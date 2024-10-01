FactoryBot.define do
  factory :stamp do
    loyalty_card { nil }
    item do
      ['Açaí 300ml', 'Açaí 500ml', 'Açaí com granola',
       'Açaí com leite condensado', 'Açaí com paçoca',
       'Açaí com banana e morango', 'Açaí com mix de frutas',
       'Açaí com castanhas', 'Açaí com mel', 'Açaí bowl com frutas',
       'Açaí com amendoim', 'Açaí com calda de chocolate', 'Açaí com leite em pó',
       'Açaí com creme de cupuaçu', 'Açaí com pasta de amendoim'].sample
    end
    user { nil }
    signed_at { '2024-08-19 19:56:18' }
  end
end
