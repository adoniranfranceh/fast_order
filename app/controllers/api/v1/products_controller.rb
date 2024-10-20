module Api
  module V1
    class ProductsController < ApplicationController
      def index
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 5).to_i

        products = current_user.admin.products

        if params[:category].present?
          products = products.where(category: params[:category])
        else
          products = products.where.not(category: 'Adicional')
        end

        if params[:paginate].present?
          products = products.order(:name).paginate(page:, per_page:)
        end

        render json: {
          products: products.as_json(except: %i[created_at updated_at]),
          total_count: products.count
        }
      end

      def create
        product = Product.new(product_params)

        if product.save
          render json: { message: 'Cliente registrado com sucesso', product: }, status: :created
        else
          render json: product.errors, status: :unprocessable_entity
        end
      end

      private

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
