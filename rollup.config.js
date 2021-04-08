import svelte from "rollup-plugin-svelte";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-bundle-size";
import typescript from "@rollup/plugin-typescript";
import autoPreprocess from "svelte-preprocess";

const isProduction = !process.env.ROLLUP_WATCH;

const plugins = [
  svelte({ emitCss: false, preprocess: autoPreprocess() }),
  nodeResolve({ browser: true, dedupe: ["svelte"] }),
  commonjs(),
  typescript({ sourceMap: true })
];

if (isProduction) {
  plugins.push(terser(), filesize());
}

export default {
  input: "js/index.ts",
  output: {
    name: "checkboxes",
    file: "assets/js/bundle.js",
    format: "iife",
    sourcemap: true
  },
  plugins
};
