import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { load } from "js-yaml";

test("versioned specifications match provenance and config", async () => {
  const provenance = JSON.parse(
    await readFile(
      new URL("../openapi.provenance.json", import.meta.url),
      "utf8",
    ),
  );
  const config = load(
    await readFile(new URL("../counterfact.yaml", import.meta.url), "utf8"),
  ) as {
    spec: Array<{
      source: string;
      prefix: string;
      version: string;
      group: string;
    }>;
  };
  assert.deepEqual(
    config.spec.map(({ source, prefix, version, group }) => ({
      source,
      prefix,
      version,
      group,
    })),
    provenance.files.map(
      (file: { file: string; prefix: string; version: string }) => ({
        source: file.file,
        prefix: file.prefix,
        version: file.version,
        group: "api",
      }),
    ),
  );
  const methods = new Set([
    "get",
    "put",
    "post",
    "delete",
    "patch",
    "head",
    "options",
    "trace",
  ]);
  let paths = 0;
  let operations = 0;
  for (const file of provenance.files) {
    const bytes = await readFile(new URL("../" + file.file, import.meta.url));
    const spec = load(bytes.toString()) as {
      openapi: string;
      info: { version: string };
      servers: Array<{ url: string }>;
      paths: Record<string, object>;
    };
    assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256);
    assert.equal(spec.openapi, provenance.openapi);
    assert.equal(spec.info.version, file.version);
    assert.equal(
      spec.servers[0].url,
      "https://api.elevenlabs.io" + file.prefix,
    );
    assert.equal(Object.keys(spec.paths).length, file.paths);
    assert.ok(
      Object.keys(spec.paths).every((path) => !/^\/v[12](?:\/|$)/.test(path)),
    );
    const count = Object.values(spec.paths)
      .flatMap((path) => Object.keys(path))
      .filter((method) => methods.has(method)).length;
    assert.equal(count, file.operations);
    paths += file.paths;
    operations += count;
  }
  assert.equal(
    paths + Object.keys(provenance.excludedPaths).length,
    provenance.sourcePaths,
  );
  assert.equal(
    operations + Object.keys(provenance.excludedPaths).length,
    provenance.sourceOperations,
  );
});
