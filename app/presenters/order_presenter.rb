class OrderPresenter < SimpleDelegator
  def initialize(order)
    @order = order
  end

  def formatted_delivery_info
    return "#{Order.human_attribute_name("delivery_type.#{@order.delivery_type}", table_info: @order.content )}" if @order.delivery_type == 'local'
    return "#{Order.human_attribute_name("delivery_type.#{@order.delivery_type}", time: @order.content.strftime("%H:%M"))}" if @order.delivery_type == 'pickup'
    return "#{Order.human_attribute_name("delivery_type.#{@order.delivery_type}", address: @order.content)}" if @order.delivery_type == 'delivery'
  end
end
