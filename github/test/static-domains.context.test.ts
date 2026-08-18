import assert from "node:assert/strict";
import test from "node:test";
import { createContext } from "../test-support/create-context.ts";

test("Codes of Conduct context stores, sorts, and finds fixtures", () => {
  const context = createContext();
  context.saveCodeOfConduct({
    key: "mit",
    name: "MIT License",
    url: "https://api.github.com/codes_of_conduct/mit",
    html_url: "https://github.com/github/choosealicense.com",
  });
  context.saveCodeOfConduct({
    key: "apache-2.0",
    name: "Apache License 2.0",
    url: "https://api.github.com/codes_of_conduct/apache-2.0",
    html_url: "https://github.com/github/choosealicense.com",
  });

  assert.deepEqual(
    context.listCodesOfConduct().map(({ key }) => key),
    ["apache-2.0", "mit"],
  );
  assert.equal(context.getCodeOfConduct("mit")?.name, "MIT License");
  assert.equal(context.getCodeOfConduct("missing"), undefined);
});

test("Gitignore context stores sorted template names and sources", () => {
  const context = createContext();
  context.saveGitignoreTemplate({ name: "Python", source: "__pycache__/\n" });
  context.saveGitignoreTemplate({ name: "Node", source: "node_modules/\n" });

  assert.deepEqual(context.listGitignoreTemplates(), ["Node", "Python"]);
  assert.equal(context.getGitignoreTemplate("Node")?.source, "node_modules/\n");
  assert.equal(context.getGitignoreTemplate("Missing"), undefined);
});

test("Meta context returns a defensive copy of stable metadata", () => {
  const context = createContext();
  const saved = context.setApiOverview({
    verifiable_password_authentication: true,
    api: ["192.0.2.0/24"],
  });
  saved.api?.push("198.51.100.0/24");

  assert.deepEqual(context.getApiOverview().api, ["192.0.2.0/24"]);
});
