class Profile < ApplicationRecord
  belongs_to :user

  has_one_attached :photo

  def photo_url
    Rails.application.routes.url_helpers.rails_blob_path(photo, only_path: true) if photo.attached?
  end

  def self.ransackable_attributes(_auth_object = nil)
    %w[full_name user_id]
  end
end
