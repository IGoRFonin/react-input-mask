import { createRequire } from "node:module";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { describe, it, expect } from "vitest";

const require = createRequire(import.meta.url);

describe("CommonJS build", () => {
  const InputElement = require("../../lib/react-input-mask.production.min.js");

  it("should return a string", () => {
    const result = ReactDOMServer.renderToString(
      <InputElement value="some" mask="799" />,
    );
    expect(typeof result).to.equal("string");
  });
});

describe("UMD build", () => {
  const InputElement = require("../../dist/react-input-mask.min.js");

  it("should return a string", () => {
    const result = ReactDOMServer.renderToString(
      <InputElement value="some" mask="799" />,
    );
    expect(typeof result).to.equal("string");
  });
});
