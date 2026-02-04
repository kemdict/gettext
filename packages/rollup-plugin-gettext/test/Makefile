extract:
	xgettext index.test.ts --language=javascript -o messages.pot

compile-mo:
	mkdir -p mo
	parallel msgfmt '{}' -o mo/'{/.}'.mo ':::' po/*.po
