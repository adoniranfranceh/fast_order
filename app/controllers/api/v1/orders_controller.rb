module Api
  module V1
    class OrdersController < ApplicationController
      def index
        @orders = Order.includes(items: :additional_fields).all.order(:created_at)
        render json: @orders.as_json(include: {
                                       items: {
                                         include: {
                                           additional_fields: { only: %i[id additional additional_value] }
                                         },
                                         only: %i[id name]
                                       }
                                     }, only: %i[id customer status delivery_type
                                                 table_info address pick_up_time user_id])
      end

      def create
        @order = Order.new(order_params)

        if @order.save
          render json: { message: 'Pedido criado com sucesso', order: @order }, status: :created
        else
          render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        order = Order.find(params[:id])
        if order.update(order_params)
          render json: { message: 'Order updated successfully' }, status: :ok
        else
          render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def order_params
        params.require(:order).permit(
          :customer,
          :status,
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
