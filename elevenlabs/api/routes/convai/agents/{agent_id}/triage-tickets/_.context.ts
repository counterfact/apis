import type { Context as Tickets } from '../../../triage-tickets/_.context.js';
export class Context {
    tickets?: () => Tickets;
    private context() { if (!this.tickets)
        throw new Error('Run triage startup scenario first'); return this.tickets(); }
    list(q: Record<string, unknown>, agent: string) { return this.context().list(q, agent); }
    createManual(agent: string, input: unknown) { return this.context().createManual(agent, input); }
    users(agent: string) { return this.context().users(agent); }
}
