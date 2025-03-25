import { z } from "zod";
import type {
  Action,
  ActionHandlerParameters,
  Agent,
  AgentRuntime,
  Memory,
  MemoryManager,
} from "./type.js";

export interface MemoeryAdaptor {
  save(data: Memory): Promise<void>;
  list(): Promise<Memory[]>;
  search(query: string): Promise<Memory[]>;
}

export class BaseMemoryManager implements MemoryManager {
  runtime: AgentRuntime;
  adaptor: MemoeryAdaptor;

  constructor(runtime: AgentRuntime, adaptor: MemoeryAdaptor) {
    this.runtime = runtime;
    this.adaptor = adaptor;
  }

  save(data: Memory): Promise<void> {
    return this.adaptor.save(data);
  }

  list(): Promise<Memory[]> {
    return this.adaptor.list();
  }

  search(query: string): Promise<Memory[]> {
    return this.adaptor.search(query);
  }
}

const saveMemorySchema = z.object({
  memory: z.string(),
  isPrivate: z.boolean().optional(),
});

type SaveMemoryActionArgs = z.infer<typeof saveMemorySchema>;

const saveMemoryResponseSchema = z.object({
  status: z.enum(["success", "error"]),
});

type SaveMemoryActionResponse = z.infer<typeof saveMemoryResponseSchema>;

export class SaveMemoryAction
  implements Action<SaveMemoryActionArgs, SaveMemoryActionResponse>
{
  agent: Agent;

  name = "save_memory";
  parameters = saveMemorySchema;
  response = saveMemoryResponseSchema;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  async handler({
    parameters,
    runtime,
  }: ActionHandlerParameters<SaveMemoryActionArgs>) {
    runtime.memoryManager.save({
      agentId: this.agent.id,
      content: parameters.memory,
      isPrivate: parameters.isPrivate ?? false,
    });
    return { status: "success" } as SaveMemoryActionResponse;
  }
}
