require 'rails_helper'

RSpec.describe 'DELETE /api/v1/customers/:id', type: :request do
  let(:user) { create(:user) }
  let!(:customer) { create(:customer, user:) }

  describe 'remover cliente' do
    it 'remove o cliente com sucesso' do
      delete "/api/v1/customers/#{customer.id}"

      expect(response).to have_http_status :ok
      expect(Customer.exists?(customer.id)).to eq false
    end

    it 'retorna erro ao tentar remover cliente com falha no destroy' do
      allow_any_instance_of(Customer).to receive(:destroy).and_return(false)
      allow_any_instance_of(Customer).to receive_message_chain(:errors, :full_messages).and_return(['Erro simulado'])

      delete "/api/v1/customers/#{customer.id}"

      json_response = JSON.parse response.body
      expect(response).to have_http_status :unprocessable_entity
      expect(json_response).to eq ['Erro simulado']
    end
  end
end
