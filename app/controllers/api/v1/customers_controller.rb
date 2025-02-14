module Api
  module V1
    class CustomersController < ApplicationController
      before_action :set_customer, only: %i[show update destroy]

      def index
        customers = filtered_customers

        render json: {
          customers: customers.paginate(page: page_param, per_page: per_page_param),
          total_count: customers.count
        }
      end

      def show
        render json: @customer.as_json(
          include: {
            loyalty_cards: {
              include: {
                stamps: { only: %i[id item date time] }
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
          render json: { errors: customer.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @customer.update(customer_params)
          render json: @customer
        else
          render json: { errors: @customer.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @customer.destroy
          render json: @customer
        else
          render json: { errors: @customer.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_customer
        @customer = Customer.find(params[:id])
      end

      def customer_params
        params.require(:customer).permit(
          :name, :email, :birthdate, :phone, :description, :favorite_order, :user_id
        )
      end

      def page_param
        (params[:page] || 1).to_i
      end

      def per_page_param
        (params[:per_page] || 5).to_i
      end

      def filtered_customers
        customers = Customer.where(user_id: params[:admin_id]).order(:name)
        customers = apply_search_query(customers)
        filter_by_birthdate(customers)
      end

      def apply_search_query(customers)
        return customers if params[:search_query].blank?

        Customer.filter_by_attributes(params[:search_query].downcase, searchable_attributes)
      end

      def searchable_attributes
        %w[name id email birthdate]
      end

      def filter_by_birthdate(customers)
        return customers if params[:date_filter].blank?

        customers.where(birthdate: Date.parse(params[:date_filter]))
      end
    end
  end
end
