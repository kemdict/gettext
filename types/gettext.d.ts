/**
 * Guess or lookup the preferred language list from environment variables.
 * @param {Record<string, string | undefined>} env
 *   A map of environment variables. Defaults to process.env.
 * @returns string[] | undefined
 */
export function guessEnvLocale(env?: Record<string, string | undefined>): string[] | undefined;
/**
 * @import { GetTextTranslations, GetTextComment } from "gettext-parser";
 * @typedef {string} Locale
 * @typedef {{ eventName: string, callback: Function }} Listener
 * @typedef {GetTextTranslations} Catalog
 */
export default class Gettext {
    /**
     * Creates and returns a new Gettext instance.
     *
     * @typedef {Object} Options - a set of options
     * @property {string} [sourceLocale] - The locale that the source code and its
     *                                     texts are written in. Translations for
     *                                     this locale is not necessary.
     * @property {boolean} [debug]       - Whether to output debug info into the
     *                                     console.
     * @property {Record<Locale, Catalog>} [translations] - translations to add to the catalog
     * @param {Options} [options]
     */
    constructor(options?: {
        /**
         * - The locale that the source code and its
         *    texts are written in. Translations for
         *    this locale is not necessary.
         */
        sourceLocale?: string | undefined;
        /**
         * - Whether to output debug info into the
         *          console.
         */
        debug?: boolean | undefined;
        /**
         * - translations to add to the catalog
         */
        translations?: Record<string, GetTextTranslations> | undefined;
    });
    /** @type Map<Locale, Catalog> */
    catalogs: Map<Locale, Catalog>;
    /** @type Array<Listener> */
    listeners: Array<Listener>;
    sourceLocale: string;
    debug: boolean;
    /**
     * Logs a warning to the console if debug mode is enabled.
     *
     * @private
     * @param  {String} message  A warning message
     */
    private warn;
    /**
     * Return locales currently added to the catalogs.
     */
    getLocales(): MapIterator<string>;
    /**
     * Return functions that translate strings into `locale`.
     * This allows not having global state while also not having to pass the
     * locale for every call.
     *
     * @param {Locale[] | Locale | undefined} locales
     * A string to use as a locale, or an array of locales to try to match for,
     * or undefined which means to not do any translations.
     */
    bindLocale(locales: Locale[] | Locale | undefined): {
        /**
         * Translate a string.
         * The locale is implicit.
         *
         * @param  {string} msgid - String to be translated
         * @return {string} Translation or the original string if no translation was found
         */
        gettext(msgid: string): string;
        /**
         * Translate a string.
         * Same as `gettext`.
         * The locale is implicit.
         *
         * @param  {string} msgid - String to be translated
         * @return {string} Translation or the original string if no translation was found
         */
        _(msgid: string): string;
        /**
         * Translate a plural string.
         * The locale is implicit.
         *
         * @param  {string} msgid        String to be translated when count is not plural
         * @param  {string} msgidPlural  String to be translated when count is plural
         * @param  {number} count        Number count for the plural
         * @return {string} Translation or the original string if no translation was found
         */
        ngettext(msgid: string, msgidPlural: string, count: number): string;
        /**
         * Translate a string from a specific context.
         * The locale is implicit.
         *
         * @param  {string} msgctxt  Translation context
         * @param  {string} msgid    String to be translated
         * @return {string} Translation or the original string if no translation was found
         */
        pgettext(msgctxt: string, msgid: string): string;
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
        npgettext(msgctxt: string, msgid: string, msgidPlural: string, count: number): string;
    };
    /**
     * Return plural forms header for the current catalogs for `locale`.
     * @param {string} locale - The locale name
     */
    _getCatalogPluralForms(locale: string): import("./plural-data.js").PluralFormsObj;
}
export type Locale = string;
export type Listener = {
    eventName: string;
    callback: Function;
};
export type Catalog = GetTextTranslations;
import type { GetTextTranslations } from "gettext-parser";
//# sourceMappingURL=gettext.d.ts.map