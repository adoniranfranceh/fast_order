FactoryBot.define do
  factory :order do
    user { nil }
    status { 1 }
    delivery_type { 1 }
    table_info { 'MyString' }
    pick_up_time { '2024-06-29 14:20:11' }
    address { 'MyText' }
    customer { 'MyString' }

    transient do
      create_items { true }
    end

    after(:build) do |order, evaluator|
      order.items << build(:item, order:) if evaluator.create_items
    end
  end
end
