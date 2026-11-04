export type ClipAnimation = {
  /**
   * @default "none"
   */
  enter_effect?:
    | "none"
    | "fade"
    | "float"
    | "gentle_float"
    | "zoom_in"
    | "drop"
    | "slide_left"
    | "slide_right"
    | "slide_up"
    | "slide_down"
    | "pop"
    | "bounce"
    | "spin"
    | "slide_bounce";
  /**
   * @default 0
   */
  enter_duration_ms?: number;
  /**
   * @default "none"
   */
  exit_effect?:
    | "none"
    | "fade"
    | "float"
    | "gentle_float"
    | "zoom_in"
    | "drop"
    | "slide_left"
    | "slide_right"
    | "slide_up"
    | "slide_down"
    | "pop"
    | "bounce"
    | "spin"
    | "slide_bounce";
  /**
   * @default 0
   */
  exit_duration_ms?: number;
};
