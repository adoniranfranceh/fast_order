# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  context 'validações' do
    it 'é inválido se o colaborador não tiver um admin' do
      user = build(:user, role: :collaborator, admin: nil)
      expect(user).to_not be_valid
      expect(user.errors[:admin]).to include('é obrigatório para colaboradores')
    end

    it 'é válido se o colaborador tiver um admin' do
      admin = create(:user, role: :admin)
      collaborator = build(:user, role: :collaborator, admin:)
      expect(collaborator).to be_valid
    end

    it 'é válido se o usuário for um admin sem admin associado' do
      admin = build(:user, role: :admin, admin: nil)
      expect(admin).to be_valid
    end
  end

  context 'callbacks' do
    it 'atribui o admin_id corretamente para um admin' do
      admin = create(:user, role: :admin)
      expect(admin.admin_id).to eq(admin.id)
    end

    it 'não atribui admin_id para colaboradores' do
      collaborator = build(:user, role: :collaborator)

      expect(collaborator).not_to be_valid
      expect(collaborator.admin_id).to be_nil
    end
  end

  context 'associações' do
    it 'um admin pode ter vários colaboradores' do
      admin = create(:user, role: :admin)
      collaborator1 = create(:user, role: :collaborator, admin:)
      collaborator2 = create(:user, role: :collaborator, admin:)
      expect(admin.collaborators).to include(collaborator1, collaborator2)
    end

    it 'um colaborador pertence a um admin' do
      admin = create(:user, role: :admin)
      collaborator = create(:user, role: :collaborator, admin:)
      expect(collaborator.admin).to eq(admin)
    end
  end
end
