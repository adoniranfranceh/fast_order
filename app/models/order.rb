class Order < ApplicationRecord
  belongs_to :user
  belongs_to :admin, class_name: 'User', optional: true

  has_many :items, dependent: :destroy
  has_many :additional_fields, through: :items
  accepts_nested_attributes_for :items, allow_destroy: true

  validates :delivery_type, :items, presence: true
  validate :validate_delivery_details

  enum status: { doing: 1, delivered: 5, paid: 10, canceled: 15 }
  enum delivery_type: { local: 1, delivery: 5, pickup: 10 }

  include Filterable

  before_save :cannot_revert_delivered_to_doing, if: :status_changed?
  before_save :check_all_items_paid, if: :status_changed?
  before_create :associate_admin, :generate_unique_code, :start_time
  after_create :sum_total
  after_save :broadcast_order
  # after_update :issue_nfc_e, if: :saved_change_to_status?

  scope :by_admin, ->(admin_id) { where(admin_id: admin_id) }
  scope :by_date, ->(date) { where(created_at: Date.parse(date).all_day) }
  scope :today, -> { where('created_at >= ?', 12.hours.ago).order(id: :asc) }
  scope :ordered, -> { order(id: :desc) }

  def elapsed_time
    return 0 unless time_started && time_stopped

    time_stopped - time_started
  end

  def content
    return table_info if local?
    return address if delivery?

    pick_up_time if pickup?
  end

  def sum_total
    self.total_price = calculate_total
    save
  end

  def generate_receipt
    OrderReceiptService.new(self).print_receipt
  end

  def update_last_edited_at
    update(last_edited_at: Time.current)
  end

  private

  # def issue_nfc_e
  #   if paid?
  #     NfeService.issue_nfe(self)
  #   end
  # end

  def calculate_total
    self.total_price = items.sum { |item| item.price + item.additional_fields.sum(:additional_value) }
  end

  def associate_admin
    self.admin_id = user.admin&.id
  end

  def cannot_revert_delivered_to_doing
    return unless status == 'doing' && time_stopped.present? && time_stopped <= 1.hour.ago

    errors.add(:base, 'Status não pode ser alterado para "Novos Pedidos" 1 hora depois de entregue')
  end

  def check_all_items_paid
    return unless status == 'paid'
    return if items.all?(&:paid?)

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
    { id: id, user_id: user_id, delivery_type: delivery_type, status: status,
      customer: customer, table_info: table_info, address: address,
      pick_up_time: pick_up_time, time_started: time_started, time_stopped: time_stopped,
      code: code, user: user_data, items: items_data }
  end

  def user_data
    user.as_json(only: [:email], include: { profile: { only: [:full_name], methods: [:photo_url] } })
  end

  def items_data
    items.map { |item| item_data(item) }
  end

  def item_data(item)
    item.as_json.merge(additional_fields: item.additional_fields.as_json)
  end

  def generate_unique_code
    self.code = loop do
      random_code = "#{SecureRandom.alphanumeric(6).upcase}-#{Time.now.to_i}"
      break random_code unless Order.exists?(code: random_code)
    end
  end

  def start_time
    self.time_started = Time.zone.now
  end
end
