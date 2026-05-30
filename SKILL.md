# Pick up the next task

When the user says **"pick up the next task"**, follow this workflow:

1. List files in `.github/todo` and pick the next task file in lexicographic order.
2. Read that task and implement it with minimal, complete code changes.
3. Run relevant lint and tests for changed packages.
4. Delete the completed task file from `.github/todo`.
5. Commit/push progress and open a pull request summarizing the completed task.
