class Profile < ApplicationRecord
  belongs_to :user

  has_one_attached :photo

  validates :full_name, presence: true
  validate :validate_photo

  def photo_url
    Rails.application.routes.url_helpers.rails_blob_path(photo, only_path: true) if photo.attached?
  end

  private

  def validate_photo
    return unless photo.attached? && !photo.content_type.in?(%w[image/jpeg image/png])

    errors.add(:base, 'Apenas JPEG ou PNG são formatos aceitos')
  end
end
