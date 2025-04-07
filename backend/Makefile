# Project Makefile with authapp project name

PROJECT=authapp

# Docker Compose Commands
up:
	docker compose -p $(PROJECT) up --build

down:
	docker compose -p $(PROJECT) down -v

restart: down up

logs:
	docker compose -p $(PROJECT) logs -f

# Prisma commands (runs inside the container)
migrate:
	docker compose -p $(PROJECT) exec auth_backend npx prisma migrate dev --name init

generate:
	docker compose -p $(PROJECT) exec auth_backend npx prisma generate

studio:
	docker compose -p $(PROJECT) exec auth_backend npx prisma studio

seed:
	docker compose -p $(PROJECT) exec auth_backend npx prisma db seed

# Access the backend container shell
shell:
	docker compose -p $(PROJECT) exec auth_backend sh
