require 'rails_helper'

RSpec.describe 'GET /api/v1/customers/:id', type: :request do
  let(:user) { create(:user) }
  let(:customer) { create(:customer, user:) }

  it 'retorna os detalhes de um cliente' do
    create(:loyalty_card, customer:)
    get "/api/v1/customers/#{customer.id}"

    json_response = JSON.parse response.body

    expect(response).to have_http_status :ok
    expect(json_response['name']).to eq customer.name
    expect(json_response['email']).to eq customer.email
    expect(json_response['loyalty_cards']).to be_present
  end

  it 'retorna erro se o cliente não existe' do
    get '/api/v1/customers/999'

    expect(response).to have_http_status :not_found
  end
end
