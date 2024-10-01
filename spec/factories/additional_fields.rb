FactoryBot.define do
  factory :additional_field do
    additional do
      ['Granola', 'Leite condensado', 'Paçoca',
       'Banana', 'Morango', 'Mel', 'Castanhas', 'Leite em pó',
       'Pasta de amendoim', 'Calda de chocolate', 'Coco ralado',
       'Chia', 'Sementes de linhaça', 'Geleia de frutas vermelhas', 'Creme de cupuaçu'].sample
    end
    additional_value { Faker::Commerce.price(range: 1..100) }
    association :item
  end
end
