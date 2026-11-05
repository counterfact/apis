import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { load } from 'js-yaml';

const defaultApp = fileURLToPath(new URL('../', import.meta.url));
const methods = new Set(['get', 'post', 'put', 'delete', 'patch', 'options', 'head', 'trace', 'query']);

/** Ignore formatting/comments while preserving whitespace inside string literals. */
export function signature(text) {
  const source = ts.createSourceFile('signature.ts', text, ts.ScriptTarget.Latest, true);
  return ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed }).printFile(source).trim();
}

function handlers(file, text) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const result = new Map();
  for (const statement of source.statements) {
    if (!statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) continue;
    const declarations = ts.isVariableStatement(statement) ? statement.declarationList.declarations : [];
    for (const declaration of declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.initializer) {
        result.set(declaration.name.text, describe(declaration.initializer));
      }
    }
    if (ts.isFunctionDeclaration(statement) && statement.name && statement.body) {
      result.set(statement.name.text, describe(statement.body));
    }
  }
  return result;
  function describe(node) {
    let random = false;
    function visit(child) {
      if (ts.isCallExpression(child) && ts.isPropertyAccessExpression(child.expression) &&
          child.expression.name.text === 'random' &&
          /\bresponse\b/.test(child.expression.expression.getText(source))) random = true;
      ts.forEachChild(child, visit);
    }
    visit(node);
    let body = ts.isArrowFunction(node) || ts.isFunctionExpression(node) ? node.body : node;
    while (ts.isParenthesizedExpression(body)) body = body.expression;
    let empty = false;
    if (ts.isBlock(body)) {
      if (body.statements.length === 0) empty = true;
      if (body.statements.length === 1 && ts.isReturnStatement(body.statements[0])) {
        body = body.statements[0].expression;
        empty = !body;
      }
    }
    if (body && ts.isObjectLiteralExpression(body) && body.properties.length === 0) empty = true;
    return { signature: signature(node.getText(source)), random, empty };
  }
}

export function auditOperations({ appDir = defaultApp, baseline = 'c32bdae' } = {}) {
  appDir = fs.realpathSync(path.resolve(appDir));
  const root = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: appDir, encoding: 'utf8' }).trim();
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 32 * 1024 * 1024 });
  git('rev-parse', '--verify', `${baseline}^{commit}`);
  const config = load(fs.readFileSync(path.join(appDir, 'counterfact.yaml'), 'utf8'));
  if (!Array.isArray(config.spec)) throw new Error('Expected a multi-spec counterfact.yaml');
  const operations = [];
  const seen = new Set();
  const cache = new Map();
  for (const spec of config.spec) {
    const document = load(fs.readFileSync(path.resolve(appDir, spec.source), 'utf8'));
    const routes = path.resolve(appDir, config.destination ?? '.', spec.group, 'routes');
    for (const [route, item] of Object.entries(document.paths ?? {})) {
      const file = path.resolve(routes, `.${route}.ts`);
      if (!file.startsWith(`${routes}${path.sep}`)) throw new Error(`Path escapes route directory: ${route}`);
      if (!cache.has(file)) {
        const relative = path.relative(root, file).split(path.sep).join('/');
        let original = '';
        // Only an absent file is tolerated; invalid baseline and other Git failures are errors.
        const entries = git('ls-tree', baseline, '--', relative).trim();
        if (entries) original = git('show', `${baseline}:${relative}`);
        cache.set(file, {
          file: relative,
          current: handlers(file, fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''),
          original: handlers(file, original),
        });
      }
      const data = cache.get(file);
      const declared = [...Object.keys(item).filter((method) => methods.has(method)),
        ...Object.keys(item.additionalOperations ?? {})];
      for (const method of declared) {
        const verb = method.toUpperCase();
        const versionedPath = `${(spec.prefix ?? '').replace(/\/$/, '')}${route}`;
        const key = `${verb} ${versionedPath}`;
        if (seen.has(key)) throw new Error(`Duplicate canonical operation: ${key}`);
        seen.add(key);
        const current = data.current.get(verb);
        const original = data.original.get(verb);
        const kind = !current ? 'missing' : current.random ? 'random' : current.empty ? 'empty' :
          current.signature === original?.signature ? 'empty' : 'authored';
        operations.push({ version: spec.version, method: verb, path: versionedPath, file: data.file, kind });
      }
    }
  }
  const counts = Object.fromEntries(['authored', 'random', 'empty', 'missing'].map((kind) => [kind, operations.filter((item) => item.kind === kind).length]));
  const remaining = operations.filter((item) => item.kind !== 'authored');
  return { baseline, total: operations.length, counts, remaining: remaining.length, operations: remaining };
}

export function checkBlockers(audit, manifest) {
  const actual = new Set(audit.operations.map((item) => `${item.method} ${item.path}`));
  const expected = manifest.operations.map((item) => `${item.method} ${item.path}`);
  if (new Set(expected).size !== expected.length) throw new Error('Duplicate blocker manifest entries');
  const missing = [...actual].filter((key) => !expected.includes(key));
  const extra = expected.filter((key) => !actual.has(key));
  const coverage = manifest.coverage;
  if (missing.length || extra.length || coverage.contractOperations !== audit.total ||
      coverage.authoredOperations !== audit.counts.authored || coverage.generatedOperations !== audit.remaining) {
    throw new Error(`Blocker manifest is stale: ${JSON.stringify({ missing, extra, counts: audit.counts })}`);
  }
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node scripts/audit-operations.mjs [--app DIR] [--baseline REF] [--out JSON] [--check-blockers]\nStructural classification requires behavioral evidence before claiming completion.');
    return;
  }
  let appDir = defaultApp, baseline = 'c32bdae', output, check = false;
  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    if (flag === '--check-blockers') { check = true; continue; }
    if (!['--app', '--baseline', '--out'].includes(flag) || !args[i + 1]) throw new Error(`Invalid argument: ${flag}`);
    const value = args[++i];
    if (flag === '--app') appDir = value;
    if (flag === '--baseline') baseline = value;
    if (flag === '--out') output = value;
  }
  const audit = auditOperations({ appDir, baseline });
  if (check) checkBlockers(audit, JSON.parse(fs.readFileSync(path.resolve(appDir, 'blocked-operations.json'), 'utf8')));
  if (output) fs.writeFileSync(output, `${JSON.stringify(audit, null, 2)}\n`);
  console.log(JSON.stringify({ total: audit.total, counts: audit.counts, remaining: audit.remaining, blockerManifestChecked: check, output }));
  if (audit.counts.missing) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
