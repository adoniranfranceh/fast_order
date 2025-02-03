class OrderSerializer
  attr_reader :order

  def initialize(order)
    @order = order
  end

  def as_json
    order.is_a?(Enumerable) ? order.map { |o| serialize(o) } : serialize(order)
  end

  private

  def serialize(order)
    base_order_data(order).merge(
      timestamps(order),
      user: serialize_user(order.user),
      items: serialize_items(order.items)
    )
  end

  def base_order_data(order)
    {
      id: order.id,
      code: order.code,
      customer: order.customer,
      status: order.status,
      delivery_type: order.delivery_type,
      total_price: order.total_price,
      table_info: order.table_info,
      address: order.address,
      pick_up_time: order.pick_up_time,
      user_id: order.user_id
    }
  end

  def timestamps(order)
    {
      time_started: order.time_started,
      elapsed_time: order.elapsed_time,
      time_stopped: order.time_stopped
    }
  end

  def serialize_user(user)
    return unless user

    {
      email: user.email,
      profile: {
        full_name: user.profile&.full_name,
        photo_url: user.profile&.photo_url
      }
    }
  end

  def serialize_items(items)
    items.map do |item|
      {
        id: item.id,
        name: item.name,
        price: item.price,
        status: item.status,
        additional_fields: serialize_additional_fields(item.additional_fields)
      }
    end
  end

  def serialize_additional_fields(fields)
    fields.map do |field|
      {
        id: field.id,
        additional: field.additional,
        additional_value: field.additional_value
      }
    end
  end
end
