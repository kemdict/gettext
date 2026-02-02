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
    const parsedMap = new Map<
        string,
        Record<string, Record<string, GetTextTranslations>>
    >();
    return {
        name: "mo",
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
                    if (!file.endsWith(".mo")) continue;
                    const content = await fs.readFile(file);
                    const key = path.basename(file);
                    catalogs[key] = {
                        messages: moParser.parse(
                            content,
                            options.defaultCharset,
                        ),
                    };
                }
                if (Object.keys(catalogs).length === 0) {
                    this.warn(`${source} imported but has no MO files in it`);
                    return null;
                }
                parsedMap.set(fulldir, catalogs);
                return fulldir + "?gettext-mo-dir";
            } catch (_e) {
                return null;
            }
        },
        load: {
            filter: {
                id: /(?:\.mo|\?gettext-mo-dir)$/,
            },
            async handler(id) {
                const parsed = id.endsWith("?gettext-mo-dir")
                    ? parsedMap.get(id.slice(0, -1 * "?gettext-mo-dir".length))
                    : moParser.parse(
                          await fs.readFile(id),
                          options.defaultCharset,
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
