require 'rails_helper'

RSpec.describe 'PUT /api/v1/stamps/:id', type: :request do
  let(:user) { create(:user) }
  let(:loyalty_card) { create(:loyalty_card, customer: create(:customer)) }
  let!(:stamp) { create(:stamp, loyalty_card:, item: 'Tea', user:) }
  let(:valid_params) { { stamp: { item: 'Updated Coffee' } } }

  context 'quando a atualização é bem-sucedida' do
    it 'atualiza o selo com sucesso' do
      put "/api/v1/loyalty_cards/#{loyalty_card.id}/stamps/#{stamp.id}", params: valid_params

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['item']).to eq 'Updated Coffee'
    end

    it 'mesmo item sendo vazio' do
      valid_params[:stamp][:item] = ''
      put "/api/v1/loyalty_cards/#{loyalty_card.id}/stamps/#{stamp.id}", params: valid_params

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['item']).to eq ''
    end
  end

  context 'retorna erro' do
    it 'quando update falha' do
      allow_any_instance_of(Stamp).to receive(:update).and_return(false)
      allow_any_instance_of(Stamp).to receive_message_chain(:errors, :full_messages).and_return(['Erro simulado'])
      put "/api/v1/loyalty_cards/#{loyalty_card.id}/stamps/#{stamp.id}", params: valid_params

      json_response = JSON.parse response.body
      expect(response).to have_http_status :unprocessable_entity
      expect(json_response['errors']).to eq ['Erro simulado']
    end
  end
end
