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
      create :user, role: :collaborator

      get root_path

      expect(response).to redirect_to new_user_session_path
    end
  end
end
