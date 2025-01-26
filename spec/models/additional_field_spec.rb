require 'rails_helper'

RSpec.describe AdditionalField, type: :model do
  describe 'update_order_total' do
    context 'atualiza preço total do pedido' do
      it 'ao adicionar adicional' do
        order = create :order,  items_count: 1, items_price: 20
        additional = create :additional_field, item: order.items.first, additional_value: 10.0


        expect(additional.additional_value).to eq 10.0
        expect(order.reload.total_price).to eq 30.0
      end

      it 'ao atualizar adicional' do
        order = create :order,  items_count: 1, items_price: 20
        additional = order.additional_fields.first

        additional.update additional_value: 5

        expect(additional.additional_value).to eq 5.0
        expect(order.reload.total_price).to eq 25.0
      end
    end
  end
end
