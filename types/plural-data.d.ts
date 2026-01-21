/** @typedef {{
 *    nplurals: number;
 *    plural: ((n: number) => number) | ((n: number) => boolean)
 * }} PluralFormsObj */
/**
 * Lookup table for existing Plural-Forms expressions to "parsed" values
 * @type Record<string, PluralFormsObj>
 */
export const pluralTable: Record<string, PluralFormsObj>;
/**
 * Lookup table mapping locales to plural forms.
 * @type Record<string, PluralFormsObj>
 */
export const localePluralTable: Record<string, PluralFormsObj>;
export type PluralFormsObj = {
    nplurals: number;
    plural: ((n: number) => number) | ((n: number) => boolean);
};
//# sourceMappingURL=plural-data.d.ts.map