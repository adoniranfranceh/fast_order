class Customer < ApplicationRecord
  belongs_to :user
  has_many :loyalty_cards, dependent: :destroy

  validates :name, :birthdate, presence: true

  include Filterable
end
