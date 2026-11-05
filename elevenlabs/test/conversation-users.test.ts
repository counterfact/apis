import assert from "node:assert/strict";
import { test } from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
const path = "/v1/convai/users";
test("conversation users derive live contacts, filter, paginate and preserve historical agent metadata", async () => {
  const h = await createDispatcherHarness();
  const get = async (q = "") => {
    const r = await h.request(path + q);
    assert.equal(r.status, 200);
    assert.match(r.headers.get("content-type") ?? "", /application\/json/);
    return r.json();
  };
  const baseline = await get();
  assert.deepEqual(
    baseline.users.map((u: { user_id: string }) => u.user_id),
    ["sim-user", "sim-user-old"],
  );
  assert.equal(baseline.users[0].conversation_count, 1);
  assert.equal(baseline.users[0].sentiment.scored_conversation_count, 0);
  assert.equal(baseline.users[0].sentiment.average_sentiment_score, null);
  await h.scenario("conversationUserContacts");
  const contacts = await get();
  assert.equal(contacts.users[0].user_id, "sim-user");
  assert.equal(contacts.users[0].conversation_count, 3);
  assert.equal(contacts.users[0].first_contact_unix_secs, 1735689599);
  assert.equal(
    contacts.users[0].last_contact_conversation_id,
    "sim-conversation-latest",
  );
  assert.equal(
    (await get("?agent_id=sim-agent&branch_id=sim-branch")).users[0]
      .conversation_count,
    1,
  );
  assert.equal((await get("?search=sim-user")).users.length, 1);
  assert.equal((await get("?search=sim")).users.length, 0);
  assert.equal(
    (
      await get(
        "?call_start_after_unix=1735689602&call_start_before_unix=1735689602",
      )
    ).users[0].conversation_count,
    1,
  );
  const page = await get("?page_size=1");
  assert.equal(page.has_more, true);
  assert.equal(
    (await get("?page_size=1&cursor=" + page.next_cursor)).users[0].user_id,
    "sim-user-old",
  );
  assert.deepEqual((await get("?cursor=99")).users, []);
  assert.equal(
    (await get("?sort_by=conversation_count&sort_direction=asc")).users[0]
      .user_id,
    "sim-user-old",
  );
  await h.request("/v1/convai/agents/sim-agent", { method: "DELETE" });
  assert.equal(
    (await get()).users[0].last_contact_agent_name,
    "Simulator Support",
  );
  await h.request("/v1/convai/conversations/sim-conversation-latest", {
    method: "DELETE",
  });
  assert.equal((await get()).users[0].conversation_count, 2);
  await h.scenario("emptyConversations");
  assert.deepEqual((await get()).users, []);
  await h.scenario("reset");
  assert.equal((await get()).users[0].conversation_count, 1);
  const other = await createDispatcherHarness();
  assert.equal((await (await other.request(path)).json()).users.length, 2);
});
test("conversation users reject invalid or unsupported query options without changing records", async () => {
  const h = await createDispatcherHarness();
  const before = await (await h.request(path)).json();
  for (const q of [
    "page_size=0",
    "cursor=abc",
    "call_start_after_unix=bad",
    "call_start_before_unix=-1",
    "call_start_after_unix=10&call_start_before_unix=1",
    "sort_by=average_sentiment_score",
    "sort_by=missing",
    "sort_direction=missing",
    "agent_id=seng_missing",
  ])
    assert.equal((await h.request(path + "?" + q)).status, 400, q);
  assert.deepEqual(await (await h.request(path)).json(), before);
});
