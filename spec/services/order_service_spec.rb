require 'rails_helper'

describe OrderService do
  let(:order) { create(:order, status: :delivered) }
  let(:service) { described_class.new(order) }

  describe '#show' do
    it 'retorna a ordem como JSON com os atributos esperados' do
      result = service.show
      expected_keys = described_class.base_order_attributes.map(&:to_s) + %w[items user]
      expect(result.keys).to match_array(expected_keys)
    end
  end

  describe '#update_order_status' do
    it 'atualiza time_stopped se o status mudar de doing' do
      order.doing!

      expect { service.update_order_status(:paid) }
        .to change { order.reload.time_stopped }.from(nil).to(be_within(1.second).of(Time.zone.now))
        .and change { order.status }.to('paid')
    end

    it 'atualiza apenas o status se mudar de qualquer outro que não seja doing' do
      order.delivered!

      service.update_order_status(:paid)

      expect(order.status).to eq 'paid'
      expect(order.time_stopped).to eq nil
    end
  end

  describe '#any_additional_fields_changed?' do
    it 'retorna true se um campo associado (additional_field) mudar' do
      item = order.items.first

      item.additional_fields.last.update!(additional: 'Novo valor')

      expect(service.any_additional_fields_changed?).to be true
    end

    it 'retorna false se nenhum campo associado mudar' do
      expect(service.any_additional_fields_changed?).to be false
    end
  end

  describe '#any_items_changed?' do
    it 'retorna verdadeiro se algum item da ordem teve seu status alterado' do
      item = order.items.first
      item.pendent!

      item.update!(status: :paid)
      expect(service.any_items_changed?).to eq true
    end
  end

  describe '#any_order_attributes_changed?' do
    it 'retorna verdadeiro se atributos relevantes forem alterados' do
      order.update!(status: :paid)
      expect(service.any_order_attributes_changed?).to be true
    end
  end

  describe '.format_response' do
    it 'retorna JSON formatado com as ordens' do
      orders = Order.all
      params = { query: 'today' }
      response = described_class.format_response(orders, params)
      expect(response).to include(:orders, :total_count)
    end
  end

  describe '.filter_orders' do
    it 'ordena os resultados por id em ordem decrescente' do
      create(:order, id: 1)
      create(:order, id: 2)
      result = described_class.filter_orders(Order.all, {})
      expect(result.first.id).to eq(2)
    end
  end

  describe '.apply_filters' do
    it 'aplica os filtros de busca, data e hoje' do
      create(:order, created_at: 1.hour.ago)
      params = { query: 'today' }
      filtered_orders = described_class.apply_filters(Order.all, params)
      expect(filtered_orders).to be_present
    end
  end

  describe '.filter_by_search_query' do
    it 'filtra ordens com base no termo de busca' do
      order.update!(customer: 'John Doe')
      result = described_class.filter_by_search_query(Order.all, { search_query: 'john' })
      expect(result).to include(order)
    end
  end

  describe '.filter_by_date' do
    it 'filtra ordens por uma data específica' do
      order.update!(created_at: Time.zone.today)
      result = described_class.filter_by_date(Order.all, { date_filter: Time.zone.today.to_s })
      expect(result).to include(order)
    end
  end

  describe '.filter_by_today' do
    it 'retorna ordens criadas nas últimas 12 horas' do
      order.update!(created_at: 6.hours.ago)
      expect(described_class.filter_by_today(Order.all)).to include(order)
    end
  end

  describe '.total_count' do
    it 'retorna a contagem correta de ordens' do
      expect(described_class.total_count(Order.all, { query: 'today' })).to eq(Order.count)
    end
  end

  describe '.order_includes' do
    it 'retorna as associações corretas' do
      expect(described_class.order_includes.keys).to match_array(%i[user items])
    end
  end

  describe '.order_only_attributes' do
    it 'retorna apenas atributos da ordem' do
      expect(described_class.order_only_attributes).to include(:id, :status, :customer)
    end
  end

  describe '.base_order_attributes' do
    it 'retorna os atributos base de uma ordem' do
      expect(described_class.base_order_attributes).to include(:id, :status, :customer)
    end
  end

  describe '.user_attributes' do
    it 'retorna os atributos do usuário com perfil' do
      expect(described_class.user_attributes[:include]).to have_key(:profile)
    end
  end
end
