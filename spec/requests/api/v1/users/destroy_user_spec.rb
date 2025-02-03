require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  describe 'DELETE /api/v1/users/:id' do
    let(:admin_user) { create :user, role: :admin }
    let(:user) { create :user, admin: admin_user }

    it 'deleta o colaborador com sucesso' do
      delete :destroy, params: { id: user.id, admin_password: admin_user.password, admin_id: admin_user.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['message']).to eq 'Usuário excluído com sucesso'
    end

    it 'retorna erro quando a senha do administrador é inválida' do
      delete :destroy, params: { id: user.id, admin_password: 'wrong_password', admin_id: admin_user.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status :unauthorized
      expect(json_response['error']).to eq 'Senha inválida'
    end
  end
end
