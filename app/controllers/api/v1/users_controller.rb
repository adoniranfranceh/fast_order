# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApplicationController
      before_action :set_user, only: %i[show update activate deactivate destroy upload_profile_image]

      def index
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 5).to_i

        collaborators = User.where(admin_id: current_user.admin.id)
                            .order(:email)
                            .paginate(page:, per_page:)

        search_query = params[:search_query]&.downcase
        searchable_attributes = %w[profile.full_name id email]

        collaborators = collaborators.filter_by_attributes(search_query, searchable_attributes) if search_query.present?

        render json: {
          users: collaborators.as_json(include: { profile: { only: %i[full_name] } }),
          total_count: collaborators.total_entries
        }
      end

      def show
        total_orders = @user.orders.where(created_at: 1.year.ago..Time.current).count
        monthly_orders = @user.orders.where(created_at: Time.current.beginning_of_month..Time.current.end_of_month).count

        render json: @user.as_json(
          include: {
            profile: {
              only: %i[full_name],
              methods: [:photo_url]
            },
            admin_id: @user.admin.id
          }
        ).merge(
          total_orders:,
          monthly_orders:
        )
      end

      def create
        user = current_user.collaborators.build(user_params)

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
        return unless params[:user][:profile_attributes][:photo]

        @user.profile.photo.attach(params[:user][:profile_attributes][:photo])
      end

      def deactivate
        if verify_admin_password(@user)
          if @user.update(status: 'inactive')
            render json: { message: 'Usuário desativado com sucesso' }, status: :ok
          else
            render json: { error: 'Não foi possível desativar o usuário' }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Senha inválida' }, status: :unauthorized
        end
      end

      def activate
        if verify_admin_password(@user)
          if @user.update(status: 'active')
            render json: { message: 'Usuário desativado com sucesso' }, status: :ok
          else
            render json: { error: 'Não foi possível desativar o usuário' }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Senha inválida' }, status: :unauthorized
        end
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

      def set_user
        @user = User.find_by(id: params[:id])
        render json: { error: 'Usuário não encontrado' }, status: :not_found unless @user
      end

      def verify_admin_password(user)
        admin = User.find_by(id: user.admin_id)
        admin&.valid_password?(params[:admin_password])
      end

      def user_params
        params.require(:user).permit(
          :email,
          :password,
          :password_confirmation,
          profile_attributes: %i[full_name]
        )
      end
    end
  end
end
