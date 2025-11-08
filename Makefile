.PHONY: help install dev build lint type-check pre-commit test preview

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

lint: ## Run linter
	npm run lint

type-check: ## Run TypeScript type check
	npm run type-check

pre-commit: ## Run pre-commit checks (lint-staged + type-check)
	npx lint-staged
	npm run type-check

test: ## Run tests (if available)
	@echo "No tests configured yet"

preview: ## Preview production build
	npm run preview

