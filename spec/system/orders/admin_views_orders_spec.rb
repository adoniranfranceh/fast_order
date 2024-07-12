# frozen_string_literal: true

require 'rails_helper'

describe 'Admin vê pedidos' do
  it 'a partir da tela inicial' do
    user = create :user, role: :collaborator

    ernesto_order = user.orders.create delivery_type: :local, table_info: '4', status: :doing, customer: 'Ernesto'
    carlos_order = user.orders.create  delivery_type: :pickup, pick_up_time: '19:30', status: :doing,
                                      customer: 'Carlos'
    user.orders.create delivery_type: :delivery, address: 'Rua: Cardoso, 100', status: :delivered, customer: 'Roger'
    user.orders.create delivery_type: :local, table_info: '7', status: :paid, customer: 'Chris'
    user.orders.create delivery_type: :local, table_info: '6', status: :canceled, customer: 'Michael'


    login_as user, scope: :user
    visit root_path

    expect(page).to have_content 'Pedidos em espera'
    expect(page).not_to have_content 'Não há pedidos'
    within 'div.waiting-orders' do
      within "div##{ernesto_order.id}" do
        expect(page).to have_content 'Mesa: 4'
        expect(page).to have_content 'Cliente: Ernesto'
        expect(page).to have_content "\nStatus: Aguardando"
        expect(page).to have_link 'Itens', href: root_path
        expect(page).to have_link 'Ver detalhes', href: root_path
      end
      within "div##{carlos_order.id}" do
        expect(page).to have_content 'Para ser retirado - 19:30'
        expect(page).to have_content 'Cliente: Carlos'
        expect(page).to have_content "\nStatus: Aguardando"
        expect(page).to have_link 'Itens', href: root_path
        expect(page).to have_link 'Ver detalhes', href: root_path
      end
    end

    within 'div.other-orders' do
      expect(Order.count).to eq 5
      expect(page).not_to have_content 'Entrega - Rua: Cardoso, 100'
      expect(page).not_to have_content 'Cliente: Roger'
      expect(page).not_to have_content "\nStatus: Entregue"
      expect(page).not_to have_link 'Itens', href: root_path
      expect(page).not_to have_link 'Ver detalhes', href: root_path

      expect(page).not_to have_content 'Mesa: 7'
      expect(page).not_to have_content 'Cliente: Chris'
      expect(page).not_to have_content 'Status: Pago'
      expect(page).not_to have_link 'Itens', href: root_path
      expect(page).not_to have_link 'Ver detalhes', href: root_path

      expect(page).not_to have_content 'Mesa: 6'
      expect(page).not_to have_content 'Cliente: Michael'
      expect(page).not_to have_content 'Status: Cancelado'
      expect(page).not_to have_link 'Itens', href: root_path
      expect(page).not_to have_link 'Ver detalhes', href: root_path
    end
  end

  it 'acessando todos' do
    user = create :user, role: :collaborator
    ernesto_order = user.orders.create  delivery_type: :local, table_info: '4', status: :doing, customer: 'Ernesto'
    gabriel_order = user.orders.create  delivery_type: :delivery, address: 'Rua das Palmeiras', status: :doing,
    customer: 'Gabriel'
    carlos_order = user.orders.create delivery_type: :pickup, pick_up_time: '19:30', status: :doing,
    customer: 'Carlos'
    roger_order = user.orders.create  delivery_type: :local, table_info: '3', status: :delivered, customer: 'Roger'
    chris_order = user.orders.create  delivery_type: :local, table_info: '7', status: :paid, customer: 'Chris'
    michael_order = user.orders.create delivery_type: :local, table_info: '6', status: :canceled, customer: 'Michael'


    login_as user, scope: :user
    visit root_path
    click_on 'Todos'

    expect(page).to have_content 'Pedidos em espera'
    expect(page).not_to have_content 'Não há pedidos'

    within 'div.waiting-orders' do
      within "div##{ernesto_order.id}" do
        expect(page).to have_content 'Mesa: 4'
        expect(page).to have_content 'Cliente: Ernesto'
        expect(page).to have_content "\nStatus: Aguardando"
        expect(page).to have_link 'Itens', href: root_path
        expect(page).to have_link 'Ver detalhes', href: root_path
      end

      within "div##{gabriel_order.id}" do
        expect(page).to have_content 'Entrega - Rua das Palmeiras'
        expect(page).to have_content 'Cliente: Gabriel'
        expect(page).to have_content "\nStatus: Aguardando"
        expect(page).to have_link 'Itens', href: root_path
        expect(page).to have_link 'Ver detalhes', href: root_path
      end

      within "div##{carlos_order.id}" do
        expect(page).to have_content 'Para ser retirado - 19:30'
        expect(page).to have_content 'Cliente: Carlos'
        expect(page).to have_content "\nStatus: Aguardando"
        expect(page).to have_link 'Itens', href: root_path
        expect(page).to have_link 'Ver detalhes', href: root_path
      end
    end

    within "div##{roger_order.id}" do
      expect(page).to have_content 'Mesa: 3'
      expect(page).to have_content 'Cliente: Roger'
      expect(page).to have_content 'Status: Entregue'
      expect(page).to have_link 'Itens', href: root_path
      expect(page).to have_link 'Ver detalhes', href: root_path
    end

    within "div##{chris_order.id}" do
      expect(page).to have_content 'Mesa: 7'
      expect(page).to have_content 'Cliente: Chris'
      expect(page).to have_content 'Status: Pago'
      expect(page).to have_link 'Itens', href: root_path
      expect(page).to have_link 'Ver detalhes', href: root_path
    end

    within "div##{michael_order.id}" do
      expect(page).to have_content 'Mesa: 6'
      expect(page).to have_content 'Cliente: Michael'
      expect(page).to have_content 'Status: Cancelado'
      expect(page).to have_link 'Itens', href: root_path
      expect(page).to have_link 'Ver detalhes', href: root_path
    end
  end

  it 'e não há pedidos aguardando' do
    user = create :user, role: :collaborator

    roger_order = user.orders.create  delivery_type: :local, table_info: '3', status: :delivered, customer: 'Roger'

    login_as user, scope: :user
    visit root_path
    click_on 'Todos'

    expect(page).not_to have_content 'Não há pedidos'
    expect(page).not_to have_content 'Pedidos em espera'

    within "div##{roger_order.id}" do
      expect(page).to have_content 'Mesa: 3'
      expect(page).to have_content 'Cliente: Roger'
      expect(page).to have_content 'Status: Entregue'
      expect(page).to have_link 'Itens', href: root_path
      expect(page).to have_link 'Ver detalhes', href: root_path
    end
  end

  it 'e não há pedidos' do
    user = create :user, role: :collaborator

    login_as user, scope: :user
    visit root_path

    expect(page).to have_content 'Não há pedidos'
  end
end
