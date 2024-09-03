module Api
  module V1
    class DashboardController < ApplicationController
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

      def monthly_profits
        Order.where(status: 'paid').group_by_month(:created_at, format: '%b %Y').sum(:total_price)
      end

      def new_clients_by_month
        Customer.group_by_month(:created_at, format: '%b %Y').count
      end

      def recent_orders_count
        Order.where('created_at >= ?', 7.days.ago).group_by_day(:created_at).count
      end

      def monthly_orders_count
        Order.group_by_month(:created_at, format: '%b %Y').count
      end

      def new_employees_by_month
        current_user.collaborators.group_by_month(:created_at, format: '%b %Y').count
      end

      def new_loyalty_cards_by_month
        LoyaltyCard.group_by_month(:created_at, format: '%b %Y').count
      end
    end
  end
end
