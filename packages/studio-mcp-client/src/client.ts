import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { type McpClientOptions } from "./type.js";

const defaultClientInfo = {
  name: "agentstudio-mcp-client",
  version: "1.0.0",
};

export async function createMcpClient({
  clientInfo = defaultClientInfo,
  transport,
  capabilities = {
    prompts: {},
    resources: {},
    tools: {},
  },
}: McpClientOptions) {
  let _transport;

  if (transport.type === "stdio") {
    if (!transport.command) {
      throw new Error("Command is required for stdio transport");
    }

    _transport = new StdioClientTransport({
      command: transport.command,
      args: transport.args ?? [],
    });
  } else if (transport.type === "sse") {
    if (!transport.serverUrl) {
      throw new Error("Server URL is required for SSE transport");
    }

    const serverUrl = new URL(transport.serverUrl);
    _transport = new SSEClientTransport(serverUrl);
  } else {
    throw new Error("Unsupported transport type");
  }

  const client = new Client(clientInfo, { capabilities });

  await client.connect(_transport);

  return client;
}
