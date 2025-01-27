require 'rails_helper'

RSpec.describe 'GET /api/v1/orders/:id', type: :request do
  describe 'GET /api/v1/orders/:id' do
    let(:user) { create(:user_with_profile, email: 'test@example.com') }
    let(:order) do
      create(:order,
             user:,
             customer: 'John Doe',
             status: :doing,
             delivery_type: 'local',
             table_info: 'Table 5',
             address: '123 Main Street',
             pick_up_time: 1.hour.from_now,
             items_count: 0,
             items_attributes: [
               { name: 'Pizza', price: 50.0, status: :pendent,
                 additional_fields_attributes: [
                   { additional: 'Extra Cheese', additional_value: 20.0 }
                 ] },
               { name: 'Soda', price: 30.0, status: :pendent }
             ])
    end

    it 'retorna os detalhes do pedido com sucesso' do
      get "/api/v1/orders/#{order.id}"

      expect(response).to have_http_status(:success)
      json_response = JSON.parse(response.body)

      response_pick_up_time = Time.zone.parse(json_response['pick_up_time']).strftime('%Y-%m-%dT%H:%M:%S%:z')

      expected_pick_up_time = order.pick_up_time.strftime('%Y-%m-%dT%H:%M:%S%:z')

      expect(response_pick_up_time).to eq expected_pick_up_time

      expect(json_response['id']).to eq order.id
      expect(json_response['customer']).to eq 'John Doe'
      expect(json_response['status']).to eq 'doing'
      expect(json_response['delivery_type']).to eq 'local'
      expect(json_response['code']).to eq order.code
      expect(json_response['table_info']).to eq 'Table 5'
      expect(json_response['address']).to eq '123 Main Street'
      expect(json_response['total_price']).to eq '100.0'

      profile = user.profile
      expect(json_response['user']['email']).to eq 'test@example.com'
      expect(json_response['user']['profile']['full_name']).to eq profile.full_name
      expect(json_response['user']['profile']['photo_url']).to eq profile.photo_url

      items = json_response['items']
      expect(items.length).to eq 2

      pizza = items.find { |item| item['name'] == 'Pizza' }
      expect(pizza['price']).to eq '50.0'
      expect(pizza['status']).to eq 'pendent'
      expect(pizza['additional_fields'].length).to eq 1
      expect(pizza['additional_fields'][0]['additional']).to eq 'Extra Cheese'
      expect(pizza['additional_fields'][0]['additional_value']).to eq '20.0'

      soda = items.find { |item| item['name'] == 'Soda' }
      expect(soda['price']).to eq '30.0'
      expect(soda['status']).to eq 'pendent'
      expect(soda['additional_fields']).to eq []
    end
  end
end
