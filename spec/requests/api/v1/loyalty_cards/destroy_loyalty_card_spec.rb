require 'rails_helper'

RSpec.describe 'DELETE /api/v1/loyalty_cards/:id', type: :request do
  let(:customer) { create(:customer) }
  let!(:loyalty_card) { create(:loyalty_card, customer:) }

  context 'quando o produto existe' do
    it 'deleta o produto com sucesso' do
      delete "/api/v1/loyalty_cards/#{loyalty_card.id}"

      expect(response).to have_http_status :ok
      json_response = JSON.parse response.body
      expect(json_response['id']).to eq loyalty_card.id
      expect(LoyaltyCard.count).to eq 0
    end
  end

  context 'retorna erro' do
    it 'quando produto não existe' do
      delete '/api/v1/loyalty_cards/9999'
      expect(response).to have_http_status :not_found
    end

    it 'ao falhar no destroy' do
      allow_any_instance_of(LoyaltyCard).to receive(:destroy).and_return(false)
      allow_any_instance_of(LoyaltyCard).to receive_message_chain(:errors, :full_messages).and_return(['Erro simulado'])

      delete "/api/v1/loyalty_cards/#{loyalty_card.id}"

      expect(response).to have_http_status :unprocessable_entity
      json_response = JSON.parse response.body
      expect(json_response['errors']).to eq ['Erro simulado']
    end
  end
end
