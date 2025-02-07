module Api
  module V1
    class OrdersController < ApplicationController
      before_action :set_order, only: %w[show update print_invoice]

      def index
        orders = fetch_orders
        orders = paginate_orders(orders)
        Rails.logger.debug orders.count
        render json: OrderService.format_response(orders, params)
      end

      def show
        order = Order.eager_load(items: :additional_fields).find(params[:id])
        render json: OrderService.new(order).show
      end

      def create
        order = Order.new(order_params)

        if order.save
          render json: order, status: :created
        else
          render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        new_status = params['order'][:status]

        OrderService.new(@order).update_order_status(new_status) if new_status.present?

        if @order.update(order_params)
          @order.update_last_edited_at if should_generate_receipt?(@order)
          render json: @order
        else
          render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def print_invoice
        # generate_edited_receipt(@order)
        # order = Order.find(params[:id])
        # pdf = InvoicePdfService.new(order).generate_pdf
        # send_data pdf, filename: "invoice_#{order.code}.pdf", type: 'application/pdf', disposition: 'inline'
      end

      private

      def set_order
        @order = Order.find params[:id]
      end

      def should_generate_receipt?(order)
        service = OrderService.new(order)
        service.any_additional_fields_changed? || service.any_items_changed? || service.any_order_attributes_changed?
      end

      def generate_edited_receipt(order)
        # Order.transaction do
        #   order.generate_receipt
        # end
      end

      def fetch_orders
        orders = Order.where(admin_id: params[:admin_id])
                      .includes(items: :additional_fields)
        OrderService.filter_orders(orders, params)
      end

      def paginate_orders(orders)
        page = (params[:page] || 1).to_i
        per_page = [(params[:per_page] || 5).to_i, 50].min
        orders.paginate(page:, per_page:)
      end

      def order_params
        params.require(:order).permit(
          *order_attributes,
          items_attributes: item_attributes
        )
      end

      def order_attributes
        %i[
          customer
          status
          delivery_type
          table_info
          address
          pick_up_time
          user_id
        ]
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
