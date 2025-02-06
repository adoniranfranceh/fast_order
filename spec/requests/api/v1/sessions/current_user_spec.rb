require 'rails_helper'

RSpec.describe Api::V1::SessionsController, type: :controller do
  include Devise::Test::ControllerHelpers

  describe 'GET #current' do
    context 'quando o usuário está autenticado' do
      let(:user) { create(:user_with_profile, email: 'admin@admin.com', role: 'admin', status: 'active') }

      before do
        sign_in user
        get :current
      end

      it 'retorna os dados do usuário logado' do
        json_response = JSON.parse(response.body)

        expected_response = {
          'user' => {
            'id' => user.id,
            'email' => 'admin@admin.com',
            'created_at' => user.created_at.iso8601(3),
            'updated_at' => user.updated_at.iso8601(3),
            'role' => 'admin',
            'admin_id' => user.admin_id,
            'status' => 'active',
            'profile' => {
              'full_name' => user.profile.full_name,
              'photo_url' => nil
            }
          }
        }

        expect(response).to have_http_status(:ok)
        expect(json_response).to eq(expected_response)
      end
    end
  end
end
