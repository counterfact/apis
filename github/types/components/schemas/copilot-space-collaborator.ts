import type { simple_user } from "./simple-user.js";

/**
 * A collaborator (user or team) of a Copilot Space
 */
export type copilot_space_collaborator =
  | (simple_user & {
      /**
       * The collaborator actor type.
       */
      actor_type: "User";
      /**
       * The role granted to the collaborator
       */
      role: "reader" | "writer" | "admin";
    })
  | {
      /**
       * The collaborator actor type.
       */
      actor_type: "Team";
      /**
       * The role granted to the collaborator
       */
      role: "reader" | "writer" | "admin";
      id: number;
      node_id: string;
      name: string;
      slug: string;
      type: "Team";
      description?: string;
      privacy?: string;
      notification_setting?: string;
      /**
       * @format uri
       */
      url?: string;
      /**
       * @format uri
       */
      html_url?: string;
      members_url?: string;
      /**
       * @format uri
       */
      repositories_url?: string;
      organization_id?: number;
      parent?: unknown;
    };
