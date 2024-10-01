module Api
  module V1
    class DashboardController < ApplicationController
      before_action :set_orders, only: %i[index]

      def index
        render json: {
          profits: monthly_profits,
          new_clients: new_clients_by_month,
          recent_orders: recent_orders_count,
          monthly_orders: monthly_orders_count,
          new_employees: new_employees_by_month,
          loyalty_cards: new_loyalty_cards_by_month
        }
      end

      private

      def set_orders
        @orders = Order.where(admin_id: current_user.admin.id)
      end

      def monthly_profits
        @orders.where(status: 'paid')
               .where('created_at >= ?', 12.months.ago)
               .group_by_month(:created_at, format: '%b %Y')
               .sum(:total_price)
      end

      def new_clients_by_month
        customers = Customer.where(user_id: current_user.id)
                            .where('created_at >= ?', 12.months.ago)
        customers.group_by_month(:created_at, format: '%b %Y').count
      end

      def recent_orders_count
        @orders.where('created_at >= ?', 7.days.ago)
               .group_by_day(:created_at, format: '%a')
               .count
      end

      def monthly_orders_count
        @orders.where('created_at >= ?', 12.months.ago)
               .group_by_month(:created_at, format: '%b %Y')
               .count
      end

      def new_employees_by_month
        current_user.collaborators
                    .where('created_at >= ?', 12.months.ago)
                    .group_by_month(:created_at, format: '%b %Y')
                    .count
      end

      def new_loyalty_cards_by_month
        LoyaltyCard.joins(:customer)
                   .where(customers: { user_id: current_user.id })
                   .where('loyalty_cards.created_at >= ?', Time.current.beginning_of_month)
                   .group("DATE_TRUNC('month', loyalty_cards.created_at AT TIME ZONE 'America/Sao_Paulo')::date")
                   .count
      end
    end
  end
end
