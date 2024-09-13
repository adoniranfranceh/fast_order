module Api
  module V1
    class CustomersController < ApplicationController
      before_action :set_customer, only: %i[show update]

      def index
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 5).to_i

        customers = Customer.where(user_id: current_user.admin.id)
                            .order(:name)
                            .paginate(page:, per_page:)

        searchable_attributes = %w[name id email birthdate]

        if params[:search_query].present?
          customers = Customer.filter_by_attributes(params[:search_query].downcase, searchable_attributes)
        end

        if params[:date_filter].present?
          begin
            date_filter = Date.parse(params[:date_filter])
            customers = customers.where(birthdate: date_filter)
          rescue ArgumentError
            Rails.logger.error("Invalid date format: #{params[:date_filter]}")
          end
        end

        render json: {
          customers:,
          total_count: customers.count
        }
      end

      def show
        render json: @customer.as_json(
          include: {
            loyalty_cards: {
              include: {
                stamps: {
                  only: %i[id item date time]
                }
              },
              only: %i[id status]
            }
          }
        )
      end

      def create
        customer = Customer.new(customer_params)

        if customer.save
          render json: { message: 'Cliente registrado com sucesso', customer: }, status: :created
        else
          render json: customer.errors, status: :unprocessable_entity
        end
      end

      def update
        if @customer.update(customer_params)
          render json: @customer
        else
          render json: @customer.errors, status: :unprocessable_entity
        end
      end

      private

      def set_customer
        @customer = Customer.find(params[:id])
      end

      def customer_params
        permitted_params = params.require(:customer).permit(
          :name,
          :email,
          :birthdate,
          :phone,
          :description,
          :favorite_order,
          :user_id
        )
        if current_user&.admin?
          permitted_params.merge(user_id: current_user.id)
        else
          permitted_params
        end
      end
    end
  end
end
