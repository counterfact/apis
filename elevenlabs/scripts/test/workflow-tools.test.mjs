import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import { auditOperations, checkBlockers, signature } from '../audit-operations.mjs';

const probe = fileURLToPath(new URL('../probe-operation.mjs', import.meta.url));
const verify = fileURLToPath(new URL('../verify-command.mjs', import.meta.url));
function directory(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'counterfact-workflow-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value));
}
function repository(dir) {
  const git = (...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  git('init', '--quiet');
  git('config', 'user.name', 'Workflow tests');
  git('config', 'user.email', 'workflow-tests@example.invalid');
  return { git, commit() { git('add', '.'); git('-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Synthetic baseline'); return git('rev-parse', 'HEAD').trim(); } };
}

test('audit counts shared versions, preserves literal whitespace, ignores scaffold formatting and detects missing handlers', (t) => {
  const dir = directory(t), { commit } = repository(dir), appDir = path.join(dir, 'app');
  const specs = ['v1', 'v2'].map((version) => ({ source: `${version}.json`, group: 'api', version, prefix: `/${version}` }));
  write(path.join(appDir, 'counterfact.yaml'), { spec: specs, destination: '.' });
  const operation = { responses: { 200: { description: 'OK' } } };
  write(path.join(appDir, 'v1.json'), { paths: { '/things/{id}': { get: operation, delete: operation } } });
  write(path.join(appDir, 'v2.json'), { paths: { '/things/{id}': { get: operation } } });
  const route = path.join(appDir, 'api/routes/things/{id}.ts');
  write(route, 'export const GET = async ($) => $.response.status(200).random();\nexport const DELETE = async ($) => { return {}; };\n');
  const baseline = commit();
  write(route, '// unrelated formatting\nexport const GET=async($)=>$.response.status(200).json({name:"a b"});\nexport const DELETE=async ($)=>{ /* unchanged scaffold */ return {}; };');
  const audit = auditOperations({ appDir, baseline });
  assert.equal(audit.total, 3);
  assert.deepEqual(audit.counts, { authored: 2, random: 0, empty: 1, missing: 0 });
  assert.equal(audit.operations[0].path, '/v1/things/{id}');
  assert.notEqual(signature('"a b"'), signature('"ab"'));
  assert.notEqual(signature('`a ${x} b`'), signature('`a ${x}b`'));
  assert.equal(signature('a + b /* comment */'), signature('a+b'));
  const manifest = { coverage: { contractOperations: 3, authoredOperations: 2, generatedOperations: 1 }, operations: audit.operations };
  checkBlockers(audit, manifest);
  assert.throws(() => checkBlockers(audit, { ...manifest, operations: [] }), /stale/);
  assert.throws(() => checkBlockers(audit, { ...manifest, operations: [...audit.operations, ...audit.operations] }), /Duplicate/);
  write(route, 'export const GET=async($)=>$.response.status(200).json({name:"a b"});');
  assert.equal(auditOperations({ appDir, baseline }).counts.missing, 1);
});

test('audit does not count response random scaffolds as authored after edits', (t) => {
  const dir = directory(t), { commit } = repository(dir), appDir = path.join(dir, 'app');
  write(path.join(appDir, 'counterfact.yaml'), { spec: [{ source: 'spec.json', group: 'api', prefix: '/v1', version: 'v1' }] });
  write(path.join(appDir, 'spec.json'), { paths: { '/things': { get: { responses: {} } } } });
  const route = path.join(appDir, 'api/routes/things.ts');
  write(route, 'export const GET=($)=>$.response.status(200).random();');
  const baseline = commit();
  write(route, 'export const GET=($)=>{ console.log("edited"); return $.response.status(200).random(); };');
  assert.equal(auditOperations({ appDir, baseline }).counts.random, 1);
});

test('probe proves template contract selection and rejects literal bypass or invalid negative control', (t) => {
  const dir = directory(t);
  const spec = path.join(dir, 'spec.json'), valid = path.join(dir, 'valid.json'), invalid = path.join(dir, 'invalid.json'), response = path.join(dir, 'response.json');
  write(spec, { openapi: '3.1.0', info: { title: 'Synthetic control', version: '1' }, paths: { '/things/{id}': { patch: {
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } } } },
    responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object' } } } } },
  } } } });
  write(valid, { headers: { 'content-type': 'application/json' }, body: { name: 'Synthetic' } });
  write(invalid, { headers: { 'content-type': 'application/json' }, body: { name: 42 } });
  write(response, { status: 200, contentType: 'application/json', body: {} });
  const argv = ['--spec', spec, '--template', '/things/{id}', '--path', '/things/local', '--method', 'PATCH', '--valid-request', valid, '--invalid-request', invalid, '--response', response];
  const run = (args) => spawnSync(process.execPath, [probe, ...args], { encoding: 'utf8', timeout: 30_000 });
  const passed = run(argv);
  assert.equal(passed.status, 0, passed.stderr + passed.stdout);
  const report = JSON.parse(passed.stdout.trim());
  assert.equal(report.requestValidationProven, true);
  assert.equal(report.valid.handlerCalled, true);
  assert.equal(report.valid.contentType, 'application/json');
  assert.equal(report.invalid.handlerCalled, false);
  assert.equal(report.invalid.status, 400);
  const bypass = [...argv]; bypass[bypass.indexOf('--template') + 1] = '/things/local';
  const rejected = run(bypass);
  assert.equal(rejected.status, 1);
  assert.equal(JSON.parse(rejected.stdout.trim()).requestValidationProven, false);
  const noControl = [...argv]; noControl[noControl.indexOf('--invalid-request') + 1] = valid;
  const unsafe = run(noControl);
  assert.equal(unsafe.status, 1);
  assert.equal(JSON.parse(unsafe.stdout.trim()).negativeControlPassed, false);
});

test('verification uses unique logs, records failure exits, and fails when passing command edits source', (t) => {
  const dir = directory(t), { commit } = repository(dir);
  write(path.join(dir, 'input.txt'), 'original'); commit();
  const run = (...command) => {
    const result = spawnSync(process.execPath, [verify, '--label', 'same-label', '--', ...command], { cwd: dir, encoding: 'utf8', timeout: 10_000 });
    const finished = JSON.parse(result.stdout.trim().split('\n').at(-1));
    t.after(() => fs.rmSync(path.dirname(finished.metadata), { recursive: true, force: true }));
    return { result, finished, metadata: JSON.parse(fs.readFileSync(finished.metadata, 'utf8')) };
  };
  const first = run(process.execPath, '-e', 'console.log("passed")');
  const second = run(process.execPath, '-e', 'process.exit(7)');
  assert.equal(first.result.status, 0);
  assert.equal(first.metadata.frozen, true);
  assert.match(fs.readFileSync(first.finished.log, 'utf8'), /passed/);
  assert.equal(second.result.status, 7);
  assert.equal(second.metadata.exitCode, 7);
  assert.notEqual(first.finished.log, second.finished.log);
  const edited = run(process.execPath, '--input-type=module', '-e', 'import fs from "node:fs";fs.writeFileSync("input.txt","edited")');
  assert.equal(edited.result.status, 1);
  assert.equal(edited.metadata.exitCode, 0);
  assert.equal(edited.metadata.frozen, false);
});
