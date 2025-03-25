import { handleApiResponse, type ApiClient } from "./client.js";

export interface BasicInfo {
  name: string;
  description: string;
  ticker: string;
  tokenAddress: string;
  tokenStatus: string;
  walletAddress: string | null;
}

export interface TokenInfo {
  creator: string;
  status: string;
  ticker: string;
  address: string;
  assetToken: string;
  price: string;
  priceUsd: string;
  marketCap: string;
  marketCapUsd: string;
  holderCount: number;
}

export interface TokenHolder {
  address: string;
  balance: string;
}

export interface TokenHoldersResponse {
  holders: TokenHolder[];
  cursor?: string;
  hasNext: boolean;
}

export interface ObjectivesResponse {
  objectives: string;
}

export type PersonaResponse = Record<string, number>;

export type MessageSettingsResponse = Record<string, unknown>;

export type TwitterSettingsResponse = Record<string, unknown>;

export class InfoSdk {
  private apiClient: ApiClient;

  constructor(client: ApiClient) {
    this.apiClient = client;
  }

  /**
   * Get basic information about the agent
   */
  async getBasicInfo(
    options: { format?: "object" | "plain-text" } = {}
  ): Promise<BasicInfo | string> {
    const response = await this.apiClient.GET("/info/basic", {
      params: { query: options },
    });
    return handleApiResponse<BasicInfo | string>(response);
  }

  /**
   * Get the agent's objectives
   */
  async getObjectives(
    options: { format?: "object" | "plain-text" } = {}
  ): Promise<ObjectivesResponse | string> {
    const response = await this.apiClient.GET("/info/objectives", {
      params: { query: options },
    });
    return handleApiResponse<ObjectivesResponse | string>(response);
  }

  /**
   * Get the agent's persona information
   */
  async getPersona(
    options: { format?: "object" | "plain-text" } = {}
  ): Promise<PersonaResponse | string> {
    const response = await this.apiClient.GET("/info/persona", {
      params: { query: options },
    });
    return handleApiResponse<PersonaResponse | string>(response);
  }

  /**
   * Get the agent's message settings
   */
  async getMessageSettings(
    options: { format?: "object" | "plain-text" } = {}
  ): Promise<MessageSettingsResponse | string> {
    const response = await this.apiClient.GET("/info/message-settings", {
      params: { query: options },
    });
    return handleApiResponse<MessageSettingsResponse | string>(response);
  }

  /**
   * Get the agent's Twitter settings
   */
  async getTwitterSettings(
    options: { format?: "object" | "plain-text" } = {}
  ): Promise<TwitterSettingsResponse | string> {
    const response = await this.apiClient.GET("/info/twitter-settings", {
      params: { query: options },
    });
    return handleApiResponse<TwitterSettingsResponse | string>(response);
  }

  /**
   * Get information about the agent's token
   */
  async getTokenInfo(): Promise<TokenInfo> {
    const response = await this.apiClient.GET("/info/token");
    return handleApiResponse<TokenInfo>(response);
  }

  /**
   * Get a list of token holders
   */
  async getTokenHolders(
    options: { limit?: number; cursor?: string } = {}
  ): Promise<TokenHoldersResponse> {
    const response = await this.apiClient.GET("/info/token-holders", {
      params: { query: options },
    });
    return handleApiResponse<TokenHoldersResponse>(response);
  }
}
