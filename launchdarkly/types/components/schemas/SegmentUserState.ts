import type { SegmentUserList } from "./SegmentUserList.js";

export type SegmentUserState = {
  included?: SegmentUserList;
  excluded?: SegmentUserList;
};
