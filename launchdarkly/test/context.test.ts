import assert from "node:assert/strict";
import test from "node:test";

import {
  Context,
  DomainError,
  SIMULATOR_TOKEN,
  type FlagEnvironmentConfig,
} from "../routes/_.context.js";
import { reset } from "../scenarios/index.js";

function context(): Context {
  return new Context({} as never);
}

function scenarioContext(value: Context) {
  return {
    context: value,
    loadContext: () => value,
    routes: {},
    route: () => ({}),
  } as never;
}

async function baseline(): Promise<Context> {
  const value = context();
  await reset(scenarioContext(value));
  return value;
}

test("reset installs deterministic projects, environments, flags, and standard segments", async () => {
  const value = await baseline();

  assert.deepEqual(
    value.listProjects().map((project) => project.key),
    ["commerce-platform", "internal-tools"],
  );
  assert.equal(value.listEnvironments("commerce-platform").length, 3);
  assert.equal(value.listFlags("commerce-platform").length, 12);
  assert.equal(value.listFlags("internal-tools").length, 2);
  assert.equal(value.listSegments("commerce-platform", "production").length, 3);
  assert.ok(
    value
      .listSegments("commerce-platform", "production")
      .every((segment) => segment.unbounded === false),
  );
});

test("reads return clones and authentication uses only the fixed simulator token", async () => {
  const value = await baseline();
  const project = value.getProject("commerce-platform");
  project.name = "Mutation outside context";

  assert.equal(value.getProject("commerce-platform").name, "Commerce Platform");
  assert.equal(value.isAuthorized(SIMULATOR_TOKEN), true);
  assert.equal(value.isAuthorized("wrong-token"), false);
  assert.equal(value.isAuthorized(undefined), false);
});

test("CRUD preserves parent relationships and reports explicit domain errors", async () => {
  const value = await baseline();
  value.createEnvironment("commerce-platform", {
    key: "demo",
    name: "Demo",
    color: "eb5757",
  });
  const flag = value.createFlag("commerce-platform", {
    key: "demo-banner",
    name: "Demo banner",
  });
  value.createSegment("commerce-platform", "demo", {
    key: "sales-engineers",
    name: "Sales engineers",
  });

  assert.ok(flag.environments.demo);
  assert.equal(
    value.patchEnvironment("commerce-platform", "demo", [
      { op: "replace", path: "/name", value: "Customer demo" },
    ]).name,
    "Customer demo",
  );
  assert.equal(
    value.patchSegment("commerce-platform", "demo", "sales-engineers", {
      patch: [{ op: "add", path: "/included/-", value: "user-casey" }],
    }).included?.[0],
    "user-casey",
  );

  assert.throws(
    () =>
      value.createSegment("commerce-platform", "demo", {
        key: "large-import",
        name: "Large import",
        unbounded: true,
      }),
    (error) =>
      error instanceof DomainError &&
      error.status === 400 &&
      error.detail.code === "invalid_request",
  );
});

test("feature flag semantic updates are atomic and dry runs do not persist or bump version", async () => {
  const value = await baseline();
  const before = value.getFlag("commerce-platform", "checkout-redesign");
  const semanticContentType =
    "application/json; domain-model=launchdarkly.semanticpatch";

  const preview = value.patchFlag(
    "commerce-platform",
    "checkout-redesign",
    {
      environmentKey: "production",
      instructions: [
        { kind: "turnFlagOn" },
        {
          kind: "addTargets",
          variationId: before.variations[0]!._id,
          values: ["user-preview"],
        },
      ],
    },
    { dryRun: true, contentType: semanticContentType },
  );

  assert.equal(
    (preview.environments.production as FlagEnvironmentConfig).on,
    true,
  );
  assert.equal(
    value.getFlag("commerce-platform", "checkout-redesign")._version,
    before._version,
  );
  assert.equal(
    (
      value.getFlag("commerce-platform", "checkout-redesign").environments
        .production as FlagEnvironmentConfig
    ).on,
    false,
  );

  assert.throws(
    () =>
      value.patchFlag(
        "commerce-platform",
        "checkout-redesign",
        {
          instructions: [
            { kind: "updateName", value: "Should roll back" },
            { kind: "validButUnsupportedInstruction" },
          ],
        },
        { contentType: semanticContentType },
      ),
    (error) => error instanceof DomainError && error.status === 400,
  );
  assert.equal(
    value.getFlag("commerce-platform", "checkout-redesign").name,
    before.name,
  );
});

test("JSON and merge patches persist once and statuses are derived by environment", async () => {
  const value = await baseline();
  const before = value.getFlag("commerce-platform", "checkout-redesign");

  value.patchFlag("commerce-platform", "checkout-redesign", {
    patch: [
      { op: "replace", path: "/description", value: "A revised checkout" },
    ],
  });
  const merged = value.patchFlag(
    "commerce-platform",
    "checkout-redesign",
    { merge: { tags: ["checkout", "candidate"] } },
    { contentType: "application/merge-patch+json" },
  );

  assert.equal(merged._version, before._version + 2);
  assert.deepEqual(merged.tags, ["checkout", "candidate"]);
  assert.equal(
    value.getFlagStatus("commerce-platform", "production", "checkout-redesign")
      .name,
    "inactive",
  );
  assert.deepEqual(
    Object.keys(
      value.getFlagStatusesAcrossEnvironments(
        "commerce-platform",
        "checkout-redesign",
      ).environments,
    ),
    ["production", "staging", "development"],
  );
});
