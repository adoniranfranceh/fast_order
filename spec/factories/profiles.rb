FactoryBot.define do
  factory :profile do
    association :user
    full_name { Faker::Name.name }
  end
end
