import type { Scenario } from '../types/index.js';
export const emptyTriageTickets: Scenario = ($) => {
    const c = $.loadContext('/convai/triage-tickets');
    c.tickets = new Map();
    c.nextId = 1;
    c.nextMutation = 0;
    c.time = 1735689610;
    c.userId = 'sim-member-narrator';
    c.workspaceId = 'sim-workspace';
    c.agent = id => $.loadContext('/convai/agents').agents.has(id);
    c.conversation = id => $.loadContext('/convai/conversations').conversations.get(id);
    c.members = () => [...$.loadContext('/workspace/groups').members].map(([email, user_id]) => ({ user_id, email, first_name: $.loadContext('/workspace').profiles.get(user_id)?.first_name ?? null, is_service_account: false, has_access: true }));
    $.loadContext('/convai/agents/{agent_id}/triage-tickets').tickets = () => c;
};
export const resetTriageTickets: Scenario = ($) => {
    emptyTriageTickets($);
    const c = $.loadContext('/convai/triage-tickets');
    c.tickets = new Map([['sim-ticket', { agentqa_ticket_id: 'sim-ticket', workspace_id: 'sim-workspace', owner_user_id: 'sim-member-narrator', agent_id: 'sim-agent', needs_clustering: false, title: 'Review agent instructions', issue_type: 'documentation_gap', labels: ['documentation'], conversation_ids: [], first_seen_unix_secs: null, last_seen_unix_secs: null, qa_comment: 'Add a clear escalation policy.', ticket_comments: [], turn_comments: [], status: 'open', priority: 'medium', priority_changes: [], status_changes: [], merged_into_ticket_id: null, source: 'manual', assignee_user_id: null, created_at_unix_secs: 1735689600, updated_at_unix_secs: 1735689600 }]]);
};
