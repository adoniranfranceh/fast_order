# frozen_string_literal: true

source 'https://rubygems.org'

ruby '3.3.1'

gem 'devise'
gem 'jbuilder'
gem 'jsbundling-rails'
gem 'pg', '~> 1.1'
gem 'puma', '>= 5.0'
gem 'rails', '~> 7.1.3', '>= 7.1.3.2'
gem 'redis', '~> 4.0'
gem 'sprockets-rails'
gem 'stimulus-rails'
gem 'turbo-rails'

gem 'tzinfo-data', platforms: %i[windows jruby]

gem 'bootsnap', require: false

group :development, :test do
  gem 'brakeman'
  gem 'capybara'
  gem 'debug', platforms: %i[mri windows]
  gem 'factory_bot_rails'
  gem 'rspec-rails'
  gem 'rubycritic', require: false
end

group :development do
  gem 'web-console'
end

group :test do
  gem 'cuprite', '~> 0.15'
  gem 'launchy'
  gem 'simplecov', require: false
end
