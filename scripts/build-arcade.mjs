import {build} from 'esbuild';
import {copyFile, mkdir, rm, writeFile} from 'node:fs/promises';

await mkdir('dist/arcade', {recursive: true});
await mkdir('dist/api', {recursive: true});
await rm('dist/arcade/assets', {recursive: true, force: true});

const templateBundle = await build({
  entryPoints: ['src/arcade/template.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const {render} = await import(`data:text/javascript;base64,${Buffer.from(templateBundle.outputFiles[0].text).toString('base64')}`);
await writeFile('dist/arcade/index.html', render());
await copyFile('src/arcade/arcade.css', 'dist/arcade/arcade.css');

await build({
  entryPoints: ['src/arcade/main.ts'],
  bundle: true,
  splitting: true,
  format: 'esm',
  outdir: 'dist/arcade/assets',
  minify: true,
  target: 'es2022',
  entryNames: 'arcade',
  chunkNames: '[name]-[hash]',
  legalComments: 'eof',
});

await build({
  entryPoints: ['src/actions/relayRaidAction.ts'],
  bundle: true,
  platform: 'node',
  packages: 'external',
  format: 'esm',
  outfile: 'dist/api/relay-raid-action.mjs',
  target: 'node22',
  legalComments: 'eof',
});

console.log('Relay Raid route and Action module built.');
