import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { PickerModalOptions } from './picker-modal.types';

/** Keep these in sync with the durations declared in the modal stylesheet. */
export const PICKER_MODAL_ENTER_DURATION = 280;
export const PICKER_MODAL_LEAVE_DURATION = 180;

/** Safety margin so we still tear down if `animationend` never fires. */
const LEAVE_FALLBACK_DELAY = PICKER_MODAL_LEAVE_DURATION + 120;

/**
 * Opens picker content in a centered overlay while leaving picker state and
 * ControlValueAccessor ownership with the calling component.
 */
@Injectable()
export class PickerModalService implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly ngZone = inject(NgZone);
  private readonly document = inject<Document>(DOCUMENT);

  private activeOverlayRef: OverlayRef | null = null;
  private leavingOverlayRef: OverlayRef | null = null;
  private previouslyFocused: HTMLElement | null = null;
  private restoreFocusOnClose = true;
  private leaveTimer: ReturnType<typeof setTimeout> | null = null;
  private detachLeaveListener: (() => void) | null = null;
  private readonly closeRequested = new Subject<void>();
  private readonly closed = new Subject<void>();
  private readonly activeOverlayDetached = new Subject<void>();

  /** Fires when the user asks to dismiss (backdrop / escape). The host decides what to do. */
  readonly closeRequested$: Observable<void> = this.closeRequested.asObservable();

  /**
   * Fires once the leave animation finished, the overlay was disposed AND focus was
   * restored. Hosts use this to release any "ignore focus" guard, otherwise the
   * restored focus immediately re-opens the picker.
   */
  readonly closed$: Observable<void> = this.closed.asObservable();

  get isOpen(): boolean {
    return this.activeOverlayRef !== null;
  }

  open(portal: TemplatePortal, options: PickerModalOptions = {}, rtl = false): void {
    if (this.activeOverlayRef) {
      return;
    }

    // A pending leave animation must not outlive a new open.
    this.disposeLeavingOverlay();
    this.restoreFocusOnClose = options.restoreFocus !== false;
    this.previouslyFocused = this.getActiveFocusableElement();

    const hasBackdrop = options.hasBackdrop !== false;
    const animation = options.animation ?? 'zoom';

    const overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop,
      backdropClass: ['qeydar-picker-modal-backdrop', ...toArray(options.backdropClass)],
      panelClass: [
        'qeydar-picker-modal-pane',
        `qeydar-picker-modal-anim-${animation}`,
        options.mobileSheet === false ? 'qeydar-picker-modal-no-sheet' : 'qeydar-picker-modal-sheet',
        ...toArray(options.panelClass)
      ],
      direction: rtl ? 'rtl' : 'ltr',
      disposeOnNavigation: true
    });

    overlayRef.hostElement.classList.add('qeydar-picker-modal-host');

    this.activeOverlayRef = overlayRef;
    overlayRef.attach(portal);
    this.focusDialog(overlayRef);

    if (options.closeOnEscape !== false) {
      overlayRef
        .keydownEvents()
        .pipe(
          filter(event => event.keyCode === ESCAPE && !hasModifierKey(event)),
          takeUntil(this.activeOverlayDetached)
        )
        .subscribe(event => {
          event.preventDefault();
          this.emitCloseRequest();
        });
    }

    if (options.closeOnBackdropClick !== false) {
      if (hasBackdrop) {
        overlayRef
          .backdropClick()
          .pipe(takeUntil(this.activeOverlayDetached))
          .subscribe(() => this.emitCloseRequest());
      } else {
        // Without a backdrop the pane itself is the only hit target, so fall back to
        // the CDK "clicked somewhere else on the page" stream.
        overlayRef
          .outsidePointerEvents()
          .pipe(
            filter(event => event.type === 'click' || event.type === 'auxclick'),
            takeUntil(this.activeOverlayDetached)
          )
          .subscribe(() => this.emitCloseRequest());
      }

      // The pane is stretched by flex/centering, so a click can land on the pane
      // itself (the padding around the dialog). Treat that as "outside" too.
      this.ngZone.runOutsideAngular(() => {
        const paneClickHandler = (event: MouseEvent) => {
          if (event.target === overlayRef.overlayElement) {
            this.emitCloseRequest();
          }
        };
        overlayRef.overlayElement.addEventListener('click', paneClickHandler);
        this.activeOverlayDetached.pipe(take(1)).subscribe(() => {
          overlayRef.overlayElement.removeEventListener('click', paneClickHandler);
        });
      });
    }

    overlayRef.detachments().pipe(takeUntil(this.activeOverlayDetached)).subscribe(() => {
      if (this.activeOverlayRef === overlayRef) {
        this.activeOverlayRef = null;
      }
    });
  }

  close(): void {
    const overlayRef = this.activeOverlayRef;
    if (!overlayRef) {
      return;
    }

    this.activeOverlayRef = null;
    this.activeOverlayDetached.next();

    // Play the leave animation on both the panel and the backdrop.
    overlayRef.addPanelClass('qeydar-picker-modal-leaving');
    overlayRef.backdropElement?.classList.add('qeydar-picker-modal-backdrop-leaving');

    this.leavingOverlayRef = overlayRef;
    const restoreTarget = this.restoreFocusOnClose ? this.previouslyFocused : null;
    this.previouslyFocused = null;

    const finalize = () => {
      if (this.leavingOverlayRef !== overlayRef) {
        return;
      }
      this.clearLeaveHandles();
      this.leavingOverlayRef = null;
      overlayRef.dispose();

      // Restore focus first, THEN announce the close so hosts can drop their
      // focus guard only after the (re)focus event has already been swallowed.
      restoreTarget?.focus({ preventScroll: true });
      this.ngZone.run(() => this.closed.next());
    };

    this.ngZone.runOutsideAngular(() => {
      const onAnimationEnd = (event: AnimationEvent) => {
        const target = event.target as HTMLElement | null;
        // Only react to the panel's own leave animation, not to inner elements.
        if (target === overlayRef.overlayElement || target?.classList.contains('qeydar-picker-modal')) {
          finalize();
        }
      };

      overlayRef.overlayElement.addEventListener('animationend', onAnimationEnd);
      this.detachLeaveListener = () =>
        overlayRef.overlayElement.removeEventListener('animationend', onAnimationEnd);

      // Fallback for reduced-motion / interrupted animations.
      this.leaveTimer = setTimeout(finalize, LEAVE_FALLBACK_DELAY);
    });
  }

  ngOnDestroy(): void {
    this.disposeLeavingOverlay();
    this.activeOverlayDetached.next();
    this.activeOverlayDetached.complete();
    this.closeRequested.complete();
    this.closed.complete();
    this.activeOverlayRef?.dispose();
    this.activeOverlayRef = null;
    this.previouslyFocused = null;
  }

  private emitCloseRequest(): void {
    // CDK attaches backdrop/keydown listeners outside the Angular zone; without
    // re-entering it an OnPush host would never re-render after closing.
    this.ngZone.run(() => this.closeRequested.next());
  }

  private focusDialog(overlayRef: OverlayRef): void {
    this.ngZone.runOutsideAngular(() => {
      Promise.resolve().then(() => {
        if (this.activeOverlayRef !== overlayRef) {
          return;
        }
        const dialog = overlayRef.overlayElement.querySelector<HTMLElement>('[role="dialog"]');
        dialog?.focus({ preventScroll: true });
      });
    });
  }

  private clearLeaveHandles(): void {
    if (this.leaveTimer !== null) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
    this.detachLeaveListener?.();
    this.detachLeaveListener = null;
  }

  private disposeLeavingOverlay(): void {
    this.clearLeaveHandles();
    this.leavingOverlayRef?.dispose();
    this.leavingOverlayRef = null;
  }

  private getActiveFocusableElement(): HTMLElement | null {
    const activeElement = this.document.activeElement;
    return activeElement instanceof HTMLElement ? activeElement : null;
  }
}

function toArray(value: string | string[] | undefined): string[] {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}
