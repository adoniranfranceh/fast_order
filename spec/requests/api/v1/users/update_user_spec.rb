require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  describe 'PUT /api/v1/users/:id' do
    let(:admin) { create :user, role: :admin }
    let(:user) { create :user, admin_id: admin.id }
    let(:valid_attributes) do
      {
        user: {
          email: 'roger@email.com'
        },
        admin_id: admin.id
      }
    end

    it 'atualiza um colaborador existente com sucesso' do
      put :update, params: { id: user.id }.merge(valid_attributes)

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['message']).to eq 'Colaborador atualizado com sucesso'
      expect(User.find_by(email: 'roger@email.com').admin).to eq admin
    end

    it 'retorna erro quando os parâmetros são inválidos' do
      invalid_attributes = valid_attributes.deep_merge user: { password: '' }

      put :update, params: { id: user.id }.merge(invalid_attributes)

      json_response = JSON.parse response.body
      expect(response).to have_http_status :unprocessable_entity
      expect(json_response['errors']).to eq ['Senha não pode ficar em branco']
    end
  end
end
