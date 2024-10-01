FactoryBot.define do
  factory :item do
    name do
      ['Açaí 500ml', 'Açaí com granola', 'Açaí com paçoca',
       'Açaí com banana', 'Açaí com morango', 'Açaí 300ml',
       'Açaí bowl com frutas', 'Açaí com creme de cupuaçu'].sample
    end
    price { Faker::Commerce.price(range: 10..100.0) }
    status { %i[pendent paid].sample }
    association :order

    transient do
      additional_count { 0 }
      additional_price { '0' }
    end

    after(:create) do |item, evaluator|
      create_list(:additional_field, evaluator.additional_count, additional_value: evaluator.additional_price, item:)
    end
  end
end
