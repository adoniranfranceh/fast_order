require 'rails_helper'

RSpec.describe 'POST /api/v1/products', type: :request do
  let(:admin) { create(:user, :admin) }
  let(:valid_attributes) do
    {
      name: 'Açaí 300ml no COPO',
      description: '',
      category: 'Açaí',
      base_price: 10.0,
      max_additional_quantity: 3,
      user_id: admin.id
    }
  end

  context 'quando os parâmetros são válidos' do
    it 'cria um novo produto com sucesso' do
      post '/api/v1/products', params: { product: valid_attributes }

      expect(response).to have_http_status :created
      json_response = JSON.parse(response.body)
      expect(json_response['message']).to eq 'Cliente registrado com sucesso'
      expect(json_response['product']['name']).to eq 'Açaí 300ml no COPO'
    end
  end

  context 'quando os parâmetros são inválidos' do
    it 'retorna erro' do
      post '/api/v1/products', params: { product: { name: '' } }

      expect(response).to have_http_status :unprocessable_entity
      json_response = JSON.parse response.body
      expect(json_response).to eq ['Usuário é obrigatório(a)', 'Nome não pode ficar em branco',
                                   'Preço Base não pode ficar em branco', 'Preço Base não é um número']
    end
  end
end
