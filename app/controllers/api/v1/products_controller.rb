module Api
  module V1
    class ProductsController < ApplicationController
      before_action :set_product, only: %i[show update destroy]
      before_action :set_admin, only: %i[index]

      def index
        products = filter_products(@admin.products)
        products = paginate(products) if params[:page]

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
          render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @product.update(product_params)
          render json: @product
        else
          render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @product.destroy
          render json: @product
        else
          render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_admin
        @admin = User.find_by!(id: params[:admin_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Admin não encontrado' }, status: :not_found
      end

      def set_product
        @product = Product.find_by(id: params[:id])
        return if @product

        render json: { error: 'Produto não encontrado' }, status: :not_found
      end

      def product_params
        params.require(:product).permit(
          :name, :description, :category, :base_price,
          :max_additional_quantity, :extra_additional_price, :user_id
        )
      end

      def filter_products(products)
        products = products.where(category: params[:category]) if params[:category].present?
        return products if params[:search_query].blank?

        search_query = params[:search_query].to_s.downcase.strip.gsub(',', '.')
        searchable_attributes = %w[name id base_price description]

        Product.filter_by_attributes(search_query, searchable_attributes)
      end

      def paginate(products)
        page = params[:page].to_i
        per_page = params[:per_page].to_i
        products.order(:name).paginate(page:, per_page:)
      end
    end
  end
end
