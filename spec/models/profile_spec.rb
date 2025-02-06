require 'rails_helper'

RSpec.describe Profile, type: :model do
  let(:user) { create(:user_with_profile) }
  let(:profile) { user.profile }

  describe 'validações' do
    it 'é válido com um nome completo' do
      profile.full_name = 'João Silva'
      expect(profile).to be_valid
    end

    it 'é inválido sem um nome completo' do
      profile.full_name = nil
      expect(profile).to be_invalid
      expect(profile.errors[:full_name]).to include('não pode ficar em branco')
    end

    it 'é inválido com um formato de foto não suportado' do
      profile.photo.attach(io: fixture_file_upload('spec/fixture/files/text_file.txt'),
                           filename: 'text_file.txt')
      expect(profile).to be_invalid
      expect(profile.errors[:base]).to include('Apenas JPEG ou PNG são formatos aceitos')
    end
  end

  describe '#photo_url' do
    it 'retorna a URL correta da foto quando está anexada' do
      profile.photo.attach(io: fixture_file_upload('spec/fixture/files/profile_image.jpg'),
                           filename: 'profile_image.jpg')
      expect(profile.photo_url).to include('/rails/active_storage/blobs/redirect')
    end

    it 'retorna nil se nenhuma foto estiver anexada' do
      expect(profile.photo_url).to be_nil
    end
  end
end
