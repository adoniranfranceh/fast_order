require 'rails_helper'

RSpec.describe 'GET /api/v1/products', type: :request do
  let(:admin) { create(:user, :admin) }
  let!(:products) { create_list(:product, 10, user: admin) }

  context 'quando busca todos os produtos' do
    it 'retorna os produtos paginados corretamente' do
      get '/api/v1/products', params: { admin_id: admin.id }

      json_response = JSON.parse(response.body)
      first_product = json_response['products'].first
      expected_result = products.first

      expect(response).to have_http_status :ok
      expect(json_response['products'].size).to eq 10
      expect(first_product['id']).to eq expected_result.id
      expect(first_product['name']).to eq expected_result.name
      expect(first_product['description']).to eq expected_result.description
      expect(first_product['category']).to eq expected_result.category
      expect(first_product['base_price']).to eq expected_result.base_price.to_s
      expect(first_product['max_additional_quantity']).to eq expected_result.max_additional_quantity
      expect(first_product['extra_additional_price']).to eq expected_result.extra_additional_price
      expect(first_product['user_id']).to eq expected_result.user_id
      expect(json_response['total_count']).to eq 10
    end
  end

  context 'quando filtra por categoria' do
    let(:category_products) { create_list(:product, 3, category: 'Bebidas', user: admin) }

    it 'retorna apenas produtos da categoria especificada' do
      get '/api/v1/products', params: { category: 'Bebidas', admin_id: admin.id }

      json_response = JSON.parse(response.body)
      expect(response).to have_http_status(:ok)
      expect(json_response['products'].all? { |p| p['category'] == 'Bebidas' }).to be_truthy
    end
  end

  context 'quando faz busca por nome' do
    let!(:product) { create(:product, name: 'Coca-Cola', user: admin) }

    it 'retorna apenas os produtos correspondentes' do
      get '/api/v1/products', params: { search_query: 'coca', admin_id: admin.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['products'].size).to be >= 1
      expect(json_response['products'].first['name']).to eq 'Coca-Cola'
    end
  end

  context 'quando não há produtos cadastrados' do
    before { Product.destroy_all }

    it 'retorna uma lista vazia' do
      get '/api/v1/products', params: { admin_id: admin.id }

      json_response = JSON.parse response.body
      expect(response).to have_http_status :ok
      expect(json_response['products']).to be_empty
      expect(json_response['total_count']).to eq 0
    end
  end

  context 'quando o admin_id não existe' do
    it 'retorna erro 404' do
      get '/api/v1/products', params: { admin_id: 9999 }

      expect(response).to have_http_status :not_found
      expect(JSON.parse(response.body)).to eq 'error' => 'Admin não encontrado'
    end
  end
end
