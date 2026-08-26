import { createHash } from "node:crypto";
import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const specificationPath = resolve(packageDirectory, "openapi.json");
const provenancePath = resolve(packageDirectory, "openapi.provenance.json");
const liveSourceUrl = "https://app.launchdarkly.com/api/v2/openapi.json";
const releaseAssetUrl =
  "https://github.com/launchdarkly/ld-openapi/releases/download/16.1.1/openapi.json";
const accessToken = process.env.LD_API_KEY;

const sourceUrl = accessToken ? liveSourceUrl : releaseAssetUrl;
const sourceKind = accessToken ? "live-api" : "release-asset";

{
  const response = await fetch(
    sourceUrl,
    accessToken ? { headers: { Authorization: accessToken } } : undefined,
  );

  if (!response.ok) {
    throw new Error(
      `LaunchDarkly returned ${response.status} ${response.statusText}; no files were changed.`,
    );
  }

  const body = Buffer.from(await response.arrayBuffer());
  let document;
  try {
    document = JSON.parse(body.toString("utf8"));
  } catch (error) {
    throw new Error(
      "LaunchDarkly returned invalid JSON; no files were changed.",
      {
        cause: error,
      },
    );
  }

  if (document.openapi !== "3.0.3") {
    throw new Error(
      `Expected OpenAPI 3.0.3 but received ${String(document.openapi)}; no files were changed.`,
    );
  }

  const retrievedAt = new Date().toISOString();
  const sha256 = createHash("sha256").update(body).digest("hex");
  const provenance = {
    sourceUrl,
    sourceKind,
    ...(sourceKind === "release-asset" ? { releaseTag: "16.1.1" } : {}),
    retrievedAt,
    openapiVersion: document.openapi,
    sha256,
  };
  const temporarySpecificationPath = `${specificationPath}.tmp`;
  const temporaryProvenancePath = `${provenancePath}.tmp`;

  await mkdir(packageDirectory, { recursive: true });
  await writeFile(temporarySpecificationPath, body);
  await writeFile(
    temporaryProvenancePath,
    `${JSON.stringify(provenance, null, 2)}\n`,
    "utf8",
  );
  await rename(temporarySpecificationPath, specificationPath);
  await rename(temporaryProvenancePath, provenancePath);

  console.log(
    `Saved LaunchDarkly OpenAPI ${document.openapi} snapshot (${sha256}) retrieved at ${retrievedAt}.`,
  );
}
