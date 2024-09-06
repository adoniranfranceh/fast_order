module Api
  module V1
    class LoyaltyCardsController < ApplicationController
      before_action :set_customer, only: %i[show create update]

      def show
        @loyalty_card = @customer.loyalty_card
        if @loyalty_card.nil?
          render json: { message: 'Nenhum cartão de fidelidade encontrado.' }, status: :not_found
        else
          render json: @loyalty_card
        end
      end

      def create
        @loyalty_card = @customer.loyalty_cards.new(loyalty_card_params)
        if @loyalty_card.save
          render json: @loyalty_card, status: :created
        else
          render @loyalty_card.errors, status: :unprocessable_entity
        end
      end

      def update
        @loyalty_card = @customer.loyalty_card
        if @loyalty_card.nil?
          render json: { message: 'Nenhum cartão de fidelidade encontrado para atualizar.' }, status: :not_found
        elsif @loyalty_card.update(loyalty_card_params)
          render json: @loyalty_card
        else
          render json: @loyalty_card.errors, status: :unprocessable_entity
        end
      end

      def remove
        @loyalty_card = LoyaltyCard.find(params[:id])
        if @loyalty_card.removed!
          render json: @loyalty_card
        else
          render json: @loyalty_card.errors, status: :unprocessable_entity
        end
      end

      private

      def set_customer
        @customer = Customer.find(params[:customer_id])
      end

      def loyalty_card_params
        params.require(:loyalty_card).permit(:name, :status)
      end
    end
  end
end
