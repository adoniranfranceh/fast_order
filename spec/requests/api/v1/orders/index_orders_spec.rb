require 'rails_helper'

describe 'Vê pedidos' do
  context 'GET api/v1/orders' do
    it 'retorna pedidos com sucesso e aplica filtro de data' do
      user = create(:user)
      today = Time.zone.today
      yesterday = Time.zone.yesterday

      create(:order,
             customer: 'Roger',
             delivery_type: :local,
             table_info: '3',
             user:,
             status: 'paid',
             total_price: 55.0,
             items_attributes: [
               { name: 'Item 1', price: 10.0,
                 additional_fields: [{ additional: 'MEL', additional_value: 1.0 }] }
             ],
             created_at: today)

      create(:order,
             customer: 'Ernesto',
             delivery_type: :local,
             table_info: '5',
             user:,
             status: 'canceled',
             total_price: 21.5,
             items_attributes: [
               { name: 'Item 2', price: 15.0 }
             ],
             created_at: yesterday)

      get '/api/v1/orders', params: { date_filter: today.to_s }

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)

      expect(json_response['orders'].length).to eq 1
      filtered_order = json_response['orders'].first

      expect(filtered_order['customer']).to eq 'Roger'
      expect(filtered_order['status']).to eq 'paid'
      expect(filtered_order['total_price']).to eq '55.0'

      expect(filtered_order['items'].length).to eq 1
      item = filtered_order['items'].first
      expect(item['name']).to eq 'Item 1'
      expect(item['price']).to eq '10.0'

      expect(item['additional_fields'].length).to eq 1
      additional_field = item['additional_fields'].first
      expect(additional_field['additional']).to eq 'MEL'
      expect(additional_field['additional_value']).to eq '1.0'
    end
  end
end
