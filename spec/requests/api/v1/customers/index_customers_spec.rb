require 'rails_helper'

RSpec.describe 'GET /api/v1/customers', type: :request do
  let(:user) { create(:user, role: :admin) }
  let(:customers) { create_list(:customer, 10, user:) }

  it 'retorna a lista de clientes com sucesso' do
    customers
    get "/api/v1/customers/?admin_id=#{user.admin.id}"

    expect(response).to have_http_status :ok

    json_response = JSON.parse response.body

    expect(json_response['customers'].size).to eq 5
    expect(json_response['total_count']).to eq 10

    customer = Customer.order(:name).first
    customer_response = json_response['customers'].find { |c| c['id'] == customer.id }

    expect(customer_response['name']).to eq customer.name
    expect(customer_response['email']).to eq customer.email
    expect(customer_response['phone']).to eq customer.phone
    expect(customer_response['birthdate']).to eq customer.birthdate.to_s
    expect(customer_response['description']).to eq customer.description
    expect(customer_response['favorite_order']).to eq customer.favorite_order
    expect(customer_response['user_id']).to eq user.id
  end

  it 'filtra clientes pelo nome e data de nascimento' do
    target_customer = customers.first
    get '/api/v1/customers', params: { search_query: target_customer.name, date_filter: target_customer.birthdate }

    expect(response).to have_http_status :ok
    json_response = JSON.parse response.body

    expect(json_response['customers'].size).to eq 1
    expect(json_response['customers'].first['name']).to eq target_customer.name
    expect(json_response['customers'].first['birthdate']).to eq target_customer.birthdate.to_s
  end

  it 'retorna vazio quando não há clientes correspondentes' do
    get '/api/v1/customers', params: { search_query: 'Nome Inexistente' }

    expect(response).to have_http_status :ok
    json_response = JSON.parse response.body

    expect(json_response['customers']).to be_empty
    expect(json_response['total_count']).to eq 0
  end
end
