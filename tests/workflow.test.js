const test = require("node:test");
const assert = require("node:assert/strict");
const { planWorkflow, runWorkflow } = require("../src/workflow");

test("planWorkflow creates human-in-the-loop plan", () => {
  const plan = planWorkflow("build a campaign");
  assert.equal(plan.length, 4);
  assert.equal(plan.some((step) => step.requiresApproval), true);
});

test("runWorkflow pauses without approval", () => {
  const result = runWorkflow("publish report");
  assert.equal(result.status, "paused");
  assert.equal(result.logs.at(-1).status, "waiting_for_approval");
});

test("runWorkflow completes with approval", () => {
  const result = runWorkflow("publish report", { approved: true });
  assert.equal(result.status, "completed");
  assert.equal(result.memory.length, 4);
});

