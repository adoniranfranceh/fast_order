class Customer < ApplicationRecord
  belongs_to :user

  validates :name, :birthdate, presence: true
end
