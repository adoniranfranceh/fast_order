require 'rails_helper'

RSpec.describe 'GET /api/v1/products/:id', type: :request do
  describe 'GET /api/v1/products/:id' do
    let(:user) { create(:user) }
    let(:product) do
      create(:product,
             name: 'Açaí 300ml no COPO',
             description: '',
             category: 'Açaí',
             base_price: 10.0,
             max_additional_quantity: 3,
             extra_additional_price: nil,
             user:)
    end

    context 'quando o produto existe' do
      it 'retorna os detalhes do produto com sucesso' do
        get "/api/v1/products/#{product.id}"

        expect(response).to have_http_status :success
        json_response = JSON.parse response.body

        expect(json_response['id']).to eq product.id
        expect(json_response['name']).to eq 'Açaí 300ml no COPO'
        expect(json_response['description']).to eq ''
        expect(json_response['category']).to eq 'Açaí'
        expect(json_response['base_price']).to eq '10.0'
        expect(json_response['max_additional_quantity']).to eq 3
        expect(json_response['extra_additional_price']).to be_nil
        expect(json_response['user_id']).to eq user.id
      end
    end

    context 'quando o produto não existe' do
      it 'retorna um erro 404' do
        get '/api/v1/products/99999'

        expect(response).to have_http_status :not_found
        json_response = JSON.parse response.body

        expect(json_response['error']).to eq 'Produto não encontrado'
      end
    end
  end
end
