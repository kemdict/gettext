.PHONY: test build publish

build:
	npx tsc -p tsconfig.lib.json

test/mo:
	cd test && npm run compile-mo

# for some reason vitest --typecheck doesn't actually fail when there are type
# errors for me, so I'm running tsc here as a workaround
test: test/mo
	npx tsc
	npx vitest run --typecheck

publish:
	npx publint
	npm publish
