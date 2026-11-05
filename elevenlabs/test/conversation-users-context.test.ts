import assert from "node:assert/strict";
import { test } from "node:test";
import { Context } from "../api/routes/convai/users/_.context.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
test("conversation-user aggregation filters before grouping, copies results and observes map replacement", async () => {
  assert.deepEqual(new Context().list({}).users, []);
  const runner = await createScenarioRunner();
  await runner.run(scenarios.reset);
  await runner.run(scenarios.conversationUserContacts);
  const c = runner.loadContext("/convai/users");
  const result = c.list({});
  assert.equal(result.users[0].conversation_count, 3);
  assert.equal(result.users[0].first_contact_unix_secs, 1735689599);
  assert.equal(result.users[0].last_contact_unix_secs, 1735689604);
  result.users[0].sentiment.positive_count = 50;
  assert.equal(c.list({}).users[0].sentiment.positive_count, 0);
  assert.equal(c.list({ agent_id: "sim-agent-old" }).users.length, 1);
  assert.equal(
    c.list({ branch_id: "sim-branch" }).users[0].conversation_count,
    1,
  );
  for (const q of [
    { page_size: 101 },
    { cursor: "9007199254740992" },
    { call_start_before_unix: "1.5" },
    { call_start_before_unix: NaN },
    { sort_by: "average_sentiment_score" },
  ])
    assert.throws(() => c.list(q));
  const records = runner.loadContext("/convai/conversations");
  const original = structuredClone(records.conversations);
  assert.equal(c.list({}).users[0].conversation_count, 3);
  assert.deepEqual(records.conversations, original);
  const tie = structuredClone(
    records.conversations.get("sim-conversation-latest")!,
  );
  tie.conversation_id = "aaa-tied";
  records.conversations.set(tie.conversation_id, tie);
  assert.equal(
    c.list({ search: "sim-user" }).users[0].last_contact_conversation_id,
    "aaa-tied",
  );
  const other = structuredClone(tie);
  other.conversation_id = "sim-other-user";
  other.user_id = "aaa-user";
  records.conversations.set(other.conversation_id, other);
  assert.equal(c.list({}).users[0].user_id, "aaa-user");
  assert.equal(c.list({}).users.length, 3);
  await runner.run(scenarios.emptyConversations);
  assert.deepEqual(c.list({}).users, []);
  await runner.run(scenarios.reset);
  assert.equal(c.list({}).users.length, 2);
});
