require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  describe 'GET /api/v1/users' do
    let(:admin_user) { create(:user, :admin) }

    it 'retorna os colaboradores com sucesso' do
      create_list :user, 3, admin_id: admin_user.id

      get :index, params: { admin_id: admin_user.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['users'].length).to eq 4
    end

    it 'aplica filtro de pesquisa por email' do
      create :user, email: 'roger@example.com', admin_id: admin_user.id
      create :user, email: 'ernesto@example.com', admin_id: admin_user.id

      get :index, params: { search_query: 'roger', admin_id: admin_user.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['users']).not_to be_empty
      expect(json_response['users'].first['email']).to eq 'roger@example.com'
    end

    it 'aplica filtro de pesquisa por full_name do perfil' do
      user = create :user, email: 'roger@example.com', admin_id: admin_user.id
      create :profile, user:, full_name: 'Roger Clots'
      create :user, email: 'ernesto@example.com', admin_id: admin_user.id

      get :index, params: { search_query: 'Clots', admin_id: admin_user.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['users']).not_to be_empty
      expect(json_response['users'].first['profile']['full_name']).to eq 'Roger Clots'
    end

    it 'aplica filtro de pesquisa por id' do
      user_for_search = create :user, email: 'roger@example.com', admin_id: admin_user.id
      create :user, email: 'ernesto@example.com', admin_id: admin_user.id

      get :index, params: { search_query: user_for_search.id, admin_id: admin_user.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['users']).not_to be_empty
      expect(json_response['users'].first['email']).to eq 'roger@example.com'
    end
  end
end
