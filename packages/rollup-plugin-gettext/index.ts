import path from "node:path";
import fs from "node:fs/promises";

import { dataToEsm } from "@rollup/pluginutils";
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
        // This is just for a directory of PO files. A single PO file gets the
        // standard resolution.
        resolveId: {
            filter: { id: /^po:/ },
            // handle prefixed directory imports and prefixed file imports
            async handler(source, importer) {
                if (!importer) return null;
                const fullpath = path.join(
                    path.dirname(importer),
                    source.slice("po:".length),
                );
                try {
                    // prefixed directories
                    const files = await fs.readdir(fullpath);
                    const catalogs: Record<
                        string,
                        Record<string, GetTextTranslations>
                    > = {};
                    for (const file of files) {
                        if (!file.endsWith(".po")) continue;
                        const content = await fs.readFile(
                            path.join(fullpath, file),
                            {
                                encoding: "utf8",
                            },
                        );
                        const key = path.basename(file, ".po");
                        // TODO: get rid of domains like python's gettext
                        catalogs[key] = {
                            messages: poParser.parse(content),
                        };
                    }
                    if (Object.keys(catalogs).length === 0) {
                        return null;
                    }
                    parsedMap.set(fullpath, catalogs);
                    return fullpath + "?gettext-po-dir";
                } catch (e) {
                    if ((e as { code: string }).code !== "ENOTDIR") return null;
                    // prefixed files, we need to resolve this here for
                    // absolute paths
                    return fullpath + "?gettext-po-file";
                }
            },
        },
        load: {
            filter: {
                id: /(?:\.po|\?gettext-po-dir|\?gettext-po-file)$/,
            },
            async handler(id) {
                // 3 cases:
                const parsed = id.endsWith("?gettext-po-dir")
                    ? // 1: prefixed directory imports, which would have the ID
                      // resolved like this in our resolveId
                      parsedMap.get(id.slice(0, -1 * "?gettext-po-dir".length))
                    : poParser.parse(
                          await fs.readFile(
                              id.endsWith("?gettext-po-file")
                                  ? // 2: prefixed file imports, strip the prefix
                                    id.slice(0, -1 * "?gettext-po-file".length)
                                  : // 3: unprefixed file imports, use the file
                                    // path directly
                                    id,
                              { encoding: "utf8" },
                          ),
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
        resolveId: {
            filter: { id: /^mo:/ },
            async handler(source, importer) {
                if (!importer) return null;
                const fullpath = path.join(
                    path.dirname(importer),
                    source.slice("mo:".length),
                );
                try {
                    // prefixed directories
                    const files = await fs.readdir(fullpath);
                    const catalogs: Record<
                        string,
                        Record<string, GetTextTranslations>
                    > = {};
                    for (const file of files) {
                        if (!file.endsWith(".mo")) continue;
                        const content = await fs.readFile(
                            path.join(fullpath, file),
                        );
                        const key = path.basename(file, ".mo");
                        // TODO: get rid of domains like python's gettext
                        catalogs[key] = {
                            messages: moParser.parse(
                                content,
                                options.defaultCharset,
                            ),
                        };
                    }
                    if (Object.keys(catalogs).length === 0) {
                        return null;
                    }
                    parsedMap.set(fullpath, catalogs);
                    return fullpath + "?gettext-mo-dir";
                } catch (e) {
                    if ((e as { code: string }).code !== "ENOTDIR") return null;
                    // prefixed files, we need to resolve this here for
                    // absolute paths
                    return fullpath + "?gettext-mo-file";
                }
            },
        },
        load: {
            filter: {
                id: /(?:\.mo|\?gettext-mo-dir|\?gettext-mo-file)$/,
            },
            async handler(id) {
                // 3 cases:
                const parsed = id.endsWith("?gettext-mo-dir")
                    ? // 1: prefixed directory imports, which would have the ID
                      // resolved like this in our resolveId
                      parsedMap.get(id.slice(0, -1 * "?gettext-mo-dir".length))
                    : moParser.parse(
                          await fs.readFile(
                              id.endsWith("?gettext-mo-file")
                                  ? // 2: prefixed file imports, strip the prefix
                                    id.slice(0, -1 * "?gettext-mo-file".length)
                                  : // 3: unprefixed file imports, use the file
                                    // path directly
                                    id,
                          ),
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
