FactoryBot.define do
  factory :item do
    name { "Item 1" }
    association :order
  end
end
