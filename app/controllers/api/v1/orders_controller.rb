module Api
  module V1
    class OrdersController < ApplicationController
      before_action :set_order, only: %w[show update print_invoice]

      def index
        orders = Order.filtered_orders(params)
        orders = paginate_orders(orders)
        render json: format_response(orders)
      end

      def show
        render json: format_order_response(@order)
      end

      def create
        order = Order.new(order_params)

        if order.save
          render json: order, status: :created
        else
          render json: order.errors.full_messages, status: :unprocessable_entity
        end
      end

      def update
        update_order_status(@order) if params.dig(:order, :status).present?

        if @order.update(order_params)
          @order.update(last_edited_at: Time.zone.now)
          render json: @order
        else
          render json: @order.errors.full_messages, status: :unprocessable_entity
        end
      end

      def print_invoice
        OrderReceiptService.new(@order).generate
      end

      private

      def set_order
        @order = Order.find(params[:id])
      end

      def paginate_orders(orders)
        page = (params[:page] || 1).to_i
        per_page = [(params[:per_page] || 5).to_i, 50].min
        orders.paginate(page:, per_page:)
      end

      def format_response(orders)
        {
          orders: OrderSerializer.new(orders).as_json,
          total_count: total_count(orders)
        }
      end

      def format_order_response(order)
        OrderSerializer.new(order).as_json
      end

      def total_count(orders)
        params[:query] == 'today' ? orders.count : orders.total_entries
      end

      def update_order_status(order)
        new_status = params[:order][:status]
        current_time = Time.zone.now

        if order.status == 'doing' && new_status != 'doing'
          order.update(time_stopped: current_time, status: new_status)
        else
          order.update(status: new_status)
        end
      end

      def order_params
        params.require(:order).permit(
          *order_attributes,
          items_attributes: item_attributes
        )
      end

      def order_attributes
        %i[customer status delivery_type table_info address pick_up_time user_id]
      end

      def item_attributes
        [
          :id,
          :name,
          :price,
          :status,
          :_destroy,
          { additional_fields_attributes: additional_field_attributes }
        ]
      end

      def additional_field_attributes
        %i[id additional additional_value _destroy]
      end
    end
  end
end
