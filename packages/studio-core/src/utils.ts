import { AgentRole, type Agent, type AgentRuntime, type Goal } from "./type.js";

export function formatGoals(goals: Goal[]): string {
  return `Your have following goals and objectives:

${goals
  .map(
    (goal, gi) => `- Goal ${gi + 1}: ${goal.name}: ${goal.description}
  ${goal.objectives.map((objective, oi) => `- Objective ${gi + 1}.${oi + 1}: ${objective.title}`).join("\n")}
`
  )
  .join("\n\n")}
`;
}

export function getRole(agent: Agent, runtime: AgentRuntime): AgentRole | null {
  return runtime.agents.get(agent.id)?.role ?? null;
}

export function getAssociatedAgents(
  agent: Agent,
  runtime: AgentRuntime
): { agent: Agent; role: AgentRole }[] {
  return Object.values(runtime.agents)
    .filter(({ agent: _agent }) => agent.id !== _agent.id)
    .map(({ agent, role }) => ({ agent, role }));
}

export function formatRoleAndAssociates(
  role: AgentRole,
  associates: { agent: Agent; role: AgentRole }[]
): string {
  return `You are amoung a group of agents, and your role is ${role}. You are associated with the following agents:
  
${associates
  .map(
    ({ agent, role }) => `- ${agent.name}:
  - ID: ${agent.id}
  - Description: ${agent.description}
  - Role: ${role}`
  )
  .join("\n\n")}

${role === AgentRole.MANAGER ? "You should delegate tasks to the Assistant Agents by sending messages to them." : ""}`;
}
