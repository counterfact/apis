import assert from "node:assert/strict";
import test from "node:test";
import { createContextHarness } from "../test-support/create-context.ts";

test("licenses context exposes seeded licenses and supports lookup", () => {
  const { context } = createContextHarness();

  const licenses = context.listLicenses();
  assert.equal(licenses.length, 7);
  assert.equal(licenses[0]?.key, "apache-2.0");

  assert.equal(context.getLicense("mit")?.name, "MIT License");
  assert.equal(context.getLicense("MIT")?.spdx_id, "MIT");
});

test("licenses context filters featured licenses and paginates results", () => {
  const { context } = createContextHarness();

  const featured = context.listLicenses({ featured: "true" });
  assert.deepEqual(
    featured.map((license) => license.key),
    ["apache-2.0", "bsd-3-clause", "gpl-3.0", "mit"],
  );

  const paged = context.listLicenses({ per_page: "2", page: "2" });
  assert.deepEqual(
    paged.map((license) => license.key),
    ["gpl-3.0", "lgpl-3.0"],
  );
});
