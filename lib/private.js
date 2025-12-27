/**
 * Returns the language code part of a locale
 *
 * @example
 *     Gettext.getLanguageCode('sv-SE')
 *     // -> "sv"
 *
 * @private
 * @param   {string} locale  A case-insensitive locale string
 * @returns {string} A language code
 */
export function getLanguageCode(locale) {
    return locale.split(/[\-_]/)[0].toLowerCase();
}
