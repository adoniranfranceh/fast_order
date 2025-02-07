require 'rails_helper'

RSpec.describe 'PUT /api/v1/loyalty_cards/:id', type: :request do
  let(:customer) { create(:customer) }
  let!(:loyalty_card) { create(:loyalty_card, customer:) }
  let(:valid_params) { { loyalty_card: { name: 'Platinum' } } }

  it 'atualiza um cartão de fidelidade existente' do
    put "/api/v1/loyalty_cards/#{loyalty_card.id}", params: valid_params

    expect(response).to have_http_status :ok
    expect(JSON.parse(response.body)['name']).to eq 'Platinum'
  end

  it 'retorna erro quando o cartão não existe' do
    put '/api/v1/loyalty_cards/99999', params: valid_params
    expect(response).to have_http_status :not_found
  end

  it 'retorna erro ao falhar no update' do
    allow_any_instance_of(LoyaltyCard).to receive(:update).and_return(false)
    allow_any_instance_of(LoyaltyCard).to receive_message_chain(:errors, :full_messages).and_return(['Erro simulado'])
    put "/api/v1/loyalty_cards/#{loyalty_card.id}", params: valid_params

    expect(response).to have_http_status :unprocessable_entity
    expect(JSON.parse(response.body)['errors']).to eq ['Erro simulado']
  end
end
