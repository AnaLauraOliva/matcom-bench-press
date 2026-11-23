# Comandos de desarrollo para Linux. En Windows usa dev.ps1.
.DEFAULT_GOAL := help
SHELL := /bin/bash

ROOT := $(CURDIR)
LOGS := $(ROOT)/logs
PIDS := $(ROOT)/pids

.PHONY: help install start stop stop-processes check-env check-container check-docker db-migrate db-seed mongo-seed db-studio check reset

help:
	@echo "Uso: make <objetivo>"
	@echo ""
	@echo "  install        Instala dependencias de backend y frontend"
	@echo "  start          Levanta PostgreSQL, backend y frontend"
	@echo "  stop           Apaga backend, frontend, PostgreSQL y MongoDB"
	@echo "  db-migrate     Aplica migraciones de Prisma"
	@echo "  db-seed        Carga datos de ejemplo"
	@echo "  mongo-seed     Carga estructuras de rutina en MongoDB"
	@echo "  db-studio      Abre Prisma Studio"
	@echo "  check          Typecheck, lint y build de ambos proyectos"
	@echo "  reset          Borra la BD y la reconstruye (DESTRUCTIVO)"
	@echo ""

check-env:
	@test -f .env || { echo "Falta .env en la raíz (copia .env.example)."; exit 1; }
	@test -f backend/.env || { echo "Falta backend/.env (copia backend/.env.example)."; exit 1; }
	@test -f frontend/.env -o -f frontend/.env.local || { echo "Falta frontend/.env o frontend/.env.local."; exit 1; }

install:
	cd backend && npm install
	cd frontend && npm install

stop-processes:
	# shortcut: se confía en el PID guardado; tras un reinicio del sistema podría haberse reciclado.
	@for name in backend frontend; do \
		if [ -f "$(PIDS)/$$name.pid" ]; then \
			pid=$$(cat "$(PIDS)/$$name.pid"); \
			kill -- -$$pid 2>/dev/null || kill $$pid 2>/dev/null || true; \
			rm -f "$(PIDS)/$$name.pid"; \
		fi; \
	done

check-docker:
	@if ! docker info >/dev/null 2>&1; then \
		echo "ERROR: El demonio de Docker no está en ejecución."; \
		echo "Inicia Docker Desktop y espera a que esté listo, luego vuelve a ejecutar el comando."; \
		exit 1; \
	fi

check-container:
	@if labels=$$(docker inspect matcom_bench_press_postgres --format '{{json .Config.Labels}}' 2>/dev/null); then \
		config=$$(printf '%s' "$$labels" | sed -n 's/.*"com.docker.compose.project.config_files":"\([^"]*\)".*/\1/p'); \
		project=$$(printf '%s' "$$labels" | sed -n 's/.*"com.docker.compose.project":"\([^"]*\)".*/\1/p'); \
		if [ -z "$$config" ] || [ "$$config" != "$(ROOT)/docker-compose.yml" ]; then \
			echo "ERROR: ya existe el contenedor matcom_bench_press_postgres del proyecto $$project, creado desde $$config."; \
			echo "No pertenece a este directorio y ocupa el nombre (y probablemente el puerto 5432)."; \
			echo "Detén ese proyecto desde su carpeta con 'docker compose down'. No lo elimines sin confirmar."; \
			exit 1; \
		fi; \
	fi

start: check-env stop-processes check-docker check-container
	@docker compose up -d --wait
	@mkdir -p "$(LOGS)" "$(PIDS)"
	@if command -v gnome-terminal >/dev/null 2>&1; then \
		gnome-terminal --title="backend" -- bash -c 'cd "$(ROOT)/backend" && npm run dev; exec bash' & \
		gnome-terminal --title="frontend" -- bash -c 'cd "$(ROOT)/frontend" && npm run dev; exec bash' & \
	elif command -v x-terminal-emulator >/dev/null 2>&1; then \
		x-terminal-emulator -T backend -e 'bash -c "cd $(ROOT)/backend && npm run dev; exec bash"' & \
		x-terminal-emulator -T frontend -e 'bash -c "cd $(ROOT)/frontend && npm run dev; exec bash"' & \
	else \
		setsid bash -c 'cd "$(ROOT)/backend" && npm run dev' > "$(LOGS)/backend.log" 2>&1 < /dev/null & echo $$! > "$(PIDS)/backend.pid"; \
		setsid bash -c 'cd "$(ROOT)/frontend" && npm run dev' > "$(LOGS)/frontend.log" 2>&1 < /dev/null & echo $$! > "$(PIDS)/frontend.pid"; \
	fi
	@echo "Backend:  http://localhost:3000  (terminal abierta)"
	@echo "Frontend: http://localhost:5173  (terminal abierta)"

stop: stop-processes
	-@docker compose down || true
	@echo "Servicios detenidos. Los datos de PostgreSQL y MongoDB se conservan."

db-migrate:
	cd backend && npm run prisma:migrate

db-seed:
	cd backend && npm run prisma:seed

mongo-seed:
	cd backend && npm run mongo:seed

db-studio:
	cd backend && npm run prisma:studio

check:
	cd backend && npm run typecheck
	cd backend && npm run build
	cd frontend && npm run lint
	cd frontend && npm run build

reset:
	@$(MAKE) stop
	@docker compose down -v
	@$(MAKE) start
	@$(MAKE) db-migrate db-seed mongo-seed
	@echo "Base de datos reiniciada y cargada con datos de ejemplo."
