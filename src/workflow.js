const TOOLS = {
  research: (task) => `Research notes for: ${task}`,
  draft: (task) => `Draft created for: ${task}`,
  review: (task) => `Review checklist completed for: ${task}`
};

function planWorkflow(goal) {
  return [
    { id: "research", tool: "research", task: `Understand context for ${goal}`, requiresApproval: false },
    { id: "draft", tool: "draft", task: `Create first output for ${goal}`, requiresApproval: false },
    { id: "approve", tool: "review", task: `Human approval for ${goal}`, requiresApproval: true },
    { id: "publish", tool: "draft", task: `Prepare publish package for ${goal}`, requiresApproval: false }
  ];
}

function runWorkflow(goal, options = {}) {
  const memory = [];
  const logs = [];
  const plan = planWorkflow(goal);
  const approved = Boolean(options.approved);

  for (const step of plan) {
    if (step.requiresApproval && !approved) {
      logs.push({ step: step.id, status: "waiting_for_approval", output: "Human approval required." });
      return { status: "paused", plan, memory, logs };
    }
    const output = executeWithRetry(step, options.retries || 1);
    memory.push({ step: step.id, output });
    logs.push({ step: step.id, status: "done", output });
  }

  return { status: "completed", plan, memory, logs };
}

function executeWithRetry(step, retries) {
  const tool = TOOLS[step.tool];
  let attempts = 0;
  while (attempts <= retries) {
    attempts += 1;
    if (tool) return tool(step.task);
  }
  throw new Error(`Tool failed: ${step.tool}`);
}

module.exports = { planWorkflow, runWorkflow };

