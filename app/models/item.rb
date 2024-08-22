class Item < ApplicationRecord
  belongs_to :order
  has_many :additional_fields, dependent: :destroy
  enum status: { pendent: 0, paid: 5 }
  accepts_nested_attributes_for :additional_fields, allow_destroy: true

  after_commit :sum_additionals, on: [:create, :update]

  def sum_additionals
    additional_total = additional_fields.sum { |af| af.additional_value.to_f }
    new_price = (price || 0) + additional_total

    if price != new_price
      update_column(:price, new_price)
    end
  end
end
