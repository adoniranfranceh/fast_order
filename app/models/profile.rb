class Profile < ApplicationRecord
  belongs_to :user

  def self.ransackable_attributes(_auth_object = nil)
    %w[full_name user_id]
  end
end
