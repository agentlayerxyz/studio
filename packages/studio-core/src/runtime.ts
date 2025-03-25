import { logInfo } from "./logger.js";
import type { MemoeryAdaptor } from "./memory.js";
import { BaseMemoryManager } from "./memory.js";
import type {
  Agent,
  AgentRole,
  AgentRuntime,
  AgentRuntimeRegisterParameters,
  MemoryManager,
  MessageManager,
  Scheduler,
} from "./type.js";

export class BaseAgentRuntime implements AgentRuntime {
  agents: Map<string, { agent: Agent; role: AgentRole }>;

  memoryManager: MemoryManager;
  messageManager: MessageManager;
  scheduler: Scheduler;

  constructor(
    messageManager: MessageManager,
    scheduler: Scheduler,
    memoryAdaptor: MemoeryAdaptor
  ) {
    this.agents = new Map();
    this.memoryManager = new BaseMemoryManager(this, memoryAdaptor);
    this.messageManager = messageManager;
    this.scheduler = scheduler;
  }

  register(parameters: AgentRuntimeRegisterParameters): void {
    this.agents.set(parameters.agent.id, {
      agent: parameters.agent,
      role: parameters.role,
    });
    logInfo(`Agent ${parameters.agent.id} registered as ${parameters.role}`);
  }

  async initialize(): Promise<void> {
    // await this.scheduler.start();
  }

  async shutdown(): Promise<void> {
    // await this.scheduler.stop();
  }
}
