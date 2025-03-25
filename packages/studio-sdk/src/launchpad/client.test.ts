import { describe, it, expect, vi, beforeEach } from "vitest";
import { createApiClient, handleApiResponse } from "./client.js";

describe("createApiClient", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it("should create a client with environment variables", () => {
    process.env.PUMP_AGENT_API_ROOT = "https://api.example.com";
    process.env.PUMP_AGENT_API_KEY = "test-api-key";

    const client = createApiClient();
    expect(client).toBeDefined();
  });

  it("should create a client with provided config", () => {
    const config = {
      apiRoot: "https://api.example.com",
      apiKey: "test-api-key",
    };

    const client = createApiClient(config);
    expect(client).toBeDefined();
  });

  it("should throw error when API root is not set", () => {
    process.env.PUMP_AGENT_API_KEY = "test-api-key";
    delete process.env.PUMP_AGENT_API_ROOT;

    expect(() => createApiClient()).toThrow("API root is not set");
  });

  it("should throw error when API key is not set", () => {
    process.env.PUMP_AGENT_API_ROOT = "https://api.example.com";
    delete process.env.PUMP_AGENT_API_KEY;

    expect(() => createApiClient()).toThrow("API key is not set");
  });
});

describe("handleApiResponse", () => {
  it("should return data when response is successful", () => {
    const mockData = { test: "data" };
    const response = { data: mockData };

    const result = handleApiResponse(response);
    expect(result).toEqual(mockData);
  });

  it("should throw error when response contains error", () => {
    const errorResponse = {
      error: {
        message: "Test error message",
        code: "TEST_ERROR",
        issues: [{ message: "Test issue" }],
      },
    };

    expect(() => handleApiResponse(errorResponse)).toThrow(
      "Test error message"
    );
  });
});
