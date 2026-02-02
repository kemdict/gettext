// @ts-check
import { defineConfig } from "astro/config";
import { po, mo } from "rollup-plugin-gettext";

export default defineConfig({
  i18n: {
    locales: ["en", "zh_TW"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  vite: { plugins: [po(), mo()] },
});
