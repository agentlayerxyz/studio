export interface McpOptions {
  // Transport configuration
  transport:
    | {
        type: "stdio";
        command: string;
        args?: string[];
      }
    | {
        type: "sse";
        serverUrl: string;
        sseEndpoint?: string;
        messageEndpoint?: string;
      };

  // Capabilities to request from the server
  capabilities?: {
    prompts?: { listChanged?: boolean };
    resources?: { listChanged?: boolean; subscribe?: boolean };
    tools?: { listChanged?: boolean };
  };
}

export interface McpClientOptions extends McpOptions {
  // Client identification
  clientInfo?: {
    name: string;
    version: string;
  };
}

export interface McpServerOptions extends McpOptions {
  // Server identification
  serverInfo: {
    name: string;
    id: string;
  };
}
