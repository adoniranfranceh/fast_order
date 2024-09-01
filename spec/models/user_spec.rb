# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  context 'validações' do
    it 'é inválido se o colaborador não tiver um admin' do
      user = build(:user, role: :collaborator, admin: nil)
      expect(user).to_not be_valid

      expect(user.errors[:admin]).to include('não pode ficar em branco')
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

    it 'deleta os colaboradores associados quando o admin é deletado' do
      admin = create(:user, role: :admin)
      create(:user, role: :collaborator, admin:)
      create(:user, role: :collaborator, admin:)

      expect { admin.destroy }.to change { User.count }.by(-3)
    end
  end
end
