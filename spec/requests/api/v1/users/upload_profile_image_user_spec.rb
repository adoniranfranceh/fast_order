require 'rails_helper'

RSpec.describe Api::V1::UsersController, type: :controller do
  describe 'PATCH /api/v1/users/:id/upload_profile_image' do
    let(:user) { create(:user_with_profile) }
    let(:file) { fixture_file_upload('spec/fixture/files/profile_image.jpg', 'image/jpeg') }
    let(:valid_attributes) do
      {
        user: {
          profile_attributes: {
            photo: file
          }
        },
        admin_id: user.admin_id
      }
    end

    it 'faz upload da imagem do perfil com sucesso' do
      patch :upload_profile_image, params: { id: user.id }.merge(valid_attributes)

      user.reload
      expect(user.profile.photo.attached?).to be true
    end
  end
end
