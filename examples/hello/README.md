# hello (cli example)

An example to showcase localizing strings in a command line app.

Run the example:

```sh
node main.ts
```

Extract strings from source code and put them into the PO template:

```sh
make extract

# Alternatively
xgettext main.ts -o po/hello.pot
```

Update translations to reflect the PO template:

```sh
make po/zh_TW.po

# Alternatively
msgmerge po/zh_TW.po po/hello.pot -o po/zh_TW.po
```

Create new translation file for an untranslated language:

```sh
cd po/
msginit
# Or use your translation editor.
```
