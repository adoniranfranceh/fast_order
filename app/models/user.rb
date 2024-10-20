# frozen_string_literal: true

class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  enum role: { collaborator: 1, admin: 5 }
  enum status: { active: 0, inactive: 1 }

  belongs_to :admin,
             class_name: 'User',
             inverse_of: :collaborators,
             optional: true

  has_many :customers, dependent: :destroy
  has_many :loyalty_cards, through: :customers
  has_many :collaborators, class_name: 'User', foreign_key: 'admin_id', dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :products
  has_one :profile, dependent: :destroy
  accepts_nested_attributes_for :profile, reject_if: proc { |attributes|
                                                       attributes['full_name'].blank?
                                                     }, update_only: true

  validate :admin_must_be_present_if_collaborator, if: :collaborator?
  after_create :associate_admin_in_admin, if: :admin?

  include Filterable

  private

  def associate_admin_in_admin
    update_column(:admin_id, id) if admin? && admin_id.nil?
  end

  def admin_must_be_present_if_collaborator
    return unless collaborator? && admin_id.nil?

    errors.add(:admin, 'é obrigatório para colaboradores')
  end
end
