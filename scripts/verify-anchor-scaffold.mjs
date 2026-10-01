import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const source = await readFile('programs/relay_raid/src/lib.rs', 'utf8');
const anchor = await readFile('Anchor.toml', 'utf8');
const manifest = await readFile('programs/relay_raid/Cargo.toml', 'utf8');

for (const instruction of ['initialize_season', 'create_profile', 'claim_receipt', 'set_profile_revoked', 'close_season']) {
  assert.match(source, new RegExp(`pub fn ${instruction}`));
}
assert.match(source, /pub player: Signer<'info>/);
assert.match(source, /pub attestor: Signer<'info>/);
assert.match(source, /seeds = \[b"receipt", season\.key\(\)\.as_ref\(\), player\.key\(\)\.as_ref\(\), nonce\.as_ref\(\)\]/);
assert.match(source, /ROUND_SCORE_MAX/);
assert.match(source, /require!\(now <= expires_at, RelayRaidError::ClaimExpired\)/);
assert.match(source, /constraint = player_profile\.player == player\.key\(\)/);
assert.match(source, /pub struct CloseSeason<'info> \{\s*#\[account\(mut, has_one = authority @ RelayRaidError::UnauthorizedAuthority\)\]/);
assert.doesNotMatch(source, /system_program::transfer/);
assert.doesNotMatch(source, /token::transfer/);
assert.match(anchor, /relay_raid = "5sCw7dCGrtqKvbs84UPqvGsBYgmYUruqYADnUUpgCJHH"/);
assert.match(manifest, /anchor-lang = "0\.30\.1"/);
console.log('PASS: Anchor receipt scaffold exposes dual-signature, nonce-bound, non-transfer invariants.');
