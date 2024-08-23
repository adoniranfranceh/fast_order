FactoryBot.define do
  factory :additional_field do
    additional { 'Additional 1' }
    additional_value { '5' }
    association :item
  end
end
