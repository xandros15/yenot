DOCKER_IMAGE_NAME=docker.box:5000/yenot

default:
	docker compose exec bot sh
start:
	docker compose up -d --remove-orphans
start-prod:
	docker compose up -d --remove-orphans --pull always
build:
	docker build -t ${DOCKER_IMAGE_NAME}-bot:latest .
push:
	docker push ${DOCKER_IMAGE_NAME}-bot:latest
stop:
	docker compose down
log:
	docker compose logs -f bot

