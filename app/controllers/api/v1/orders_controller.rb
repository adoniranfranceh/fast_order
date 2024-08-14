module Api
  module V1
    class OrdersController < ApplicationController
      def index
        @orders = Order.all
        render json: @orders
      end

      def create
        @order = Order.new(order_params)

        if @order.save
          render json: { message: 'Pedido criado com sucesso', order: @order }, status: :created
        else
          render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def order_params
        params.require(:order).permit(
          :customer,
          :delivery_type,
          :table_info,
          :address,
          :pick_up_time,
          :user_id,
          items_attributes: [
            :name,
            { additional_fields_attributes: %i[id additional additional_value] }
          ]
        )
      end
    end
  end
end
