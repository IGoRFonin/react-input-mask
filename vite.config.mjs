import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [react()],
  // Vite 8 uses oxc by default. The oxc plugin defaults to exclude: /\.js$/
  // so .js files are not processed by the JSX transform.
  // Setting `include` to a broad pattern overrides that default exclusion.
  // Setting `lang: "jsx"` (not in the public type but supported at runtime)
  // ensures the oxc parser treats all included files as JSX source.
  oxc: {
    include: [/src\/.*\.js$/, /tests\/.*\.js$/, /dev\/.*\.js$/, /\.[jt]sx$/],
    // @ts-ignore — lang is excluded from OxcOptions type but works at runtime
    lang: "jsx",
    jsx: { runtime: "automatic", importSource: "react" },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "browser",
          include: ["tests/input/**/*.test.js"],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["tests/server-render/**/*.js", "tests/build/**/*.js"],
        },
      },
    ],
  },
});
