class Item < ApplicationRecord
  belongs_to :order
  has_many :additional_fields, dependent: :destroy
  accepts_nested_attributes_for :additional_fields, allow_destroy: true
end
