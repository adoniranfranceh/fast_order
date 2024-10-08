# frozen_string_literal: true

# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { '123456' }
    password_confirmation { '123456' }
    role { :admin }
  end
end
