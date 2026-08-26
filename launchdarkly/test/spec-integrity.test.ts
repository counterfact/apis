import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import test from "node:test";

const snapshotUrl = new URL("../openapi.json", import.meta.url);
const provenanceUrl = new URL("../openapi.provenance.json", import.meta.url);

const expectedSnapshot = {
  openapiVersion: "3.0.3",
  releaseTag: "16.1.1",
  sha256: "fe58256eeef23f732d1ced02aacfcb943c9f7d38d90bb9fcf047266c1a4fb4bd",
  sourceKind: "release-asset",
  sourceUrl:
    "https://github.com/launchdarkly/ld-openapi/releases/download/16.1.1/openapi.json",
  pathCount: 166,
};

test("the vendored LaunchDarkly OpenAPI snapshot matches its provenance", async () => {
  const [snapshot, provenanceText] = await Promise.all([
    readFile(snapshotUrl),
    readFile(provenanceUrl, "utf8"),
  ]);
  const document = JSON.parse(snapshot.toString()) as {
    openapi?: unknown;
    paths?: unknown;
  };
  const provenance = JSON.parse(provenanceText) as Record<string, unknown>;

  assert.equal(
    fileURLToPath(snapshotUrl).endsWith("/launchdarkly/openapi.json"),
    true,
  );
  assert.equal(document.openapi, expectedSnapshot.openapiVersion);
  assert.equal(Array.isArray(document.paths), false);
  assert.equal(
    Object.keys(document.paths as object).length,
    expectedSnapshot.pathCount,
  );
  assert.deepEqual(provenance, {
    sourceUrl: expectedSnapshot.sourceUrl,
    sourceKind: expectedSnapshot.sourceKind,
    releaseTag: expectedSnapshot.releaseTag,
    retrievedAt: "2026-08-26T00:00:00.000Z",
    openapiVersion: expectedSnapshot.openapiVersion,
    sha256: expectedSnapshot.sha256,
  });
  assert.equal(
    createHash("sha256").update(snapshot).digest("hex"),
    expectedSnapshot.sha256,
  );
});
