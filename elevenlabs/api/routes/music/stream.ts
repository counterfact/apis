import type { Routes } from "../../types/index.js";
type Route = Routes["/music"]["/stream"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context;
  try {
    const song = c.compose($.body, $.query);
    return $.x.response
      .header("song-id", song.songId)
      .status(200)
      .match("audio/mpeg", Buffer.from(song.audio));
  } catch (error) {
    if (error instanceof Error && error.name === "MusicError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
