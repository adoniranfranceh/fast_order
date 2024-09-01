# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@email.com" }
    password { '123456' }
    role { :collaborator }
  end
end
