module Api
  module V1
    class LoyaltyCardsController < ApplicationController
      before_action :set_customer, only: %i[create]
      before_action :set_loyalty_card, only: %i[update destroy]

      def create
        @loyalty_card = @customer.loyalty_cards.new(loyalty_card_params)
        if @loyalty_card.save
          render json: @loyalty_card, status: :created
        else
          render json: { errors: @loyalty_card.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @loyalty_card.update(loyalty_card_params)
          render json: @loyalty_card
        else
          render json: { errors: @loyalty_card.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @loyalty_card.destroy
          render json: @loyalty_card
        else
          render json: { errors: @loyalty_card.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_customer
        @customer = Customer.find(params[:customer_id])
      end

      def set_loyalty_card
        @loyalty_card = LoyaltyCard.find(params[:id])
      end

      def loyalty_card_params
        params.require(:loyalty_card).permit(:name, :status)
      end
    end
  end
end
