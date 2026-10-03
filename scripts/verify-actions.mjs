import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';

const port = 4188;
const child = spawn(process.execPath, ['scripts/preview.mjs', '--port', String(port)], {
  cwd: process.cwd(),
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
child.stdout.on('data', (chunk) => { output += chunk.toString(); });
child.stderr.on('data', (chunk) => { output += chunk.toString(); });

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (output.includes('Static preview ready')) {
      return;
    }
    if (child.exitCode !== null) {
      throw new Error(`preview server exited early: ${output}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  throw new Error(`preview server did not start: ${output}`);
}

try {
  await waitForServer();
  const origin = `http://127.0.0.1:${port}`;
  const actions = await fetch(`${origin}/actions.json`);
  assert.equal(actions.status, 200);
  const manifest = await actions.json();
  assert.equal(manifest.rules[0].pathPattern, '/arcade/*');
  assert.equal(manifest.rules[0].apiPath, '/api/actions/relay-raid');

  const options = await fetch(`${origin}/api/actions/relay-raid`, {method: 'OPTIONS'});
  assert.equal(options.status, 204);
  assert.equal(options.headers.get('access-control-allow-methods'), 'GET,POST,OPTIONS');

  const metadata = await fetch(`${origin}/api/actions/relay-raid`);
  assert.equal(metadata.status, 200);
  assert.equal((await metadata.json()).title, 'Relay Raid');

  const invalid = await fetch(`${origin}/api/actions/relay-raid`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({account: 'invalid', receiptId: 'local-00000000', nonce: 'valid-nonce-123'}),
  });
  assert.equal(invalid.status, 400);

  const valid = await fetch(`${origin}/api/actions/relay-raid`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({account: '11111111111111111111111111111111', receiptId: 'local-00000000', nonce: 'valid-nonce-123'}),
  });
  assert.equal(valid.status, 200);
  assert.equal((await valid.json()).type, 'message');
  console.log('PASS: Action manifest, metadata, CORS preflight, and development message endpoint.');
} finally {
  child.kill('SIGTERM');
}
