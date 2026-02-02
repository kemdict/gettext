import path from "node:path";
import fs from "node:fs/promises";

import { createFilter, dataToEsm } from "@rollup/pluginutils";
import {
    po as poParser,
    mo as moParser,
    type GetTextPoParserOptions,
    type GetTextTranslations,
} from "gettext-parser";
import type { Plugin } from "rollup";

interface MoPluginOptions {
    defaultCharset?: string;
}

interface PoPluginOptions {
    parserOptions?: GetTextPoParserOptions;
}

export function po(options: PoPluginOptions = {}): Plugin {
    const parsedMap = new Map<
        string,
        Record<string, Record<string, GetTextTranslations>>
    >();
    return {
        name: "po",
        async resolveId(source, importer) {
            if (!importer) return null;
            try {
                const fulldir = path.join(path.dirname(importer), source);
                // if it doesn't exist that just means we shouldn't handle it
                const files = await fs.readdir(fulldir);
                const catalogs: Record<
                    string,
                    Record<string, GetTextTranslations>
                > = {};
                for (const file of files) {
                    if (!file.endsWith(".po")) continue;
                    const content = await fs.readFile(file, {
                        encoding: "utf8",
                    });
                    const key = path.basename(file);
                    catalogs[key] = { messages: poParser.parse(content) };
                }
                if (Object.keys(catalogs).length === 0) {
                    this.warn(`${source} imported but has no PO files in it`);
                    return null;
                }
                parsedMap.set(fulldir, catalogs);
                return fulldir + "?gettext-po-dir";
            } catch (_e) {
                return null;
            }
        },
        load: {
            filter: {
                id: /(?:\.po|\?gettext-po-dir)$/,
            },
            async handler(id) {
                const parsed = id.endsWith("?gettext-po-dir")
                    ? parsedMap.get(id.slice(0, -1 * "?gettext-po-dir".length))
                    : poParser.parse(
                          await fs.readFile(id, { encoding: "utf8" }),
                          options.parserOptions,
                      );
                return dataToEsm(parsed, {
                    preferConst: true,
                    compact: true,
                    namedExports: false,
                });
            },
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
