/**
 * The type of GitHub user that can comment, open issues, or create pull requests while the interaction limit is in effect.
 * @example "collaborators_only"
 */
export type interaction_group =
  | "existing_users"
  | "contributors_only"
  | "collaborators_only";
