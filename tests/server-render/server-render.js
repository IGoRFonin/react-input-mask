import { createRequire } from "node:module";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { describe, it, expect } from "vitest";

const require = createRequire(import.meta.url);
// корневой index.js — CJS-переключатель dev/prod сборки из lib/
// eslint-disable-next-line import/extensions
const InputElement = require("../../index.js");

describe("Test prerender", () => {
  it("should return a string", () => {
    const result = ReactDOMServer.renderToString(
      <InputElement value="some" mask="799" />,
    );
    expect(typeof result).to.equal("string");
  });
});
