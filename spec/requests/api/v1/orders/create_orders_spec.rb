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

    context 'e falha' do
      it 'quando delivery_type não é fornecido' do
        user = create(:user)
        params = {
          order: {
            customer: 'Ernesto',
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

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse response.body
        expect(json_response['errors']).to include 'Tipo de entrega não pode ficar em branco'

        expect(Order.count).to eq 0
      end

      it 'quando delivery_type é local e table_info não é fornecido' do
        user = create(:user)
        params = {
          order: {
            customer: 'Ernesto',
            delivery_type: :local,
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

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse response.body
        expect(json_response['errors']).to include 'Info da mesa não pode ficar em branco. Entrega local'

        expect(Order.count).to eq 0
      end

      it 'quando delivery_type é delivery e address não é fornecido' do
        user = create(:user)
        params = {
          order: {
            customer: 'Ernesto',
            delivery_type: :delivery,
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

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse response.body
        expect(json_response['errors']).to include 'Endereço não pode ficar em branco. Entrega delivery'

        expect(Order.count).to eq 0
      end

      it 'quando delivery_type é pickup e pick_up_time não é fornecido' do
        user = create(:user)
        params = {
          order: {
            customer: 'Ernesto',
            delivery_type: :pickup,
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

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse response.body
        expect(json_response['errors']).to include 'Hora de retirada não pode ficar em branco. Entrega para retirada'

        expect(Order.count).to eq 0
      end

      it 'quando items não é fornecido' do
        user = create(:user)
        params = {
          order: {
            customer: 'Ernesto',
            delivery_type: :local,
            table_info: '7',
            user_id: user.id
          }
        }

        post('/api/v1/orders', params:)

        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse response.body
        expect(json_response['errors']).to include 'Items não pode ficar em branco'
        expect(Order.count).to eq 0
      end
    end
  end
end
