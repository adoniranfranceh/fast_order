require 'rails_helper'

describe 'Colaborador cria novo pedido' do
  it 'a partir da tela inicial', js: true do
    admin = create :user_with_profile, role: :admin
    user = create :user_with_profile, admin:, role: :collaborator

    login_as user, scope: :user
    visit root_path

    click_on 'Novo pedido'

    find('em', text: 'Selecione o tipo de entrega').click
    find('li[data-value="local"]').click
    fill_in 'Cliente', with: 'Ernesto'
    fill_in 'Info da Mesa', with: '5'
    fill_in 'Nome', with: 'Açaí'
    fill_in 'Preço', with: 10.0
    click_on 'Criar Pedido'

    order = Order.last
    expect(page).to have_content 'Novos Pedidos1'
    expect(page).to have_content "Pedido ##{order.code}"
    expect(page).to have_content 'Ernesto'
    expect(page).to have_content "\nMesa: 5"
    expect(page).to have_content "\nStatus: Aguardando..."
    expect(page).to have_button 'Ver Detalhes'

    expect(Order.count).to eq 1
    expect(order.reload.total_price).to eq 10
    expect(order.items.count).to eq 1
    item = order.items.last
    expect(item.name).to eq 'Açaí'
    expect(item.price).to eq 10.0
  end
end
