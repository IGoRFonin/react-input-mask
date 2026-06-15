import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// When React 17 is installed, react-dom/client doesn't exist.
// Provide an empty stub so Vite's import-analysis doesn't error on the
// dynamic import in tests/helpers/react-render.js.
function reactDomClientFallbackPlugin() {
  const RESOLVED_ID = "\0virtual:react-dom-client-stub";
  let hasClient = true;
  try {
    require.resolve("react-dom/client");
  } catch {
    hasClient = false;
  }
  if (hasClient) return null;
  return {
    name: "react-dom-client-fallback",
    resolveId(id) {
      if (id === "react-dom/client") return RESOLVED_ID;
    },
    load(id) {
      if (id === RESOLVED_ID) return "export {};";
    },
  };
}

export default defineConfig({
  plugins: [react(), reactDomClientFallbackPlugin()].filter(Boolean),
  // Vite 8 uses oxc by default. The oxc plugin defaults to exclude: /\.js$/
  // so .js files with JSX (in src/, tests/ and the dev sandbox) are not
  // processed. `lang: "jsx"` is not in the public OxcOptions type but works at
  // runtime — it overrides extension-based lang detection so .js files are
  // parsed as JSX.
  oxc: {
    include: [/src\/.*\.js$/, /tests\/.*\.js$/, /dev\/.*\.js$/, /\.[jt]sx$/],
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
