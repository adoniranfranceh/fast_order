#!/bin/bash

rm -rf /app/tmp/pids
bundle install
bundle exec rails assets:precompile db:create db:migrate
bundle exec rails runner "Order.where('created_at <= ?', 1.year.ago).destroy_all"
exec "$@"
