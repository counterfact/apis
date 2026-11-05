import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function sourceFingerprint() {
  const files = [...new Set(git('ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', '.').split('\0').filter(Boolean))].sort();
  const hash = createHash('sha256');
  for (const file of files) {
    hash.update(JSON.stringify(file));
    let stat;
    try { stat = fs.lstatSync(file); } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      hash.update('missing'); continue;
    }
    if (stat.isDirectory()) throw new Error(`Verify submodule sources separately: ${file}`);
    hash.update(String(stat.mode));
    hash.update(stat.isSymbolicLink() ? fs.readlinkSync(file) : fs.readFileSync(file));
  }
  return hash.digest('hex');
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node scripts/verify-command.mjs --label NAME [--log-dir DIR] -- COMMAND [ARGS...]\nRun from the source subtree being checked. Logs default outside the repository. Records exact command, HEAD, source fingerprints and exit status; changed source fails verification.');
    return;
  }
  const split = args.indexOf('--');
  if (split < 0 || split === args.length - 1) throw new Error('Supply a command after --');
  const command = args.slice(split + 1);
  let label, logDir = os.tmpdir();
  for (let i = 0; i < split; i += 2) {
    if (!args[i + 1] || !['--label', '--log-dir'].includes(args[i])) throw new Error(`Invalid option: ${args[i]}`);
    if (args[i] === '--label') label = args[i + 1];
    else logDir = args[i + 1];
  }
  if (!label) throw new Error('--label is required');
  const root = fs.realpathSync(git('rev-parse', '--show-toplevel').trim());
  logDir = fs.realpathSync(path.resolve(logDir));
  if (logDir === root || logDir.startsWith(`${root}${path.sep}`)) throw new Error('Keep verification logs outside the source repository');
  const directory = fs.mkdtempSync(path.join(logDir, `verify-${label.replace(/[^a-z0-9_.-]/gi, '-').slice(0, 60)}-`));
  const log = path.join(directory, 'output.log'), metadata = path.join(directory, 'result.json');
  const head = git('rev-parse', 'HEAD').trim(), before = sourceFingerprint();
  const record = { label, cwd: process.cwd(), command, head, sourceBefore: before, startedAt: new Date().toISOString(), log };
  fs.writeFileSync(metadata, `${JSON.stringify(record, null, 2)}\n`);
  console.log(JSON.stringify({ stage: 'running', log, metadata }));
  const fd = fs.openSync(log, 'w');
  let run;
  try { run = spawnSync(command[0], command.slice(1), { stdio: ['ignore', fd, fd], timeout: 10 * 60_000, killSignal: 'SIGKILL' }); }
  finally { fs.closeSync(fd); }
  const after = sourceFingerprint(), finalHead = git('rev-parse', 'HEAD').trim();
  const frozen = before === after && head === finalHead;
  Object.assign(record, { finishedAt: new Date().toISOString(), exitCode: run.status, signal: run.signal,
    processError: run.error?.code, sourceAfter: after, finalHead, frozen });
  fs.writeFileSync(metadata, `${JSON.stringify(record, null, 2)}\n`);
  console.log(JSON.stringify({ stage: 'finished', exitCode: run.status, frozen, log, metadata }));
  process.exitCode = run.status === 0 && frozen ? 0 : run.status || 1;
}

try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
