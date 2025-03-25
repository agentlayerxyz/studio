import { type LanguageModel } from "ai";
import { type ZodSchema } from "zod";

export type ReceivingMessageParameters = {
  id: string;
  message: string;
  runtime: AgentRuntime;
  topicId?: string;
  from?: string;
  replyTo?: string;
};

export type SendingMessageParameters = Omit<
  ReceivingMessageParameters,
  "runtime"
> & {
  to: string;
};

export interface Agent<TResponse = string, TPartialResponse = string> {
  id: string;
  name: string;
  description: string;
  goals: Goal[];
  providers: ContextProvider[];
  actions: Action<unknown, unknown>[];
  evaluators: Evaluator<TResponse, TPartialResponse>[];
  model: LanguageModel;

  onMessage(parameters: ReceivingMessageParameters): Promise<TResponse>;

  onMessageStream(
    parameters: ReceivingMessageParameters
  ): ReadableStream<TPartialResponse>;
}

export enum AgentRole {
  MANAGER = "MANAGER",
  ASSISTANT = "ASSISTANT",
}

export type AgentRuntimeRegisterParameters = {
  agent: Agent;
  role: AgentRole;
};

export interface AgentRuntime {
  agents: Map<
    string,
    {
      agent: Agent;
      role: AgentRole;
    }
  >;

  memoryManager: MemoryManager;
  messageManager: MessageManager;
  scheduler: Scheduler;

  register(parameters: AgentRuntimeRegisterParameters): void;

  initialize(): Promise<void>;

  shutdown(): Promise<void>;
}

export interface Goal {
  name: string;
  description: string;
  objectives: Objective[];
}

export enum ObjectiveStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Objective {
  title: string;
  status: ObjectiveStatus;
}

export interface MessageManager {
  sendMessage(parameters: SendingMessageParameters): Promise<unknown>;
}

export type ScheduleOnceParameters = {
  agentId: string;
  message: string;
  delayMs: number;
};

export type ScheduleRepeatParameters = {
  agentId: string;
  message: string;
  intervalMs: number;
};

export interface Scheduler {
  runtime: AgentRuntime;
  scheduleOnce(parameters: ScheduleOnceParameters): string;
  repeat(parameters: ScheduleRepeatParameters): string;
  cancel(scheduleId: string): void;
}

export interface Memory {
  agentId: string;
  content: string;
  isPrivate: boolean;
  embedding?: number[];
  relevance?: number;
}

export interface MemoryManager {
  runtime: AgentRuntime;
  save: (data: Memory) => Promise<void>;
  list: () => Promise<Memory[]>;
  search: (query: string) => Promise<Memory[]>;
}

export interface Context {
  subject: string;
  content: string;
  rank?: number;
}

export type ContextProviderParameters = {
  context: Context[];
  runtime: AgentRuntime;
};

export interface ContextProvider {
  get: (parameters: ContextProviderParameters) => Promise<Context>;
}

export type ActionHandlerParameters<TActionParams> = {
  parameters: TActionParams;
  runtime: AgentRuntime;
  context: Context[];
};

export interface Action<TActionParams, TActionResponse = void> {
  name: string;
  description?: string;
  parameters: ZodSchema<TActionParams>;
  response: ZodSchema<TActionResponse>;
  handler: (
    parameters: ActionHandlerParameters<TActionParams>
  ) => Promise<TActionResponse>;
}

export interface Evaluator<TResponse = string, TPartialResponse = string> {
  name: string;

  evaulateParitalResponse: (parameters: {
    response: TPartialResponse;
    runtime: AgentRuntime;
    context: Context[];
  }) => Promise<void>;

  evaluateResponse: (parameters: {
    response: TResponse;
    runtime: AgentRuntime;
    context: Context[];
  }) => Promise<void>;
}
