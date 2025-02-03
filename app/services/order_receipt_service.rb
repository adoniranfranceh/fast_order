class OrderReceiptService
  def initialize(order)
    @order = order
    @printer = Escpos::Printer.new
  end

  def generate_if_needed
    generate if should_generate_receipt?
  end

  def generate
    Order.transaction do
      @order.generate_receipt
    end
  end

  def print_receipt
    build_receipt
    send_to_printer(@printer.to_escpos)
  end

  private

  def should_generate_receipt?
    additional_fields_changed? || items_changed? || order_attributes_changed?
  end

  def additional_fields_changed?
    @order.items.flat_map(&:additional_fields).any? { |field| field.previous_changes.key?(:updated_at) }
  end

  def items_changed?
    @order.items.any? { |item| item.previous_changes.key?(:updated_at) || item.previous_changes.key?(:status) }
  end

  def order_attributes_changed?
    @order.previous_changes.keys.any? do |key|
      %w[updated_at status total_price time_stopped last_edited_at].include?(key)
    end
  end

  def build_receipt
    @printer << "\x1B\x74\x02"
    @printer << "\n\n"

    add_header
    add_order_details
    add_items
    add_total
    add_footer

    @printer << "\n\n\n\n"
  end

  def add_header
    print_edit_time
    print_order_code
  end

  def print_edit_time
    return if @order.last_edited_at.blank?

    @printer << Escpos::Helpers.big("Editado em #{format_text(@order.last_edited_at.strftime('%H:%M'))}\n")
  end

  def print_order_code
    @printer << "#{format_text("Recibo do pedido ##{@order.code}")}\n"
    @printer << "--------------------------------\n"
  end

  def add_order_details
    @printer << "#{format_text("Cliente: #{@order.customer}")}\n"
    @printer << "#{format_text("Tipo de Entrega: #{delivery_type(@order.delivery_type)} #{@order.content}")}\n"
    @printer << "#{format_text("Data: #{@order.created_at.strftime('%d/%m/%Y %H:%M')}")}\n"
    @printer << "--------------------------------\n"
  end

  def add_items
    @order.items.each do |item|
      add_item_details(item)
      add_additional_fields(item) if item.additional_fields.present?
      add_item_total(item)
    end
  end

  def add_item_details(item)
    @printer << "#{format_text(item.name)} - R$ #{format_price(item.price)}\n"
  end

  def add_additional_fields(item)
    @printer << "#{format_text('Adicionais:')}\n"
    item.additional_fields.each do |add|
      formatted_value = add.additional_value.positive? ? "(R$ #{format_price(add.additional_value)})" : ''
      @printer << format_text("#{add.additional} #{formatted_value} | ").to_s
    end
  end

  def add_item_total(item)
    total_item_price = item.price.to_f + item.additional_fields.sum(&:additional_value).to_f
    @printer << "#{format_text("Total: R$ #{format_price(total_item_price)}")}\n"
    @printer << "--------------------------------\n"
  end

  def add_total
    @printer << "#{format_text("Preço Total: R$ #{format_price(@order.total_price)}")}\n"
    @printer << "--------------------------------\n"
  end

  def add_footer
    @printer << "#{format_text('Obrigado pela sua compra!')}\n"
    @printer << Escpos::Helpers.cut
  end

  def format_price(price)
    format('%.2f', price.to_f).gsub('.', ',')
  end

  def delivery_type(type)
    {
      pickup: 'Para retirada',
      delivery: 'Delivery',
      local: 'Local'
    }[type.to_sym] || 'Desconhecido'
  end

  def send_to_printer(data)
    File.open(ENV['COMPLETE_PRINTER_PATH'], 'wb') do |file|
      file.write(data)
    end
  end

  def format_text(text)
    text = text.gsub(/[áàãâä]/, 'a')
               .gsub(/[éê]/, 'e')
               .gsub(/[íï]/, 'i')
               .gsub(/[óôõö]/, 'o')
               .gsub(/ú/, 'u')
               .gsub(/ç/, 'c')
               .gsub(/[ÁÀÃÂÄ]/, 'A')
               .gsub(/[ÉÊ]/, 'E')
               .gsub(/Í/, 'I')
               .gsub(/[ÓÔÕÖ]/, 'O')
               .gsub(/Ú/, 'U')
               .gsub(/Ç/, 'C')

    text.encode('ISO-8859-1', invalid: :replace, undef: :replace, replace: '')
  end
end
