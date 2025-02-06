FactoryBot.define do
  file_path = Rails.root.join('db/products.json')
  products_data = JSON.parse(File.read(file_path))
  random_product = products_data.sample

  factory :product do
    name { random_product['name'] }
    description { random_product['descriptio'] }
    base_price { random_product['base_price'] }
    max_additional_quantity { random_product['max_additional_quantity'] }
    extra_additional_price { random_product['extra_additional_price'] }
    user { nil }
  end
end
