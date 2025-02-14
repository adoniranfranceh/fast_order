# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { '123456' }
    password_confirmation { '123456' }
    role { :admin }

    factory :user_with_profile do
      after(:create) do |user|
        create(:profile, user:)
      end
    end
  end
end
