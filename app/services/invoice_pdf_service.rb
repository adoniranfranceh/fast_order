class InvoicePdfService
  def initialize(order)
    @order = order
  end

  def generate_pdf
    Prawn::Document.new do |pdf|
      pdf.text "Pedido ##{@order.code}", size: 20, style: :bold
      pdf.text "Cliente: #{@order.customer}"
      pdf.text "Tipo de Entrega: #{delivery_type(@order.delivery_type)}"
      pdf.text "Informação da entrega #{@order.content}"
      pdf.text "Por: #{@order.user.profile&.full_name || @order.user.email}"
      pdf.text "\n"
      pdf.text @order.created_at.strftime('%d/%m/%Y %H:%M').to_s

      pdf.move_down 10
      pdf.text 'Itens:', style: :bold

      @order.items.each do |item|
        total_item_price = (item.price.to_f + item.additional_fields.sum(&:additional_value).to_f)
        pdf.text '___________________________________'
        pdf.text " • #{item.name} - R$ #{format_price(item.price)}"
        if item.additional_fields.present?
          pdf.text 'Adicionais:'
          item.additional_fields.map do |add|
            pdf.text "     - #{add.additional} (R$ #{format_price(add.additional_value)})"
          end
        end
        pdf.text '----------------------'
        pdf.text "   Total: R$ #{format_price(total_item_price)}"
      end

      pdf.move_down 10
      pdf.text "Preço Total: R$ #{format_price(@order.total_price)}", style: :bold
    end.render
  end

  private

  def delivery_type(type)
    {
      pickup: 'Para retirada',
      delivery: 'Delivery',
      local: 'Local'
    }[type.to_sym] || 'Desconhecido'
  end

  def format_price(price)
    formatted_price = format('%.2f', price.to_f)
    formatted_price.gsub('.', ',')
  end
end
