import createClient from "openapi-fetch";
import type { paths } from "../lib/pump-agent/api.js";
import { logger } from "@agentlayer/logging";

/**
 * Create a client for the Pump Agent API
 * @param config - The configuration for the client
 * @returns A client for the Pump Agent API
 */
export const createApiClient = (config?: {
  apiRoot?: string;
  apiKey?: string;
}) => {
  const apiRoot =
    config?.apiRoot ??
    process.env.PUMPAGENT_API_ROOT ??
    "https://pumpagent.ai/api";
  const apiKey = config?.apiKey ?? process.env.PUMPAGENT_API_KEY;

  if (!apiRoot) {
    throw new Error(
      "API root is not set. You can set it by PUMPAGENT_API_ROOT environment variable or by passing apiRoot option."
    );
  }

  if (!apiKey) {
    throw new Error(
      "API key is not set. You can set it by PUMPAGENT_API_KEY environment variable or by passing apiKey option."
    );
  }

  return createClient<paths>({
    baseUrl: `${apiRoot}`,
    headers: {
      "x-api-key": apiKey,
      "content-type": "application/json",
    },
  });
};

export const handleApiResponse = <T>(
  response:
    | { data: T; error?: never }
    | {
        data?: never;
        error: {
          message: string;
          code: string;
          issues?: {
            message: string;
          }[];
        };
      }
): T => {
  if (response.error) {
    logger.error(
      `Fail to call pump agent api: ${response.error.code} ${response.error.message}`
    );
    throw new Error(response.error.message);
  }

  return response.data;
};

export type ApiClient = ReturnType<typeof createApiClient>;
