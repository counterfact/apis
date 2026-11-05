import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const marker = 'COUNTERFACT_PROBE_RESULT:';
const args = process.argv.slice(2);

function options(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--') || !argv[i + 1]) throw new Error(`Missing option value: ${argv[i]}`);
    result[argv[i].slice(2)] = argv[++i];
  }
  return result;
}

async function child(config) {
  let handlerCalled = false;
  try {
    const { Registry, ContextRegistry, Dispatcher, loadOpenApiDocument } = await import('@counterfact/runtime');
    const document = await loadOpenApiDocument(path.resolve(config.spec));
    const verb = config.method.toUpperCase();
    if (!document.paths[config.template]?.[verb.toLowerCase()]) throw new Error('Template/method absent from contract; refusing an unvalidated literal-route probe');
    const input = JSON.parse(fs.readFileSync(config[config.case === 'valid' ? 'valid-request' : 'invalid-request'], 'utf8'));
    const fixture = JSON.parse(fs.readFileSync(config.response, 'utf8'));
    const registry = new Registry();
    registry.add(config.template, { [verb]: () => {
      handlerCalled = true;
      return { status: fixture.status ?? 200, headers: fixture.headers ?? {},
        content: [{ type: fixture.contentType ?? 'application/json', body: fixture.body ?? {} }] };
    } });
    const dispatcher = new Dispatcher(registry, new ContextRegistry(), document,
      { validateRequests: true, validateResponses: true });
    const response = await dispatcher.request({ method: verb, path: config.path,
      headers: input.headers ?? {}, query: input.query ?? {}, body: input.body, req: { path: config.path } });
    console.log(marker + JSON.stringify({ kind: 'result', handlerCalled, status: response.status, contentType: response.contentType }));
  } catch (error) {
    console.log(marker + JSON.stringify({ kind: 'error', handlerCalled, name: error.name, message: String(error.message).slice(0, 300) }));
  }
}

async function main() {
  if (args.includes('--help')) {
    console.log(`Usage: node scripts/probe-operation.mjs --spec SPEC --template '/items/{id}' --path /items/example --method PATCH --valid-request valid.json --invalid-request invalid.json --response response.json [--out result.json]
Request JSON: {"headers":{"content-type":"application/json"},"query":{},"body":{"name":"example"}}
Response JSON: {"status":200,"contentType":"application/json","headers":{},"body":{}}
Supply a deliberately invalid body/query/header proving validation prevents handler entry.
Each case has 256MB heap, 256KB stack and a 12-second subprocess timeout.
Results prove request selection only; no response-body-schema validation claim is made.
Use only minimal synthetic inputs; do not publish private fixtures or raw process logs.`);
    return;
  }
  const config = options(args);
  if (config.child === 'yes') { await child(config); return; }
  const allowed = new Set(['spec', 'template', 'path', 'method', 'valid-request', 'invalid-request', 'response', 'out']);
  for (const key of Object.keys(config)) if (!allowed.has(key)) throw new Error(`Unknown option: ${key}`);
  for (const key of ['spec', 'template', 'path', 'method', 'valid-request', 'invalid-request', 'response']) {
    if (!config[key]) throw new Error(`Required option: --${key}`);
  }
  if (!config.path.startsWith('/') || /[?#]/.test(config.path)) throw new Error('Use a concrete path only; supply query in the request fixture');
  const fixture = JSON.parse(fs.readFileSync(config.response, 'utf8'));
  const reports = {};
  for (const name of ['valid', 'invalid']) {
    const argv = Object.entries({ ...config, child: 'yes', case: name }).flatMap(([key, value]) => [`--${key}`, value]);
    const run = spawnSync(process.execPath, ['--max-old-space-size=256', '--stack-size=256', fileURLToPath(import.meta.url), ...argv],
      { cwd: process.cwd(), encoding: 'utf8', timeout: 12_000, killSignal: 'SIGKILL', maxBuffer: 1024 * 1024 });
    const line = run.stdout?.split(/\r?\n/).findLast((item) => item.startsWith(marker));
    reports[name] = { exitCode: run.status, signal: run.signal, processError: run.error?.code,
      stderrPresent: Boolean(run.stderr), ...(line ? JSON.parse(line.slice(marker.length)) : { kind: 'no-result' }) };
  }
  const valid = reports.valid, invalid = reports.invalid;
  const validPassed = valid.kind === 'result' && valid.handlerCalled && valid.status === (fixture.status ?? 200) && valid.exitCode === 0;
  const negativeControlPassed = invalid.kind === 'result' && !invalid.handlerCalled && invalid.status === 400 && invalid.exitCode === 0;
  const report = { template: config.template, path: config.path, method: config.method.toUpperCase(),
    validPassed, negativeControlPassed, requestValidationProven: validPassed && negativeControlPassed, ...reports };
  if (config.out) fs.writeFileSync(config.out, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report));
  if (!report.requestValidationProven) process.exitCode = 1;
}

try { await main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
