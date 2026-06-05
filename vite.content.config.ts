import { defineConfig } from "vite";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "src/utils/contentScripts.ts",
      formats: ["iife"],
      fileName: () => "contentScripts.js",
      name: "contentScripts.js",
    },
  },
  plugins: [babel({ presets: [reactCompilerPreset()] })],
});
