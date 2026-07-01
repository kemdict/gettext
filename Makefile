.PHONY: fmt test test.coverage build

fmt:
	prettier -w ./lib

test:
	node --test 'test/**/*.js'

test.coverage:
	node --test --experimental-test-coverage \
		--test-reporter=lcov --test-reporter-destination=coverage.info \
		test/gettext.test.js

build:
	npx tsc -p tsconfig.lib.json

publish:
	npx publint
	npm publish
