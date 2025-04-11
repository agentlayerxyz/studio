#!/usr/bin/env node

import { LaunchpadSdk, TransferOptionsSchema } from "@agentstudio/sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Logger } from "@agentlayer/logging";
import { z } from "zod";

const logger = new Logger({
  service: "agentstudio-mcp-server",
  useStdErr: true,
});

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
    this.server.resource("basci-info", "agent://info/basic", async (uri) => {
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
    });

    this.server.resource("token-info", "agent://info/token", async (uri) => {
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
    });

    this.server.resource("persona", "agent://info/persona", async (uri) => {
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
    });

    this.server.resource(
      "objectives",
      "agent://info/objectives",
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

    this.server.resource("wallet", "agent://info/wallet", async (uri) => {
      const wallet = await this.sdk.wallet.getWallet();
      return {
        contents: [
          {
            type: "text",
            text: wallet.publicKey,
            uri: uri.href,
          },
        ],
      };
    });

    this.server.resource(
      "recent-messages",
      "agent://message/recent",
      async () => {
        const { messages } = await this.sdk.message.getRecentMessages();
        return {
          contents: messages.map((item) => ({
            type: "text",
            text: item.message,
            uri: `agent://message/${item.id}`,
          })),
        };
      }
    );

    this.server.tool(
      "send-message",
      "Send a message to PumpAgent message board as the agent",
      {
        message: z.string(),
        replyTo: z.string().optional(),
      },
      async (args) => {
        try {
          const message = await this.sdk.message.createMessage(
            args.message,
            args.replyTo
          );

          return {
            isError: false,
            content: [
              {
                type: "resource",
                resource: {
                  mimeType: "text/plain",
                  uri: `agent://message/${message.id}`,
                  text: message.message,
                },
              },
            ],
          };
        } catch (error) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text:
                  error instanceof Error
                    ? error.message
                    : JSON.stringify(error),
              },
            ],
          };
        }
      }
    );

    // TODO support twitter methods

    // TODO support other wallet methods

    this.server.tool(
      "wallet-transfer",
      "Transfer ERC20 tokens to one or more wallet addresses on a given EVM compatible blockchain",
      TransferOptionsSchema.shape,
      async (args) => {
        const transfer = await this.sdk.wallet.transfer(args);

        if (transfer.success) {
          return {
            isError: false,
            content: transfer.operationIds.map((operationId) => ({
              type: "resource",
              resource: {
                mimeType: "text/plain",
                uri: `agent://wallet/transfer/${operationId}`,
                text: operationId,
              },
            })),
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

    const apiKey = args[0] ?? (process.env.AGENT_API_KEY as string);

    if (!apiKey) {
      logger.info(
        "API key is required either as a command line argument or as the AGENT_API_KEY environment variable"
      );
      process.exit(1);
    }

    const server = new StudioMcpServer(apiKey);
    await server.start();
    logger.info("AgentStudio MCP server running on stdio");
  } catch (error) {
    logger.error("Error during startup", error);
    process.exit(1);
  }
}

main().catch((error) => {
  logger.error("Fatal error in main():", error);
  process.exit(1);
});
