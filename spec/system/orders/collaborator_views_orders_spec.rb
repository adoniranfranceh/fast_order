require 'rails_helper'

describe 'Colaborador vê pedidos' do
  it 'de seus admin', js: true do
    admin = create :user_with_profile, role: :admin, email: 'admin@admin.com'
    user = create(:user_with_profile, role: :collaborator, admin:)
    other_user = create :user_with_profile, email: 'other_user@email.com', admin:,
                                            role: :collaborator

    login_as user, scope: :user
    visit root_path

    create :order, user: other_user, delivery_type: :delivery, address: 'Rua: Cardoso, 100', status: :delivered,
                   customer: 'Roger'

    within("div[status-type='delivered']") do
      expect(page).to have_content 'Entregues1'
      expect(page).to have_content 'Entrega - Rua: Cardoso, 100'
      expect(page).to have_content 'Roger'
      expect(page).to have_content "\nStatus: Entregue"
      expect(page).to have_button 'Ver Detalhes'
    end
  end

  it 'e não pode ver pedidos de outro admin', js: true do
    admin = create :user_with_profile, role: :admin, email: 'admin@admin.com'
    user = create(:user_with_profile, role: :collaborator, admin:)
    other_admin = create :user_with_profile, role: :admin, email: 'other_admin@admin.com'
    other_user = create :user_with_profile, email: 'other_user@email.com',
                                            admin: other_admin, role: :collaborator

    login_as user, scope: :user
    visit root_path

    create :order, user: other_user, delivery_type: :delivery, address: 'Rua: Cardoso, 100', status: :delivered,
                   customer: 'Roger'

    within("div[status-type='delivered']") do
      expect(page).to have_content 'Entregues0'
      expect(page).not_to have_content 'Entrega - Rua: Cardoso, 100'
      expect(page).not_to have_content 'Roger'
      expect(page).not_to have_content "\nStatus: Entregue"
      expect(page).not_to have_button 'Ver Detalhes'
    end
  end
end
