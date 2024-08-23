FactoryBot.define do
  factory :item do
    name { 'Item 1' }
    price { 10 }
    status { :pendent }
    association :order

    transient do
      additional_count { 0 }
      additional_price { '0' }
    end

    after(:build) do |item, evaluator|
      evaluator.additional_count.times do
        item.additional_fields << build(:additional_field, additional_value: evaluator.additional_price, item: item)
      end
    end
  end
end
