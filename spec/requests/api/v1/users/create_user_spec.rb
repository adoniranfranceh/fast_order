require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  describe 'POST /api/v1/users' do
    let(:admin) { create :user, role: :admin }
    let(:valid_attributes) do
      {
        user: {
          email: 'roger@example.com',
          password: '123456',
          password_confirmation: '123456',
          profile_attributes: { full_name: 'Roger Taylor' }
        },
        admin_id: admin.id
      }
    end

    it 'cria um novo colaborador com sucesso' do
      post :create, params: valid_attributes

      json_response = JSON.parse response.body
      expect(response).to have_http_status :created
      expect(json_response['message']).to eq 'Colaborador registrado com sucesso'
      expect(User.find_by(email: 'roger@example.com').admin).to eq admin
    end

    it 'retorna erro quando os parâmetros são inválidos' do
      invalid_attributes = valid_attributes.deep_merge user: { email: '' }

      post :create, params: invalid_attributes

      json_response = JSON.parse response.body
      expect(response).to have_http_status :unprocessable_entity
      expect(json_response['errors']).to eq ['E-mail não pode ficar em branco']
    end
  end
end
