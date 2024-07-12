# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    email { 'user@email.com' }
    password { '123456' }
    role { :collaborator }
  end
end
