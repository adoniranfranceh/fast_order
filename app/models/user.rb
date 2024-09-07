# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  enum role: { collaborator: 1, admin: 5 }

  belongs_to :admin,
             class_name: 'User',
             optional: true,
             inverse_of: :collaborators

  has_many :customers, dependent: :destroy
  has_many :loyalty_cards, through: :customers
  has_many :collaborators,
           class_name: 'User',
           foreign_key: 'admin_id',
           dependent: :destroy,
           inverse_of: :admin
  has_many :orders, dependent: :destroy
  has_one :profile, dependent: :destroy

  after_create :associate_admin_in_admin, if: :admin?

  include Filterable

  def self.ransackable_attributes(_auth_object = nil)
    ['name', 'email', '']
  end

  def self.ransackable_associations(_auth_object = nil)
    ['profile']
  end

  private

  def associate_admin_in_admin
    self.admin_id = id
    save
  end
end
