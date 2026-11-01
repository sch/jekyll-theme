import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    ignorePatterns: ["assets/js/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns: ["assets/js/**", "_layouts/**"],
  },
  publicDir: false,
  build: {
    outDir: "assets/js",
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: "js/index.ts",
      name: "checkboxes",
      formats: ["iife"],
      fileName: () => "bundle.js",
    },
  },
});
