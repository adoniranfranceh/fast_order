class Customer < ApplicationRecord
  belongs_to :user
  has_many :loyalty_cards, dependent: :destroy

  validates :name, :birthdate, presence: true

  include Filterable

  def self.ransackable_attributes(_auth_object = nil)
    %w[name birthdate email]
  end
end
