import { po, mo } from "rollup-plugin-gettext";

export default {
    plugins: [po(), mo()],
};
