/**
 * @example {"color_1":"#2792dc","color_2":"#9ce6e6","type":"orb"}
 */
export type OrbAvatar = {
  /**
   * The type of the avatar
   * @default "orb"
   */
  type?: "orb";
  /**
   * The first color of the avatar
   * @default "#2792dc"
   */
  color_1?: string;
  /**
   * The second color of the avatar
   * @default "#9ce6e6"
   */
  color_2?: string;
};
