require 'rails_helper'

describe 'Colaborador cria novo pedido' do
  xit 'a partir da tela inicial' do
    user = create :user, role: :collaborator

    login_as user, scope: :user

    click_on 'Novo Pedido'

    select 'Local', from: 'Tipo de entrega'
    fill_in 'Mesa', with: '5'

    select
  end
end
