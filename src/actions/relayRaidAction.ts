const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

export const ACTION_CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type',
  'access-control-max-age': '600',
  vary: 'origin',
} as const;

export type RelayRaidClaimIntent = {
  account: string;
  receiptId: string;
  nonce: string;
};

function base58DecodedByteLength(value: string): number {
  let decoded = 0n;
  for (const character of value) {
    decoded = decoded * 58n + BigInt(BASE58.indexOf(character));
  }
  let bytes = 0;
  while (decoded > 0n) {
    decoded >>= 8n;
    bytes += 1;
  }
  const leadingZeroes = value.match(/^1*/)?.[0].length ?? 0;
  return leadingZeroes + bytes;
}

export function validatePublicKey(account: unknown): account is string {
  if (typeof account !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(account)) {
    return false;
  }
  return base58DecodedByteLength(account) === 32;
}

export function parseClaimIntent(body: unknown): RelayRaidClaimIntent | null {
  if (!body || typeof body !== 'object') {
    return null;
  }
  const candidate = body as Record<string, unknown>;
  if (!validatePublicKey(candidate.account)) {
    return null;
  }
  if (typeof candidate.receiptId !== 'string' || !/^local-[a-f0-9]{8}$/.test(candidate.receiptId)) {
    return null;
  }
  if (typeof candidate.nonce !== 'string' || candidate.nonce.length < 12 || candidate.nonce.length > 128) {
    return null;
  }
  return {account: candidate.account, receiptId: candidate.receiptId, nonce: candidate.nonce};
}

export function createActionsManifest(): {rules: Array<{pathPattern: string; apiPath: string}>} {
  return {rules: [{pathPattern: '/arcade/*', apiPath: '/api/actions/relay-raid'}]};
}

export function createRelayRaidActionMetadata(origin: string): Record<string, unknown> {
  return {
    icon: `${origin}/favicon.svg`,
    title: 'Relay Raid',
    description: 'Open a wallet-optional, 90-second arcade demonstration. Action support is optional and this endpoint does not issue a real reward.',
    label: 'Open Relay Raid',
    links: {
      actions: [{label: 'Open game', href: `${origin}/arcade/`}],
    },
  };
}

export function createDevelopmentMessage(intent: RelayRaidClaimIntent): Record<string, string> {
  return {
    type: 'message',
    title: 'Relay Raid development endpoint',
    description: `Receipt ${intent.receiptId} belongs to a local demonstration. No transaction, asset, reward, or on-chain claim was created.`,
  };
}
