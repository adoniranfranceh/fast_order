require 'rails_helper'

describe 'Cria pedido' do
  context 'POST api/v1/orders' do
    it 'com sucesso' do
      user = create(:user)
      params = {
        order: {
          customer: 'Ernesto',
          delivery_type: :local,
          table_info: '7',
          user_id: user.id,
          items_attributes: [
            { name: 'Item 1',
              additional_fields_attributes: [
                { additional: 'Adicional 1', additional_value: '20' }
              ] },
            { name: 'Item 2',
              additional_fields_attributes: [
                { additional: 'Adicional 2', additional_value: '15' }
              ] }
          ]
        }
      }

      post('/api/v1/orders', params:)

      expect(response).to have_http_status :created

      expect(Order.count).to eq 1
      expect(Item.count).to eq 2
      expect(AdditionalField.count).to eq 2

      order = Order.last
      expect(order.items.count).to eq 2
      expect(order.items.first.name).to eq 'Item 1'
      expect(order.items.second.name).to eq 'Item 2'

      item1 = order.items.first
      item2 = order.items.second
      expect(item1.additional_fields.count).to eq 1
      expect(item1.additional_fields.first.additional).to eq 'Adicional 1'
      expect(item1.additional_fields.first.additional_value).to eq 20

      expect(item2.additional_fields.count).to eq 1
      expect(item2.additional_fields.first.additional).to eq 'Adicional 2'
      expect(item2.additional_fields.first.additional_value).to eq 15
    end
  end
end
