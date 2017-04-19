.PHONY: help init build run debug unit-test system-test test all shutdown clean
.DEFAULT_GOAL := help

NODE_IMAGE=node:6-slim
BOT_DEBUG?=false

include .env

help:
	#source:http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

node-init:
	@docker run -it --rm -v `pwd`:/app -w /app $(NODE_IMAGE) npm install

init: ## Initializes the project by installing any depdendcies
init: node-init

build: ## Build docker image
	@docker-compose build app

dev: ## Run robot
	@docker-compose run --service-ports\
		-e DB_HOST=$(DB_HOST) \
		-e BOT_DEBUG=$(BOT_DEBUG) \
		-e SLACK_TOKEN=$(SLACK_TOKEN) \
		-e WIT_TOKEN=$(WIT_TOKEN) \
		app node_modules/.bin/gulp dev

run: ## Run robot
	@docker-compose run --service-ports\
		-e DB_HOST=$(DB_HOST) \
		-e BOT_DEBUG=$(BOT_DEBUG) \
		-e SLACK_TOKEN=$(SLACK_TOKEN) \
		-e WIT_TOKEN=$(WIT_TOKEN) \
		app

debug: BOT_DEBUG:=true
debug: run
debug: ## Run robot in debug mode

unit-test: ## Runs the unit tests for the project
	@docker-compose run -e DB_HOST=$(DB_HOST) -e NODE_ENV=test app /bin/sh -c "sleep 2; npm run test-unit"

system-test: ## Runs the system tests for the project

test: unit-test
test: system-test
test: ## Runs all the tests for the project

all: build test
all: ## Runs the build and tests targets

shutdown: ## Stops all containers
	docker-compose stop

clean: shutdown
clean: ## Cleans environment
	-@rm -rf node_modules

heroku-config:
	while read -r line; do heroku config:set $$line; done < .env
