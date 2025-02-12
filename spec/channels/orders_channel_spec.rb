require 'rails_helper'

RSpec.describe OrdersChannel, type: :channel do
  let(:user) { create(:user) }

  before do
    stub_connection current_user: user
  end

  describe 'assinatura' do
    it 'assina com sucesso o canal de orders_channel' do
      subscribe

      expect(subscription).to be_confirmed
      expect(subscription).to have_stream_from('orders_channel')
    end
  end

  describe 'desconexão' do
    it 'desconecta com sucesso e limpa recursos' do
      subscribe

      expect(subscription).to be_confirmed

      unsubscribe

      expect(subscription).to_not have_stream_from('orders_channel')
    end
  end
end
