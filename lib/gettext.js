import { parsePluralForms, fallbackPluralForms } from "./plurals.js";

/**
 * Guess or lookup the preferred language list from the environment.
 */
export function guessLocale() {
    // If $LANG is C, C.<encoding>, or POSIX: return msgid untranslated.
    // Prefer LANGUAGE, then LC_ALL, then LC_MESSAGES, then LANG.
    const LANG = process?.env["LANG"];
    if (LANG && (LANG === "C" || LANG.startsWith("C.") || LANG === "POSIX")) {
        return [];
    }
    /** @type string[] */
    const locales = [];
    const LANGUAGE = process?.env["LANGUAGE"];
    if (LANGUAGE) locales.push(...LANGUAGE.split(":"));
    const LC_ALL = process?.env["LC_ALL"];
    if (LC_ALL) locales.push(LC_ALL);
    const LC_MESSAGES = process?.env["LC_MESSAGES"];
    if (LC_MESSAGES) locales.push(LC_MESSAGES);
    if (LANG) locales.push(LANG);
    return locales;
}

/**
 * @import { GetTextTranslations, GetTextComment } from "gettext-parser";
 * @typedef {string} Locale
 * @typedef {string} Domain
 * @typedef {{ eventName: string, callback: Function }} Listener
 * @typedef {Record<Domain, GetTextTranslations>} Catalog
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
     * @property {boolean} [debug]       - Whether to output debug info into the
     *                                     console.
     * @property {Record<Locale, Catalog>} [translations] - translations to add to the catalog
     * @param {Options} [options]
     */
    constructor(options) {
        options = options || {};

        // Set source locale
        this.sourceLocale = "";
        if (options.sourceLocale) {
            if (typeof options.sourceLocale === "string") {
                this.sourceLocale = options.sourceLocale;
            } else {
                this.warn("The `sourceLocale` option should be a string");
            }
        }

        if (options.translations) {
            for (const [locale, catalog] of Object.entries(
                options.translations,
            )) {
                this.catalogs.set(locale, catalog);
            }
        }

        // Set debug flag
        this.debug = "debug" in options && options.debug === true;
    }
    /**
     * Adds an event listener.
     *
     * @param  {string}   eventName  An event name
     * @param  {Function} callback   An event handler function
     */
    on(eventName, callback) {
        this.listeners.push({
            eventName: eventName,
            callback: callback,
        });
    }
    /**
     * Removes an event listener.
     *
     * @param  {string}   eventName  An event name
     * @param  {Function} callback   A previously registered event handler function
     */
    off(eventName, callback) {
        this.listeners = this.listeners.filter(function (listener) {
            return (
                (listener.eventName === eventName &&
                    listener.callback === callback) === false
            );
        });
    }
    /**
     * Emits an event to all registered event listener.
     *
     * @private
     * @param  {String} eventName  An event name
     * @param  {any}    eventData  Data to pass to event listeners
     */
    emit(eventName, eventData) {
        for (var i = 0; i < this.listeners.length; i++) {
            var listener = this.listeners[i];
            if (listener.eventName === eventName) {
                listener.callback(eventData);
            }
        }
    }
    /**
     * Logs a warning to the console if debug mode is enabled.
     *
     * @ignore
     * @param  {String} message  A warning message
     */
    warn(message) {
        if (this.debug) {
            console.warn(message);
        }

        this.emit("error", new Error(message));
    }
    /**
     * Return locales currently added to the catalogs.
     */
    getLocales() {
        return Object.keys(this.catalogs);
    }
    // FIXME: this function is actually relatively hot, since every component
    // and every module would call it. Some sort of caching needs to be done,
    // either through our own mechanism or by making the return value a class
    // and letting the JS engine optimize it.
    /**
     * Return functions that translate strings into `locale` within `domain`.
     * This allows not having global state but also not having to pass the
     * locale and domain for every call.
     *
     * @param {Locale[] | Locale} locales - locales to try to match for. Can also be a string.
     * @param {Domain} [domain] - the domain, defaults to "messages"
     */
    with(locales, domain = "messages") {
        let locale =
            typeof locales === "string"
                ? locales
                : locales.find((preferred) => this.catalogs.has(preferred));
        // FIXME: we're basically using "empty locale" to mean "no translations,
        // always return msgid/msgid_plural". We should make that explicit. We
        // should also implement the C/C.*/POSIX locales.
        if (locale === undefined) {
            this.warn("None of the locales have translations in the catalogs.");
            locale = "";
        }
        if (domain.trim() === "") {
            this.warn("You specified an empty `domain` value.");
        }
        if (locale !== this.sourceLocale && !this.catalogs.has(locale)) {
            this.warn(
                `The specified locale ${locale} does not have translations in the catalogs.`,
            );
        }

        const pluralFunc = this._getCatalogPluralForms(locale, domain).plural;
        // TODO: we could possibly want multiple catalogs given a locale that
        // is a preference for multiple locales (for per-string fallback).
        const catalog = this.catalogs.get(locale);
        // The value of `this` would no longer be our instance if we call each
        // of the functions as standalone functions. This reference to our
        // instance, on the other hand, will not change even when the returned
        // functions are called as standalone functions.
        const self = this;

        /**
         * @overload
         * @param {string} domain
         * @param {string | undefined} msgctxt
         * @param {string} msgid
         * @param {undefined} msgidPlural
         * @param {undefined} count
         * @param {true} getComment
         * @return {GetTextComment}
         *
         * @overload
         * @param {string} domain
         * @param {string | undefined} msgctxt
         * @param {string} msgid
         * @param {string} [msgidPlural]
         * @param {number} [count]
         * @param {false} [getComment]
         * @return {string}
         */
        /**
         * The base function for all variants.
         * This does not need to take `locale` as an input, because all functions
         * resulting from a given `.with` call all use the same locale.
         *
         * This does need to take `domain` because some functions allow
         * specifying the domain.
         *
         * @param {string} domain - A gettext domain name
         * @param {string | undefined} msgctxt - Translation context. undefined or empty string means no context.
         * @param {string} msgid - String to be translated
         * @param {string} [msgidPlural] - If no translation was found, return this on count!=1
         * @param {number} [count] - Number count for the plural
         * @param {boolean} [getComment] - If true, return the comment for the matched entry instead.
         * @return {string | GetTextComment}
         *
         */
        const baseGettext = (
            domain,
            msgctxt,
            msgid,
            msgidPlural,
            count,
            getComment,
        ) => {
            const context = msgctxt || "";

            let defaultTranslation = msgid;
            if (count !== undefined && !isNaN(count) && count !== 1) {
                defaultTranslation = msgidPlural || msgid;
            }

            const translation =
                catalog?.[domain]?.translations?.[context]?.[msgid];

            if (getComment) {
                return translation?.comments || {};
            }

            /** @type {boolean | number} */
            let index;
            if (translation) {
                if (typeof count === "number") {
                    index = pluralFunc(count);
                    if (typeof index === "boolean") {
                        index = index ? 1 : 0;
                    }
                } else {
                    index = 0;
                }

                return translation.msgstr[index] || defaultTranslation;
            } else if (!self.sourceLocale || locale !== self.sourceLocale) {
                self.warn(
                    'No translation was found for msgid "' +
                        msgid +
                        '" in msgctxt "' +
                        msgctxt +
                        '" and domain "' +
                        domain +
                        '"',
                );
            }

            return defaultTranslation;
        };
        return {
            /**
             * Translate a string.
             * The domain and locale are implicit.
             *
             * @param  {string} msgid - String to be translated
             * @return {string} Translation or the original string if no translation was found
             */
            gettext(msgid) {
                // this `domain` is the one from `.with`.
                return baseGettext(domain, undefined, msgid);
            },
            /**
             * Translate a string.
             * Same as `gettext`.
             * The domain and locale are implicit.
             *
             * @param  {string} msgid - String to be translated
             * @return {string} Translation or the original string if no translation was found
             */
            _(msgid) {
                // this `domain` is the one from `.with`.
                return baseGettext(domain, undefined, msgid);
            },
            /**
             * Translate a string using a specific domain.
             * The locale is implicit.
             *
             * @param  {string} domain  A gettext domain name
             * @param  {string} msgid   String to be translated
             * @return {string} Translation or the original string if no translation was found
             */
            dgettext(domain, msgid) {
                return baseGettext(domain, undefined, msgid);
            },
            /**
             * Translate a plural string.
             * The domain and locale are implicit.
             *
             * @param  {string} msgid        String to be translated when count is not plural
             * @param  {string} msgidPlural  String to be translated when count is plural
             * @param  {number} count        Number count for the plural
             * @return {string} Translation or the original string if no translation was found
             */
            ngettext(msgid, msgidPlural, count) {
                // this `domain` is the one from `.with`.
                return baseGettext(
                    domain,
                    undefined,
                    msgid,
                    msgidPlural,
                    count,
                );
            },
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
            dngettext(domain, msgid, msgidPlural, count) {
                return baseGettext(
                    domain,
                    undefined,
                    msgid,
                    msgidPlural,
                    count,
                );
            },
            /**
             * Translate a string from a specific context.
             * The domain and locale are implicit.
             *
             * @param  {string} msgctxt  Translation context
             * @param  {string} msgid    String to be translated
             * @return {string} Translation or the original string if no translation was found
             */
            pgettext(msgctxt, msgid) {
                // this `domain` is the one from `.with`.
                return baseGettext(domain, msgctxt, msgid);
            },
            /**
             * Translates a string from a specific context using a specific domain.
             * The locale is implicit.
             *
             * @param  {string} domain   A gettext domain name
             * @param  {string} msgctxt  Translation context
             * @param  {string} msgid    String to be translated
             * @return {string} Translation or the original string if no translation was found
             */
            dpgettext(domain, msgctxt, msgid) {
                return baseGettext(domain, msgctxt, msgid);
            },
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
            npgettext(msgctxt, msgid, msgidPlural, count) {
                // this `domain` is the one from `.with`.
                return baseGettext(domain, msgctxt, msgid, msgidPlural, count);
            },
            /**
             * Translate a plural string from a specific context using a specific domain.
             * The locale is implicit.
             *
             * @param {string} domain - A gettext domain name
             * @param {string} msgctxt - Translation context
             * @param {string} msgid - String to be translated
             * @param {string} [msgidPlural] - If no translation was found, return this on count!=1
             * @param {number} [count] - Number count for the plural
             * @return {string} Translation or the original string if no translation was found
             */
            dnpgettext(domain, msgctxt, msgid, msgidPlural, count) {
                return baseGettext(domain, msgctxt, msgid, msgidPlural, count);
            },
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
            getComment(domain, msgctxt, msgid) {
                return baseGettext(
                    domain,
                    msgctxt,
                    msgid,
                    undefined,
                    undefined,
                    true,
                );
            },
        };
    }
    /**
     * Return plural forms header of `domain` for `locale`.
     * @param {string} locale - The locale name
     * @param {string} domain - The domain name
     */
    _getCatalogPluralForms(locale, domain) {
        const header =
            this.catalogs.get(locale)?.[domain].headers["Plural-Forms"];
        return header
            ? parsePluralForms(header) || fallbackPluralForms(locale)
            : fallbackPluralForms(locale);
    }
}
