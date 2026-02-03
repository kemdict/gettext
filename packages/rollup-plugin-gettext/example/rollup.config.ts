import { po, mo } from "rollup-plugin-gettext";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
    plugins: [po(), mo(), nodeResolve()],
};
