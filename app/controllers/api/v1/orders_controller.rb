module Api
  module V1
    class OrdersController < ApplicationController
      def index
        orders = fetch_orders
        orders = paginate_orders(orders)

        render json: format_response(orders)
      end

      def show
        order = Order.includes(items: :additional_fields).find(params[:id])
        render json: order.as_json(include: {
                                     user: {
                                       only: [:email],
                                       include: {
                                         profile: {
                                           only: [:full_name],
                                           methods: [:photo_url]
                                         }
                                       }
                                     },
                                     items: {
                                       include: {
                                         additional_fields: { only: %i[id additional additional_value] }
                                       },
                                       only: %i[id name price status]
                                     }
                                   }, only: %i[id customer status delivery_type code
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

        if order.status == 'doing' && new_status != 'doing'
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

      def fetch_orders
        orders = Order.where(admin_id: current_user.admin.id)
                      .includes(items: :additional_fields)
                      .order(created_at: :desc)
        filter_orders(orders)
      end

      def filter_orders(orders)
        search_query = params[:search_query]
        return orders unless search_query != ''

        search_query = params[:search_query]
        searchable_attributes = %w[customer code status delivery_type total_price
                                   table_info address pick_up_time]

        orders = orders.filter_by_attributes(search_query.downcase, searchable_attributes) if search_query.present?

        return orders unless params[:query] == 'today'

        orders.where('created_at >= ?', 12.hours.ago)
      end

      def paginate_orders(orders)
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 5).to_i

        orders.paginate(page:, per_page:)
      end

      def format_response(orders)
        {
          orders: orders.as_json(
            include: order_includes,
            only: order_only_attributes
          ),
          total_count: orders.total_entries
        }
      end

      def order_includes
        {
          user: {
            include: {
              profile: { only: [:full_name], methods: [:photo_url] }
            }, only: [:email]
          },
          items: {
            include: {
              additional_fields: { only: %i[id additional additional_value] }
            }, only: %i[id name price status]
          }
        }
      end

      def order_only_attributes
        %i[id code customer status delivery_type total_price table_info address pick_up_time user_id time_started time_stopped]
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
