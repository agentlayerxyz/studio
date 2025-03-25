import { z } from "zod";
import type {
  Action,
  ActionHandlerParameters,
  AgentRuntime,
  ScheduleOnceParameters,
  Scheduler,
  ScheduleRepeatParameters,
} from "./type.js";
import { nanoid } from "nanoid";

export class SimpleScheduler implements Scheduler {
  runtime: AgentRuntime;

  timeoutIds: Map<string, NodeJS.Timeout> = new Map();
  intervalIds: Map<string, NodeJS.Timeout> = new Map();

  constructor(runtime: AgentRuntime) {
    this.runtime = runtime;
  }

  scheduleOnce(parameters: ScheduleOnceParameters): string {
    const timeout = setTimeout(() => {
      this.runtime.agents.get(parameters.agentId)?.agent.onMessage({
        id: nanoid(),
        message: parameters.message,
        runtime: this.runtime,
      });
    }, parameters.delayMs);

    const id = nanoid();
    this.timeoutIds.set(id, timeout);

    return id;
  }

  repeat(parameters: ScheduleRepeatParameters): string {
    const interval = setInterval(() => {
      this.runtime.agents.get(parameters.agentId)?.agent.onMessage({
        id: nanoid(),
        message: parameters.message,
        runtime: this.runtime,
      });
    }, parameters.intervalMs);

    const id = nanoid();
    this.intervalIds.set(id, interval);

    return id;
  }

  cancel(scheduleId: string): void {
    const timeout = this.timeoutIds.get(scheduleId);

    if (timeout) {
      clearTimeout(timeout);
      this.timeoutIds.delete(scheduleId);
      return;
    }

    const interval = this.intervalIds.get(scheduleId);
    if (interval) {
      clearInterval(interval);
      this.intervalIds.delete(scheduleId);
    }
  }
}

const scheduleOnceActionArgsSchema = z.object({
  agentId: z.string(),
  message: z.string(),
  delayMs: z.number(),
});

type ScheduleOnceActionArgs = z.infer<typeof scheduleOnceActionArgsSchema>;

export class ScheduleOnceAction implements Action<ScheduleOnceActionArgs> {
  name = "schedule_once";
  parameters = scheduleOnceActionArgsSchema;
  response = z.void();
  description = "Schedule a message to be sent to an agent once after a delay";

  async handler({
    parameters,
    runtime,
  }: ActionHandlerParameters<ScheduleOnceActionArgs>) {
    runtime.scheduler.scheduleOnce(parameters);
  }
}

const scheduleRepeatActionArgsSchema = z.object({
  agentId: z.string(),
  message: z.string(),
  intervalMs: z.number(),
});

type ScheduleRepeatActionArgs = z.infer<typeof scheduleRepeatActionArgsSchema>;

export class ScheduleRepeatAction implements Action<ScheduleRepeatActionArgs> {
  name = "schedule_repeat";
  parameters = scheduleRepeatActionArgsSchema;
  response = z.void();
  description =
    "Schedule a message to be sent to an agent repeatedly at a given interval";

  async handler({
    parameters,
    runtime,
  }: ActionHandlerParameters<ScheduleRepeatActionArgs>) {
    runtime.scheduler.repeat(parameters);
  }
}
