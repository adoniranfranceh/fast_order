require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  describe 'GET /api/v1/users/:id' do
    let(:admin_user) { create(:user, :admin) }
    let(:user) { create :user_with_profile, admin_id: admin_user.id, role: :collaborator }

    it 'retorna o colaborador com sucesso' do
      create :order, user_id: user.id, created_at: 1.month.ago

      create :order, user_id: user.id, created_at: Time.current

      get :show, params: { id: user.id, admin_id: admin_user.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['id']).to eq user.id
      expect(json_response['email']).to eq user.email
      expect(json_response['created_at']).to eq user.created_at.iso8601(3)
      expect(json_response['updated_at']).to eq user.updated_at.iso8601(3)
      expect(json_response['role']).to eq 'collaborator'
      expect(json_response['admin_id']).to eq admin_user.id
      expect(json_response['status']).to eq 'active'
      expect(json_response['profile']['full_name']).to eq user.profile.full_name
      expect(json_response['profile']['photo_url']).to eq user.profile.photo_url
      expect(json_response['total_orders']).to eq 2
      expect(json_response['monthly_orders']).to eq 1
    end

    it 'não pode acessar o colaborador de outro admin' do
      other_user = create :user
      get :show, params: { id: other_user.id, admin_id: admin_user.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status :not_found
      expect(json_response['error']).to eq('Usuário não encontrado')
    end

    it 'retorna erro quando o usuário não é encontrado' do
      get :show, params: { id: 999, admin_id: admin_user.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status(:not_found)
      expect(json_response['error']).to eq('Usuário não encontrado')
    end
  end
end
