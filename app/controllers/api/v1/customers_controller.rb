module Api
  module V1
    class CustomersController < ApplicationController
      def index; end

      def create
        customer = Customer.new(customer_params)

        if customer.save
          render json: { message: 'Cliente salvo com sucesso', customer: }, status: :created
        else
          render json: { errors: customer.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def customer_params
        params.require(:customer).permit(
          :name,
          :email,
          :birthdate,
          :phone,
          :description,
          :favorite_order,
          :user_id
        )
      end
    end
  end
end
