import { pluralFuncTable, localePluralForms } from "./plural-data.js";

// The function can only always return numbers or always return booleans
// regardless of the input.
/**
 * @import { PluralFormsObj } from "./plural-data.js";
 * @type PluralFormsObj
 */
const defaultPluralForms = {
    nplurals: 2,
    plural: (n) => n !== 1,
};

/**
 * "Parse" the plural forms.
 *
 * Ideally this would actually parse it instead of using a lookup table, except
 * that would be too complicated and also questionably safe. So maybe using a
 * lookup table is fine.
 *
 * @param {string} pluralForms - The plural forms string from the header
 */
export function parsePluralForms(pluralForms) {
    const normalized = pluralForms.replaceAll(/ |(?:;(?:\\n)?$)/g, "");
    const match = normalized.match(/^nplurals=(\d);plural=(.*)/);
    if (!match) {
        console.log(
            `Warning: matching pluralForms failed! Original value: ${pluralForms}`,
        );
        return undefined;
    }
    const nplurals = parseInt(match[1]);
    let pluralStr = match[2];
    if (!pluralStr.match(/^\(.*\)$/)) {
        pluralStr = "(" + pluralStr + ")";
    }

    const func = pluralFuncTable[pluralStr];
    if (func) {
        return {
            nplurals,
            plural: func,
        };
    }
    console.log(`Warning: unknown pluralForms! "${pluralForms}"`);
    return undefined;
}

/**
 * Return the fallback plural forms for `locale`.
 *
 * If the locale with a region does not match, try without its region.
 * @param {string} locale - The locale to get the fallback value for.
 */
export function fallbackPluralForms(locale) {
    const pluralForms =
        localePluralForms(locale) ||
        // if not found, try with underscore. GNU Gettext usually prefers underscore
        localePluralForms(locale.replace("-", "_")) ||
        // if not found, try the top level code. The top level code can only
        // be 2 ~ 3 characters.
        localePluralForms(locale.slice(0, 3).replace(/[-_]/, ""));
    if (pluralForms) return parsePluralForms(pluralForms);
    console.log(
        `Warning: no fallback plurals found for locale "${locale}". Using default plurals (Germanic).`,
    );
    return defaultPluralForms;
}
