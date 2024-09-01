# frozen_string_literal: true

require 'rails_helper'

describe 'Admin vê pedidos' do
  it 'em tempo real', js: true do
    admin = create :user, role: :admin, email: 'admin@admin.com'
    user = create(:user, role: :collaborator, admin:)

    login_as admin, scope: :user
    visit root_path

    create :order, user:, delivery_type: :pickup, pick_up_time: '19:30', status: :doing, customer: 'Carlos'
    create :order, user:, delivery_type: :delivery, address: 'Rua: Cardoso, 100', status: :delivered, customer: 'Roger'

    within("div[status-type='delivered']") do
      expect(page).to have_content 'Entrega - Rua: Cardoso, 100'
      expect(page).to have_content 'Roger'
      expect(page).to have_content "\nStatus: Entregue"
      # expect(page).to have_link 'Itens'
      # expect(page).to have_link 'Ver detalhes', href: root_path
    end

    within("div[status-type='doing']") do
      # expect(page).to have_content 'Para ser retirado - 19:30'
      expect(page).to have_content 'Carlos'
      expect(page).to have_content "\nStatus: Aguardando"
      # expect(page).to have_link 'Itens'
      # expect(page).to have_link 'Ver detalhes', href: root_path
    end
  end

  it 'a partir da tela inicial', js: true do
    admin = create :user, role: :admin, email: 'admin@admin.com'
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
      expect(page).to have_content 'Ernesto'
      expect(page).to have_content "\nMesa: 4"
      expect(page).to have_content "\nStatus: Aguardando..."
      # expect(page).to have_link 'Itens'
      # expect(page).to have_link 'Ver detalhes', href: root_path
      # expect(page).to have_content 'Para ser retirado - 19:30'
      expect(page).to have_content 'Carlos'
      expect(page).to have_content "\nStatus: Aguardando"
      # expect(page).to have_link 'Itens'
      # expect(page).to have_link 'Ver detalhes', href: root_path
    end

    within("div[status-type='delivered']") do
      expect(page).to have_content 'Entrega - Rua: Cardoso, 100'
      expect(page).to have_content 'Roger'
      expect(page).to have_content "\nStatus: Entregue"
      # expect(page).to have_link 'Itens'
      # expect(page).to have_link 'Ver detalhes', href: root_path
    end

    within("div[status-type='paid']") do
      expect(page).to have_content 'Mesa: 7'
      expect(page).to have_content 'Chris'
      expect(page).to have_content 'Status: Pago'
      # expect(page).to have_link 'Itens'
      # expect(page).to have_link 'Ver detalhes', href: root_path
    end

    within("div[status-type='canceled']") do
      expect(page).to have_content 'Mesa: 6'
      expect(page).to have_content 'Michael'
      expect(page).to have_content 'Status: Cancelado'
      # expect(page).to have_link 'Itens'
      # expect(page).to have_link 'Ver detalhes', href: root_path
    end
  end
end
