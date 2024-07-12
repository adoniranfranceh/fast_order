require 'simplecov'
SimpleCov.start 'rails' do
  add_filter 'channels'
  add_filter 'mailers'
  add_filter 'jobs'
end

require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'
require 'capybara/cuprite'

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

Capybara.javascript_driver = :cuprite

RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
  config.include Warden::Test::Helpers
  include ActiveSupport::Testing::TimeHelpers

  config.before(type: :system) do
    driven_by(:rack_test)
  end

  config.before(:each, js: true) do
    driven_by(:cuprite, screen_size: [1440, 810], options: {
      js_errors: false,
      headless: %w[0],
      process_timeout: 15,
      timeout: 10,
      browser_options: { 'no-sandbox' => nil }
    })
  end

  config.fixture_paths = [
    Rails.root.join('spec/fixtures')
  ]

  config.use_transactional_fixtures = true

  config.infer_spec_type_from_file_location!

  config.filter_rails_from_backtrace!
end
