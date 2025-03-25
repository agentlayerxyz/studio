import { z } from "zod";
import { CommonError, ErrorCode } from "./error.js";
import { logError, logInfo } from "./logger.js";
import type {
  Action,
  ActionHandlerParameters,
  Agent,
  AgentRuntime,
  MessageManager,
  SendingMessageParameters,
} from "./type.js";
import { nanoid } from "nanoid";

export class SimpleMessageManager implements MessageManager {
  runtime: AgentRuntime;

  constructor(runtime: AgentRuntime) {
    this.runtime = runtime;
  }

  sendMessage({
    id,
    topicId,
    message,
    to,
    from,
    replyTo,
  }: SendingMessageParameters): Promise<string> {
    const agentInfo = this.runtime.agents.get(to);
    if (!agentInfo) {
      logError(`Agent ${to} not found`);
      throw new CommonError(ErrorCode.NOT_FOUND, `Agent ${to} not found`);
    }

    const agent = agentInfo.agent;

    logInfo("Sending message from %s to %s: %s", from, to, message);

    return agent.onMessage({
      id,
      topicId,
      message,
      from,
      replyTo,
      runtime: this.runtime,
    });
  }
}

const internalMessageActionArgsSchema = z.object({
  agentId: z.string(),
  message: z.string(),
});

type InternalMessageActionArgs = z.infer<
  typeof internalMessageActionArgsSchema
>;

const internalMessageActionResponseSchema = z.object({
  status: z.enum(["success", "error"]),
  message: z.string().optional(),
});

type InternalMessageActionResponse = z.infer<
  typeof internalMessageActionResponseSchema
>;

export class InternalMessageAction
  implements Action<InternalMessageActionArgs, InternalMessageActionResponse>
{
  agent: Agent;

  name = "internal_message";
  description = "Send a message to another agent";
  parameters = internalMessageActionArgsSchema;
  response = internalMessageActionResponseSchema;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  async handler({
    parameters,
    runtime,
  }: ActionHandlerParameters<InternalMessageActionArgs>) {
    const agent = runtime.agents.get(parameters.agentId);
    if (!agent) {
      logError("Agent %s not found", parameters.agentId);
      return {
        status: "error",
        message: "Agent not found",
      } as InternalMessageActionResponse;
    }

    const message = await runtime.messageManager.sendMessage({
      id: nanoid(),
      message: parameters.message,
      to: parameters.agentId,
      from: this.agent.id,
    });

    return {
      status: "success",
      message: message,
    } as InternalMessageActionResponse;
  }
}
