module Api
  module V1
    class StampsController < ApplicationController
      before_action :set_loyalty_card

      def create
        @stamp = @loyalty_card.stamps.create(stamp_params.merge(user: current_user, signed_at: Time.current))
        if @stamp.save
          render json: @stamp, status: :created
        else
          render json: @stamp.errors.full_messages, status: :unprocessable_entity
        end
      end

      def update
        stamp = Stamp.find(params[:id])
        if stamp.update(stamp_params)
          render json: stamp, status: :created
        else
          render json: stamp.errors.full_messages, status: :unprocessable_entity
        end
      end

      private

      def set_loyalty_card
        @loyalty_card = LoyaltyCard.find(params[:loyalty_card_id])
      end

      def stamp_params
        params.require(:stamp).permit(:item)
      end
    end
  end
end
