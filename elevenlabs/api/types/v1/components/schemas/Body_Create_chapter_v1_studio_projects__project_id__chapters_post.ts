export type Body_Create_chapter_v1_studio_projects__project_id__chapters_post =
  {
    /**
     * The name of the chapter, used for identification only.
     */
    name: string;
    /**
     * An optional URL from which we will extract content to initialize the Studio project. If this is set, 'from_url' and 'from_content' must be null. If neither 'from_url', 'from_document', 'from_content' are provided we will initialize the Studio project as blank.
     */
    from_url?: string | null;
  };
