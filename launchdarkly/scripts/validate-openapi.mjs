import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const specificationPath = resolve(packageDirectory, "openapi.json");
const provenancePath = resolve(packageDirectory, "openapi.provenance.json");
const liveSourceUrl = "https://app.launchdarkly.com/api/v2/openapi.json";
const releaseAssetUrl =
  "https://github.com/launchdarkly/ld-openapi/releases/download/16.1.1/openapi.json";

const [body, provenanceText] = await Promise.all([
  readFile(specificationPath),
  readFile(provenancePath, "utf8"),
]);
const document = JSON.parse(body.toString("utf8"));
const provenance = JSON.parse(provenanceText);
const sha256 = createHash("sha256").update(body).digest("hex");

if (document.openapi !== "3.0.3") {
  throw new Error(
    `Expected OpenAPI 3.0.3 but found ${String(document.openapi)}.`,
  );
}
if (
  provenance.sourceUrl !== liveSourceUrl &&
  provenance.sourceUrl !== releaseAssetUrl
) {
  throw new Error(`Unexpected source URL: ${String(provenance.sourceUrl)}.`);
}
if (
  provenance.sourceUrl === releaseAssetUrl &&
  (provenance.sourceKind !== "release-asset" ||
    provenance.releaseTag !== "16.1.1")
) {
  throw new Error("The release-asset provenance is missing its expected tag.");
}
if (
  provenance.sourceUrl === liveSourceUrl &&
  provenance.sourceKind !== "live-api"
) {
  throw new Error("The live API provenance is missing its source kind.");
}
if (provenance.openapiVersion !== document.openapi) {
  throw new Error(
    "The provenance OpenAPI version does not match the snapshot.",
  );
}
if (provenance.sha256 !== sha256) {
  throw new Error("The snapshot SHA-256 does not match its provenance record.");
}
if (
  typeof provenance.retrievedAt !== "string" ||
  Number.isNaN(Date.parse(provenance.retrievedAt))
) {
  throw new Error("The provenance retrieval timestamp is missing or invalid.");
}

console.log(
  `Validated LaunchDarkly OpenAPI ${document.openapi} snapshot (${sha256}).`,
);
