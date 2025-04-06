# Project Makefile

# Docker compose commands
up:
	docker-compose up --build

down:
	docker-compose down -v

restart: down up

logs:
	docker-compose logs -f

# Prisma commands (runs inside the container)
migrate:
	docker-compose exec backend npx prisma migrate dev --name init

generate:
	docker-compose exec backend npx prisma generate

studio:
	docker-compose exec backend npx prisma studio

seed:
	docker-compose exec backend npx prisma db seed

# Access the backend container shell
shell:
	docker-compose exec backend sh
