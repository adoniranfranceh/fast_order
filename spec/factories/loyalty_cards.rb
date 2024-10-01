FactoryBot.define do
  factory :loyalty_card do
    customer { nil }
    status { %i[active used removed].sample }
  end
end
