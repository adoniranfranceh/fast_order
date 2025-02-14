class InvoicePdfService
  def initialize(order)
    @order = order
  end

  def generate_pdf
    Prawn::Document.new do |pdf|
      generate_header(pdf)
      generate_items(pdf)
      generate_total(pdf)
    end.render
  end

  private

  def generate_header(pdf)
    pdf.text "Pedido ##{@order.code}", size: 20, style: :bold
    pdf.text "Cliente: #{@order.customer}"
    pdf.text "Tipo de Entrega: #{delivery_type(@order.delivery_type)}"
    pdf.text "Informação da entrega: #{@order.content}"
    pdf.text "Por: #{user_name}"
    pdf.text "\n"
    pdf.text formatted_creation_date
    pdf.move_down 10
    pdf.text 'Itens:', style: :bold
  end

  def generate_items(pdf)
    @order.items.each do |item|
      generate_item_details(pdf, item)
    end
  end

  def generate_item_details(pdf, item)
    total_item_price = calculate_total_item_price(item)

    pdf.text '___________________________________'
    pdf.text " • #{item.name} - R$ #{format_price(item.price)}"
    generate_additional_fields(pdf, item) if item.additional_fields.present?
    pdf.text '----------------------'
    pdf.text "   Total: R$ #{format_price(total_item_price)}"
  end

  def generate_additional_fields(pdf, item)
    pdf.text 'Adicionais:'
    item.additional_fields.each do |add|
      pdf.text "     - #{add.additional} (R$ #{format_price(add.additional_value)})"
    end
  end

  def generate_total(pdf)
    pdf.move_down 10
    pdf.text "Preço Total: R$ #{format_price(@order.total_price)}", style: :bold
  end

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

  def calculate_total_item_price(item)
    item.price.to_f + item.additional_fields.sum(&:additional_value).to_f
  end

  def user_name
    @order.user.profile&.full_name || @order.user.email
  end

  def formatted_creation_date
    @order.created_at.strftime('%d/%m/%Y %H:%M').to_s
  end
end
