// The fallback plurals of this file are from GNU Gettext's plural-table.c as
// well as converted from Unicode CLDR.

// FIXME obviously this is not ideal!

/**
 *  @typedef {((n: number) => number) | ((n: number) => boolean)} PluralFunc
 *  @typedef {{
 *    nplurals: number;
 *    plural: PluralFunc
 * }} PluralFormsObj */

/**
 * Lookup table for existing "plural=" expressions to "parsed" function values.
 * The keys are normalized to always start and end with parens to reduce (though
 * not eliminate) duplicate keys.
 * @type Record<string, PluralFunc>
 */
export const pluralFuncTable = {
    "(n==1?0:n==2?1:n==0||(n%100>=3&&n%100<=10)?2:n%100>=11&&n%100<=19?3:4)": (
        n,
    ) =>
        n == 1
            ? 0
            : n == 2
              ? 1
              : n == 0 || (n % 100 >= 3 && n % 100 <= 10)
                ? 2
                : n % 100 >= 11 && n % 100 <= 19
                  ? 3
                  : 4,
    "(n%10==1&&n%100!=11)": (n) => n % 10 == 1 && n % 100 != 11,
    "(n==0?0:n==1?1:n==2?2:n%100>=3&&n%100<=10?3:n%100>=11&&n%100<=99?4:5)": (
        n,
    ) =>
        n == 0
            ? 0
            : n == 1
              ? 1
              : n == 2
                ? 2
                : n % 100 >= 3 && n % 100 <= 10
                  ? 3
                  : n % 100 >= 11 && n % 100 <= 99
                    ? 4
                    : 5,
    "((n==1)?0:(n>=2&&n<=4)?1:2)": (n) =>
        n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2,
    "((n==1||n==11)?0:(n==2||n==12)?1:(n>2&&n<20)?2:3)": (n) =>
        n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3,
    "(0)": () => 0,
    "(1)": () => 1,
    "(n!=1)": (n) => n != 1,
    "(n%100==1?0:n%100==2?1:n%100==3||n%100==4?2:3)": (n) =>
        n % 100 == 1
            ? 0
            : n % 100 == 2
              ? 1
              : n % 100 == 3 || n % 100 == 4
                ? 2
                : 3,
    "(n%100==1?0:n%100==2?1:n%100>=3&&n%100<=4?2:3)": (n) =>
        n % 100 == 1
            ? 0
            : n % 100 == 2
              ? 1
              : n % 100 >= 3 && n % 100 <= 4
                ? 2
                : 3,
    "(n%100==1?1:n%100==2?2:n%100==3||n%100==4?3:0)": (n) =>
        n % 100 == 1
            ? 1
            : n % 100 == 2
              ? 2
              : n % 100 == 3 || n % 100 == 4
                ? 3
                : 0,
    "(n%10==1&&n%100!=11?0:n!=0?1:2)": (n) =>
        n % 10 == 1 && n % 100 != 11 ? 0 : n != 0 ? 1 : 2,
    "(n%10==1&&n%100!=11?0:n%10>=2&&(n%100<10||n%100>=20)?1:2)": (n) =>
        n % 10 == 1 && n % 100 != 11
            ? 0
            : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)
              ? 1
              : 2,
    "(n%10==1&&n%100!=11?0:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?1:2)": (
        n,
    ) =>
        n % 10 == 1 && n % 100 != 11
            ? 0
            : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
              ? 1
              : 2,
    "(n%10==1&&n%100!=11?0:n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?1:n%10==0||n%10>=5&&n%10<=9||n%100>=11&&n%100<=14?2:3)":
        (n) =>
            n % 10 == 1 && n % 100 != 11
                ? 0
                : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)
                  ? 1
                  : n % 10 == 0 ||
                      (n % 10 >= 5 && n % 10 <= 9) ||
                      (n % 100 >= 11 && n % 100 <= 14)
                    ? 2
                    : 3,
    "(n%10==1?0:n%10==2?1:2)": (n) => (n % 10 == 1 ? 0 : n % 10 == 2 ? 1 : 2),
    "(n==0?0:n==1?1:n==2?2:3)": (n) =>
        n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : 3,
    "(n==0?0:n==1?1:n==2?2:n%100>=3&&n%100<=10?3:n%100>=11?4:5)": (n) =>
        n == 0
            ? 0
            : n == 1
              ? 1
              : n == 2
                ? 2
                : n % 100 >= 3 && n % 100 <= 10
                  ? 3
                  : n % 100 >= 11
                    ? 4
                    : 5,
    "(n==0||n==1)": (n) => n == 0 || n == 1,
    "(n==1)?0:((n==2)?1:((n>10&&n%10==0)?2:3))": (n) =>
        n == 1 ? 0 : n == 2 ? 1 : n > 10 && n % 10 == 0 ? 2 : 3,
    "(n==1?0:(n==0||(n%100>0&&n%100<20))?1:2)": (n) =>
        n == 1 ? 0 : n == 0 || (n % 100 > 0 && n % 100 < 20) ? 1 : 2,
    "(n==1?0:n%10>=2&&(n%100<10||n%100>=20)?1:n%10==0||(n%100>10&&n%100<20)?2:3)":
        (n) =>
            n == 1
                ? 0
                : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20)
                  ? 1
                  : n % 10 == 0 || (n % 100 > 10 && n % 100 < 20)
                    ? 2
                    : 3,
    "(n==1?0:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?1:2)": (n) =>
        n == 1
            ? 0
            : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
              ? 1
              : 2,
    "(n==1?0:n==2?1:2)": (n) => (n == 1 ? 0 : n == 2 ? 1 : 2),
    "(n==1?0:n==2?1:n<7?2:n<11?3:4)": (n) =>
        n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4,
    "(n==1?3:n%10==1&&n%100!=11?0:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?1:2)":
        (n) =>
            n == 1
                ? 3
                : n % 10 == 1 && n % 100 != 11
                  ? 0
                  : n % 10 >= 2 &&
                      n % 10 <= 4 &&
                      (n % 100 < 10 || n % 100 >= 20)
                    ? 1
                    : 2,
    "(n>1)": (n) => n > 1,
    "(n>2)": (n) => n > 2,
};

// from Gettext's plural-table.c
// prettier-ignore
const pluralTable = {
    "ja vi ko": "nplurals=1; plural=0;",
    "en de nl sv da no nb nn fo es pt it bg el fi et he eo hu tr ca": "nplurals=2; plural=(n != 1);",
    "pt_BR fr": "nplurals=2; plural=(n > 1);",
    "lv": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2);",
    "ga": "nplurals=3; plural=n==1 ? 0 : n==2 ? 1 : 2;",
    "ro": "nplurals=3; plural=n==1 ? 0 : (n==0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2;",
    "lt": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2);",
    "ru uk be sr hr": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);",
    "cs sk": "nplurals=3; plural=(n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2;",
    "pl": "nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);",
    "sl": "nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100==3 || n%100==4 ? 2 : 3);",
};

// from Unicode CLDR (plurals.xml), converted with Gettext's cldr-plurals program
// prettier-ignore
const cldrPlurals = {
    "bm bo dz hnj id ig ii in ja jbo jv jw kde kea km ko lkt lo ms my nqo osa root sah ses sg su th to tpi vi wo yo yue zh":
        "nplurals=1; plural=0;",
    "am as bn doi fa gu hi kn kok kok_Latn pcm zu":
        "nplurals=2; plural=(n==0 || n==1);",
    "ff hy kab": "nplurals=2; plural=(n > 1);",
    "ast de en et fi fy gl ia ie io ji lij nl sc sv sw ur yi":
        "nplurals=2; plural=(n != 1);",
    "si": "nplurals=2; plural=(n > 1);",
    "ak bho csw guw ln mg nso pa ti wa": "nplurals=2; plural=(n > 1);",
    "tzm": "nplurals=2; plural=(n<=1 || (n>=11 && n<=99));",
    "af an asa az bal bem bez bg brx ce cgg chr ckb dv ee el eo eu fo fur gsw ha haw hu jgo jmc ka kaj kcg kk kkj kl ks ksb ku ky lb lg mas mgo ml mn mr nah nb nd ne nn nnh no nr ny nyn om or os pap ps rm rof rwk saq sd sdh seh sn so sq ss ssy st syr ta te teo tig tk tn tr ts ug uz ve vo vun wae xh xog":
        "nplurals=2; plural=(n != 1);",
    "da": "nplurals=2; plural=(n != 1);",
    "is": "nplurals=2; plural=(n%10==1 && n%100!=11);",
    "mk": "nplurals=2; plural=(n%10==1 && n%100!=11);",
    "ceb fil tl":
        "nplurals=2; plural=(n==1 || n==2 || n==3 || (n%10!=4 && n%10!=6 && n%10!=9));",
    "lv prg":
        "nplurals=3; plural=(n%10==0 || (n%100>=11 && n%100<=19) ? 0 : n%10==1 && n%100!=11 ? 1 : 2);",
    "lag": "nplurals=3; plural=(n==0 ? 0 : (n==0 || n==1) && n!=0 ? 1 : 2);",
    "blo cv ksh": "nplurals=3; plural=(n==0 ? 0 : n==1 ? 1 : 2);",
    "he iw": "nplurals=3; plural=(n==1 ? 0 : n==2 ? 1 : 2);",
    "iu naq sat se sma smi smj smn sms":
        "nplurals=3; plural=(n==1 ? 0 : n==2 ? 1 : 2);",
    "shi": "nplurals=3; plural=(n==0 || n==1 ? 0 : n>=2 && n<=10 ? 1 : 2);",
    "mo ro":
        "nplurals=3; plural=(n==1 ? 0 : n==0 || (n!=1 && n%100>=1 && n%100<=19) ? 1 : 2);",
    "bs hr sh sr":
        "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : 2);",
    "fr": "nplurals=3; plural=(n==0 || n==1 ? 0 : n!=0 && n%1000000==0 ? 1 : 2);",
    "pt": "nplurals=3; plural=(n<=1 ? 0 : n!=0 && n%1000000==0 ? 1 : 2);",
    "ca it lld pt_PT scn vec":
        "nplurals=3; plural=(n==1 ? 0 : n!=0 && n%1000000==0 ? 1 : 2);",
    "es": "nplurals=3; plural=(n==1 ? 0 : n!=0 && n%1000000==0 ? 1 : 2);",
    "gd": "nplurals=4; plural=(n==1 || n==11 ? 0 : n==2 || n==12 ? 1 : (n>=3 && n<=10) || (n>=13 && n<=19) ? 2 : 3);",
    "sl": "nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100>=3 && n%100<=4 ? 2 : 3);",
    "dsb hsb":
        "nplurals=4; plural=(n%100==1 ? 0 : n%100==2 ? 1 : n%100>=3 && n%100<=4 ? 2 : 3);",
    "cs sk": "nplurals=3; plural=(n==1 ? 0 : n>=2 && n<=4 ? 1 : 2);",
    "pl": "nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : 2);",
    "be": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : 2);",
    "lt": "nplurals=3; plural=(n%10==1 && (n%100<11 || n%100>19) ? 0 : n%10>=2 && n%10<=9 && (n%100<11 || n%100>19) ? 1 : 2);",
    "ru uk":
        "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : 2);",
    "sgs": "nplurals=4; plural=(n%10==1 && n%100!=11 ? 0 : n==2 ? 1 : n!=2 && n%10>=2 && n%10<=9 && (n%100<11 || n%100>19) ? 2 : 3);",
    "br": "nplurals=5; plural=(n%10==1 && n%100!=11 && n%100!=71 && n%100!=91 ? 0 : n%10==2 && n%100!=12 && n%100!=72 && n%100!=92 ? 1 : ((n%10>=3 && n%10<=4) || n%10==9) && (n%100<10 || n%100>19) && (n%100<70 || n%100>79) && (n%100<90 || n%100>99) ? 2 : n!=0 && n%1000000==0 ? 3 : 4);",
    "mt": "nplurals=5; plural=(n==1 ? 0 : n==2 ? 1 : n==0 || (n%100>=3 && n%100<=10) ? 2 : n%100>=11 && n%100<=19 ? 3 : 4);",
    "ga": "nplurals=5; plural=(n==1 ? 0 : n==2 ? 1 : n>=3 && n<=6 ? 2 : n>=7 && n<=10 ? 3 : 4);",
    "gv": "nplurals=4; plural=(n%10==1 ? 0 : n%10==2 ? 1 : n%100==0 || n%100==20 || n%100==40 || n%100==60 || n%100==80 ? 2 : 3);",
    "kw": "nplurals=6; plural=(n==0 ? 0 : n==1 ? 1 : n%100==2 || n%100==22 || n%100==42 || n%100==62 || n%100==82 || (n%1000==0 && ((n%100000>=1000 && n%100000<=20000) || n%100000==40000 || n%100000==60000 || n%100000==80000)) || (n!=0 && n%1000000==100000) ? 2 : n%100==3 || n%100==23 || n%100==43 || n%100==63 || n%100==83 ? 3 : n!=1 && (n%100==1 || n%100==21 || n%100==41 || n%100==61 || n%100==81) ? 4 : 5);",
    "ar ars":
        "nplurals=6; plural=(n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 && n%100<=99 ? 4 : 5);",
    "cy": "nplurals=6; plural=(n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n==3 ? 3 : n==6 ? 4 : 5);",
};

/**
 * Lookup table mapping locales to plural forms.
 * @param {string} locale - The locale to look up.
 */
export function localePluralForms(locale) {
    // Try gettext's first
    for (const [langs, value] of Object.entries(pluralTable)) {
        if (langs.split(" ").includes(locale)) return value;
    }
    // Then try CLDR
    for (const [langs, value] of Object.entries(cldrPlurals)) {
        if (langs.split(" ").includes(locale)) return value;
    }
}
