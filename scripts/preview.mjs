import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
import {
  ACTION_CORS_HEADERS,
  createActionsManifest,
  createDevelopmentMessage,
  createRelayRaidActionMetadata,
  parseClaimIntent,
} from '../dist/api/relay-raid-action.mjs';

const root = resolve('dist');
const args = process.argv.slice(2);
const port = Number(args[args.indexOf('--port') + 1] || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
};

function originFor(request) {
  return `http://${request.headers.host || `127.0.0.1:${port}`}`;
}

function sendJson(response, status, payload, headers = {}) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers,
  });
  response.end(JSON.stringify(payload));
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 8_192) {
      throw new Error('request body exceeds 8192 bytes');
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new Error('request body must be valid JSON');
  }
}

async function handleAction(request, response, url) {
  if (url.pathname === '/actions.json' && request.method === 'GET') {
    sendJson(response, 200, createActionsManifest(), ACTION_CORS_HEADERS);
    return true;
  }
  if (url.pathname !== '/api/actions/relay-raid') {
    return false;
  }
  if (request.method === 'OPTIONS') {
    response.writeHead(204, ACTION_CORS_HEADERS);
    response.end();
    return true;
  }
  if (request.method === 'GET') {
    sendJson(response, 200, createRelayRaidActionMetadata(originFor(request)), ACTION_CORS_HEADERS);
    return true;
  }
  if (request.method === 'POST') {
    try {
      const intent = parseClaimIntent(await readJsonBody(request));
      if (!intent) {
        sendJson(response, 400, {message: 'A valid account, local receipt ID, and nonce are required.'}, ACTION_CORS_HEADERS);
        return true;
      }
      sendJson(response, 200, createDevelopmentMessage(intent), ACTION_CORS_HEADERS);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'invalid request';
      sendJson(response, 400, {message}, ACTION_CORS_HEADERS);
      return true;
    }
  }
  sendJson(response, 405, {message: 'Method not allowed.'}, {...ACTION_CORS_HEADERS, allow: 'GET,POST,OPTIONS'});
  return true;
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', originFor(request));
    if (await handleAction(request, response, url)) {
      return;
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, {allow: 'GET,HEAD'});
      response.end('Method not allowed');
      return;
    }
    let file = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (!file.startsWith(`${root}/`) && file !== root) {
      throw new Error('outside static root');
    }
    if ((await stat(file)).isDirectory()) {
      file += '/index.html';
    }
    const body = await readFile(file);
    response.writeHead(200, {
      'content-type': types[extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    if (request.method === 'HEAD') {
      response.end();
    } else {
      response.end(body);
    }
  } catch {
    response.writeHead(404, {'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store'});
    response.end('Not found');
  }
}).listen(port, '0.0.0.0', () => console.log('Static preview ready'));
