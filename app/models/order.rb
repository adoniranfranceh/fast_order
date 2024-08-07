class Order < ApplicationRecord
  belongs_to :user
  enum status: { doing: 1, delivered: 5, paid: 10, canceled: 15 }
  enum delivery_type: { local: 1, delivery: 5, pickup: 10 }

  after_save :broadcast_order

  def content
    return table_info if local?
    return address if delivery?

    pick_up_time if pickup?
  end

  private

  def broadcast_order
    Rails.logger.debug "Broadcasting order with ID: #{self.id} ----------------"
    ActionCable.server.broadcast 'orders_channel', {
      id:,
      user_id:,
      address:,
      delivery_type:,
      status:,
      customer:
    }
  end

  # def broadcast_order
  #   message = {
  #     id:,
  #     user_id:,
  #     customer:,
  #     address:,
  #     status:,
  #     delivery_type:
  #   }

  #   Rails.logger.info("Broadcasting message: #{message.inspect}")
  #   ActionCable.server.broadcast 'OrdersChannel', message
  # end
end
