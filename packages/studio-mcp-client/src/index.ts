import { type McpServerOptions } from "./type.js";
import { type Client } from "@modelcontextprotocol/sdk/client/index.js";
import { logger } from "@agentlayer/logging";
import { createMcpClient } from "./client.js";

export class StudioMcpClient {
  private clients: Map<string, Client>;
  private serverOptions: McpServerOptions[];
  private initialized = false;

  constructor(serverOptions: McpServerOptions[], autoInit = true) {
    this.clients = new Map<string, Client>();
    this.serverOptions = serverOptions;

    if (autoInit) {
      this.init();
    }
  }

  async init() {
    logger.info("Initialize to mcp clients");

    for (const serverOption of this.serverOptions) {
      const { serverInfo, ...options } = serverOption;

      logger.info(
        `Connecting to mcp server for ${serverInfo.id} / ${serverInfo.name} / ${options.transport.type}`
      );

      try {
        const client = await createMcpClient(options);
        this.clients.set(serverInfo.id, client);
        logger.info(
          `Connected to mcp server for ${serverInfo.id} / ${serverInfo.name} / ${options.transport.type}`
        );
      } catch (error) {
        logger.error(
          `Failed to connect to mcp server for ${serverInfo.id} / ${serverInfo.name} / ${options.transport.type}`,
          error
        );
      }
    }

    this.initialized = true;
  }

  async listPrompts() {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const clients = this.clients;

    try {
      const prompts = await Promise.all(
        Array.from(clients.entries())
          .filter(([, client]) => !!client.getServerCapabilities()?.prompts)
          .map(async ([serverId, client]) => {
            const { prompts } = await client.listPrompts();

            return prompts.map((prompt) => ({
              ...prompt,
              name: `${serverId}.${prompt.name}`,
            }));
          })
      );

      return prompts.flat();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to list prompts", {
        error: errorMessage,
      });
      return { error: errorMessage };
    }
  }

  async listPromptsByServer(serverId: string) {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const client = this.clients.get(serverId);

    if (!client) {
      return {
        error: `MCP server with ID '${serverId}' not found`,
      };
    }

    try {
      if (!client.getServerCapabilities()?.prompts) {
        return {
          error: `MCP server with ID '${serverId}' does not support prompts`,
        };
      }

      const { prompts } = await client.listPrompts();
      return prompts;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to list prompts", {
        error: errorMessage,
      });
      return { error: errorMessage };
    }
  }

  async getPrompt(
    serverId: string,
    promptName: string,
    args: Record<string, any>
  ) {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const client = this.clients.get(serverId);

    if (!client) {
      return {
        error: `MCP server with ID '${serverId}' not found`,
      };
    }

    if (!client.getServerCapabilities()?.prompts) {
      return {
        error: `MCP server with ID '${serverId}' does not support prompts`,
      };
    }

    const { prompt } = await client.getPrompt({
      name: promptName,
      arguments: args,
    });
    return prompt;
  }

  async listResources() {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const clients = this.clients;

    try {
      const resources = await Promise.all(
        Array.from(clients.entries())
          .filter(([, client]) => !!client.getServerCapabilities()?.resources)
          .map(async ([serverId, client]) => {
            const { resources } = await client.listResources();

            return resources.map((resource) => ({
              ...resource,
              name: `${serverId}.${resource.name}`,
            }));
          })
      );

      return resources.flat();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to list resources", { error: errorMessage });
    }
  }

  async listResourcesByServer(serverId: string) {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const client = this.clients.get(serverId);

    if (!client) {
      return {
        error: `MCP server with ID '${serverId}' not found`,
      };
    }

    if (!client.getServerCapabilities()?.resources) {
      return {
        error: `MCP server with ID '${serverId}' does not support resources`,
      };
    }

    try {
      const { resources } = await client.listResources();
      return resources;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to list resources", { error: errorMessage });
    }
  }

  async readResource(serverId: string, uri: string) {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const client = this.clients.get(serverId);

    if (!client) {
      return {
        error: `MCP server with ID '${serverId}' not found`,
      };
    }

    if (!client.getServerCapabilities()?.resources) {
      return {
        error: `MCP server with ID '${serverId}' does not support resources`,
      };
    }

    try {
      const { resource } = await client.readResource({ uri });
      return resource;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to read resource", { error: errorMessage });
    }
  }

  async listResourceTemplates() {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const clients = this.clients;

    try {
      const resourceTemplates = await Promise.all(
        Array.from(clients.entries())
          .filter(([, client]) => !!client.getServerCapabilities()?.resources)
          .map(async ([serverId, client]) => {
            const { resourceTemplates } = await client.listResourceTemplates();

            return resourceTemplates.map((resourceTemplate) => ({
              ...resourceTemplate,
              name: `${serverId}.${resourceTemplate.name}`,
            }));
          })
      );

      return resourceTemplates.flat();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to list resource templates", {
        error: errorMessage,
      });
    }
  }

  async listResourceTemplatesByServer(serverId: string) {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const client = this.clients.get(serverId);

    if (!client) {
      return {
        error: `MCP server with ID '${serverId}' not found`,
      };
    }

    if (!client.getServerCapabilities()?.resources) {
      return {
        error: `MCP server with ID '${serverId}' does not support resources`,
      };
    }

    try {
      const { resourceTemplates } = await client.listResourceTemplates();
      return resourceTemplates;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to list resource templates", {
        error: errorMessage,
      });
    }
  }

  async listTools() {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const clients = this.clients;

    try {
      const tools = await Promise.all(
        Array.from(clients.entries())
          .filter(([, client]) => !!client.getServerCapabilities()?.tools)
          .map(async ([serverId, client]) => {
            const { tools } = await client.listTools();

            return tools.map((tool) => ({
              ...tool,
              name: `${serverId}.${tool.name}`,
            }));
          })
      );

      return tools.flat();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to list tools", { error: errorMessage });
    }
  }

  async listToolsByServer(serverId: string) {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const client = this.clients.get(serverId);

    if (!client) {
      return {
        error: `MCP server with ID '${serverId}' not found`,
      };
    }

    if (!client.getServerCapabilities()?.tools) {
      return {
        error: `MCP server with ID '${serverId}' does not support tools`,
      };
    }

    try {
      const { tools } = await client.listTools();
      return tools;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to list tools", { error: errorMessage });
    }
  }

  async callTool(serverId: string, toolId: string, args?: Record<string, any>) {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    const client = this.clients.get(serverId);

    if (!client) {
      return {
        error: `MCP server with ID '${serverId}' not found`,
      };
    }

    if (!client.getServerCapabilities()?.tools) {
      return {
        error: `MCP server with ID '${serverId}' does not support tools`,
      };
    }

    try {
      const { result } = await client.callTool({
        name: toolId,
        arguments: args ?? {},
      });
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error("Failed to call tool", { error: errorMessage });
    }
  }

  listServers() {
    if (!this.initialized) {
      throw new Error("Client is not initialized");
    }

    return this.serverOptions.map((item) => ({
      ...item,
      connected: this.clients.has(item.serverInfo.id),
    }));
  }
}
