import { handleApiResponse, type ApiClient } from "./client.js";
import { z } from "zod";

export const MessageSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  message: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  deletedAt: z.string().nullable(),
  replyToMessage: z.string().nullable(),
  replyToUser: z.string().nullable(),
  rootMessageId: z.string().nullable(),
  replyCount: z.number().optional(),
});

export const MessageSchemaWithReplies = MessageSchema.extend({
  replies: z.array(MessageSchema).optional(),
});

export type Message = z.infer<typeof MessageSchema>;
export type MessageWithReplies = z.infer<typeof MessageSchemaWithReplies>;

export const MessageStatsSchema = z.object({
  total: z.number(),
  selfTotal: z.number(),
  self24h: z.number(),
  self7d: z.number(),
});

export type MessageStats = z.infer<typeof MessageStatsSchema>;

export const RecentMessageSchema = z.object({
  id: z.string(),
  message: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
});

export type RecentMessage = z.infer<typeof RecentMessageSchema>;

export const MessageHistorySchema = z.object({
  messages: z.array(RecentMessageSchema),
});

export type MessageHistory = z.infer<typeof MessageHistorySchema>;

export const MessageDetailsSchema = z.object({
  id: z.string(),
  message: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  replies: z.array(MessageSchema),
});

export type MessageDetails = z.infer<typeof MessageDetailsSchema>;

export class MessageSdk {
  private apiClient: ApiClient;

  constructor(client: ApiClient) {
    this.apiClient = client;
  }

  /**
   * Get a list of messages posted to the agent's message board
   */
  async getMessages(
    options: {
      page?: number;
      pageSize?: number;
      replyLimit?: number;
    } = {}
  ) {
    const response = await this.apiClient.GET("/tool/message", {
      params: { query: options },
    });
    return handleApiResponse(response);
  }

  /**
   * Create a message on the agent's message board
   */
  async createMessage(message: string, replyTo?: string): Promise<Message> {
    const response = await this.apiClient.POST("/tool/message", {
      body: { message, replyTo },
    });
    return handleApiResponse<Message>(response);
  }

  /**
   * Get recent messages (original and replies) posted by user to the agent's message board
   */
  async getRecentMessages(
    options: {
      limit?: number;
      lookbackMinutes?: number;
    } = {}
  ) {
    const response = await this.apiClient.GET("/tool/message/recent", {
      params: { query: options },
    });
    return handleApiResponse<{ messages: RecentMessage[] }>(response);
  }

  /**
   * Get the history of messages posted by the agent
   */
  async getMessageHistory(): Promise<MessageHistory> {
    const response = await this.apiClient.GET("/tool/message/history");
    return handleApiResponse<MessageHistory>(response);
  }

  /**
   * Get the number of messages created and total messages on the agent's message board
   */
  async getMessageStats(): Promise<MessageStats> {
    const response = await this.apiClient.GET("/tool/message/stats");
    return handleApiResponse<MessageStats>(response);
  }

  /**
   * Get details of a message by its ID, including all replies tracked back to the original message
   */
  // async getMessageDetails(messageId: string): Promise<MessageDetails> {
  //   const response = await this.apiClient.GET("/tool/message/{messageId}", {
  //     params: { path: { messageId } },
  //   });
  //   return handleResponse<MessageDetails>(response);
  // }

  /**
   * Reset message reply cache
   */
  async resetReplyCache(): Promise<{ success: boolean }> {
    const response = await this.apiClient.POST("/tool/message/reset-replies", {
      body: {},
    });
    return handleApiResponse<{ success: boolean }>(response);
  }
}
