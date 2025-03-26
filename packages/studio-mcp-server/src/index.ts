#!/usr/bin/env node

import { LaunchpadSdk, TransferOptionsSchema } from "@agentstudio/sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export class StudioMcpServer {
  private server: McpServer;
  private sdk: LaunchpadSdk;

  constructor(agentApiKey: string) {
    this.server = new McpServer({
      name: "agentstudio-mcp-server",
      version: "0.0.1",
    });

    this.sdk = new LaunchpadSdk({
      apiKey: agentApiKey,
    });

    this.init();
  }

  async init() {
    this.server.resource(
      "basci-info",
      "https://pumpagent.ai/agent/info/basic",
      async (uri) => {
        const info = await this.sdk.info.getBasicInfo({ format: "plain-text" });
        return {
          contents: [
            {
              type: "text",
              text: info as string,
              uri: uri.href,
            },
          ],
        };
      }
    );

    this.server.resource(
      "token-info",
      "https://pumpagent.ai/agent/info/token",
      async (uri) => {
        const info = await this.sdk.info.getTokenInfo();
        return {
          contents: [
            {
              type: "text",
              uri: uri.href,
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      }
    );

    this.server.resource(
      "persona",
      "https://pumpagent.ai/agent/info/persona",
      async (uri) => {
        const persona = await this.sdk.info.getPersona({
          format: "plain-text",
        });

        return {
          contents: [
            {
              type: "text",
              text: persona as string,
              uri: uri.href,
            },
          ],
        };
      }
    );

    this.server.resource(
      "objectives",
      "https://pumpagent.ai/agent/info/objectives",
      async (uri) => {
        const objectives = await this.sdk.info.getObjectives({
          format: "plain-text",
        });

        return {
          contents: [
            {
              type: "text",
              text: objectives as string,
              uri: uri.href,
            },
          ],
        };
      }
    );

    // TODO support message methods

    // TODO support twitter methods

    // TODO support other wallet methods

    this.server.tool(
      "wallet-transfer",
      TransferOptionsSchema.shape,
      async (args) => {
        const transfer = await this.sdk.wallet.transfer(args);

        if (transfer.success) {
          return {
            isError: false,
            content: [
              {
                type: "text",
                text: transfer.operationIds.join(", "),
              },
            ],
          };
        } else {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: transfer.error as string,
              },
            ],
          };
        }
      }
    );
  }

  getServer() {
    return this.server;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async stop() {
    await this.server.close();
  }
}

async function main() {
  try {
    const args = process.argv.slice(2);
    if (args.length < 1) {
      console.error("API key is required as a command line argument");
      process.exit(1);
    }
    const apiKey = args[0] ?? (process.env.AGENT_API_KEY as string);

    if (!apiKey) {
      console.error("API key is required as a command line argument");
    }

    const server = new StudioMcpServer(apiKey);
    await server.start();
    console.error("AgentStudio MCP server running on stdio");
  } catch (error) {
    console.error("Error during startup", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
