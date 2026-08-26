import type { RepositoryRep } from "./RepositoryRep.js";

export type RepositoryCollectionRep = {
  _links: { [key: string]: unknown };
  /**
   * An array of repositories
   */
  items: Array<RepositoryRep>;
};
