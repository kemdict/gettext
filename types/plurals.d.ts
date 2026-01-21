/**
 * "Parse" the plural forms.
 *
 * Ideally this would actually parse it instead of using a lookup table, except
 * that would be too complicated and also questionably safe. So maybe using a
 * lookup table is fine.
 *
 * @param {string} pluralForms - The plural forms string from the header
 */
export function parsePluralForms(pluralForms: string): PluralFormsObj | undefined;
/**
 * Return the fallback plural forms for `locale`.
 *
 * If the locale with a region does not match, try without its region.
 * @param {string} locale - The locale to get the fallback value for.
 */
export function fallbackPluralForms(locale: string): PluralFormsObj;
import type { PluralFormsObj } from "./plural-data.js";
//# sourceMappingURL=plurals.d.ts.map