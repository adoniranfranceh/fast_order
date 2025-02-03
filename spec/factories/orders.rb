FactoryBot.define do
  factory :order do
    user
    admin_id { nil }
    status { %i[doing delivered paid canceled].sample }
    delivery_type { %i[local pickup delivery].sample }
    table_info { "A#{rand(1..15)}" }
    pick_up_time { Faker::Time.forward(days: 23, period: :afternoon).to_s }
    address { Faker::Address.full_address }
    customer { Faker::Name.name }

    transient do
      items_count { 1 }
      items_price { 10 }
      create_items { true }
      items_status { :paid }
      additional_count { rand(1..5) }
      additional_price { 0 }
    end

    before(:create) do |order, evaluator|
      if evaluator.create_items
        evaluator.items_count.times do
          item = build(:item, price: evaluator.items_price, status: evaluator.items_status)

          order.items << item

          evaluator.additional_count.times do
            additional_field = build(:additional_field, additional_value: evaluator.additional_price, item:)
            item.additional_fields << additional_field
          end
        end
      end
    end
  end
end
