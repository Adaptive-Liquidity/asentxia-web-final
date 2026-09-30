import {build} from 'esbuild';
import {mkdir, writeFile, copyFile} from 'node:fs/promises';
await mkdir('dist/assets', {recursive: true});
await mkdir('dist/command', {recursive: true});
const t = await build({entryPoints: ['src/command/template.ts'], bundle: true, platform: 'node', format: 'esm', write: false});
const {render} = await import('data:text/javascript;base64,' + Buffer.from(t.outputFiles[0].text).toString('base64'));
// The command experience is the homepage. /command/ stays as an alias (canonical → /).
await writeFile('dist/index.html', render('/'));
await writeFile('dist/command/index.html', render('/command/'));
await copyFile('src/command/home.css', 'dist/home.css');
await build({entryPoints: ['src/command/main.ts'], bundle: true, format: 'esm', outfile: 'dist/assets/home.js', minify: true, target: 'es2022', legalComments: 'eof'});
console.log('Homepage built → dist/index.html (+ /command/ alias)');
