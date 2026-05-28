export type pull_request_minimal = {
  /**
   * @format int64
   */
  id: number;
  number: number;
  url: string;
  head: {
    ref: string;
    sha: string;
    repo: {
      /**
       * @format int64
       */
      id: number;
      url: string;
      name: string;
    };
  };
  base: {
    ref: string;
    sha: string;
    repo: {
      /**
       * @format int64
       */
      id: number;
      url: string;
      name: string;
    };
  };
};
