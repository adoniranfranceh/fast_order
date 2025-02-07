require 'rails_helper'

RSpec.describe 'DELETE /api/v1/products/:id', type: :request do
  let(:admin) { create(:user, :admin) }
  let!(:product) { create(:product, user: admin) }

  context 'quando o produto existe' do
    it 'deleta o produto com sucesso' do
      delete "/api/v1/products/#{product.id}"

      expect(response).to have_http_status :ok
      json_response = JSON.parse response.body
      expect(json_response['id']).to eq product.id
      expect(Product.count).to eq 0
    end
  end

  context 'retorna erro' do
    it 'quando produto não existe' do
      delete '/api/v1/products/9999'

      expect(response).to have_http_status :not_found
      json_response = JSON.parse response.body
      expect(json_response['error']).to eq 'Produto não encontrado'
    end

    it 'ao falhar no destroy' do
      allow_any_instance_of(Product).to receive(:destroy).and_return(false)
      allow_any_instance_of(Product).to receive_message_chain(:errors, :full_messages).and_return(['Erro simulado'])

      delete "/api/v1/products/#{product.id}"

      expect(response).to have_http_status :unprocessable_entity
      json_response = JSON.parse response.body
      expect(json_response['errors']).to eq ['Erro simulado']
    end
  end
end
