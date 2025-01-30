FactoryBot.define do
  factory :product do
    name { 'MyString' }
    description { 'MyText' }
    base_price { '9.99' }
    max_additional_quantity { 1 }
    extra_additional_price { 'MyString' }
    user { nil }
  end
end
