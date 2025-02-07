require 'rails_helper'

RSpec.describe 'POST /api/v1/customers/:customer_id/loyalty_card', type: :request do
  let!(:customer) { create(:customer) }
  let(:valid_params) { { loyalty_card: { name: 'Gold', status: 'active' } } }

  it 'cria um novo cartão de fidelidade' do
    post "/api/v1/customers/#{customer.id}/loyalty_card", params: valid_params

    expect(response).to have_http_status :created
    expect(JSON.parse(response.body)['name']).to eq 'Gold'
  end

  it 'retorna erro quando falha no save' do
    allow_any_instance_of(LoyaltyCard).to receive(:save).and_return(false)
    allow_any_instance_of(LoyaltyCard).to receive_message_chain(:errors, :full_messages).and_return(['Erro simulado'])

    post "/api/v1/customers/#{customer.id}/loyalty_card", params: valid_params

    expect(response).to have_http_status :unprocessable_entity
    expect(JSON.parse(response.body)['errors']).to eq ['Erro simulado']
  end
end
