import { handleApiResponse, type ApiClient } from "./client.js";

import { z } from "zod";

export const TweetOptionsSchema = z.object({
  content: z.string(),
  replyToId: z.string().optional(),
  quoteId: z.string().optional(),
});

export type TweetOptions = z.infer<typeof TweetOptionsSchema>;

export const UserTweetsOptionsSchema = z.object({
  username: z.string().optional(),
  maxResults: z.number().optional(),
  includeReplies: z.boolean().optional(),
  includeRetweets: z.boolean().optional(),
  output: z.enum(["full", "simple", "minimum"]).optional(),
});

export type UserTweetsOptions = z.infer<typeof UserTweetsOptionsSchema>;

export const SearchTweetsOptionsSchema = z.object({
  query: z.string(),
  maxResults: z.number().optional(),
  mode: z.number().optional(),
  output: z.enum(["full", "simple", "minimum"]).optional(),
});

export type SearchTweetsOptions = z.infer<typeof SearchTweetsOptionsSchema>;

export const UserInfoSchema = z.object({
  avatar: z.string().optional(),
  banner: z.string().optional(),
  biography: z.string().optional(),
  birthday: z.string().optional(),
  canDm: z.boolean().optional(),
  followersCount: z.number().optional(),
  followingCount: z.number().optional(),
  friendsCount: z.number().optional(),
  isBlueVerified: z.boolean().optional(),
  isPrivate: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  joined: z.string().optional(),
  likesCount: z.number().optional(),
  listedCount: z.number().optional(),
  location: z.string().optional(),
  mediaCount: z.number().optional(),
  name: z.string().optional(),
  pinnedTweetIds: z.array(z.string()).optional(),
  statusesCount: z.number().optional(),
  tweetsCount: z.number().optional(),
  url: z.string().optional(),
  userId: z.string().optional(),
  username: z.string().optional(),
  website: z.string().optional(),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;

export class TwitterSdk {
  private apiClient: ApiClient;

  constructor(client: ApiClient) {
    this.apiClient = client;
  }

  /**
   * Create a tweet or reply to an existing tweet
   */
  async tweet(options: TweetOptions) {
    const response = await this.apiClient.POST("/tool/twitter/tweet", {
      body: options,
    });
    return handleApiResponse(response);
  }

  /**
   * Retweet a tweet
   */
  async retweet(tweetId: string) {
    const response = await this.apiClient.POST("/tool/twitter/retweet", {
      body: { tweetId },
    });
    return handleApiResponse(response);
  }

  /**
   * Like a tweet
   */
  async like(tweetId: string) {
    const response = await this.apiClient.POST("/tool/twitter/like", {
      body: { tweetId },
    });
    return handleApiResponse(response);
  }

  /**
   * Get user information by username
   */
  async getUserInfo(username: string): Promise<UserInfo> {
    const response = await this.apiClient.GET("/tool/twitter/user-info", {
      params: { query: { username } },
    });
    return handleApiResponse<UserInfo>(response);
  }

  /**
   * Get recent tweets by username or by the default user
   */
  async getUserTweets(options: UserTweetsOptions = {}) {
    const response = await this.apiClient.GET("/tool/twitter/user-tweets", {
      params: { query: options },
    });
    return handleApiResponse(response);
  }

  /**
   * Search tweets by query
   */
  async searchTweets(options: SearchTweetsOptions) {
    const response = await this.apiClient.GET("/tool/twitter/search", {
      params: { query: options },
    });
    return handleApiResponse(response);
  }

  /**
   * Get mentions by username
   */
  async getMentions(
    options: {
      username?: string;
      maxResults?: number;
      output?: "full" | "simple" | "minimum";
    } = {}
  ) {
    const response = await this.apiClient.GET("/tool/twitter/mentions", {
      params: { query: options },
    });
    return handleApiResponse(response);
  }

  /**
   * Get tweets by conversation ID
   */
  async getTweetsByConversation(
    conversationId: string,
    options: {
      maxResults?: number;
      output?: "full" | "simple" | "minimum";
    } = {}
  ) {
    const response = await this.apiClient.GET(
      "/tool/twitter/by-conversation-id",
      {
        params: { query: { conversationId, ...options } },
      }
    );
    return handleApiResponse(response);
  }

  /**
   * Get followers by username
   */
  async getFollowers(username: string) {
    const response = await this.apiClient.GET("/tool/twitter/followers", {
      params: { query: { username } },
    });
    return handleApiResponse(response);
  }

  /**
   * Get following by username
   */
  async getFollowing(username: string) {
    const response = await this.apiClient.GET("/tool/twitter/following", {
      params: { query: { username } },
    });
    return handleApiResponse(response);
  }
}
