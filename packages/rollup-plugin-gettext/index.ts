import { createFilter, dataToEsm, FilterPattern } from "@rollup/pluginutils";
import {
    type GetTextPoParserOptions,
    po as poParser,
    mo as moParser,
} from "gettext-parser";

interface MoPluginOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
    defaultCharset?: string;
}

interface PoPluginOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
    parserOptions?: GetTextPoParserOptions;
}

export function po(options: PoPluginOptions = {}) {
    const filter = createFilter(options?.include, options?.exclude);
    return {
        name: "po",
        transform(code: string, id: string) {
            if (!/\.po$/.test(id) || !filter(id)) return;
            try {
                const parsed = poParser.parse(code, options.parserOptions);
                return {
                    code: dataToEsm(parsed, {
                        preferConst: true,
                        compact: true,
                        namedExports: false,
                    }),
                    map: { mappings: "" },
                };
            } catch (e) {
                return null;
            }
        },
    };
}

export function mo(options: MoPluginOptions = {}) {
    const filter = createFilter(options?.include, options?.exclude);
    return {
        name: "mo",
        transform(code: string, id: string) {
            if (!/\.mo$/.test(id) || !filter(id)) return;
            try {
                const parsed = moParser.parse(code, options.defaultCharset);
                return {
                    code: dataToEsm(parsed, {
                        preferConst: true,
                        compact: true,
                        namedExports: false,
                    }),
                    map: { mappings: "" },
                };
            } catch (e) {
                return null;
            }
        },
    };
}
