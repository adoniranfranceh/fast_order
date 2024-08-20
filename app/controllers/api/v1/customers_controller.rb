module Api
  module V1
    class CustomersController < ApplicationController
      before_action :set_customer, only: %i[show update]

      def index
        @customers = Customer.where(user_id: current_user.id).order(:name)
        render json: @customers
      end

      def show
        render json: @customer.as_json(
          include: {
            loyalty_cards: {
              include: {
                stamps: {
                  only: %i[item date time]
                }
              },
              only: %i[id status]
            }
          }
        )
      end

      def create
        @customer = Customer.new(customer_params)

        if @customer.save
          render json: { message: 'Cliente registrado com sucesso', customer: @customer }, status: :created
        else
          render json: { errors: @customer.errors }, status: :unprocessable_entity
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
        params.require(:customer).permit(
          :name,
          :email,
          :birthdate,
          :phone,
          :description,
          :favorite_order,
          :user_id
        ).merge(user_id: current_user.id)
      end
    end
  end
end
