/**
 * Defines asset positioning and transformation on canvas.
 */
export type CanvasPlacement = {
  /**
   * @default 0.5
   */
  x_relative?: number;
  /**
   * @default 0.5
   */
  y_relative?: number;
  /**
   * @default 1
   */
  scale_x?: number;
  /**
   * @default 1
   */
  scale_y?: number;
  /**
   * @default 0
   */
  pivot_x?: number;
  /**
   * @default 0
   */
  pivot_y?: number;
  /**
   * @default 0
   */
  skew_x?: number;
  /**
   * @default 0
   */
  skew_y?: number;
  /**
   * @default 0
   */
  crop_top?: number;
  /**
   * @default 0
   */
  crop_right?: number;
  /**
   * @default 0
   */
  crop_bottom?: number;
  /**
   * @default 0
   */
  crop_left?: number;
  /**
   * @default false
   */
  flip_x?: boolean;
  /**
   * @default false
   */
  flip_y?: boolean;
};
