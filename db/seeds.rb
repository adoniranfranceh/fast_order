# frozen_string_literal: true
require 'net/http'
require 'json'

def fetch_user_info_from_api
  url = URI("https://randomuser.me/api/")
  response = Net::HTTP.get(url)
  user_data = JSON.parse(response)["results"].first

  {
    'email' => user_data['email'],
    'image_path' => user_data['picture']['large'],
    'name' => "#{user_data['name']['first']} #{user_data['name']['last']}"
  }
end

def create_user_with_profile(role, admin = nil)
  user_info = fetch_user_info_from_api

  email = user_info['email']
  photo_url = user_info['image_path']
  full_name = user_info['name']

  user = FactoryBot.create(:user, email: email, role: role, admin: admin)

  profile = FactoryBot.build(:profile, user: user, full_name: full_name)

  begin
    image = URI.open(photo_url)
    profile.photo.attach(io: image, filename: File.basename(photo_url), content_type: 'image/jpeg')
  rescue OpenURI::HTTPError => e
  end

  if profile.valid?
    profile.save!
  else
  end

  user
end

admin = FactoryBot.create(:user, email: 'admin@admin.com')

5.times do
  create_user_with_profile(:collaborator, admin)
end

def create_customers(admin, months_back, count)
  months_back.times do |i|
    (1..count).each do |j|
      FactoryBot.create(:customer,
             created_at: Date.today.beginning_of_month - i.months + rand(1..30).days,
             user: admin)
    end
  end
end

create_customers(admin, 6, 10)

def create_orders(admin, count)
  (0..11).each do |i|
    start_of_week = (Date.today - i.months).beginning_of_week

    (0..6).each do |day|
      created_at = start_of_week + day.days
      20.times do
        FactoryBot.create(:order,
                          created_at: created_at,
                          items_count: rand(1..8),
                          items_status: :paid,
                          additional_count: rand(1..5),
                          time_stopped: created_at + rand(5..50).minutes,
                          user: admin.collaborators.sample)
      end
    end
  end

  count.times do
    created_at = DateTime.now - rand(0..10).hours
    FactoryBot.create(:order,
                      created_at: created_at,
                      items_count: rand(1..8),
                      items_status: :paid,
                      additional_count: rand(1..5),
                      time_stopped: created_at + rand(5..50).minutes,
                      user: admin.collaborators.sample)
  end
end

admin = User.first
create_orders(admin, 50)

def create_loyalty_cards(months_back)
  Customer.find_each do |customer|
    months_back.times do |i|
      FactoryBot.create_list(:loyalty_card, rand(1..3),
                   created_at: Date.today.beginning_of_month - i.months + rand(1..30).days,
                   customer: customer)
    end
  end
end

create_loyalty_cards(6)

LoyaltyCard.find_each do |card|
  user = card.customer.user
  FactoryBot.create_list(:stamp, rand(1..10), loyalty_card: card, user: user)
end
