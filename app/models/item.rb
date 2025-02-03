class Item < ApplicationRecord
  belongs_to :order
  has_many :additional_fields, dependent: :destroy
  enum status: { pendent: 0, paid: 5 }
  accepts_nested_attributes_for :additional_fields, allow_destroy: true

  after_save :update_order_total, :check_order_status
  validates :name, presence: true

  private

  def check_order_status
    return unless status == 'pendent' && order.status == 'paid'

    order.update status: 'delivered' if order.status == 'paid'
  end

  def update_order_total
    order.sum_total
  end
end
