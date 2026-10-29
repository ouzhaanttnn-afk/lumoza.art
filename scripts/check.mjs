import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export async function checkSite(root) {
  for (const page of ['index.html', 'tr/index.html']) await checkPage(root, page);
  const config = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'));
  if (config.framework !== null || config.outputDirectory !== 'dist') throw new Error('Unexpected Vercel configuration.');
}

async function checkPage(root, page) {
  const html = await readFile(resolve(root, page), 'utf8');
  const css = await readFile(resolve(root, 'styles.css'), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML ids.');
  const links = [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1]);
  for (const link of links) {
    if (link.startsWith('#') && !ids.includes(link.slice(1))) throw new Error(`Missing anchor: ${link}`);
  }
  const files = new Set([
    ...links.filter(link => link.startsWith('/')),
    ...[...html.matchAll(/\bsrc="(\/[^\"]+)"/g)].map(match => match[1]),
    ...[...css.matchAll(/url\("([^"]+)"\)/g)].map(match => match[1])
  ]);
  for (const file of files) await access(resolve(root, file.replace(/^\//, '')));
  if (!html.includes('mailto:alpertosun@lumoza.art')) throw new Error('Missing contact destination.');
  if ((html.match(/<h1\b/g) || []).length !== 1) throw new Error('Expected exactly one h1.');
  console.log(`Checks passed for ${page}: ${files.size} local assets, unique ids, navigation targets and contact link.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await checkSite(fileURLToPath(new URL('../', import.meta.url)));
}
