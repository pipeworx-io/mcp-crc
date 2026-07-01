interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Checksum MCP — CRC-32 & Adler-32.
 *
 * Keyless, offline: compute CRC-32 (IEEE, as used by zip/gzip/PNG) and Adler-32
 * (as used by zlib) checksums of text. Pure functions — no API, no key. These
 * are error-detection checksums, NOT cryptographic hashes (use the `hash` pack
 * for MD5/SHA).
 */


const TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const b of bytes) crc = TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function adler32(bytes: Uint8Array): number {
  let a = 1, b = 0;
  for (const x of bytes) { a = (a + x) % 65521; b = (b + a) % 65521; }
  return ((b << 16) | a) >>> 0;
}
const hex8 = (n: number) => n.toString(16).padStart(8, '0');

const tools: McpToolExport['tools'] = [
  {
    name: 'crc32',
    description: 'Compute the CRC-32 (IEEE) checksum of UTF-8 text — the algorithm used by zip/gzip/PNG. Returns the unsigned 32-bit value and its hex form. Keyless, offline. (Error-detection checksum, not cryptographic.)',
    inputSchema: { type: 'object', properties: { text: { type: 'string', description: 'The text to checksum.' } }, required: ['text'] },
  },
  {
    name: 'adler32',
    description: 'Compute the Adler-32 checksum of UTF-8 text (as used by zlib). Returns the unsigned value and hex. Keyless, offline.',
    inputSchema: { type: 'object', properties: { text: { type: 'string', description: 'The text to checksum.' } }, required: ['text'] },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const text = args.text;
  if (typeof text !== 'string') throw new Error('Required argument "text" is missing (a string).');
  const bytes = new TextEncoder().encode(text);
  switch (name) {
    case 'crc32': { const v = crc32(bytes); return { algorithm: 'crc32', value: v, hex: hex8(v) }; }
    case 'adler32': { const v = adler32(bytes); return { algorithm: 'adler32', value: v, hex: hex8(v) }; }
    default: throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
