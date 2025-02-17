DOCKER_COMPOSE=docker compose
CONTAINER_NAME=app
YARN_BIN=yarn

setup:
	$(DOCKER_COMPOSE) up --build

setup-db:
	$(DOCKER_COMPOSE) exec $(CONTAINER_NAME) rails db:seed

start:
	$(DOCKER_COMPOSE) up -d

test-cy:
	$(DOCKER_COMPOSE) exec $(CONTAINER_NAME) $(YARN_BIN) install && $(DOCKER_COMPOSE) exec $(CONTAINER_NAME) $(YARN_BIN) test

test-rspec:
	bundle exec rspec

fix:
	$(DOCKER_COMPOSE) exec $(CONTAINER_NAME) $(YARN_BIN) lint:fix
