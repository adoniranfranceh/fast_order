#!/bin/bash

rm -rf /app/tmp/pids
bundle install
bundle exec rails assets:precompile db:create db:migrate
exec "$@"
