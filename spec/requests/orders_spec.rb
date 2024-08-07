require 'rails_helper'

RSpec.describe 'Orders', type: :request do
  describe 'GET /index' do
    it 'com sucesso' do
      user = create :user, role: :collaborator

      login_as user, scope: :user
      get root_path

      expect(response).to have_http_status(:success)
    end

    it 'e não está autenticado' do
      user = create :user, role: :collaborator

      get root_path

      expect(response).to redirect_to new_user_session_path
    end
  end

  describe 'GET /show' do
    it 'returns http success' do
      get '/orders/show'
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /new' do
    it 'returns http success' do
      get '/orders/new'
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /create' do
    it 'returns http success' do
      get '/orders/create'
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /edit' do
    it 'returns http success' do
      get '/orders/edit'
      expect(response).to have_http_status(:success)
    end
  end

  describe 'GET /update' do
    it 'returns http success' do
      get '/orders/update'
      expect(response).to have_http_status(:success)
    end
  end
end
