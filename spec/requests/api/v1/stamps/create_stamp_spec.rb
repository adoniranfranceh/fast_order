require 'rails_helper'

RSpec.describe 'POST /api/v1/stamps', type: :request do
  let(:user) { create(:user) }
  let(:loyalty_card) { create(:loyalty_card, customer: create(:customer)) }
  let(:valid_params) { { stamp: { item: 'Coffee' }, admin_id: user.admin_id } }
  let(:invalid_params) { { stamp: { item: '' }, admin_id: nil } }

  context 'quando os parâmetros são válidos' do
    it 'cria um selo com sucesso' do
      post "/api/v1/loyalty_cards/#{loyalty_card.id}/stamps", params: valid_params

      json_response = JSON.parse response.body
      expect(response).to have_http_status :created
      expect(json_response['item']).to eq 'Coffee'
    end
  end

  context 'retorna erro' do
    it 'quando os parâmetros são inválidos' do
      post "/api/v1/loyalty_cards/#{loyalty_card.id}/stamps", params: invalid_params

      expect(response).to have_http_status :not_found
    end

    it 'quando save quebra' do
      allow_any_instance_of(Stamp).to receive(:save).and_return(false)
      allow_any_instance_of(Stamp).to receive_message_chain(:errors, :full_messages).and_return(['Erro simulado'])

      post "/api/v1/loyalty_cards/#{loyalty_card.id}/stamps", params: valid_params

      expect(response).to have_http_status :unprocessable_entity
      expect(JSON.parse(response.body)['errors']).to eq ['Erro simulado']
    end
  end
end
