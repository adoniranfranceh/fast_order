require 'rails_helper'

RSpec.describe OrderReceiptService, type: :service do
  let(:printer) { instance_double(Escpos::Printer) }
  let(:order) do
    instance_double(Order,
                    id: 1,
                    code: '1234',
                    customer: 'Cliente Teste',
                    delivery_type: 'pickup',
                    created_at: Time.zone.now,
                    total_price: 50.0,
                    last_edited_at: nil,
                    items: [])
  end
  let(:service) { described_class.new(order) }

  before do
    allow(Escpos::Printer).to receive(:new).and_return(printer)
    allow(printer).to receive(:<<)
    allow(printer).to receive(:to_escpos).and_return('ESC/POS DATA')
    allow(File).to receive(:open).and_yield(double(write: true))
    allow(Rails.logger).to receive(:info)
    allow(Rails.logger).to receive(:debug)
    allow(Rails.logger).to receive(:error)
  end

  describe '#generate_if_needed' do
    before { allow(service).to receive(:should_generate_receipt?).and_return(true) }

    it 'chama generate se o recibo precisar ser gerado' do
      expect(service).to receive(:generate)
      service.generate_if_needed
    end
  end

  describe '#generate' do
    it 'chama generate_receipt no pedido' do
      expect(order).to receive(:generate_receipt)
      service.generate
    end
  end

  describe '#print_receipt' do
    it 'loga e envia dados de recibo para a impressora' do
      expect(service).to receive(:build_receipt)
      expect(service).to receive(:send_to_printer).with('ESC/POS DATA')
      service.print_receipt
    end
  end

  describe '#should_generate_receipt?' do
    before do
      allow(service).to receive(:additional_fields_changed?).and_return(false)
      allow(service).to receive(:items_changed?).and_return(false)
      allow(service).to receive(:order_attributes_changed?).and_return(true)
    end

    it 'retorna true se os atributos do pedido mudaram' do
      expect(service.send(:should_generate_receipt?)).to be true
    end
  end

  describe '#additional_fields_changed?' do
    let(:item) do
      double('Item',
             additional_fields: [double('AdditionalField',
                                        previous_changes: { updated_at: %w[2023-01-01 2023-01-02] })])
    end

    before do
      allow(order).to receive(:items).and_return([item])
    end

    it 'verifica se os campos adicionais mudaram' do
      expect(service.send(:additional_fields_changed?)).to be true
    end
  end

  describe '#items_changed?' do
    let(:item) { double('Item', previous_changes: { updated_at: %w[2023-01-01 2023-01-02] }) }

    before do
      allow(order).to receive(:items).and_return([item])
    end

    it 'verifica se os itens mudaram' do
      expect(service.send(:items_changed?)).to be true
    end
  end

  describe '#order_attributes_changed?' do
    before do
      allow(order).to receive(:previous_changes).and_return('status' => %w[pending completed])
    end

    it 'verifica se os atributos do pedido mudaram' do
      expect(service.send(:order_attributes_changed?)).to be true
    end
  end

  describe '#build_receipt' do
    it 'chama os métodos responsáveis pela construção do recibo' do
      expect(service).to receive(:add_header)
      expect(service).to receive(:add_order_details)
      expect(service).to receive(:add_items)
      expect(service).to receive(:add_total)
      expect(service).to receive(:add_footer)

      service.send(:build_receipt)
    end
  end

  describe '#add_header' do
    let(:order_with_edit) { instance_double(Order, last_edited_at: Time.zone.now, code: '1234') }
    let(:order_without_edit) { instance_double(Order, last_edited_at: nil, code: '1234') }

    it 'imprime a data de edição quando o pedido foi editado' do
      service = described_class.new(order_with_edit)
      expect(Escpos::Helpers).to receive(:big).with("Editado em #{order_with_edit.last_edited_at.strftime('%H:%M')}\n")
      service.send(:add_header)
    end

    it 'não imprime a data de edição quando o pedido não foi editado' do
      service = described_class.new(order_without_edit)
      expect(Escpos::Helpers).not_to receive(:big)
      service.send(:add_header)
    end
  end

  describe '#add_order_details' do
    let(:order) do
      instance_double(Order, customer: 'Cliente Teste', delivery_type: 'pickup', content: 'Detalhes',
                             created_at: Time.zone.now)
    end

    it 'imprime as informações do pedido corretamente' do
      service = described_class.new(order)
      expect(service).to receive(:format_text).with('Cliente: Cliente Teste')
      expect(service).to receive(:format_text).with('Tipo de Entrega: Para retirada Detalhes')
      expect(service).to receive(:format_text).with("Data: #{order.created_at.strftime('%d/%m/%Y %H:%M')}")
      service.send(:add_order_details)
    end
  end

  describe '#add_items' do
    let(:order) { instance_double(Order, items: [item_with_additional]) }
    let(:item_with_additional) do
      instance_double(Item, name: 'Item 1', price: 10.0, additional_fields: [additional_field])
    end
    let(:additional_field) { instance_double(AdditionalField, additional: 'Adicional 1', additional_value: 5.0) }

    it 'chama os métodos de detalhes do item e imprime os campos adicionais' do
      service = described_class.new(order) # Apenas o order é passado
      allow(service).to receive(:add_item_details).and_call_original
      allow(service).to receive(:add_item_total).and_call_original
      expect(service).to receive(:add_additional_fields).with(item_with_additional).once
      service.send(:add_items)
    end
  end

  describe '#add_additional_fields' do
    let(:add_field) { instance_double(AdditionalField, additional: 'Adicional 1', additional_value: 5.0) }
    let(:item_with_additional) { instance_double(Item, additional_fields: [add_field]) }
    let(:order) { instance_double(Order, items: [item_with_additional]) }

    it 'imprime os campos adicionais e seus valores corretamente' do
      service = described_class.new(order)
      expect(service).to receive(:format_text).with('Adicionais:')
      expect(service).to receive(:format_text).with('Adicional 1 (R$ 5,00) | ')
      service.send(:add_additional_fields, item_with_additional)
    end
  end

  describe '#add_total' do
    let(:order) { instance_double(Order, total_price: 50.0) }

    it 'imprime o preço total formatado corretamente' do
      service = described_class.new(order)
      allow(service).to receive(:format_text).and_return('Preço Total: R$ 50,00')
      allow(service).to receive(:format_price).and_return('50,00')

      expect(service.instance_variable_get(:@printer)).to receive(:<<).with("Preço Total: R$ 50,00\n")
      expect(service.instance_variable_get(:@printer)).to receive(:<<).with("--------------------------------\n")

      service.send(:add_total)
    end
  end

  describe '#add_footer' do
    let(:order) { instance_double(Order) }

    it 'imprime a mensagem de agradecimento e chama o método cut do Escpos::Helpers' do
      service = described_class.new(order)
      allow(service).to receive(:format_text).and_return('Obrigado pela sua compra!')

      expect(service.instance_variable_get(:@printer)).to receive(:<<).with("Obrigado pela sua compra!\n")
      expect(Escpos::Helpers).to receive(:cut)

      service.send(:add_footer)
    end
  end

  describe '#format_price' do
    it 'formata o preço corretamente' do
      service = described_class.new(order)
      expect(service.send(:format_price, 10.5)).to eq '10,50'
    end
  end

  describe '#delivery_type' do
    it 'retorna o tipo de entrega correto' do
      service = described_class.new(order)
      expect(service.send(:delivery_type, 'pickup')).to eq 'Para retirada'
      expect(service.send(:delivery_type, 'delivery')).to eq 'Delivery'
      expect(service.send(:delivery_type, 'local')).to eq 'Local'
      expect(service.send(:delivery_type, 'unknown')).to eq 'Desconhecido'
    end
  end

  describe '#send_to_printer' do
    it 'escreve dados no arquivo da impressora' do
      expect(File).to receive(:open).with(ENV['COMPLETE_PRINTER_PATH'], 'wb')
      service.send(:send_to_printer, 'ESC/POS DATA')
    end
  end

  describe '#format_text' do
    it 'substitui caracteres acentuados corretamente' do
      service = described_class.new(order)
      formatted_text = service.send(:format_text, 'áéíóúçÁÉÍÓÚÇ')
      expect(formatted_text).to eq 'aeioucAEIOUC'
    end
  end
end
