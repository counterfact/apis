/**
 * Branch Short
 */
export type branch_short = {
  name: string;
  commit: { sha: string; url: string };
  protected: boolean;
};
