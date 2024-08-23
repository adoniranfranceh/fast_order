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
      items_count { 1 }
      items_price { 10 }
      create_items { true }
      additional_count { 0 }
      additional_price { 0 }
    end

    before(:create) do |order, evaluator|
      if evaluator.create_items
        evaluator.items_count.times do
          item = build(:item, price: evaluator.items_price, order:)
          evaluator.additional_count.times do
            item.additional_fields << build(:additional_field, additional_value: evaluator.additional_price, item:)
          end
          order.items << item
        end
      end
    end
  end
end
