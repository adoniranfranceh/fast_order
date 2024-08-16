require 'rails_helper'

RSpec.describe Order, type: :model do
  context 'validações de delivery' do
    it 'é inválido sem delivery_type' do
      order = build(:order, delivery_type: nil)
      expect(order).to_not be_valid
      expect(order.errors[:delivery_type]).to include('não pode ficar em branco')
    end

    it 'é inválido com delivery_type local sem table_info' do
      order = build(:order, delivery_type: :local, table_info: nil)
      expect(order).to_not be_valid
      expect(order.errors[:table_info]).to include('não pode ficar em branco. Entrega local')
    end

    it 'é inválido com delivery_type delivery sem address' do
      order = build(:order, delivery_type: :delivery, address: nil)
      expect(order).to_not be_valid
      expect(order.errors[:address]).to include('não pode ficar em branco. Entrega delivery')
    end

    it 'é inválido com delivery_type pickup sem pick_up_time' do
      order = build(:order, delivery_type: :pickup, pick_up_time: nil)
      expect(order).to_not be_valid
      expect(order.errors[:pick_up_time]).to include('não pode ficar em branco. Entrega para retirada')
    end

    it 'é inválido sem items' do
      order = build(:order, create_items: false)
      expect(order).to_not be_valid
      expect(order.errors[:items]).to include('não pode ficar em branco')
    end

    it 'é válido com todos os campos preenchidos corretamente para local' do
      user = create :user
      order = build(:order, delivery_type: :local, table_info: 'Mesa 1', items_attributes: [name: 'item 1'], user:)
      expect(order).to be_valid
    end

    it 'é válido com todos os campos preenchidos corretamente para delivery' do
      user = create :user
      order = build(:order, delivery_type: :delivery, address: 'Rua 123', items_attributes: [name: 'item 1'], user:)
      expect(order).to be_valid
    end

    it 'é válido com todos os campos preenchidos corretamente para pickup' do
      user = create :user
      order = build(:order, delivery_type: :pickup, pick_up_time: '12:00', items_attributes: [name: 'item 1'], user:)
      expect(order).to be_valid
    end
  end

  context '.content' do
    it 'tipo de entrega local' do
      user = create :user
      order = create :order, user:, delivery_type: :local, table_info: 'M7'

     expect(order.content).to eq 'M7'
    end

    it 'tipo de entrega delivery' do
      user = create :user
      order = create :order, user:, delivery_type: :delivery, address: 'Rua das Palmeiras, 100'

      expect(order.content).to eq 'Rua das Palmeiras, 100'
    end

    it 'tipo de entrega para retirar' do
      user = create :user
      order = create :order, user:, delivery_type: :pickup, pick_up_time: '18:00'

      expect(order.content.strftime('%H:%M')).to eq '18:00'
    end
  end
end
