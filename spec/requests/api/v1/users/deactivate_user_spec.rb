require 'rails_helper'

RSpec.describe 'Users', type: :request do
  describe 'PUT /api/v1/users/:id/deactivate' do
    it 'desativa o usuário com sucesso com senha admin correta' do
      admin_password = 'admin_password'
      admin = create(:user, role: :admin, password: admin_password, password_confirmation: admin_password)
      user = create(:user, admin:, role: :collaborator)

      put deactivate_api_v1_user_path(user), params: { admin_password:, admin_id: admin.id }

      expect(response).to have_http_status :ok
      expect(JSON.parse(response.body)['message']).to eq 'Usuário desativado com sucesso'
      expect(user.reload.status).to eq 'inactive'
    end

    it 'retorna erro de senha inválida com senha admin incorreta' do
      admin_password = 'admin_password'
      admin = create(:user, role: :admin, password: admin_password, password_confirmation: admin_password)
      user = create(:user, admin:, role: :collaborator)

      put deactivate_api_v1_user_path(user), params: { admin_password: 'wrong_password', admin_id: admin.id  }

      expect(response).to have_http_status :unauthorized
      expect(JSON.parse(response.body)['error']).to eq 'Senha inválida'
    end

    it 'retorna erro ao tentar desativar o usuário quando ocorre uma falha' do
      admin_password = 'admin_password'
      admin = create(:user, role: :admin, password: admin_password, password_confirmation: admin_password)
      user = create(:user, admin:, role: :collaborator)

      allow_any_instance_of(User).to receive(:update).and_return(false)

      put deactivate_api_v1_user_path(user), params: { admin_password:, admin_id: admin.id }

      expect(response).to have_http_status :unprocessable_entity
      expect(JSON.parse(response.body)['error']).to eq 'Não foi possível atualizar o status do usuário'
    end

    it 'retorna erro ao tentar desativar o usuário de outro admin' do
      admin_password = 'admin_password'
      admin = create :user, role: :admin
      other_admin = create(:user, role: :admin, password: admin_password, password_confirmation: admin_password)
      user = create(:user, admin:, role: :collaborator)

      put deactivate_api_v1_user_path(user), params: { admin_password:, admin_id: other_admin.id }

      expect(response).to have_http_status :not_found
      expect(JSON.parse(response.body)['error']).to eq 'Usuário não encontrado'
      expect(user.reload.status).to eq 'active'
    end
  end
end
