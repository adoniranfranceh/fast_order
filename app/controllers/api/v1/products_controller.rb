module Api
  module V1
    class ProductsController < ApplicationController
      before_action :set_product, only: %w[show destroy update]

      def index
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 5).to_i

        products = current_user.admin.products

        products = if params[:category].present?
                     products.where(category: params[:category])
                   else
                     products.where.not(category: 'Adicional')
                   end

        searchable_attributes = %w[name id base_price description]

        if params[:search_query].present?
          search_query = params[:search_query].to_s.downcase.strip.gsub(',', '.')
          products = Product.filter_by_attributes(search_query, searchable_attributes)
        end
        products = products.order(:name).paginate(page:, per_page:) if params[:paginate].present?

        render json: {
          products: products.as_json(except: %i[created_at updated_at]),
          total_count: products.count
        }
      end

      def show
        render json: @product
      end

      def create
        product = Product.new(product_params)

        if product.save
          render json: { message: 'Cliente registrado com sucesso', product: }, status: :created
        else
          render json: product.errors.full_messages, status: :unprocessable_entity
        end
      end

      def update
        if @product.update(product_params)
          render json: @product
        else
          render json: @product.errors.full_messages, status: :unprocessable_entity
        end
      end

      def destroy
        if @product.destroy!
          render json: @product
        else
          render json: @product.errors.full_messages
        end
      end

      private

      def set_product
        @product = Product.find params[:id]
      end

      def product_params
        permitted_params = params.require(:product).permit(
          :name,
          :description,
          :category,
          :base_price,
          :max_additional_quantity,
          :extra_additional_price,
          :user_id
        )
        permitted_params.merge(user_id: current_user.admin.id)
      end
    end
  end
end
