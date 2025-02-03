module Api
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: %i[show update activate deactivate destroy upload_profile_image]

      def index
        collaborators = fetch_collaborators
        collaborators = filter_collaborators(collaborators) if params[:search_query].present?

        render json: {
          users: collaborators.as_json(include: { profile: { only: %i[full_name] } }),
          total_count: collaborators.total_entries
        }
      end

      def show
        render json: user_with_orders(@user)
      end

      def create
        user = User.find(params[:admin_id]).collaborators.build(user_params)

        if user.save
          render json: { message: 'Colaborador registrado com sucesso', user: }, status: :created
        else
          render json: user.errors.full_messages, status: :unprocessable_entity
        end
      end

      def update
        if @user.update(user_params)
          render json: { message: 'Colaborador atualizado com sucesso', user: @user }, status: :ok
        else
          render json: @user.errors.full_messages, status: :unprocessable_entity
        end
      end

      def upload_profile_image
        return unless params.dig(:user, :profile_attributes, :photo)

        @user.profile.photo.attach(params[:user][:profile_attributes][:photo])
        render json: { message: 'Foto de perfil atualizada com sucesso' }, status: :ok
      end

      def deactivate
        update_user_status('inactive', 'Usuário desativado com sucesso')
      end

      def activate
        update_user_status('active', 'Usuário ativado com sucesso')
      end

      def destroy
        if verify_admin_password(@user)
          @user.destroy
          render json: { message: 'Usuário excluído com sucesso' }, status: :ok
        else
          render json: { error: 'Senha inválida' }, status: :unauthorized
        end
      end

      private

      def fetch_collaborators
        User.where(admin_id: params[:admin_id])
            .order(:email)
            .paginate(page: params[:page] || 1, per_page: params[:per_page] || 5)
      end

      def filter_collaborators(collaborators)
        collaborators.filter_by_attributes(params[:search_query], %w[profile.full_name id email])
      end

      def set_user
        @user = User.find_by(id: params[:id], admin_id: params[:admin_id])
        render json: { error: 'Usuário não encontrado' }, status: :not_found unless @user
      end

      def user_params
        params.require(:user).permit(:email, :password, :password_confirmation, profile_attributes: %i[full_name])
      end

      def verify_admin_password(user)
        admin = User.find_by(id: user.admin_id)
        admin&.valid_password?(params[:admin_password])
      end

      def update_user_status(status, success_message)
        if verify_admin_password(@user)
          if @user.update(status: status)
            render json: { message: success_message }, status: :ok
          else
            render json: { error: 'Não foi possível atualizar o status do usuário' }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Senha inválida' }, status: :unauthorized
        end
      end

      def user_with_orders(user)
        total_orders = user.orders.where(created_at: 1.year.ago..Time.current).count
        monthly_orders = user.orders.where(created_at: Time.current.beginning_of_month..Time.current.end_of_month).count

        user.as_json(
          include: {
            profile: {
              only: %i[full_name],
              methods: [:photo_url]
            }
          }
        ).merge(
          total_orders: total_orders,
          monthly_orders: monthly_orders
        )
      end
    end
  end
end
