class Order < ApplicationRecord
  belongs_to :user
  belongs_to :admin, class_name: 'User', optional: true

  enum status: { doing: 1, delivered: 5, paid: 10, canceled: 15 }
  enum delivery_type: { local: 1, delivery: 5, pickup: 10 }

  has_many :items, dependent: :destroy
  has_many :additional_fields, through: :items, dependent: :destroy
  accepts_nested_attributes_for :items, allow_destroy: true

  validates :delivery_type, :items, presence: true
  validate :validate_delivery_details
  before_save :cannot_revert_delivered_to_doing, if: :status_changed?

  after_save :broadcast_order
  after_create :sum_total
  before_save :check_all_items_paid, if: :status_changed?
  before_create :associate_admin
  before_create :start_time, :generate_unique_code

  include Filterable

  def content
    return table_info if local?
    return address if delivery?

    pick_up_time if pickup?
  end

  def duration
    return 0 unless time_started && time_stopped

    (time_stopped - time_started).to_i
  end

  def sum_total
    total_items = items.sum do |item|
      price = item.price.to_s
      BigDecimal(price.empty? ? '0' : price)
    end

    total_additionals = additional_fields.sum do |additional|
      additional_value = additional.additional_value.to_s
      BigDecimal(additional_value.empty? ? '0' : additional_value)
    end

    self.total_price = total_items + total_additionals
    save
  end

  private

  def generate_unique_code
    self.code = loop do
      random_code = SecureRandom.alphanumeric(6).upcase
      break random_code unless Order.exists?(code: random_code)
    end
  end

  def start_time
    self.time_started = Time.zone.now
  end

  def cannot_revert_delivered_to_doing
    return unless status == 'doing' && time_stopped <= 1.hour.ago

    errors.add(:base, 'Status não pode ser alterado para "Novos Pedidos" 1 hora depois de entregue')
  end

  def associate_admin
    self.admin_id = user.admin&.id
  end

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
    ActionCable.server.broadcast 'orders_channel', order_data
  end

  def order_data
    {
      id:, user_id:, delivery_type:, status:, customer:, table_info:,
      address:, pick_up_time:, time_started:, time_stopped:, code:,
      user: user.as_json(only: [:email], include: { profile: { only: [:full_name], methods: [:photo_url] } }),
      items: items.map do |item|
        item.as_json.merge(
          additional_fields: item.additional_fields.as_json
        )
      end
    }
  end
end
