#!/usr/bin/env node
/**
 * Conservative accidental-secret guard. Not a replacement for GitHub Secret Scanning
 * or an independent audit. Never prints suspect values.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const runGit = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 40 * 1024 * 1024 });
const patterns = [
  { id: 'github-token', re: /(?:ghp_|gho_|ghu_|ghs_|ghr_)[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}/g },
  { id: 'openai-key', re: /sk-(?:proj-)?[A-Za-z0-9_-]{30,}/g },
  { id: 'google-api-key', re: /AIza[0-9A-Za-z_-]{30,}/g },
  { id: 'private-key', re: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g },
  { id: 'aws-access-key', re: /(?:AKIA|ASIA)[A-Z0-9]{16}/g },
  { id: 'credential-assignment', re: /\b(?:api[_-]?key|secret|client[_-]?secret|password|access[_-]?token|private[_-]?key)\s*[:=]\s*["'`]?([A-Za-z0-9/+=_.-]{20,})["'`]?/gi },
];
const ignoredValues = new Set(['MY_GEMINI_API_KEY', 'MY_APP_URL', 'YOUR_API_KEY', 'REPLACE_ME', 'EXAMPLE_TOKEN']);
const findings = [];
const binary = /\.(?:png|jpe?g|gif|webp|woff2?|ico|pdf|zip|gz|br|lock)$/i;

function check(content, source, historic = false) {
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const p of patterns) {
      p.re.lastIndex = 0;
      for (const match of line.matchAll(p.re)) {
        const value = match[1] ?? match[0];
        if (ignoredValues.has(value)) continue;
        findings.push({ source, line: historic ? 'historical-patch' : i + 1, pattern: p.id });
      }
    }
  }
}

// Run against current tracked tree; ignore lockfiles and binary assets.
const files = runGit('ls-files', '-z').split('\0').filter(Boolean);
for (const file of files) {
  if (binary.test(file)) continue;
  try { check(readFileSync(file, 'utf8'), file); }
  catch (err) { process.stderr.write(`Could not scan tracked file ${file}: ${err.message}\n`); process.exitCode = 2; }
}

// Also detect historical exposures in all locally available branches.
// This is a heuristic: force-pruned history and remote-only refs are not covered.
if (process.argv.includes('--history')) {
  const patch = runGit('log', '--all', '--no-ext-diff', '--no-color', '-p', '--format=commit:%h', '--');
  const patchLines = patch.split(/\r?\n/);
  let current = 'history';
  for (const line of patchLines) {
    if (line.startsWith('commit:')) current = line;
    if ((line.startsWith('+') || line.startsWith('-')) && !line.startsWith('+++') && !line.startsWith('---')) {
      check(line.slice(1), current, true);
    }
  }
}
const unique = Array.from(new Map(findings.map(f => [`${f.source}:${f.line}:${f.pattern}`, f])).values());
if (unique.length) {
  process.stderr.write(`Security guard found ${unique.length} suspected credential location(s). Values withheld.\n`);
  for (const f of unique.slice(0, 30)) process.stderr.write(`- ${f.source}:${f.line} [${f.pattern}]\n`);
  process.exitCode = 1;
} else {
  process.stdout.write('No matches for the configured credential indicators. This is not a clean-security certification.\n');
}
