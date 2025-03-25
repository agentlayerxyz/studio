import { handleApiResponse, type ApiClient } from "./client.js";
import { z } from "zod";

export const WalletInfoSchema = z.object({
  publicKey: z.string(),
  createdAt: z.string(),
  metadata: z.record(z.unknown()),
  note: z.string().nullable(),
});

export type WalletInfo = z.infer<typeof WalletInfoSchema>;

export const TransferOptionsSchema = z.object({
  chainId: z.number(),
  tokenAddress: z.string(),
  to: z.union([z.string(), z.array(z.string())]),
  tokenAmount: z.union([z.string(), z.array(z.string())]),
  comment: z.string().optional(),
  scheduledAt: z.string().optional(),
});

export type TransferOptions = z.infer<typeof TransferOptionsSchema>;

export const TransferResultSchema = z.object({
  success: z.boolean(),
  operationIds: z.array(z.string()),
  error: z.union([z.string(), z.array(z.string())]).optional(),
});

export type TransferResult = z.infer<typeof TransferResultSchema>;

export const OperationStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "PROCESSING", "SUCCESS", "FAILED", "CANCELLED"]),
  txHash: z.string().optional(),
  amount: z.array(z.string()).optional(),
  to: z.array(z.string()).optional(),
});

export type OperationStatus = z.infer<typeof OperationStatusSchema>;

export const CallbackConfigSchema = z.object({
  type: z.enum(["PAYMENT", "TRANSFER", "BALANCE"]),
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  walletAddress: z.string(),
  callbackUrl: z.string(),
  metadata: z.record(z.unknown()),
});

export type CallbackConfig = z.infer<typeof CallbackConfigSchema>;

export const CallbackHistorySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  eventId: z.string(),
  walletAddress: z.string(),
  callbackUrl: z.string(),
  payload: z.record(z.unknown()),
  result: z.record(z.unknown()),
  configId: z.string().nullable(),
  error: z.string().nullable(),
});

export type CallbackHistory = z.infer<typeof CallbackHistorySchema>;

export const PaymentOptionsSchema = z.object({
  paymentWallet: z.string(),
  amount: z.string(),
  tokenNetwork: z.number(),
  tokenAddress: z.string(),
  description: z.string(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  expiredInMinutes: z.number().optional(),
});

export type PaymentOptions = z.infer<typeof PaymentOptionsSchema>;

export const PaymentResultSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  amount: z.string(),
  tokenAddress: z.string(),
  tokenNetwork: z.string(),
  description: z.string(),
  metadata: z.record(z.unknown()).optional(),
});

export type PaymentResult = z.infer<typeof PaymentResultSchema>;

export const BalanceAlertSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  walletAddress: z.string(),
  tokenAddress: z.string(),
  tokenNetwork: z.string(),
  type: z.enum([
    "BALANCE_ALERT_WARNING",
    "BALANCE_ALERT_CRITICAL",
    "BALANCE_THRESHOLD",
  ]),
  value: z.string(),
  operator: z.enum(["GREATER_THAN", "LESS_THAN", "EQUAL"]),
});

export type BalanceAlert = z.infer<typeof BalanceAlertSchema>;

export const BalanceAlertOptionsSchema = z.object({
  name: z.string(),
  tokenAddress: z.string(),
  tokenNetwork: z.string(),
  type: z.enum([
    "BALANCE_ALERT_WARNING",
    "BALANCE_ALERT_CRITICAL",
    "BALANCE_THRESHOLD",
  ]),
  operator: z.enum(["GREATER_THAN", "LESS_THAN", "EQUAL"]),
  value: z.string(),
});

export type BalanceAlertOptions = z.infer<typeof BalanceAlertOptionsSchema>;

export class WalletSdk {
  private apiClient: ApiClient;

  constructor(client: ApiClient) {
    this.apiClient = client;
  }

  /**
   * Get wallet information
   */
  async getWallet(): Promise<WalletInfo> {
    const response = await this.apiClient.GET("/wallet");
    return handleApiResponse<WalletInfo>(response);
  }

  /**
   * Transfer tokens to one or multiple addresses
   */
  async transfer(options: TransferOptions): Promise<TransferResult> {
    const response = await this.apiClient.POST("/wallet/transfer", {
      body: options,
    });
    return handleApiResponse<TransferResult>(response);
  }

  /**
   * Create a payment request
   */
  async createPayment(options: PaymentOptions): Promise<PaymentResult> {
    const response = await this.apiClient.POST("/wallet/payment", {
      body: options,
    });
    return handleApiResponse<PaymentResult>(response);
  }

  /**
   * Get callback configurations
   */
  async getCallbackConfigs(
    options: {
      page?: number;
      pageSize?: number;
      type?: "PAYMENT" | "TRANSFER" | "BALANCE";
    } = {}
  ) {
    const response = await this.apiClient.GET("/wallet/callback-config", {
      params: { query: options },
    });
    return handleApiResponse(response);
  }

  /**
   * Update a callback configuration
   */
  async updateCallbackConfig(
    id: string,
    callbackUrl: string
  ): Promise<CallbackConfig> {
    const response = await this.apiClient.PUT("/wallet/callback-config", {
      body: { id, callbackUrl },
    });
    return handleApiResponse<CallbackConfig>(response);
  }

  /**
   * Create a new callback configuration
   */
  async createCallbackConfig(
    type: "PAYMENT" | "TRANSFER" | "BALANCE",
    callbackUrl: string
  ): Promise<CallbackConfig> {
    const response = await this.apiClient.POST("/wallet/callback-config", {
      body: { type, callbackUrl },
    });
    return handleApiResponse<CallbackConfig>(response);
  }

  /**
   * Delete a callback configuration
   */
  async deleteCallbackConfig(id: string): Promise<{ success: boolean }> {
    const response = await this.apiClient.DELETE("/wallet/callback-config", {
      params: { query: { id } },
    });
    return handleApiResponse<{ success: boolean }>(response);
  }

  /**
   * Get callback history
   */
  async getCallbacks(
    options: {
      page?: number;
      pageSize?: number;
      type?: "PAYMENT" | "TRANSFER" | "BALANCE";
    } = {}
  ) {
    const response = await this.apiClient.GET("/wallet/callbacks", {
      params: { query: options },
    });
    return handleApiResponse(response);
  }

  /**
   * Retry a failed callback
   */
  async retryCallback(id: string): Promise<{ success: boolean }> {
    const response = await this.apiClient.POST("/wallet/callback/retry", {
      body: { id },
    });
    return handleApiResponse<{ success: boolean }>(response);
  }

  /**
   * Get balance alerts
   */
  async getBalanceAlerts(options: { page?: number; pageSize?: number } = {}) {
    const response = await this.apiClient.GET("/wallet/balance-alerts", {
      params: { query: options },
    });
    return handleApiResponse(response);
  }

  /**
   * Update a balance alert
   */
  async updateBalanceAlert(options: {
    id: string;
    name: string;
    tokenAddress: string;
    tokenNetwork: string;
    operator: "GREATER_THAN" | "LESS_THAN" | "EQUAL";
    value: string;
  }): Promise<BalanceAlert> {
    const response = await this.apiClient.PUT("/wallet/balance-alert", {
      body: options,
    });
    return handleApiResponse<BalanceAlert>(response);
  }

  /**
   * Create a new balance alert
   */
  async createBalanceAlert(
    options: BalanceAlertOptions
  ): Promise<BalanceAlert> {
    const response = await this.apiClient.POST("/wallet/balance-alert", {
      body: options,
    });
    return handleApiResponse<BalanceAlert>(response);
  }

  /**
   * Delete a balance alert
   */
  async deleteBalanceAlert(id: string): Promise<{ success: boolean }> {
    const response = await this.apiClient.DELETE("/wallet/balance-alert", {
      params: { query: { id } },
    });
    return handleApiResponse<{ success: boolean }>(response);
  }
}
