class LoyaltyCard < ApplicationRecord
  belongs_to :customer
  has_many :stamps, dependent: :destroy

  enum status: { active: 0, completed: 5, used: 10, removed: 15 }
end
