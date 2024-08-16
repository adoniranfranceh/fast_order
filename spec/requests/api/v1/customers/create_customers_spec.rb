require 'rails_helper'

describe 'Cria cliente' do
  it 'com sucesso' do
    user = create(:user)
    params = {
      customer: {
        name: 'Michael',
        email: 'michael@email.com',
        birthdate: '2000-07-12',
        phone: '525252525',
        favorite_order: 'Xícara de chá',
        user_id: user.id
      }
    }

    post('/api/v1/customers', params:)

    expect(response).to have_http_status :created
    expect(Customer.count).to eq 1
    json_response = JSON.parse(response.body)
    expect(json_response['message']).to eq 'Cliente salvo com sucesso'
    customer = Customer.last
    expect(customer.name).to eq 'Michael'
    expect(customer.email).to eq 'michael@email.com'
    expect(customer.birthdate).to eq Time.zone.parse('2000-07-12')
    expect(customer.phone).to eq '525252525'
    expect(customer.favorite_order).to eq 'Xícara de chá'
    expect(customer.user_id).to eq user.id
  end

  it 'com sucesso' do
    user = create(:user)
    params = {
      customer: {
        name: '',
        email: 'michael@email.com',
        birthdate: '',
        phone: '525252525',
        favorite_order: 'Xícara de chá',
        user_id: user.id
      }
    }

    post('/api/v1/customers', params:)

    expect(response).to have_http_status :unprocessable_entity
    expect(Customer.count).to eq 0
    json_response = JSON.parse(response.body)
    expect(json_response['errors']).to eq ['Nome não pode ficar em branco',
                                           'Data de nascimento não pode ficar em branco']
  end
end
