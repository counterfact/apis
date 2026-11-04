/**
 * @example {"description":"My Song Description","genres":["pop","rock","jazz"],"is_explicit":false,"languages":["en","fr"],"title":"My Song"}
 */
export type SongMetadata = {
  /**
   * The title of the song
   */
  title: string | null;
  /**
   * The description of the song
   */
  description: string | null;
  /**
   * The genres of the song
   */
  genres: Array<string>;
  /**
   * The languages of the song
   */
  languages: Array<string>;
  /**
   * Whether the song is explicit
   */
  is_explicit: boolean | null;
};
