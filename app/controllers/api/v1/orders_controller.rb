module Api
  module V1
    class OrdersController < ApplicationController
      def index
        orders = Order.where(admin_id: current_user.admin.id)
        orders.includes(items: :additional_fields).order(created_at: :desc)
        orders = orders.where('created_at >= ?', 12.hours.ago) if params[:query] == 'today'
        render json: orders.as_json(include: {
                                      items: {
                                        include: {
                                          additional_fields: { only: %i[id additional additional_value] }
                                        },
                                        only: %i[id name price status]
                                      }
                                    }, only: %i[id customer status delivery_type total_price
                                                table_info address pick_up_time user_id
                                                time_started time_stopped])
      end

      def show
        order = Order.includes(items: :additional_fields).find(params[:id])
        render json: order.as_json(include: {
                                     items: {
                                       include: {
                                         additional_fields: { only: %i[id additional additional_value] }
                                       },
                                       only: %i[id name price status]
                                     }
                                   }, only: %i[id customer status delivery_type
                                               table_info address pick_up_time user_id total_price])
      end

      def create
        order = Order.new(order_params)

        if order.save
          render json: order, status: :created
        else
          render json: order.errors, status: :unprocessable_entity
        end
      end

      def update
        order = Order.find(params[:id])
        new_status = params[:status] || 'delivered'
        current_time = Time.zone.now

        if new_status == 'doing' && order.time_started.nil?
          order.update(time_started: current_time, status: new_status)

        elsif order.status == 'doing' && new_status != 'doing'
          order.update(time_stopped: current_time, status: new_status)
        else
          order.update(status: new_status)
        end

        if order.update(order_params)
          render json: order
        else

          render json: order.errors, status: :unprocessable_entity
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
            :id,
            :name,
            :price,
            :status,
            :_destroy,
            { additional_fields_attributes: %i[id additional additional_value _destroy] }
          ]
        ).merge(user_id: current_user.id)
      end
    end
  end
end
