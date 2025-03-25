import { generateText, streamText, type LanguageModel } from "ai";
import type {
  Action,
  AgentRole,
  ContextProvider,
  Evaluator,
  Goal,
  ReceivingMessageParameters,
} from "./type.js";
import { type Agent } from "./type.js";
import {
  IdentityInfoProvider,
  ObjectivesInfoProvider,
  RoleAndAssociatesInfoProvider,
  TemporalInfoProvider,
} from "./context.js";
import { InternalMessageAction } from "./message.js";

export class BaseAgent implements Agent {
  id: string;
  name: string;
  description: string;
  goals: Goal[];
  model: LanguageModel;
  providers: ContextProvider[];
  actions: Action<any, any>[];
  evaluators: Evaluator[];

  constructor(
    id: string,
    name: string,
    description: string,
    goals: Goal[],
    providers: ContextProvider[],
    actions: Action<unknown, unknown>[],
    evaluators: Evaluator<unknown>[],
    model: LanguageModel
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.goals = goals;
    this.evaluators = evaluators;
    this.model = model;

    this.providers = [
      new IdentityInfoProvider(this),
      new TemporalInfoProvider(),
      new ObjectivesInfoProvider(this),
      new RoleAndAssociatesInfoProvider(this),
      ...providers,
    ];

    this.actions = [new InternalMessageAction(this), ...actions];
  }

  async onMessage({
    message,
    runtime,
    from,
  }: ReceivingMessageParameters): Promise<string> {
    let fromAgent: { agent: Agent; role: AgentRole } | undefined;

    if (from) {
      fromAgent = runtime.agents.get(from);
    }

    const contextList = await Promise.all(
      this.providers.map((p) => p.get({ context: [], runtime }))
    );

    const contextText = contextList
      .sort(
        (a, b) =>
          (a.rank ?? Number.MAX_SAFE_INTEGER) -
          (b.rank ?? Number.MAX_SAFE_INTEGER)
      ) // sort by rank (from low to high)
      .map((c) => `### ${c.subject}\n\n${c.content}`)
      .join("\n\n");

    const systemPrompt = `
      ${contextText}

      ${
        fromAgent
          ? `You are receiving a message from another agent: ${fromAgent.agent.name} (role: ${fromAgent.role}).`
          : ""
      }
    `;

    // TODO: memory recall

    const { text } = await generateText({
      model: this.model,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    return text;
  }

  onMessageStream({
    message,
    runtime,
    from,
  }: ReceivingMessageParameters): ReadableStream<string> {
    if (from) {
      const agent = runtime.agents.get(from);

      if (agent) {
        // internal message
      }
    }

    const systemPrompt = "";

    const { textStream } = streamText({
      model: this.model,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    return textStream;
  }
}
