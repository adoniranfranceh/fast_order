module Api
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: %i[show update]

      def index
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 5).to_i

        collaborators = User.where(admin_id: current_user.admin.id)
                            .order(:email)
                            .paginate(page:, per_page:)

        search_query = params[:search_query].downcase
        searchable_attributes = %w[profile.full_name id email]

        collaborators = collaborators.filter_by_attributes(search_query, searchable_attributes) if search_query.present?

        render json: {
          users: collaborators.as_json(include: {
                                         profile: { only: %i[full_name] }
                                       }),
          total_count: collaborators.total_entries
        }
      end

      def show
        render json: @user.as_json(
          include: {
            profile: {
              only: %i[full_name]
            }
          }
        )
      end

      def create
        user = current_user.collaborators.build(user_params)

        if user.save
          render json: { message: 'Colaborador registrado com sucesso', user: }, status: :created
        else
          render user.errors, status: :unprocessable_entity
        end
      end

      def update
        if @user.update(user_params)
          render json: { message: 'Colaborador registrado com sucesso', user: @user }, status: :created
        else
          render @user.errors, status: :unprocessable_entity
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
