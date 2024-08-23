class Order < ApplicationRecord
  belongs_to :user

  enum status: { doing: 1, delivered: 5, paid: 10, canceled: 15 }
  enum delivery_type: { local: 1, delivery: 5, pickup: 10 }

  has_many :items, dependent: :destroy
  has_many :additional_fields, through: :items, dependent: :destroy
  accepts_nested_attributes_for :items, allow_destroy: true

  validates :delivery_type, :items, presence: true
  validate :validate_delivery_details

  after_save :broadcast_order
  after_create :sum_total

  before_save :check_all_items_paid, if: :status_changed?

  def content
    return table_info if local?
    return address if delivery?

    pick_up_time if pickup?
  end

  def sum_total
    total_items = items.sum { |item| BigDecimal(item.price.to_s) }
    total_additionals = additional_fields.sum { |additional| BigDecimal(additional.additional_value.to_s) }
    self.total_price = total_items + total_additionals
    save
  end

  private

  def check_all_items_paid
    return unless status == 'paid'
    return if items.all? { |item| item.status == 'paid' }

    errors.add(:base, 'Só é possível pagar se todos os itens forem pagos')
    throw(:abort)
  end

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
