# mcp-crc

Checksum MCP — CRC-32 & Adler-32.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1152+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `crc32` | Compute the CRC-32 (IEEE) checksum of UTF-8 text — the algorithm used by zip/gzip/PNG. Returns the unsigned 32-bit value and its hex form. Keyless, offline. (Error-detection checksum, not cryptographic.) |
| `adler32` | Compute the Adler-32 checksum of UTF-8 text (as used by zlib). Returns the unsigned value and hex. Keyless, offline. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "crc": {
      "url": "https://gateway.pipeworx.io/crc/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1152+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Crc data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
