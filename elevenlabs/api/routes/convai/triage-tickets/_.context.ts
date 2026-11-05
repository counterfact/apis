import type { AgentConversationTicketResponseModel as Ticket } from '../../../types/v1/components/schemas/AgentConversationTicketResponseModel.js';
import type { AssignableUserResponseModel as User } from '../../../types/v1/components/schemas/AssignableUserResponseModel.js';
const priorities = ['low', 'medium', 'high', 'urgent'];
const statuses = ['open', 'in_progress', 'resolved', 'cancelled', 'merged'];
const issues = ['knowledge_gap', 'incorrect_information', 'documentation_gap', 'product_feedback', 'platform_bug', 'tool_issue', 'missing_tool', 'unnecessary_escalation', 'wrong_action'];
export class TicketError extends Error {
    override name = 'TicketError';
    constructor(public status: number, public code: string, message: string) { super(message); }
}
const invalid = (): never => { throw new TicketError(400, 'invalid_ticket_request', 'Invalid local ticket request'); };
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown, max = 10000): v is string => typeof v === 'string' && v.length > 0 && v.length <= max;
function input(v: unknown, keys: string[]) { if (!object(v) || Object.keys(v).some(k => !keys.includes(k)))
    return invalid(); return v; }
export class Context {
    tickets = new Map<string, Ticket>();
    nextId = 1;
    time = 0;
    nextMutation = 0;
    workspaceId = '';
    userId = '';
    agent: (id: string) => boolean = () => false;
    conversation: (id: string) => {
        agent_id: string;
        transcript: unknown[];
    } | undefined = () => undefined;
    members: () => User[] = () => [];
    private now() { return this.time + ++this.nextMutation; }
    private stored(id: string) { const t = this.tickets.get(id); if (!t)
        throw new TicketError(404, 'ticket_not_found', 'Ticket not found'); return t; }
    private requireAgent(id: string) { if (!this.agent(id))
        throw new TicketError(404, 'agent_not_found', 'Agent not found'); }
    get(id: string) { return structuredClone(this.stored(id)); }
    users(id: string) { this.requireAgent(id); return structuredClone(this.members().filter(u => !u.is_service_account)); }
    private priority(v: unknown) { if (v != null && !priorities.includes(v as string))
        return invalid(); return v as Ticket['priority']; }
    private turns(v: unknown, conversationIds: string[]) { if (!Array.isArray(v) || v.length > 200)
        return invalid(); return v.map(value => { const t = input(value, ['turn_index', 'comment']); if (!Number.isSafeInteger(t.turn_index) || (t.turn_index as number) < 0 || !text(t.comment))
        return invalid(); if (!conversationIds.some(id => (this.conversation(id)?.transcript.length ?? 0) > (t.turn_index as number)))
        return invalid(); return { turn_index: t.turn_index as number, comment: t.comment as string }; }); }
    private allocate(agentId: string, body: Record<string, unknown>, ids: string[]) { const time = this.now(), id = `sim-ticket-created-${this.nextId++}`; const t: Ticket = { agentqa_ticket_id: id, workspace_id: this.workspaceId, owner_user_id: this.userId, agent_id: agentId, needs_clustering: false, title: body.title as string ?? String(body.qa_comment ?? 'Conversation follow-up').slice(0, 120), issue_type: null, labels: [], conversation_ids: ids, first_seen_unix_secs: ids.length ? time : null, last_seen_unix_secs: ids.length ? time : null, qa_comment: body.qa_comment as string ?? null, ticket_comments: [], turn_comments: [], status: 'open', priority: this.priority(body.priority) ?? null, priority_changes: [], status_changes: [], merged_into_ticket_id: null, source: 'manual', assignee_user_id: null, created_at_unix_secs: time, updated_at_unix_secs: time }; this.tickets.set(id, t); return t; }
    private validateCreate(body: Record<string, unknown>) { if (body.title != null && !text(body.title, 120) || body.qa_comment != null && !text(body.qa_comment))
        return invalid(); this.priority(body.priority); }
    createManual(agentId: string, value: unknown) { const b = input(value, ['title', 'qa_comment', 'priority']); this.requireAgent(agentId); this.validateCreate(b); if (!text(b.qa_comment))
        return invalid(); return structuredClone(this.allocate(agentId, b, [])); }
    create(value: unknown) {
        const b = input(value, ['conversation_id', 'title', 'qa_comment', 'turn_comments', 'priority']);
        this.validateCreate(b);
        if (!text(b.conversation_id))
            return invalid();
        const conversation = this.conversation(b.conversation_id);
        if (!conversation)
            throw new TicketError(404, 'conversation_not_found', 'Conversation not found');
        this.requireAgent(conversation.agent_id);
        const turns = this.turns(b.turn_comments ?? [], [b.conversation_id]);
        if (b.qa_comment == null && !turns.length)
            return invalid();
        let t = [...this.tickets.values()].find(t => t.conversation_ids.includes(b.conversation_id as string) && ['open', 'in_progress'].includes(t.status));
        if (t) {
            const time = this.now();
            if (b.qa_comment != null)
                t.ticket_comments.push({ comment: b.qa_comment as string, owner_user_id: this.userId, created_at_unix_secs: time });
            this.raise(t, this.priority(b.priority) ?? null, time);
            t.updated_at_unix_secs = time;
        }
        else
            t = this.allocate(conversation.agent_id, b, [b.conversation_id]);
        for (const turn of turns)
            t.turn_comments.push({ ...turn, owner_user_id: this.userId, created_at_unix_secs: t.updated_at_unix_secs });
        return structuredClone(t);
    }
    private raise(t: Ticket, p: Ticket['priority'], time: number) { if (priorities.indexOf(p ?? '') > priorities.indexOf(t.priority ?? '')) {
        t.priority = p;
        t.priority_changes.push({ priority: p, changed_by_user_id: this.userId, changed_at_unix_secs: time });
    } }
    patch(id: string, value: unknown) {
        const t = this.stored(id), b = input(value, ['title', 'qa_comment', 'status', 'assignee_user_id', 'priority']);
        this.validateCreate(b);
        if (b.status != null && (!statuses.includes(b.status as string) || b.status === 'merged') || t.status === 'merged' && b.status != null && b.status !== t.status)
            return invalid();
        if (b.assignee_user_id != null && !this.users(t.agent_id).some(u => u.user_id === b.assignee_user_id && u.has_access))
            return invalid();
        const changes = Object.entries(b).filter(([k, v]) => v !== undefined && (!['title', 'qa_comment', 'status'].includes(k) || v !== null) && t[k as keyof Ticket] !== v);
        if (!changes.length)
            return structuredClone(t);
        const time = this.now();
        for (const [k, v] of changes) {
            if (k === 'status')
                t.status_changes.push({ status: v as Ticket['status'], changed_by_user_id: this.userId, changed_at_unix_secs: time });
            if (k === 'priority')
                t.priority_changes.push({ priority: v as Ticket['priority'], changed_by_user_id: this.userId, changed_at_unix_secs: time });
            Object.assign(t, { [k]: v });
        }
        t.updated_at_unix_secs = time;
        return structuredClone(t);
    }
    comment(id: string, value: unknown, turn = false) { const t = this.stored(id), b = input(value, turn ? ['turn_index', 'comment'] : ['comment']); if (!text(b.comment))
        return invalid(); const turns = turn ? this.turns([b], t.conversation_ids) : []; const time = this.now(); if (turn)
        t.turn_comments.push({ ...turns[0], owner_user_id: this.userId, created_at_unix_secs: time });
    else
        t.ticket_comments.push({ comment: b.comment, owner_user_id: this.userId, created_at_unix_secs: time }); t.updated_at_unix_secs = time; return structuredClone(t); }
    merge(id: string, value: unknown) { const t = this.stored(id), b = input(value, ['source_ticket_ids']); if (!Array.isArray(b.source_ticket_ids) || !b.source_ticket_ids.length || b.source_ticket_ids.length > 50 || b.source_ticket_ids.some(v => !text(v) || v === id) || new Set(b.source_ticket_ids).size !== b.source_ticket_ids.length)
        return invalid(); if (!['open', 'in_progress', 'resolved'].includes(t.status))
        throw new TicketError(409, 'ticket_not_mergeable', 'Target ticket cannot accept merges'); const sources = b.source_ticket_ids.map(v => this.stored(v)); if (sources.some(s => s.agent_id !== t.agent_id || s.status !== 'open'))
        throw new TicketError(409, 'ticket_not_mergeable', 'Sources must be open tickets for the same agent'); const time = this.now(); for (const s of sources) {
        t.conversation_ids = [...new Set([...t.conversation_ids, ...s.conversation_ids])];
        this.raise(t, s.priority, time);
        s.conversation_ids = [];
        s.status = 'merged';
        s.merged_into_ticket_id = id;
        s.status_changes.push({ status: 'merged', changed_by_user_id: this.userId, changed_at_unix_secs: time });
        s.updated_at_unix_secs = time;
    } const seen = sources.flatMap(s => [s.first_seen_unix_secs, s.last_seen_unix_secs]).filter((v): v is number => v != null); if (seen.length) {
        t.first_seen_unix_secs = Math.min(t.first_seen_unix_secs ?? Infinity, ...seen);
        t.last_seen_unix_secs = Math.max(t.last_seen_unix_secs ?? 0, ...seen);
    } t.updated_at_unix_secs = time; return structuredClone(t); }
    delete(id: string) { this.stored(id); if ([...this.tickets.values()].some(t => t.merged_into_ticket_id === id))
        throw new TicketError(409, 'ticket_has_merged_sources', 'Delete merged source tickets first'); this.tickets.delete(id); }
    list(q: Record<string, unknown> = {}, agentId?: string) {
        if (agentId)
            this.requireAgent(agentId);
        const size = q.page_size ?? 100, cursor = q.cursor ?? '0';
        if (typeof size !== 'number' || !Number.isSafeInteger(size) || size < 1 || size > 100 || typeof cursor !== 'string' || !/^\d+$/.test(cursor) || !Number.isSafeInteger(Number(cursor)))
            return invalid();
        for (const [key, allowed] of [['status', statuses], ['issue_type', issues], ['sort_by', ['created_at', 'priority']]] as const)
            if (q[key] != null && !(allowed as readonly string[]).includes(q[key] as string))
                return invalid();
        const arrays = (key: string, allowed: string[]) => { const v = q[key]; if (v == null)
            return null; const a = typeof v === 'string' ? [v] : v; if (!Array.isArray(a) || a.some(v => typeof v !== 'string' || !allowed.includes(v)))
            return invalid(); return a; };
        const sources = arrays('sources', ['qa', 'agent', 'manual']), ps = arrays('priorities', priorities);
        for (const k of ['agent_id', 'conversation_id', 'owner_user_id', 'assignee_user_id', 'label', 'merged_into_ticket_id', 'search'])
            if (q[k] != null && typeof q[k] !== 'string')
                return invalid();
        if (typeof q.search === 'string' && q.search.length > 200)
            return invalid();
        const values = [...this.tickets.values()].filter(t => (!agentId || t.agent_id === agentId) && (q.agent_id == null || t.agent_id === q.agent_id) && (q.conversation_id == null || t.conversation_ids.includes(q.conversation_id as string)) && (q.status == null || t.status === q.status) && (!sources || sources.includes(t.source)) && (!ps || ps.includes(t.priority)) && (q.owner_user_id == null || t.owner_user_id === q.owner_user_id) && (q.assignee_user_id == null || (q.assignee_user_id === 'unassigned' ? t.assignee_user_id == null : t.assignee_user_id === q.assignee_user_id)) && (q.issue_type == null || t.issue_type === q.issue_type) && (q.label == null || t.labels.includes(q.label as string)) && (q.merged_into_ticket_id == null || t.merged_into_ticket_id === q.merged_into_ticket_id)).map(t => { const copy = structuredClone(t); copy.search_match = null; if (q.search) {
            const needle = (q.search as string).toLowerCase();
            const texts = [{ field: 'title', value: t.title }, { field: 'description', value: t.qa_comment }, ...t.ticket_comments.map(c => ({ field: 'comment', value: c.comment })), ...t.turn_comments.map(c => ({ field: 'turn_comment', value: c.comment, turn_index: c.turn_index }))];
            for (const entry of texts) {
                const snippet = (entry.value ?? '').replace(/\s+/g, ' '), start = snippet.toLowerCase().indexOf(needle);
                if (start >= 0) {
                    copy.search_match = { field: entry.field as NonNullable<Ticket['search_match']>['field'], snippet, highlight_start: start, highlight_end: start + needle.length, turn_index: 'turn_index' in entry ? entry.turn_index as number : null };
                    break;
                }
            }
        } return copy; }).filter(t => !q.search || t.search_match).sort((a, b) => (q.sort_by === 'priority' ? priorities.indexOf(b.priority ?? '') - priorities.indexOf(a.priority ?? '') : 0) || b.created_at_unix_secs - a.created_at_unix_secs || a.agentqa_ticket_id.localeCompare(b.agentqa_ticket_id));
        const offset = Number(cursor), has_more = offset + size < values.length;
        return { agent_conversation_tickets: values.slice(offset, offset + size), has_more, next_cursor: has_more ? String(offset + size) : null };
    }
}
