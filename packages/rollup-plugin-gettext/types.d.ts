// The imports here cannot be top level, since that turns this file into a
// module and the module declarations below into module augmentations.
declare module "*.po" {
    import { GetTextTranslations } from "gettext-parser";
    const value: GetTextTranslations;
    export default value;
}
declare module "*.mo" {
    import { GetTextTranslations } from "gettext-parser";
    const value: GetTextTranslations;
    export default value;
}
// Our patterns here overlap with each other.
// Should "po:foo.po" match "*.po" or "po:*"?
// I need it to match as "*.po", but typescript favors "po:*", as it favors
// favors matches with longer prefixes:
// https://github.com/microsoft/TypeScript/blob/01c23d68b1/src/compiler/core.ts#L2410
//
// Declaring "po:*.po" here will make sure "po:foo.po" gets the single-file
// type. It seems that when two patterns have the same prefix length, the one
// that is declared first is the one that is used.
declare module "po:*.po" {
    import { GetTextTranslations } from "gettext-parser";
    const value: GetTextTranslations;
    export default value;
}
declare module "mo:*.mo" {
    import { GetTextTranslations } from "gettext-parser";
    const value: GetTextTranslations;
    export default value;
}
declare module "po:*" {
    import { GetTextTranslations } from "gettext-parser";
    const value: Record<string, GetTextTranslations>;
    export default value;
}
declare module "mo:*" {
    import { GetTextTranslations } from "gettext-parser";
    const value: Record<string, GetTextTranslations>;
    export default value;
}
