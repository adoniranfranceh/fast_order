require 'rails_helper'
require 'tempfile'

RSpec.describe InvoicePdfService, type: :service do
  it 'gera um PDF com todas as informações do pedido' do
    pedido = create(:order, customer: 'João Silva', items_count: 1, items_price: 10, create_items: true,
                            additional_count: 2, additional_price: 2)

    pedido.items.first.update(name: 'Hambúrguer')
    pedido.items.first.additional_fields.first.update(additional: 'Salada')
    pedido.items.first.additional_fields.last.update(additional: 'Peperone')

    allow(pedido).to receive(:code).and_return('IPN9ES')

    pdf_service = InvoicePdfService.new(pedido)
    pdf_conteudo = pdf_service.generate_pdf

    Tempfile.open(['pedido', '.pdf']) do |file|
      file.binmode
      file.write(pdf_conteudo)
      file.rewind

      reader = PDF::Reader.new(file)
      texto_pdf = reader.pages.map(&:text).join(' ')

      expect(texto_pdf).to include('Pedido #IPN9ES')
      expect(texto_pdf).to include('Cliente: João Silva')
      expect(texto_pdf).to include('Hambúrguer - R$ 10,00')
      expect(texto_pdf).to include('Adicionais')
      expect(texto_pdf).to include('Salada (R$ 2,00)')
      expect(texto_pdf).to include('Peperone (R$ 2,00)')
      expect(texto_pdf).to include('Total: R$ 14,00')
      expect(texto_pdf).to include('Preço Total: R$ 14,00')
    end
  end
end
