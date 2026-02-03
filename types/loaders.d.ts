/**
 * Load MO translations the directories `localesDirs`.
 *
 * These directories should be arranged similar to /usr/share/locale, like
 * <dir>/<locale>/LC_MESSAGES/<domain>.mo.
 *
 * @param {string} domain
 * @param {...string} localesDirs
 */
export function bindtextdomain(domain: string, ...localesDirs: string[]): Record<string, import("gettext-parser").GetTextTranslations>;
/**
 * Load PO translations from `dir`.
 * `dir` should be structured like <dir>/<locale>.po.
 * @param {string} dir
 */
export function loadTranslations(dir: string): Record<string, import("gettext-parser").GetTextTranslations>;
//# sourceMappingURL=loaders.d.ts.map