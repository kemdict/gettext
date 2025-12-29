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
 * @import { GetTextTranslations, GetTextTranslation, GetTextComment } from "gettext-parser";
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

        this.locale = "";
        this.domain = "messages";

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
    /**
     * Set the locale to the first locale in preferredLocales that is present in
     * the catalogs.
     *
     * @example
     *     gt.setFirstAvailableLocale(['zh_HK', 'zh_TW'])
     *
     * @param {string[]} preferredLocales Preferred locales
     */
    setFirstAvailableLocale(preferredLocales) {
        for (const preferred of preferredLocales) {
            if (this.catalogs.has(preferred)) {
                this.locale = preferred;
                return;
            }
        }
        this.warn(
            "No preferredLocale is present in the catalogs. The locale has not been unchanged.",
        );
    }
    /**
     * Sets the locale to get translated messages for.
     *
     * @example
     *     gt.setLocale('sv-SE')
     *
     * @param {string} locale  A locale
     */
    setLocale(locale) {
        if (typeof locale !== "string") {
            this.warn(
                "You called setLocale() with an argument of type " +
                    typeof locale +
                    ". " +
                    "The locale must be a string.",
            );
            return;
        }

        if (locale.trim() === "") {
            this.warn(
                "You called setLocale() with an empty value, which makes little sense.",
            );
        }

        if (locale !== this.sourceLocale && !this.catalogs.has(locale)) {
            this.warn(
                'You called setLocale() with "' +
                    locale +
                    '", but no translations for that locale has been added.',
            );
        }

        this.locale = locale;
    }
    /**
     * Sets the default gettext domain.
     *
     * @example
     *     gt.setTextDomain('domainname')
     *
     * @param {String} domain  A gettext domain name
     */
    setTextDomain(domain) {
        if (typeof domain !== "string") {
            this.warn(
                "You called setTextDomain() with an argument of type " +
                    typeof domain +
                    ". " +
                    "The domain must be a string.",
            );
            return;
        }

        if (domain.trim() === "") {
            this.warn(
                "You called setTextDomain() with an empty `domain` value.",
            );
        }

        this.domain = domain;
    }
    /**
     * Translates a string using the default textdomain
     *
     * @example
     *     gt.gettext('Some text')
     *
     * @param  {String} msgid  String to be translated
     * @return {String} Translation or the original string if no translation was found
     */
    gettext(msgid) {
        return this.dnpgettext(this.domain, "", msgid);
    }
    /**
     * Translates a string using a specific domain
     *
     * @example
     *     gt.dgettext('domainname', 'Some text')
     *
     * @param  {String} domain  A gettext domain name
     * @param  {String} msgid   String to be translated
     * @return {String} Translation or the original string if no translation was found
     */
    dgettext(domain, msgid) {
        return this.dnpgettext(domain, "", msgid);
    }
    /**
     * Translates a plural string using the default textdomain
     *
     * @example
     *     gt.ngettext('One thing', 'Many things', numberOfThings)
     *
     * @param  {String} msgid        String to be translated when count is not plural
     * @param  {String} msgidPlural  String to be translated when count is plural
     * @param  {Number} count        Number count for the plural
     * @return {String} Translation or the original string if no translation was found
     */
    ngettext(msgid, msgidPlural, count) {
        return this.dnpgettext(this.domain, "", msgid, msgidPlural, count);
    }
    /**
     * Translates a plural string using a specific textdomain
     *
     * @example
     *     gt.dngettext('domainname', 'One thing', 'Many things', numberOfThings)
     *
     * @param  {String} domain       A gettext domain name
     * @param  {String} msgid        String to be translated when count is not plural
     * @param  {String} msgidPlural  String to be translated when count is plural
     * @param  {Number} count        Number count for the plural
     * @return {String} Translation or the original string if no translation was found
     */
    dngettext(domain, msgid, msgidPlural, count) {
        return this.dnpgettext(domain, "", msgid, msgidPlural, count);
    }
    /**
     * Translates a string from a specific context using the default textdomain
     *
     * @example
     *    gt.pgettext('sports', 'Back')
     *
     * @param  {String} msgctxt  Translation context
     * @param  {String} msgid    String to be translated
     * @return {String} Translation or the original string if no translation was found
     */
    pgettext(msgctxt, msgid) {
        return this.dnpgettext(this.domain, msgctxt, msgid);
    }
    /**
     * Translates a string from a specific context using s specific textdomain
     *
     * @example
     *     gt.dpgettext('domainname', 'sports', 'Back')
     *
     * @param  {String} domain   A gettext domain name
     * @param  {String} msgctxt  Translation context
     * @param  {String} msgid    String to be translated
     * @return {String} Translation or the original string if no translation was found
     */
    dpgettext(domain, msgctxt, msgid) {
        return this.dnpgettext(domain, msgctxt, msgid);
    }
    /**
     * Translates a plural string from a specific context using the default textdomain
     *
     * @example
     *     gt.npgettext('sports', 'Back', '%d backs', numberOfBacks)
     *
     * @param  {String} msgctxt      Translation context
     * @param  {String} msgid        String to be translated when count is not plural
     * @param  {String} msgidPlural  String to be translated when count is plural
     * @param  {Number} count        Number count for the plural
     * @return {String} Translation or the original string if no translation was found
     */
    npgettext(msgctxt, msgid, msgidPlural, count) {
        return this.dnpgettext(this.domain, msgctxt, msgid, msgidPlural, count);
    }
    /**
     * Translates a plural string from a specifi context using a specific textdomain
     *
     * @example
     *     gt.dnpgettext('domainname', 'sports', 'Back', '%d backs', numberOfBacks)
     *
     * @param  {string} domain       A gettext domain name
     * @param  {string | null | undefined} msgctxt      Translation context
     * @param  {string} msgid        String to be translated
     * @param  {string} [msgidPlural]  If no translation was found, return this on count!=1
     * @param  {number} [count]        Number count for the plural
     * @return {string} Translation or the original string if no translation was found
     */
    dnpgettext(domain, msgctxt, msgid, msgidPlural, count) {
        let defaultTranslation = msgid;
        /** @type {boolean | number} */
        let index;

        msgctxt = msgctxt || "";

        if (count !== undefined && !isNaN(count) && count !== 1) {
            defaultTranslation = msgidPlural || msgid;
        }

        const translation = this._getTranslation(domain, msgctxt, msgid);

        if (translation) {
            if (typeof count === "number") {
                const { plural } = this._getCatalogPluralForms(
                    this.locale,
                    domain,
                );
                index = plural(count);
                if (typeof index === "boolean") {
                    index = index ? 1 : 0;
                }
            } else {
                index = 0;
            }

            return translation.msgstr[index] || defaultTranslation;
        } else if (!this.sourceLocale || this.locale !== this.sourceLocale) {
            this.warn(
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
    }
    /**
     * Retrieves comments object for a translation. The comments object
     * has the shape `{ translator, extracted, reference, flag, previous }`.
     *
     * @example
     *     const comment = gt.getComment('domainname', 'sports', 'Backs')
     *
     * @param  {String} domain   A gettext domain name
     * @param  {String} msgctxt  Translation context
     * @param  {String} msgid    String to be translated
     * @return {GetTextComment} Comments object or false if not found
     */
    getComment(domain, msgctxt, msgid) {
        var translation;

        translation = this._getTranslation(domain, msgctxt, msgid);
        if (translation) {
            return translation.comments || {};
        }

        return {};
    }
    /** @type import("./plural-data.js").PluralFormsObj | undefined */
    pluralForms = undefined;
    /**
     * Return plural forms header of `domain` for `locale`.
     * @param {string} locale - The locale name
     * @param {string} domain - The domain name
     */
    _getCatalogPluralForms(locale, domain) {
        if (this.pluralForms) return this.pluralForms;
        const header =
            this.catalogs.get(locale)?.[domain].headers["Plural-Forms"];

        const pluralForms = header
            ? parsePluralForms(header) || fallbackPluralForms(locale)
            : fallbackPluralForms(locale);

        this.pluralForms = pluralForms;
        return this.pluralForms;
    }
    /**
     * Retrieves translation object from the domain and context
     *
     * @private
     * @param  {string} domain   A gettext domain name
     * @param  {string} msgctxt  Translation context
     * @param  {string} msgid    String to be translated
     * @return {GetTextTranslation | undefined} Translation object or undefined if not found
     */
    _getTranslation(domain, msgctxt, msgid) {
        msgctxt = msgctxt || "";

        return this.catalogs.get(this.locale)?.[domain]?.translations?.[
            msgctxt
        ]?.[msgid];
    }
    /* C-style aliases */
    /**
     * C-style alias for [setTextDomain](#gettextsettextdomaindomain)
     *
     * @see Gettext#setTextDomain
     * @param {string} domain
     */
    textdomain(domain) {
        return this.setTextDomain(domain);
    }
    /**
     * C-style alias for [setLocale](#gettextsetlocalelocale)
     *
     * @see Gettext#setLocale
     * @param {string} locale
     */
    setlocale(locale) {
        return this.setLocale(locale);
    }
}
