import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["lib/**", "dist/**", "node_modules/**", "docs/**"],
  },
  js.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat["recommended-latest"],
  prettierRecommended,
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/prop-types": "off",
      "react/display-name": "off",
      "no-console": ["warn", { allow: ["error"] }],
      "prefer-const": ["error", { destructuring: "all" }],
    },
  },
];
