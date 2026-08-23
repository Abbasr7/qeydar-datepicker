# Modal Presentation

By default the Qeydar pickers open as a **popover** anchored to their input. As of **v1.3.0** they can also open in a centered **modal dialog** (with backdrop, focus trap, Escape-to-close, and an optional mobile bottom-sheet). This works for **both** the DatePicker and the TimePicker, and is fully composable with [custom templates](./CUSTOM_TEMPLATES.md).

---

## Table of contents

- [Quick start](#quick-start)
- [How it works](#how-it-works)
- [API reference](#api-reference)
  - [`presentation`](#presentation)
  - [`modalOptions`](#modaloptions)
- [Animations](#animations)
- [Mobile bottom sheet](#mobile-bottom-sheet)
- [RTL & localization](#rtl--localization)
- [Styling the modal](#styling-the-modal)
- [Modal + custom templates](#modal--custom-templates)
- [Accessibility](#accessibility)
- [Best practices & gotchas](#best-practices--gotchas)

---

## Quick start

Switch the trigger from a popover to a modal with a single input:

```typescript
import { Component } from '@angular/core';
import { QeydarDatePickerModule } from '@qeydar/datepicker';

@Component({
  selector: 'app-modal-date',
  standalone: true,
  imports: [QeydarDatePickerModule],
  template: `
    <qeydar-date-picker
      [(ngModel)]="value"
      [calendarType]="'jalali'"
      [presentation]="'modal'"
    ></qeydar-date-picker>
  `
})
export class ModalDateComponent {
  value: Date | string = '';
}
```

TimePicker works exactly the same way:

```html
<qeydar-time-picker
  [(ngModel)]="time"
  [presentation]="'modal'"
  [modalOptions]="{ animation: 'slide-up', hideHeader: true }"
></qeydar-time-picker>
```

That's it — clicking the input (or focusing it) now opens a centered, animated dialog with a dimmed backdrop, and closes on Escape / backdrop click.

---

## How it works

Under the hood the picker uses the Angular CDK `Overlay`. When `presentation === 'modal'`:

1. Instead of a `cdkConnectedOverlay` anchored to the input, the picker opens a **globally centered** overlay.
2. A `qeydar-picker-modal` dialog shell is rendered inside it, wrapping the **same** popup body that the popover uses — so every feature (range, time, custom templates, disabled dates, …) behaves identically.
3. `PickerModalService` owns the overlay lifecycle, focus trap, leave animation, and focus restoration back to the trigger.
4. Picker state and `ControlValueAccessor` ownership stay with the calling component — the modal is purely a presentation layer.

`inline` always wins: a picker with `[isInline]="true"` (DatePicker) or `[inline]="true"` (TimePicker) never opens a modal, regardless of `presentation`.

---

## API reference

### `presentation`

```ts
@Input() presentation: 'popover' | 'modal' = 'popover';
```

| Value      | Behaviour                                                              |
| ---------- | ---------------------------------------------------------------------- |
| `'popover'`| (default) The popup anchors to the input as before.                    |
| `'modal'`  | The popup renders inside a centered overlay dialog with a backdrop.    |

Available on **both** `qeydar-date-picker` and `qeydar-time-picker`.

### `modalOptions`

```ts
@Input() modalOptions: PickerModalOptions = {};
```

All options are optional — defaults are shown in the table.

| Option                 | Type                                  | Default   | Description                                                                 |
| ---------------------- | ------------------------------------- | --------- | --------------------------------------------------------------------------- |
| `hasBackdrop`          | `boolean`                             | `true`    | Render the dimmed backdrop behind the dialog.                              |
| `backdropClass`        | `string`                              | —         | Extra class(es) on the backdrop element.                                    |
| `panelClass`           | `string \| string[]`                  | —         | Extra class(es) on the overlay pane, useful for scoping custom styles.     |
| `closeOnEscape`        | `boolean`                             | `true`    | Close when the user presses `Escape`.                                      |
| `closeOnBackdropClick` | `boolean`                             | `true`    | Close when the user clicks the backdrop or the padding around the dialog.  |
| `restoreFocus`         | `boolean`                             | `true`    | Move focus back to the element that opened the modal once it closes.       |
| `hideHeader`           | `boolean`                             | `false`   | Hide the modal title bar (title + close button).                           |
| `animation`            | `'zoom' \| 'slide-up' \| 'fade'`      | `'zoom'`  | Entrance/exit animation. `'zoom'` auto-switches to a sheet on mobile.      |
| `mobileSheet`          | `boolean`                             | `true`    | On viewports < 480px, dock the dialog to the bottom as a sheet.            |

```typescript
// A full example
modalOptions = {
  animation: 'zoom',          // 'zoom' | 'slide-up' | 'fade'
  panelClass: 'my-brand-modal',
  backdropClass: 'my-backdrop',
  closeOnEscape: true,
  closeOnBackdropClick: true,
  restoreFocus: true,
  hideHeader: false,
  hasBackdrop: true,
  mobileSheet: true,
};
```

```html
<qeydar-date-picker
  [(ngModel)]="value"
  [presentation]="'modal'"
  [modalOptions]="modalOptions"
></qeydar-date-picker>
```

---

## Animations

Choose between three built-in entrance/exit animations:

| `animation`  | Effect                                                   |
| ------------ | -------------------------------------------------------- |
| `'zoom'`     | (default) Scale + fade up — the classic dialog look.    |
| `'slide-up'` | Slides in from the bottom (feels mobile-native).        |
| `'fade'`     | Simple opacity cross-fade.                              |

```html
<qeydar-time-picker
  [(ngModel)]="time"
  [presentation]="'modal'"
  [modalOptions]="{ animation: 'slide-up' }"
></qeydar-time-picker>
```

The entrance runs for **280ms** and the exit for **180ms**. These durations are tuned to feel snappy on desktop and smooth on mobile, and they automatically collapse to **1ms** when the user has `prefers-reduced-motion: reduce` enabled.

---

## Mobile bottom sheet

On viewports narrower than **480px**, the modal docks to the bottom of the screen as a **bottom sheet** with a drag handle and respects the safe-area inset. This happens automatically whenever `mobileSheet` is `true` (the default) and the chosen animation is compatible.

```html
<!-- A sheet that stays centered even on phones -->
<qeydar-date-picker
  [(ngModel)]="value"
  [presentation]="'modal'"
  [modalOptions]="{ mobileSheet: false }"
></qeydar-date-picker>
```

The sheet gets rounded top corners, a centered grab handle, and slides up/down on open/close instead of zooming.

---

## RTL & localization

The modal honors the picker's `rtl` setting:

- The overlay's direction is set to `rtl` when `[rtl]="true"`.
- The dialog shell respects `[dir]`, so the title/close button order mirrors your app.
- The title is localized through the picker's existing `lang` config (`selectDate`, `selectDateRange`, `selectTime`, etc.).

```html
<qeydar-date-picker
  [(ngModel)]="value"
  [calendarType]="'jalali'"
  [rtl]="true"
  [presentation]="'modal'"
></qeydar-date-picker>
```

---

## Styling the modal

The modal ships with sensible defaults, including **automatic dark-mode** support via `prefers-color-scheme`. You can override its look with plain CSS variables on the overlay host, or scope your own rules with `panelClass` / `backdropClass`.

### CSS variables (theming)

```css
.qeydar-picker-modal-host {
  --qpm-radius: 16px;            /* dialog corner radius        */
  --qpm-surface: #fff;           /* dialog background           */
  --qpm-border: #e8eaed;         /* dialog border               */
  --qpm-text: #303133;           /* primary text                */
  --qpm-muted: #8a8f98;          /* secondary text / close icon */
  --qpm-hover: #f2f4f7;          /* hover surface               */
  --qpm-accent: #40a9ff;         /* focus ring accent           */
}
```

You can also bridge the picker's own design tokens — the modal falls back to them automatically:

```css
:root {
  --dp-color-surface: #ffffff;
  --dp-color-border:  #e8eaed;
  --dp-color-text:    #303133;
  --dp-color-muted:   #8a8f98;
  --dp-color-hover:   #f2f4f7;
  --dp-color-primary: #40a9ff;
}
```

### Scoping custom styles with `panelClass`

```typescript
modalOptions = { panelClass: 'brand-datepicker' };
```

```css
.brand-datepicker .qeydar-picker-modal {
  border-radius: 24px;
  background: linear-gradient(180deg, #1f2937, #111827);
  color: #f9fafb;
}
.brand-datepicker .qeydar-picker-modal-header {
  border-color: rgba(255,255,255,.08);
}
```

### Dark mode

The dialog automatically swaps to a dark surface when the OS/browser is in dark mode. To **force** dark, just set the CSS variables above on `.qeydar-picker-modal-host` yourself.

---

## Modal + custom templates

Modal presentation and custom templates are fully independent — you can use both at once. For example, a mobile-friendly modal with a custom footer:

```html
<qeydar-date-picker
  [(ngModel)]="value"
  [calendarType]="'jalali'"
  [format]="'yyyy/MM/dd HH:mm'"
  [showTimePicker]="true"
  [presentation]="'modal'"
  [modalOptions]="{ animation: 'slide-up' }"
>
  <ng-template qeydarTemplate="footer" let-ctx>
    <div style="display:flex;gap:8px;justify-content:flex-end;padding:12px;">
      <button type="button" (click)="ctx.cancel()">انصراف</button>
      <button type="button" (click)="ctx.confirm()">ثبت</button>
    </div>
  </ng-template>
</qeydar-date-picker>
```

See [CUSTOM_TEMPLATES.md](./CUSTOM_TEMPLATES.md) for the full template API.

---

## Accessibility

The modal is built to be keyboard- and screen-reader-friendly out of the box:

- **`role="dialog"` + `aria-modal="true"`** on the dialog shell, with an `aria-labelledby` pointing at the title.
- A **CDK focus trap** keeps Tab cycling inside the modal while it is open.
- **Escape** closes the dialog (when `closeOnEscape` is on).
- **Focus restoration** returns focus to the trigger input after close (when `restoreFocus` is on), and the picker guards against the restored focus immediately re-opening the modal.
- Respects `prefers-reduced-motion`.

---

## Best practices & gotchas

1. **`presentation` is ignored for inline pickers.** `inline`/`isInline` always renders the calendar in place.
2. **Re-opening after close.** The picker suppresses the focus event that restoring focus would generate, so the modal does not instantly bounce back. If you wire your own open trigger (e.g. a button calling the picker's `open()`), make sure it is not the same element the modal restores focus to.
3. **One modal at a time per picker.** Each picker instance has its own `PickerModalService`. Calling `open()` while a modal is already open is a no-op.
4. **`hasBackdrop: false`** disables the dimmed layer; in that mode clicking anywhere outside the dialog (or pressing Escape, if enabled) still dismisses it.
5. **`hideHeader: true`** removes the title/close button. Provide your own close affordance (e.g. a custom `footer` template with `ctx.cancel()`) so users are not stranded.
6. **Routing/navigation.** The overlay is `disposeOnNavigation`, so leaving the route automatically tears the modal down.
7. **Performance.** The leave animation is `will-change: transform, opacity` for its short duration and is cleaned up afterwards; no long-running GPU layers are left behind.
