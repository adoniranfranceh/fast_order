# frozen_string_literal: true

require 'rails_helper'

describe 'Admin vê pedidos' do
  it 'aparecerem em tempo real', js: true do
    admin = create :user_with_profile, role: :admin, email: 'admin@admin.com'
    user = create(:user, role: :collaborator, admin:)

    login_as admin, scope: :user
    visit root_path

    order1 = create :order, user:, delivery_type: :pickup, pick_up_time: Time.zone.parse('19:30'),
                            status: :doing, customer: 'Carlos'
    order2 = create :order, user:, delivery_type: :delivery, address: 'Rua: Cardoso, 100',
                            status: :delivered, customer: 'Roger'

    within("div[status-type='delivered']") do
      expect(page).to have_text("Pedido ##{order2.code}", wait: 4)
      expect(page).to have_content 'Entrega - Rua: Cardoso, 100'
      expect(page).to have_content 'Roger'
      expect(page).to have_content "\nStatus: Entregue"
      expect(page).to have_button 'Ver Detalhes'
    end

    within("div[status-type='doing']") do
      expect(page).to have_content "Pedido ##{order1.code}"
      expect(page).to have_content 'Horário de retirada: 19:30'
      expect(page).to have_content 'Carlos'
      expect(page).to have_content "\nStatus: Aguardando"
      expect(page).to have_button 'Ver Detalhes'
    end
  end

  it 'a partir da tela inicial', js: true do
    admin = create :user_with_profile, role: :admin, email: 'admin@admin.com'
    user = create(:user, role: :collaborator, admin:)

    create :order, user:, delivery_type: :local, table_info: '4', status: :doing, customer: 'Ernesto'
    create :order, user:, delivery_type: :pickup, pick_up_time: '19:30', status: :doing, customer: 'Carlos'
    create :order, user:, delivery_type: :delivery, address: 'Rua: Cardoso, 100', status: :delivered, customer: 'Roger'
    create :order, user:, delivery_type: :local, table_info: '7', status: :paid, customer: 'Chris', items_status: :paid
    create :order, user:, delivery_type: :local, table_info: '6', status: :canceled, customer: 'Michael'

    login_as admin, scope: :user
    visit root_path

    expect(page).to have_content 'Novos Pedidos'
    within "div[status-type='doing']" do
      expect(page).to have_content 'Novos Pedidos2'
      expect(page).to have_content 'Ernesto'
      expect(page).to have_content "\nMesa: 4"
      expect(page).to have_content "\nStatus: Aguardando..."
      expect(page).to have_button 'Ver Detalhes'

      expect(page).to have_content 'Horário de retirada: 19:30'
      expect(page).to have_content 'Carlos'
      expect(page).to have_content "\nStatus: Aguardando"
      expect(page).to have_button 'Ver Detalhes'
    end

    within("div[status-type='delivered']") do
      expect(page).to have_content 'Entregues1'
      expect(page).to have_content 'Entrega - Rua: Cardoso, 100'
      expect(page).to have_content 'Roger'
      expect(page).to have_content "\nStatus: Entregue"
      expect(page).to have_button 'Ver Detalhes'
    end

    within("div[status-type='paid']") do
      expect(page).to have_content 'Pagos1'
      expect(page).to have_content 'Mesa: 7'
      expect(page).to have_content 'Chris'
      expect(page).to have_content 'Status: Pago'
      expect(page).to have_button 'Ver Detalhes'
    end

    within("div[status-type='canceled']") do
      expect(page).to have_content 'Cancelados1'
      expect(page).to have_content 'Mesa: 6'
      expect(page).to have_content 'Michael'
      expect(page).to have_content 'Status: Cancelado'
      expect(page).to have_button 'Ver Detalhes'
    end
  end
end
