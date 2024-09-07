FactoryBot.define do
  factory :customer do
    name { 'MyString' }
    email { 'MyString' }
    phone { 'MyString' }
    birthdate { '2024-08-16' }
    description { 'MyString' }
    favorite_order { 'MyString' }
    user
  end
end
