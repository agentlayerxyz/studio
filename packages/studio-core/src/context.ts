import {
  type ContextProviderParameters,
  type Agent,
  type Context,
  type ContextProvider,
} from "./type.js";
import {
  formatGoals,
  formatRoleAndAssociates,
  getAssociatedAgents,
  getRole,
} from "./utils.js";

export class IdentityInfoProvider implements ContextProvider {
  agent: Agent;
  constructor(agent: Agent) {
    this.agent = agent;
  }
  async get(): Promise<Context> {
    return {
      subject: "Who am I?",
      rank: 100,
      content: `Your name is ${this.agent.name}, with an ID as ${this.agent.id}; You are an AI agent with the following description: ${this.agent.description}`,
    };
  }
}

export class TemporalInfoProvider implements ContextProvider {
  async get(): Promise<Context> {
    return {
      subject: "When is it?",
      rank: 200,
      content: `The current time is ${new Date().toISOString()}`,
    };
  }
}

export class ObjectivesInfoProvider implements ContextProvider {
  agent: Agent;
  constructor(agent: Agent) {
    this.agent = agent;
  }
  async get(): Promise<Context> {
    return {
      subject: "Goals and Objectives",
      rank: 300,
      content: formatGoals(this.agent.goals),
    };
  }
}

export class RoleAndAssociatesInfoProvider implements ContextProvider {
  agent: Agent;
  constructor(agent: Agent) {
    this.agent = agent;
  }
  async get({ runtime }: ContextProviderParameters): Promise<Context> {
    const role = getRole(this.agent, runtime);
    const associates = getAssociatedAgents(this.agent, runtime);

    if (!role) {
      return {
        subject: "Role & Associates",
        rank: 400,
        content: `None`,
      };
    }

    return {
      subject: "Role & Associates",
      rank: 400,
      content: formatRoleAndAssociates(role, associates),
    };
  }
}
