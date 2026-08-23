/**
 * Shared configuration for the modal presentation of the date/time pickers.
 */
export type PickerPresentation = 'popover' | 'modal';

/** Entrance/exit animation used by the modal panel. */
export type PickerModalAnimation = 'zoom' | 'slide-up' | 'fade';

export interface PickerModalOptions {
  /** Extra class(es) applied to the overlay pane, useful for scoping custom styles. */
  panelClass?: string | string[];
  /** Extra class applied to the backdrop element. */
  backdropClass?: string;
  /** Render the dimmed backdrop behind the modal. Defaults to `true`. */
  hasBackdrop?: boolean;
  /** Close the modal when the user presses `Escape`. Defaults to `true`. */
  closeOnEscape?: boolean;
  /** Close the modal when the user clicks the area around the panel. Defaults to `true`. */
  closeOnBackdropClick?: boolean;
  /** Move focus back to the element that opened the modal once it closes. Defaults to `true`. */
  restoreFocus?: boolean;
  /** Hide the modal title bar. Defaults to `false`. */
  hideHeader?: boolean;
  /** Panel animation. Defaults to `'zoom'` (auto-switches to a bottom sheet on small screens). */
  animation?: PickerModalAnimation;
  /**
   * On viewports narrower than 480px, dock the modal to the bottom of the screen
   * as a sheet with a drag handle. Defaults to `true`.
   */
  mobileSheet?: boolean;
}
