require 'rails_helper'

RSpec.describe Order, type: :model do
  let!(:admin) { create(:user, role: :admin) }
  let!(:user) { create(:user, role: :collaborator, admin_id: admin.id) }

  let!(:order1) do
    create(:order, admin_id: admin.id, customer: 'John Doe', code: 'ORDER123', created_at: 1.day.ago)
  end
  let!(:order2) do
    create(:order, admin_id: admin.id, customer: 'Jane Smith', code: 'ORDER456', created_at: 2.days.ago)
  end
  let!(:order3) do
    create(:order, admin_id: admin.id, customer: 'Alice Johnson', code: 'ORDER789', created_at: Time.current)
  end
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
      order = build(:order, items: [])
      expect(order).to_not be_valid
      expect(order.errors[:items]).to include('não pode ficar em branco')
    end

    it 'é válido com todos os campos preenchidos corretamente para local' do
      user = create(:user)
      order = build(:order, delivery_type: :local, table_info: 'Mesa 1', items_attributes: [{ name: 'item 1' }],
                            user:)
      expect(order).to be_valid
    end

    it 'é válido com todos os campos preenchidos corretamente para delivery' do
      user = create(:user)
      order = build(:order, delivery_type: :delivery, address: 'Rua 123', items_attributes: [{ name: 'item 1' }],
                            user:)
      expect(order).to be_valid
    end

    it 'é válido com todos os campos preenchidos corretamente para pickup' do
      user = create(:user)
      order = build(:order, delivery_type: :pickup, pick_up_time: '12:00', items_attributes: [{ name: 'item 1' }],
                            user:)
      expect(order).to be_valid
    end
  end

  context '#content' do
    it 'tipo de entrega local' do
      user = create(:user)
      order = create(:order, user:, delivery_type: :local, table_info: 'M7')

      expect(order.content).to eq 'M7'
    end

    it 'tipo de entrega delivery' do
      user = create(:user)
      order = create(:order, user:, delivery_type: :delivery, address: 'Rua das Palmeiras, 100')

      expect(order.content).to eq 'Rua das Palmeiras, 100'
    end

    it 'tipo de entrega para retirar' do
      user = create(:user)
      order = create(:order, user:, delivery_type: :pickup, pick_up_time: '18:00')

      expect(order.content.strftime('%H:%M')).to eq '18:00'
    end
  end

  context '#sum_total' do
    it 'ao criar pedido' do
      user = create(:user)
      order = create(:order, items_count: 3, items_price: 15, additional_count: 1, additional_price: 0.5, user:)
      expect(order.total_price).to eq 3 * (15 + 0.5)
    end

    it 'ao atualizar o preço do item' do
      user = create(:user)
      order = create(:order, items_count: 2, items_price: 15, additional_count: 1, additional_price: 0.5, user:)

      order.items.first.update!(price: 30)

      expect(order.reload.total_price).to eq 30 + 15 + 2 * 0.5
    end

    it 'ao atualizar o preço do adicional' do
      user = create(:user)
      order = create(:order, items_count: 2, items_price: 15, additional_count: 1, additional_price: 0.5, user:)

      order.additional_fields.first.update!(additional_value: 1.0)
      order.reload

      expect(order.total_price).to eq 2 * 15 + 1 + 0.5
    end
  end

  describe '#elapsed_time' do
    let(:order) { Order.new }

    context 'quando o tempo de início e o tempo de parada estão definidos' do
      it 'retorna o tempo entre time_started e time_stopped' do
        order.time_started = Time.zone.local(2025, 2, 3, 14, 0, 0)
        order.time_stopped = Time.zone.local(2025, 2, 3, 15, 30, 0)

        expect(order.elapsed_time).to eq 90 * 60
      end
    end

    context 'quando o tempo de início ou o tempo de parada não estão definidos' do
      it 'retorna 0 quando time_started é nil' do
        order.time_started = nil
        order.time_stopped = Time.current

        expect(order.elapsed_time).to eq 0
      end

      it 'retorna 0 quando time_stopped é nil' do
        order.time_started = Time.current
        order.time_stopped = nil

        expect(order.elapsed_time).to eq 0
      end

      it 'retorna 0 quando ambos são nil' do
        order.time_started = nil
        order.time_stopped = nil

        expect(order.elapsed_time).to eq 0
      end
    end
  end

  describe '#generate_receipt' do
    let(:order) { create(:order) }
    let(:receipt_service) { instance_double(OrderReceiptService) }

    before do
      allow(OrderReceiptService).to receive(:new).with(order).and_return(receipt_service)
      allow(receipt_service).to receive(:print_receipt)
    end

    it 'chama o método print_receipt do OrderReceiptService' do
      order.generate_receipt
      expect(receipt_service).to have_received :print_receipt
    end
  end

  describe '#update_last_edited_at' do
    let(:order) { create(:order) }

    it 'atualiza o campo last_edited_at com o horário atual' do
      current_time = Time.current
      allow(Time).to receive(:current).and_return(current_time)

      order.update_last_edited_at

      expect(order.reload.last_edited_at).to be_within(0.1).of current_time
    end
  end

  context '.valid?' do
    context 'check_all_items_paid' do
      it 'é inválido se todos os itens não forem pagos' do
        user = create(:user)
        order = create(:order, user:, delivery_type: :delivery, address: 'Rua: Cardoso, 100', status: :doing,
                               customer: 'Roger', items_status: :pendent)

        order.update(status: 'paid')

        expect(order.reload.status).to eq 'doing'
        expect(order.errors[:base]).to include('Só é possível pagar se todos os itens forem pagos')
      end

      it 'é válido se todos os itens forem pagos' do
        user = create(:user)
        order = create(:order, user:, status: :delivered)

        order.items.first.update!(status: 'paid')
        order.update(status: 'paid')

        expect(order.reload.status).to eq 'paid'
      end
    end

    context 'método associate_admin' do
      it 'associa corretamente o admin ao pedido' do
        admin = create(:user, :admin)
        user = create(:user, admin:)
        order = create(:order, user:)
        order.reload
        expect(order.admin).to eq(admin)
      end
    end

    context '.cannot_revert_delivered_to_doing' do
      it 'status não pode ser doing se stopped_time for de 1 ou mais horas atrás' do
        order = create(:order, status: :delivered)

        order.update time_stopped: 2.hours.ago
        order.update status: :doing

        expect(order.errors[:base]).to include(
          'Status não pode ser alterado para "Novos Pedidos" ' \
          '1 hora depois de entregue'
        )
      end
    end
  end
end
