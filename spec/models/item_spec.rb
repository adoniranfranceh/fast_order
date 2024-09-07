require 'rails_helper'

RSpec.describe Item, type: :model do
  context '.valid?' do
    context '.check_order_status' do
      it 'atualiza status para entregue se algum item for pendent novamente' do
        user = create :user
        order = create(:order, user:, status: :paid, items_status: :paid)
        item_paid = create :item, order:, status: :paid

        item_paid.update(status: 'pendent')
        expect(order.reload.status).to eq('delivered')
      end
    end
  end
end
