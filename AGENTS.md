# Simulator agent instructions

Follow the workflow in `.github/copilot-instructions.md` for simulator changes.

## Seed data and reset behavior

- Always define seed data, initial state population, and reset orchestration in `scenarios/` for the relevant API group.
- Use the `startup` scenario to initialize the simulator and a named `reset` scenario to restore its baseline.
- Context classes own state and business operations. Initialize their containers empty; do not seed data in constructors or put fixture restoration in context methods.
- Scenarios must perform the state population and replacement themselves. Calling a context method that hides the seeding or reset logic does not satisfy this rule.
- Keep route handlers focused on request behavior. Tests that need seeded state should run the appropriate scenario.
