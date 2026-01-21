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
 * @typedef {string} Domain
 * @typedef {{ eventName: string, callback: Function }} Listener
 * @typedef {Record<Domain, GetTextTranslations>} Catalog
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
        translations?: Record<string, Catalog> | undefined;
    });
    /** @type Map<Locale, Catalog> */
    catalogs: Map<Locale, Catalog>;
    /** @type Array<Listener> */
    listeners: Array<Listener>;
    sourceLocale: string;
    debug: boolean;
    /**
     * Adds an event listener.
     *
     * @param  {string}   eventName  An event name
     * @param  {Function} callback   An event handler function
     */
    on(eventName: string, callback: Function): void;
    /**
     * Removes an event listener.
     *
     * @param  {string}   eventName  An event name
     * @param  {Function} callback   A previously registered event handler function
     */
    off(eventName: string, callback: Function): void;
    /**
     * Emits an event to all registered event listener.
     *
     * @private
     * @param  {String} eventName  An event name
     * @param  {any}    eventData  Data to pass to event listeners
     */
    private emit;
    /**
     * Logs a warning to the console if debug mode is enabled.
     *
     * @ignore
     * @param  {String} message  A warning message
     */
    warn(message: string): void;
    /**
     * Return locales currently added to the catalogs.
     */
    getLocales(): MapIterator<string>;
    /**
     * Return functions that translate strings into `locale` within `domain`.
     * This allows not having global state but also not having to pass the
     * locale and domain for every call.
     *
     * @param {Locale[] | Locale | undefined} locales
     * A string to use as a locale, or an array of locales to try to match for,
     * or undefined which means to not do any translations.
     * @param {Domain} [domain] - the domain, defaults to "messages"
     */
    bindLocale(locales: Locale[] | Locale | undefined, domain?: Domain): {
        /**
         * Translate a string.
         * The domain and locale are implicit.
         *
         * @param  {string} msgid - String to be translated
         * @return {string} Translation or the original string if no translation was found
         */
        gettext(msgid: string): string;
        /**
         * Translate a string.
         * Same as `gettext`.
         * The domain and locale are implicit.
         *
         * @param  {string} msgid - String to be translated
         * @return {string} Translation or the original string if no translation was found
         */
        _(msgid: string): string;
        /**
         * Translate a string using a specific domain.
         * The locale is implicit.
         *
         * @param  {string} domain  A gettext domain name
         * @param  {string} msgid   String to be translated
         * @return {string} Translation or the original string if no translation was found
         */
        dgettext(domain: string, msgid: string): string;
        /**
         * Translate a plural string.
         * The domain and locale are implicit.
         *
         * @param  {string} msgid        String to be translated when count is not plural
         * @param  {string} msgidPlural  String to be translated when count is plural
         * @param  {number} count        Number count for the plural
         * @return {string} Translation or the original string if no translation was found
         */
        ngettext(msgid: string, msgidPlural: string, count: number): string;
        /**
         * Translate a plural string using a specific domain.
         * The locale is implicit.
         *
         * @param  {string} domain       A gettext domain name
         * @param  {string} msgid        String to be translated when count is not plural
         * @param  {string} msgidPlural  String to be translated when count is plural
         * @param  {number} count        Number count for the plural
         * @return {string} Translation or the original string if no translation was found
         */
        dngettext(domain: string, msgid: string, msgidPlural: string, count: number): string;
        /**
         * Translate a string from a specific context.
         * The domain and locale are implicit.
         *
         * @param  {string} msgctxt  Translation context
         * @param  {string} msgid    String to be translated
         * @return {string} Translation or the original string if no translation was found
         */
        pgettext(msgctxt: string, msgid: string): string;
        /**
         * Translates a string from a specific context using a specific domain.
         * The locale is implicit.
         *
         * @param  {string} domain   A gettext domain name
         * @param  {string} msgctxt  Translation context
         * @param  {string} msgid    String to be translated
         * @return {string} Translation or the original string if no translation was found
         */
        dpgettext(domain: string, msgctxt: string, msgid: string): string;
        /**
         * Translate a plural string from a specific context.
         * The domain and locale are implicit.
         *
         * @param  {string} msgctxt      Translation context
         * @param  {string} msgid        String to be translated when count is not plural
         * @param  {string} msgidPlural  String to be translated when count is plural
         * @param  {number} count        Number count for the plural
         * @return {string} Translation or the original string if no translation was found
         */
        npgettext(msgctxt: string, msgid: string, msgidPlural: string, count: number): string;
        /**
         * Translate a plural string from a specific context using a specific domain.
         * The locale is implicit.
         *
         * @param {string} domain - A gettext domain name
         * @param {string | null | undefined} msgctxt - Translation context
         * @param {string} msgid - String to be translated
         * @param {string} [msgidPlural] - If no translation was found, return this on count!=1
         * @param {number} [count] - Number count for the plural
         * @return {string} Translation or the original string if no translation was found
         */
        dnpgettext(domain: string, msgctxt: string | null | undefined, msgid: string, msgidPlural?: string, count?: number): string;
        /**
         * Retrieve comments object for a translation. The comments object
         * has the shape `{ translator, extracted, reference, flag, previous }`.
         *
         * @example
         *     const comment = getComment('domainname', 'sports', 'Backs')
         *
         * @param  {String} domain   A gettext domain name
         * @param  {String} msgctxt  Translation context
         * @param  {String} msgid    String to be translated
         * @return {GetTextComment} Comments object or false if not found
         */
        getComment(domain: string, msgctxt: string, msgid: string): GetTextComment;
    };
    /**
     * Return plural forms header of `domain` for `locale`.
     * @param {string} locale - The locale name
     * @param {string} domain - The domain name
     */
    _getCatalogPluralForms(locale: string, domain: string): import("./plural-data.js").PluralFormsObj;
}
export type Locale = string;
export type Domain = string;
export type Listener = {
    eventName: string;
    callback: Function;
};
export type Catalog = Record<Domain, GetTextTranslations>;
import type { GetTextComment } from "gettext-parser";
import type { GetTextTranslations } from "gettext-parser";
//# sourceMappingURL=gettext.d.ts.map