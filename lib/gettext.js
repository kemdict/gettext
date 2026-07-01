import { parsePluralForms, fallbackPluralForms } from "./plurals.js";

/**
 * Guess or lookup the preferred language list from environment variables.
 * @param {Record<string, string | undefined>} env
 *   A map of environment variables. Defaults to process.env.
 * @returns string[] | undefined
 */
export function guessEnvLocale(env = process?.env) {
    if (!env) return;
    // If $LANG is C, C.<encoding>, or POSIX: return msgid untranslated.
    // Prefer LANGUAGE, then LC_ALL, then LC_MESSAGES, then LANG.
    const LANG = env["LANG"];
    if (LANG && (LANG === "C" || LANG.startsWith("C.") || LANG === "POSIX")) {
        return;
    }
    /** @type Set<string> */
    const locales = new Set();
    const LANGUAGE = env["LANGUAGE"];
    if (LANGUAGE)
        LANGUAGE.split(":").forEach((lang) => {
            locales.add(lang);
        });
    const LC_ALL = env["LC_ALL"];
    if (LC_ALL) locales.add(LC_ALL);
    const LC_MESSAGES = env["LC_MESSAGES"];
    if (LC_MESSAGES) locales.add(LC_MESSAGES);
    if (LANG) locales.add(LANG);
    return [...locales];
}

/**
 * @import { GetTextTranslations } from "gettext-parser";
 * @typedef {string} Locale
 * @typedef {{ eventName: string, callback: Function }} Listener
 * @typedef {GetTextTranslations} Catalog
 */

export default class Gettext {
    /** @type Map<Locale, Catalog> */
    catalogs = new Map();
    /** @type Array<Listener> */
    listeners = [];
    /**
     * Creates and returns a new Gettext instance.
     *
     * @typedef {Object} Options - a set of options
     * @property {string} [sourceLocale] - The locale that the source code and its
     *                                     texts are written in. Translations for
     *                                     this locale is not necessary.
     * @property {Record<Locale, Catalog>} [translations] - translations to add to the catalog
     * @param {Options} [options]
     */
    constructor(options) {
        options = options || {};

        // Set source locale
        this.sourceLocale = "";
        if (options.sourceLocale) {
            this.sourceLocale = options.sourceLocale;
        }

        if (options.translations) {
            for (const [locale, catalog] of Object.entries(
                options.translations,
            )) {
                this.catalogs.set(locale, catalog);
            }
        }
    }
    /**
     * Return locales currently added to the catalogs.
     */
    getLocales() {
        return this.catalogs.keys();
    }
    // NOTE: This function is actually relatively hot, since every component and
    // every module would call it. But caching this could only really be faster
    // if we generate the key from the arguments with something with maybe 2
    // inputs, anything more complex would literally just be slower. At best
    // it's a 2x speed increase, but we're talking about going from 0.0002ms per
    // bindLocale call to 0.0001ms here. It's not worth it.
    /**
     * Return functions that translate strings into `locale`.
     * This allows not having global state while also not having to pass the
     * locale for every call.
     *
     * @param {Locale[] | Locale | undefined} locales
     * A string to use as a locale, or an array of locales to try to match for,
     * or undefined which means to not do any translations.
     */
    bindLocale(locales) {
        const localesArr = !locales
            ? []
            : Array.isArray(locales)
              ? locales
              : [locales];

        // The value of `this` would no longer be our instance if we call each
        // of the functions as standalone functions. This reference to our
        // instance, on the other hand, will not change even when the returned
        // functions are called as standalone functions.
        const self = this;

        /**
         * The base function for all variants.
         * This does not need to take `locale` as an input, because all functions
         * resulting from a given `.with` call all use the same locale.
         *
         * @param {string | null | undefined} msgctxt - Translation context. undefined or empty string means no context.
         * @param {string} msgid - String to be translated
         * @param {string} [msgidPlural] - If no translation was found, return this on count!=1
         * @param {number} [count] - Number count for the plural
         * @return {string}
         *
         */
        const baseGettext = (msgctxt, msgid, msgidPlural, count) => {
            const context = msgctxt || "";

            let defaultTranslation = msgid;
            if (count !== undefined && !isNaN(count) && count !== 1) {
                defaultTranslation = msgidPlural || msgid;
            }

            for (const locale of localesArr) {
                if (
                    locale === "C" ||
                    locale === "POSIX" ||
                    locale.startsWith("C.")
                ) {
                    return defaultTranslation;
                }
                const pluralFunc = self._getCatalogPluralForms(locale).plural;
                const catalog = self.catalogs.get(locale);
                const translation = catalog?.translations?.[context]?.[msgid];
                if (!translation) continue;

                /** @type {boolean | number} */
                let index = typeof count === "number" ? pluralFunc(count) : 0;
                if (typeof index === "boolean") {
                    index = index ? 1 : 0;
                }
                const msgstr = translation.msgstr[index];
                if (msgstr) return msgstr;
            }
            return defaultTranslation;
        };
        return {
            /**
             * Translate a string.
             * The locale is implicit.
             *
             * @param  {string} msgid - String to be translated
             * @return {string} Translation or the original string if no translation was found
             */
            gettext(msgid) {
                return baseGettext(undefined, msgid);
            },
            /**
             * Translate a string.
             * Same as `gettext`.
             * The locale is implicit.
             *
             * @param  {string} msgid - String to be translated
             * @return {string} Translation or the original string if no translation was found
             */
            _(msgid) {
                return baseGettext(undefined, msgid);
            },
            /**
             * Translate a plural string.
             * The locale is implicit.
             *
             * @param  {string} msgid        String to be translated when count is not plural
             * @param  {string} msgidPlural  String to be translated when count is plural
             * @param  {number} count        Number count for the plural
             * @return {string} Translation or the original string if no translation was found
             */
            ngettext(msgid, msgidPlural, count) {
                return baseGettext(undefined, msgid, msgidPlural, count);
            },
            /**
             * Translate a string from a specific context.
             * The locale is implicit.
             *
             * @param  {string} msgctxt  Translation context
             * @param  {string} msgid    String to be translated
             * @return {string} Translation or the original string if no translation was found
             */
            pgettext(msgctxt, msgid) {
                return baseGettext(msgctxt, msgid);
            },
            /**
             * Translate a plural string from a specific context.
             * The locale is implicit.
             *
             * @param  {string} msgctxt      Translation context
             * @param  {string} msgid        String to be translated when count is not plural
             * @param  {string} msgidPlural  String to be translated when count is plural
             * @param  {number} count        Number count for the plural
             * @return {string} Translation or the original string if no translation was found
             */
            npgettext(msgctxt, msgid, msgidPlural, count) {
                return baseGettext(msgctxt, msgid, msgidPlural, count);
            },
        };
    }
    /**
     * Cache for computed plural forms.
     * Right now the computation is just normalizing the value then looking it
     * up, but this already benefits from a cache.
     * @type {Map<string, import("./plural-data.js").PluralFormsObj>}
     */
    _pluralForms = new Map();

    /**
     * Return plural forms header for the current catalogs for `locale`.
     * @param {string} locale - The locale name
     */
    _getCatalogPluralForms(locale) {
        return this._pluralForms.getOrInsertComputed(locale, () => {
            const header = this.catalogs.get(locale)?.headers["Plural-Forms"];
            return header
                ? parsePluralForms(header) || fallbackPluralForms(locale)
                : fallbackPluralForms(locale);
        });
    }
}
