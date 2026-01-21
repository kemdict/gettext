/**
 * Load MO translations the directories `localesDirs`.
 *
 * These directories should be arranged similar to /usr/share/locale, like
 * <dir>/<locale>/LC_MESSAGES/<domain>.mo.
 *
 * @param {string} domain
 * @param {...string} localesDirs
 */
export function bindtextdomain(domain: string, ...localesDirs: string[]): Record<string, Catalog>;
/**
 * Load PO translations from `dir`.
 * `dir` should be structured like <dir>/<locale>.po.
 * @param {string} dir
 */
export function loadTranslations(dir: string): Record<string, Catalog>;
import type { Catalog } from "./gettext.js";
//# sourceMappingURL=loaders.d.ts.map