require 'rails_helper'

RSpec.describe 'PUT /api/v1/customers/:id', type: :request do
  let(:user) { create(:user) }
  let(:customer) { create(:customer, user:) }

  it 'atualiza os dados de um cliente com sucesso' do
    params = { customer: { name: 'Michael Updated' } }
    put "/api/v1/customers/#{customer.id}", params: params

    expect(response).to have_http_status(:ok)
    json_response = JSON.parse(response.body)
    expect(json_response['name']).to eq 'Michael Updated'
  end

  it 'retorna erro ao tentar atualizar com dados inválidos' do
    params = { customer: { name: '' } }
    put "/api/v1/customers/#{customer.id}", params: params

    expect(response).to have_http_status(:unprocessable_entity)
    json_response = JSON.parse(response.body)
    expect(json_response).to eq ['Nome não pode ficar em branco']
  end
end
