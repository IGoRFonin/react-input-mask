import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [react()],
  // Vite 8 uses oxc by default. The oxc plugin defaults to exclude: /\.js$/
  // so .js files with JSX (in src/ and tests/) are not processed.
  // `lang: "jsx"` is not in the public OxcOptions type but works at runtime —
  // it overrides extension-based lang detection so .js files are parsed as JSX.
  oxc: {
    include: [/src\/.*\.js$/, /tests\/.*\.js$/, /\.[jt]sx$/],
    // @ts-ignore — lang is intentionally excluded from public OxcOptions
    lang: "jsx",
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
            provider: playwright(),
            instances: [{ browser: "chromium", launch: { headless: true } }],
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
