require 'rails_helper'

describe 'Vê pedidos' do
  context 'GET api/v1/orders' do
    it 'com sucesso' do
      user = create :user
      create(:order, customer: 'Roger', user:)
      create(:order, customer: 'Ernesto', user:)

      get '/api/v1/orders'

      expect(response).to have_http_status :success

      json_response = JSON.parse(response.body)

      expect(json_response.length).to eq 2
      expect(json_response[0]['customer']).to eq 'Roger'
      expect(json_response[1]['customer']).to eq 'Ernesto'
    end
  end
end
