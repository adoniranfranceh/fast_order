class Stamp < ApplicationRecord
  belongs_to :loyalty_card
  belongs_to :user
end
