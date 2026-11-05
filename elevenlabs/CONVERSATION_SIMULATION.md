# Bounded conversation simulation

POST `/v1/convai/agents/{agent_id}/simulate-conversation` and its `/stream`
variant simulate a short text exchange locally. Both deprecated operations are
retained because they remain in the checked-in contract snapshot.

The live canonical agent's first message starts a fresh conversation. If it is
empty, the simulated user starts. Optional text history is copied and the next
speaker alternates from its last turn. The simulated user's first-message text,
or a scenario-owned user fixture, supplies user turns; subsequent agent replies
use a scenario-owned fixture. Primitive dynamic variables substitute `{{name}}`
placeholders in generated messages. Missing variables remain literal.

A synthetic conversation ends after at most six new messages. A smaller
`new_turns_limit` is honored, including zero; its default of 100 succeeds and
still terminates after six. Up to 100 input history messages are supported with
role, message, time and empty tool-call/result arrays. Nonempty tool histories,
other history metadata, and nonempty tool mocks return 400. Input times must be
nonnegative and ordered. Missing agents return 404.

These are deterministic text fixtures. Prompts, model/language/voice settings,
knowledge retrieval, tool execution, data collection and semantic evaluation do
not run. Extra evaluation criteria receive `unknown` results and null scores;
call success remains `unknown`. No conversation record, test invocation or
agent mutation is created. There are no branch/version selectors in these
contracts: calls read the current canonical agent configuration. Startup and
reset replace the simulation fixtures through `scenarios/conversation-simulation.ts`.

The stream response uses a local buffered SSE convention because the snapshot
specifies ordering but no response content type or event schema. Each `data:`
event contains `{simulated_conversation: [turn]}`; concatenate these lists. The
last event contains `{analysis: ...}`. With zero history and zero new turns,
only that final event is emitted. The entire event string is returned as
`text/event-stream`; this implements bounded ordered framing, not incremental
network delivery or inference streaming. Dispatcher tests parse the returned
string and compare it with the JSON response.
