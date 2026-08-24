import assert from "node:assert/strict";
import test from "node:test";
import { codesOfConduct } from "../scenarios/index.ts";
import { createContext } from "../test-support/create-context.ts";
import type { Scenario$ } from "../types/_.context.ts";

test("Codes of Conduct context stores, sorts, and finds fixtures", () => {
  const context = createContext();
  context.saveCodeOfConduct({
    key: "contributor_covenant",
    name: "Contributor Covenant",
    url: "https://api.github.com/codes_of_conduct/contributor_covenant",
    html_url: "https://www.contributor-covenant.org/",
  });
  context.saveCodeOfConduct({
    key: "citizen_code_of_conduct",
    name: "Citizen Code of Conduct",
    url: "https://api.github.com/codes_of_conduct/citizen_code_of_conduct",
    html_url: "http://citizencodeofconduct.org/",
  });

  assert.deepEqual(
    context.listCodesOfConduct().map(({ key }) => key),
    ["citizen_code_of_conduct", "contributor_covenant"],
  );
  assert.equal(
    context.getCodeOfConduct("contributor_covenant")?.name,
    "Contributor Covenant",
  );
  assert.equal(context.getCodeOfConduct("missing"), undefined);
});

test("Codes of Conduct scenario is additive and idempotent", () => {
  const context = createContext();
  context.saveCodeOfConduct({
    key: "community_compact",
    name: "Community Compact",
    url: "https://api.example.test/codes_of_conduct/community_compact",
    html_url: "https://example.test/community-compact",
  });
  const $ = {
    context,
    loadContext: () => context,
    route: () => ({}),
    routes: {},
  } as unknown as Scenario$;

  codesOfConduct($);
  codesOfConduct($);

  assert.deepEqual(
    context.listCodesOfConduct().map(({ key }) => key),
    ["citizen_code_of_conduct", "community_compact", "contributor_covenant"],
  );
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
