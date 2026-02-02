import path from "node:path";

import {
    createFilter,
    dataToEsm,
    type FilterPattern,
} from "@rollup/pluginutils";
import {
    po as poParser,
    mo as moParser,
    type GetTextPoParserOptions,
    type GetTextTranslations,
} from "gettext-parser";
import type { Plugin } from "rollup";

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

export function po(options: PoPluginOptions = {}): Plugin {
    const filter = createFilter(options?.include, options?.exclude);
    return {
        name: "po",
        async resolveId(source, importer, { attributes }) {
            if (!(filter(source) && attributes.type === "po")) return null;
            if (!importer) return null;
            const files = await this.fs.readdir(path.dirname(importer));
            const catalogs: Record<
                string,
                Record<string, GetTextTranslations>
            > = {};
            for (const file of files) {
                const content = await this.fs.readFile(file, {
                    encoding: "utf8",
                });
                const key = path.basename(file);
                catalogs[key] = { messages: poParser.parse(content) };
            }
        },
        load(id) {
            // for some reason the type I import from Rollup does not include
            // the options argument, even though they are documented and do
            // indeed show up at runtime
            // this works around that
            const type = arguments[2]?.attributes?.type;
            if (type !== "po") return;
        },
        transform(code, id) {
            const type = arguments[2]?.attributes?.type;
            if (!((type === "po" || /\.po$/.test(id)) && filter(id))) return;
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

export function mo(options: MoPluginOptions = {}): Plugin {
    const filter = createFilter(options?.include, options?.exclude);
    return {
        name: "mo",
        transform(code, id) {
            const type = arguments[2]?.attributes?.type;
            if (!((type === "mo" || /\.mo$/.test(id)) && filter(id))) return;
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
