# Hexkit Raycast extension — common tasks.
# Override the package manager with: make <target> PM=pnpm

PM ?= npm

.DEFAULT_GOAL := help
.PHONY: help install dev build lint lint-fix typecheck icon clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	$(PM) install

dev: ## Live-develop in Raycast (`ray develop` — registers the extension)
	$(PM) exec ray develop

build: ## Compile all command entry points (`ray build`)
	$(PM) exec ray build

lint: ## Lint the extension (manifest + JS)
	$(PM) exec ray lint

lint-fix: ## Lint with autofix
	$(PM) exec ray lint -- --fix

typecheck: ## Strict TypeScript check
	$(PM) exec tsc -- --noEmit

icon: ## Regenerate the placeholder extension icon (assets/extension-icon.png)
	node scripts/make-icon.mjs

clean: ## Remove build output and local caches
	rm -rf dist node_modules raycast-env.d.ts .raycast
