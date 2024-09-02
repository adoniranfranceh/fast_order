module Api
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: %i[show update]

      def index
        collaborators = User.where(admin_id: current_user.admin.id).order(:email)
        render json: collaborators.as_json(include: {
                                             profile: { only: %i[full_name] }
                                           })
      end

      def create
        user = current_user.collaborators.build(user_params)

        if user.save
          render json: { message: 'Colaborador registrado com sucesso', user: }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @user.update(user_params)
          render json: { message: 'Colaborador registrado com sucesso', user: @user }, status: :created
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_user
        @user = User.find(params[:id])
      end

      def user_params
        params.require(:user).permit(
          :email,
          :password,
          :password_confirmation
        )
      end
    end
  end
end
