class Order < ApplicationRecord
  belongs_to :user
  enum status: { doing: 1, delivered: 5, paid: 10, canceled: 15 }
  enum delivery_type: { local: 1, delivery: 5, pickup: 10 }
  has_many :items, dependent: :destroy
  accepts_nested_attributes_for :items, allow_destroy: true

  validates :delivery_type, :items, presence: true
  validate :validate_delivery_details

  after_save :broadcast_order

  def content
    return table_info if local?
    return address if delivery?

    pick_up_time if pickup?
  end

  private

  def validate_delivery_details
    return errors.add(:table_info, 'não pode ficar em branco. Entrega local') if local? && table_info.blank?
    return errors.add(:address, 'não pode ficar em branco. Entrega delivery') if delivery? && address.blank?
    return unless pickup? && pick_up_time.blank?

    errors.add(:pick_up_time, 'não pode ficar em branco. Entrega para retirada')
  end

  def broadcast_order
    Rails.logger.error('CHEGOU AQUI')
    ActionCable.server.broadcast 'orders_channel', {
      id:,
      user_id:,
      delivery_type:,
      status:,
      customer:,
      table_info:,
      address:,
      pick_up_time:
    }
  end
end
