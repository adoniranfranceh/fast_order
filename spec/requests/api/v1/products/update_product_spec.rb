require 'rails_helper'

RSpec.describe 'PUT /api/v1/products/:id', type: :request do
  let(:admin) { create(:user, :admin) }
  let(:product) { create(:product, user: admin, name: 'Açaí 300ml no COPO') }

  context 'quando os parâmetros são válidos' do
    it 'atualiza o produto com sucesso' do
      put "/api/v1/products/#{product.id}", params: { product: { name: 'Açaí 500ml' } }

      expect(response).to have_http_status :ok
      json_response = JSON.parse response.body
      expect(json_response['name']).to eq 'Açaí 500ml'
    end
  end

  context 'quando os parâmetros são inválidos' do
    it 'retorna erro' do
      put "/api/v1/products/#{product.id}", params: { product: { name: '' } }

      expect(response).to have_http_status :unprocessable_entity
      json_response = JSON.parse response.body
      expect(json_response['errors']).to eq ['Nome não pode ficar em branco']
    end
  end

  context 'quando o produto não existe' do
    it 'retorna erro 404' do
      put '/api/v1/products/9999', params: { product: { name: 'Açaí 500ml' } }

      expect(response).to have_http_status :not_found
      json_response = JSON.parse response.body
      expect(json_response['error']).to eq 'Produto não encontrado'
    end
  end
end
