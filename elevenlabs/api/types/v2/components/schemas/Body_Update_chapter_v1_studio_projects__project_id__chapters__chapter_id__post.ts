import type { ChapterContentInputModel } from "./ChapterContentInputModel.js";
export type Body_Update_chapter_v1_studio_projects__project_id__chapters__chapter_id__post =
  {
    /**
     * The name of the chapter, used for identification only.
     */
    name?: string | null;
    /**
     * The chapter content to use.
     */
    content?: ChapterContentInputModel | null;
  };
