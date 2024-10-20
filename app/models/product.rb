class Product < ApplicationRecord
  belongs_to :user

  validates :name, presence: true
  validates :base_price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :max_additional_quantity, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  validates :extra_additional_price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
end
