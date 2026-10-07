import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../', import.meta.url));
const production = process.argv.includes('--production');
const root = resolve(project, production ? 'dist' : '.');
const portArgument = process.argv.indexOf('--port');
const port = Number(portArgument !== -1 ? process.argv[portArgument + 1] : process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png' };

const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return;
    }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const target = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!target.startsWith(root + sep)) {
      response.writeHead(403);
      response.end('Forbidden');
      return;
    }
    // Serve only site files; package/config/source files are never public.
    const relative = target.slice(root.length + 1).split(sep).join('/');
    if (!['index.html', '404.html', 'styles.css', 'robots.txt', 'sitemap.xml'].includes(relative) && !relative.startsWith('assets/')) {
      throw Object.assign(new Error('Not found'), { code: 'ENOENT' });
    }
    if (!(await stat(target)).isFile()) throw Object.assign(new Error('Not found'), { code: 'ENOENT' });
    const content = await readFile(target);
    response.writeHead(200, {
      'Content-Type': mime[extname(target)] || 'application/octet-stream',
      'Content-Length': content.length,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    const status = error instanceof URIError ? 400 : error.code === 'ENOENT' ? 404 : 500;
    response.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : status === 404 ? await readFile(resolve(root, '404.html')) : 'Unable to serve this request.');
  }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Lumoza ${production ? 'production preview' : 'local preview'}: http://localhost:${port}`));
