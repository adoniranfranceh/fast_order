# spec/factories/customers.rb
FactoryBot.define do
  factory :customer do
    name { Faker::Name.name }
    email { Faker::Internet.email }
    phone { Faker::PhoneNumber.phone_number }
    birthdate do
      Faker::Date.birthday(min_age: 18, max_age: 65)
    end
    description { Faker::Lorem.sentence }
    favorite_order { Faker::Lorem.words(number: 3).join(' ') }
    association :user
  end
end
