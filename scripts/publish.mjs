#!/usr/bin/env node
/**
 * Publish without a local git install:
 *   1) uploads the project source (respecting .gitignore) as a commit on `main`
 *   2) uploads `dist/` as a commit on `gh-pages` and turns on GitHub Pages
 *
 * Auth comes from the GitHub CLI at run time (`gh auth token`); the token is never written to disk.
 *
 *   npm run build && node scripts/publish.mjs "commit message"
 *   env: REPO=owner/name (default yflora0512/tracing), GH=/path/to/gh
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, relative, sep } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const REPO = process.env.REPO || 'yflora0512/tracing';
const GH = process.env.GH || (existsSync(join(homedir(), '.local/bin/gh')) ? join(homedir(), '.local/bin/gh') : 'gh');
const MESSAGE = process.argv[2] || 'Update Trac:ing showing page';
const TRAILER = '\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>';
const TOKEN = execFileSync(GH, ['auth', 'token']).toString().trim();

async function api(method, path, body, ok = []) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'tracing-publish-script',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok && !ok.includes(res.status)) throw new Error(`${method} ${path} → ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : { status: res.status, data: await res.json().catch(() => null) };
}

/* ---- minimal .gitignore matcher (names, *.ext, prefix*, a/b paths) ---- */
const rules = readFileSync(join(ROOT, '.gitignore'), 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .concat(['.git']);
const toRe = (g) => new RegExp(`^${g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*')}$`);
const matchers = rules.map((r) => ({ hasSlash: r.includes('/'), re: toRe(r.replace(/^\/|\/$/g, '')) }));
const ignored = (rel) => {
  const parts = rel.split('/');
  return matchers.some((m) => (m.hasSlash ? m.re.test(rel) : parts.some((p) => m.re.test(p))));
};

function walk(dir, base = dir, filter = () => true, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(base, full).split(sep).join('/');
    if (!filter(rel)) continue;
    if (statSync(full).isDirectory()) walk(full, base, filter, out);
    else out.push(rel);
  }
  return out;
}

async function pool(items, n, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (next < items.length) {
        const k = next++;
        results[k] = await fn(items[k], k);
      }
    }),
  );
  return results;
}

async function commitTree(branch, baseDir, files, message, extra = []) {
  console.log(`\n▶ ${branch}: uploading ${files.length + extra.length} files`);
  const blobs = await pool(files, 6, async (rel) => {
    const content = readFileSync(join(baseDir, rel)).toString('base64');
    const { data } = await api('POST', '/git/blobs', { content, encoding: 'base64' });
    return { path: rel, mode: '100644', type: 'blob', sha: data.sha };
  });
  for (const e of extra) {
    const { data } = await api('POST', '/git/blobs', { content: Buffer.from(e.content).toString('base64'), encoding: 'base64' });
    blobs.push({ path: e.path, mode: '100644', type: 'blob', sha: data.sha });
  }
  const { data: tree } = await api('POST', '/git/trees', { tree: blobs });
  const ref = await api('GET', `/git/ref/heads/${branch}`, null, [404, 409]);
  const parent = ref.status === 200 ? ref.data.object.sha : null;
  const { data: commit } = await api('POST', '/git/commits', { message: message + TRAILER, tree: tree.sha, parents: parent ? [parent] : [] });
  if (parent) await api('PATCH', `/git/refs/heads/${branch}`, { sha: commit.sha });
  else await api('POST', '/git/refs', { ref: `refs/heads/${branch}`, sha: commit.sha });
  console.log(`  ✓ ${branch} → ${commit.sha.slice(0, 7)}`);
}

async function main() {
  // An empty repository has no git database yet; the contents API creates the first commit.
  const head = await api('GET', '/git/ref/heads/main', null, [404, 409]);
  if (head.status !== 200) {
    console.log('▶ empty repository: creating initial commit');
    await api('PUT', '/contents/README.md', {
      message: 'Initial commit' + TRAILER,
      content: readFileSync(join(ROOT, 'README.md')).toString('base64'),
      branch: 'main',
    });
  }

  const src = walk(ROOT, ROOT, (rel) => !ignored(rel));
  await commitTree('main', ROOT, src, MESSAGE);

  const dist = join(ROOT, 'dist');
  if (!existsSync(join(dist, 'index.html'))) throw new Error('dist/ is missing — run `npm run build` first');
  await commitTree('gh-pages', dist, walk(dist), `Deploy: ${MESSAGE}`, [{ path: '.nojekyll', content: '' }]);

  const pages = await api('GET', '/pages', null, [404]);
  if (pages.status === 404) {
    await api('POST', '/pages', { source: { branch: 'gh-pages', path: '/' } }, [409]);
    console.log('\n✓ GitHub Pages enabled (gh-pages / root)');
  }
  const [owner, name] = REPO.split('/');
  console.log(`\nRepository: https://github.com/${REPO}\nSite:       https://${owner}.github.io/${name}/`);
}

main().catch((e) => {
  console.error('\n✗', e.message);
  process.exit(1);
});
