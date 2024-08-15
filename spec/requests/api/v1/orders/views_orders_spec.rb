require 'rails_helper'

describe 'Vê pedidos' do
  context 'GET api/v1/orders' do
    it 'com sucesso' do
      user = create(:user)
      create(:order, customer: 'Roger', user:,
                     items_attributes: [{ name: 'Item 1' }])
      create(:order, customer: 'Ernesto', user:,
                     items_attributes: [{ name: 'Item 1' },
                                        additional_fields_attributes: [
                                          { additional: 'Adicional 1', additional_value: 20 }
                                        ]])

      get '/api/v1/orders'

      expect(response).to have_http_status(:success)

      json_response = JSON.parse(response.body)

      expect(json_response.length).to eq 2

      first_order = json_response.find { |order| order['customer'] == 'Roger' }
      expect(first_order['status']).to eq 'doing'
      expect(first_order['customer']).to eq 'Roger'
      expect(first_order['items'].length).to eq 1
      expect(first_order['items'].first['name']).to eq 'Item 1'
      expect(first_order['additional_fields']).to eq nil

      second_order = json_response.find { |order| order['customer'] == 'Ernesto' }
      expect(second_order['status']).to eq 'doing'
      expect(second_order['customer']).to eq 'Ernesto'
      expect(second_order['items'].length).to eq 2
      expect(second_order['items'].first['name']).to eq 'Item 1'
      second_order_additionals = second_order['items'].second['additional_fields']
      expect(second_order_additionals.length).to eq 1
      expect(second_order_additionals.first['additional']).to eq 'Adicional 1'
      expect(second_order_additionals.first['additional_value']).to eq '20.0'
    end
  end
end
