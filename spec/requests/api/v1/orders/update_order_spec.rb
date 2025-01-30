require 'rails_helper'

RSpec.describe 'Atualiza Pedido', type: :request do
  describe 'PUT /api/v1/orders/:id' do
    let(:order) { create(:order, status: :doing, items_count: 1, items_price: 20, additional_count: 0) }

    context 'com sucesso' do
      it 'atualiza o pedido com novos dados' do
        params = {
          order: {
            customer: 'Customer',
            status: :paid
          }
        }

        put("/api/v1/orders/#{order.id}", params:)

        expect(response).to have_http_status(:ok)

        updated_order = Order.find(order.id)
        expect(Order.count).to eq 1
        expect(AdditionalField.count).to eq 0
        expect(updated_order.customer).to eq 'Customer'
        expect(updated_order.items.count).to eq 1
        expect(updated_order.total_price).to eq 20
      end

      it 'atualiza `time_stopped` quando status muda de doing para delivered' do
        params = {
          order: {
            status: :delivered
          }
        }

        put("/api/v1/orders/#{order.id}", params:)

        expect(response).to have_http_status(:ok)

        updated_order = Order.find(order.id)
        expect(Order.count).to eq 1
        expect(AdditionalField.count).to eq 0
        expect(updated_order.time_stopped).to be_within(0.1).of(Time.zone.now)
        expect(updated_order.items.count).to eq 1
        expect(updated_order.total_price).to eq 20
      end

      it 'atualiza status do pedido' do
        order.delivered!

        params = {
          order: {
            status: :paid
          }
        }

        put("/api/v1/orders/#{order.id}", params:)

        expect(response).to have_http_status(:ok)

        updated_order = Order.find(order.id)
        expect(Order.count).to eq 1
        expect(AdditionalField.count).to eq 0
        expect(updated_order.items.count).to eq 1
        expect(updated_order.total_price).to eq 20
      end

      it 'adiciona um novo adicional a um item existente' do
        params = {
          order: {
            items_attributes: [
              {
                id: order.items.first.id,
                additional_fields_attributes: [
                  { additional: 'Adicional 1', additional_value: 20 }
                ]
              }
            ]
          }
        }

        put("/api/v1/orders/#{order.id}", params:)

        expect(response).to have_http_status(:ok)

        updated_order = Order.find(order.id)
        expect(Order.count).to eq 1
        expect(AdditionalField.count).to eq 1
        expect(updated_order.items.count).to eq 1
        expect(updated_order.reload.total_price).to eq 40

        item = updated_order.items.first
        expect(item.additional_fields.count).to eq 1
        additional_field = item.additional_fields.first
        expect(additional_field.additional).to eq 'Adicional 1'
        expect(additional_field.additional_value).to eq 20
      end

      it 'adiciona um novo item ao pedido' do
        params = {
          order: {
            items_attributes: [
              {
                name: 'Item',
                price: 10
              }
            ]
          }
        }

        put("/api/v1/orders/#{order.id}", params:)

        expect(response).to have_http_status(:ok)

        updated_order = Order.find(order.id)
        expect(Order.count).to eq 1
        expect(Item.count).to eq 2
        expect(AdditionalField.count).to eq 0
        expect(updated_order.items.count).to eq 2
        expect(updated_order.reload.total_price).to eq 30

        new_item = updated_order.items.last
        expect(new_item.name).to eq 'Item'
        expect(new_item.price).to eq 10
        expect(new_item.additional_fields.count).to eq 0
      end
    end

    context 'com falha' do
      it 'não permite remover todos os itens do pedido' do
        params = {
          order: {
            items_attributes: [
              { id: order.items.first.id, _destroy: true }
            ]
          }
        }

        put("/api/v1/orders/#{order.id}", params:)

        expect(response).to have_http_status :unprocessable_entity

        json_response = JSON.parse response.body
        expect(json_response).to eq ['Itens não pode ficar em branco']

        unchanged_order = Order.find order.id
        expect(Order.count).to eq 1
        expect(unchanged_order.items.count).to eq 1
        expect(unchanged_order.reload.total_price).to eq 20
      end
    end
  end
end
