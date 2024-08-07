class OrderPresenter < SimpleDelegator
  def initialize(order)
    @order = order
  end

  def formatted_delivery_info
    if @order.delivery_type == 'local'
      return "#{Order.human_attribute_name("delivery_type.#{@order.delivery_type}",
                                           table_info: @order.content)}"
    end
    if @order.delivery_type == 'pickup'
      return "#{Order.human_attribute_name("delivery_type.#{@order.delivery_type}",
                                           time: @order.content.strftime('%H:%M'))}"
    end
    return unless @order.delivery_type == 'delivery'

    "#{Order.human_attribute_name("delivery_type.#{@order.delivery_type}",
                                  address: @order.content)}"
  end

  def as_json
    {
      id: @order.id,
      delivery_type: @order.delivery_type,
      address: @order.address,
      status: @order.status,
      customer: @order.customer,
      created_at: @order.created_at,
      updated_at: @order.updated_at
    }
  end
end
