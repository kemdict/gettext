run:
	node main.ts

extract:
	xgettext main.ts -o po/hello.pot

po/%.po: po/hello.pot
	msgmerge "$@" po/hello.pot -o "$@"
