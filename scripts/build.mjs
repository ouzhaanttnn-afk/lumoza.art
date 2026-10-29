import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { checkSite } from './check.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
await checkSite(root);
const output = resolve(root, 'dist');
await mkdir(output, { recursive: true });
for (const file of ['index.html', 'tr', '404.html', 'styles.css', 'robots.txt', 'sitemap.xml', 'assets']) {
  await cp(resolve(root, file), resolve(output, file), { recursive: true });
}
console.log('Built Lumoza into dist/. No framework or runtime dependencies.');
