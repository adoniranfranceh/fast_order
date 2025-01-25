# # frozen_string_literal: true
require 'net/http'
require 'json'
require 'active_support/testing/time_helpers'
require_relative 'create_order'
include ActiveSupport::Testing::TimeHelpers
include CreateOrder

def fetch_user_info_from_api
  url = URI("https://randomuser.me/api/")
  response = Net::HTTP.get(url)
  user_data = JSON.parse(response)["results"].first
  {
    'email' => user_data['email'],
    'image_path' => user_data['picture']['large'],
    'name' => "#{user_data['name']['first']} #{user_data['name']['last']}"
  }
rescue StandardError => e
  puts "Erro ao buscar usuário: #{e.message}"
  raise
end

def create_user_with_profile(role, admin = nil)
  user_info = fetch_user_info_from_api
  email = user_info['email']
  photo_url = user_info['image_path']
  full_name = user_info['name']

  user = FactoryBot.create(:user, email:, role:, admin:)
  profile = FactoryBot.build(:profile, user:, full_name:)

  attach_profile_photo(profile, photo_url)

  profile.save! if profile.valid?

  user
end

def attach_profile_photo(profile, photo_url)
  image = URI.open(photo_url)
  profile.photo.attach(io: image, filename: File.basename(photo_url), content_type: 'image/jpeg')
end

def create_users_with_travel(admin:, count:, role:)
  count.times do |i|
    created_at_time = i.months.ago.beginning_of_month + rand(0..30).days + rand(0..23).hours + rand(0..59).minutes
    travel_to(created_at_time) do
      create_user_with_profile(role, admin)
    end
  end
end

def create_customers(admin:, months_back:, count:)
  months_back.times do |i|
    count.times do
      FactoryBot.create(:customer,
                        created_at: Date.today.beginning_of_month - i.months + rand(1..30).days,
                        user: admin)
    end
  end
end

def create_orders(admin:, start_date:, end_date:, daily_orders_range:)
  CreateOrders.create(admin:, start_date:, end_date:, daily_orders_range:)
end

def create_loyalty_cards(months_back)
  Customer.find_each do |customer|
    months_back.times do |i|
      FactoryBot.create_list(:loyalty_card, rand(1..3),
                             created_at: Date.today.beginning_of_month - i.months + rand(1..30).days,
                             customer: customer)
    end
  end
end

def create_stamps_for_loyalty_cards
  LoyaltyCard.find_each do |card|
    user = card.customer.user
    FactoryBot.create_list(:stamp, rand(1..5), loyalty_card: card, user: user)
  end
end

admin = FactoryBot.create(:user, email: 'admin@admin.com')

create_users_with_travel(admin:, count: 5, role: :collaborator)
create_customers(admin:, months_back: 6, count: 5)


file_path = Rails.root.join('db', 'products.json')
products_data = JSON.parse(File.read(file_path))

products_data.each do |product|
  Product.create!(
    name: product['name'],
    description: product['description'],
    category: product['category'],
    base_price: product['base_price'],
    max_additional_quantity: product['max_additional_quantity'],
    extra_additional_price: product['extra_additional_price'],
    user_id: product['user_id']
  )
end

create_orders(admin:, start_date: 3.months.ago.to_date, end_date: Date.today, daily_orders_range: 5..10)
create_orders(admin:,start_date: Date.today - 1.day,end_date: Date.today, daily_orders_range: 5..10)

create_loyalty_cards(6)
create_stamps_for_loyalty_cards
