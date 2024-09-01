require 'rails_helper'

describe 'Colaborador vê pedidos' do
  it 'de seus admin', js: true do
    admin = create :user, role: :admin, email: 'admin@admin.com'
    user = create(:user, role: :collaborator, admin:)
    other_user = create :user, email: 'other_user@email.com', admin:,
                               role: :collaborator

    login_as user, scope: :user
    visit root_path

    create :order, user: other_user, delivery_type: :delivery, address: 'Rua: Cardoso, 100', status: :delivered,
                   customer: 'Roger'

    within("div[status-type='delivered']") do
      expect(page).to have_content 'Entrega - Rua: Cardoso, 100'
      expect(page).to have_content 'Roger'
      expect(page).to have_content "\nStatus: Entregue"
      # expect(page).to have_link 'Itens'
      # expect(page).to have_link 'Ver detalhes', href: root_path
    end
  end

  it 'e não pode ver pedidos de outro admin', js: true do
    admin = create :user, role: :admin, email: 'admin@admin.com'
    user = create(:user, role: :collaborator, admin:)
    other_admin = create :user, role: :admin, email: 'other_admin@admin.com'
    other_user = create :user, email: 'other_user@email.com',
                               admin: other_admin, role: :collaborator

    login_as user, scope: :user
    visit root_path

    create :order, user: other_user, delivery_type: :delivery, address: 'Rua: Cardoso, 100', status: :delivered,
                   customer: 'Roger'

    within("div[status-type='delivered']") do
      expect(page).not_to have_content 'Entrega - Rua: Cardoso, 100'
      expect(page).not_to have_content 'Roger'
      expect(page).not_to have_content "\nStatus: Entregue"
      # expect(page).to have_link 'Itens'
      # expect(page).to have_link 'Ver detalhes', href: root_path
    end
  end
end
