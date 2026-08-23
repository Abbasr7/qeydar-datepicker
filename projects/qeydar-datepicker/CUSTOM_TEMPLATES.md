# Custom Templates

The Qeydar DatePicker lets you override **every** visual part of the calendar with your own markup using a small, content-projection directive. You can tweak a single day cell, restyle the header/footer, or take over the entire calendar body and render your own wheel/dock picker — all while keeping the library's date logic, range selection, validation, and `ControlValueAccessor` wiring intact.

> The directive was previously called `Template` (e.g. `<ng-template Template="day">`). That selector still works, but the recommended spelling is now **`qeydarTemplate`**.

---

## Table of contents

- [How it works](#how-it-works)
- [Available slots](#available-slots)
- [Cell templates (`day`, `month`, `year`)](#cell-templates-day-month-year)
  - [Template context reference](#template-context-reference)
  - [Example 1 — day with event indicators](#example-1--day-with-event-indicators)
  - [Example 2 — highlighting Jalali holidays](#example-2--highlighting-jalali-holidays)
  - [Example 3 — colored month & year cells](#example-3--colored-month--year-cells)
- [Headless slots (`toolbar`, `header`, `footer`, `body`)](#headless-slots-toolbar-header-footer-body)
  - [Example 4 — custom header with custom title](#example-4--custom-header-with-custom-title)
  - [Example 5 — quick-range toolbar](#example-5--quick-range-toolbar)
  - [Example 6 — custom footer with Confirm / Clear](#example-6--custom-footer-with-confirm--clear)
  - [Example 7 — fully custom body (wheel picker)](#example-7--fully-custom-body-wheel-picker)
- [TypeScript context types](#typescript-context-types)
- [Styling notes](#styling-notes)
- [Best practices & gotchas](#best-practices--gotchas)

---

## How it works

Place one or more `<ng-template>` elements **between the opening and closing tags** of `<qeydar-date-picker>` and tag each one with the `qeydarTemplate` directive, naming the slot it targets:

```html
<qeydar-date-picker [(ngModel)]="value">
  <ng-template qeydarTemplate="day" let-day> … </ng-template>
  <ng-template qeydarTemplate="header" let-ctx> … </ng-template>
</qeydar-date-picker>
```

The directive picks them up via `@ContentChildren` and routes each one to the right part of the calendar. If you do **not** project a slot, the built-in markup is rendered instead — so you can override as much or as little as you like.

Every template receives a typed **context object**. With Angular's `let-foo` syntax you can destructure named fields, or use `let-ctx` to grab the whole object:

```html
<!-- named shortcut -->
<ng-template qeydarTemplate="day" let-dayNumber="dayNumber" let-isSelected="isSelected"> … </ng-template>

<!-- whole context -->
<ng-template qeydarTemplate="header" let-ctx>
  <span>{{ ctx.currentMonthName }} {{ ctx.currentYear }}</span>
</ng-template>
```

---

## Available slots

| Slot       | What it replaces                                              | Context type                |
| ---------- | ------------------------------------------------------------- | --------------------------- |
| `day`      | The inner content of each day cell (the default day number)   | `DayTemplateContext`        |
| `month`    | The inner content of each month cell (in the month selector)  | `MonthTemplateContext`      |
| `year`     | The inner content of each year cell (in the year selector)    | `YearTemplateContext`       |
| `toolbar`  | Extra row rendered **above** the calendar header              | `ToolbarTemplateContext`    |
| `header`   | The entire calendar header (prev / next / title row)          | `HeaderTemplateContext`     |
| `footer`   | The entire calendar footer (description, today, OK)           | `FooterTemplateContext`     |
| `body`     | **All** day/month/year grids — an escape hatch                | `BodyTemplateContext`       |

The directive validates slot names in development mode and warns in the console if you pass an unknown name (e.g. a typo).

---

## Cell templates (`day`, `month`, `year`)

Cell templates only replace the **content inside** each button — the button itself (click handling, disabled state, range/start/end CSS classes) is still managed by the grid. That keeps keyboard navigation, range drag-preview, and disabled-date validation working for free.

### Template context reference

**`day`** — `let-day` (the `Date`) / `DayTemplateContext`

| Property         | Type      | Description                                                        |
| ---------------- | --------- | ------------------------------------------------------------------ |
| `$implicit`      | `Date`    | The date (alias of `day` / `date`)                                 |
| `day` / `date`   | `Date`    | The cell's date                                                    |
| `dayNumber`      | `number`  | Localized day-of-month number (correct for Jalali/Gregorian)       |
| `isSelected`     | `boolean` | The date is part of the current selection                          |
| `isInRange`      | `boolean` | The date falls inside a selected range                             |
| `isRangeStart`   | `boolean` | The date is the start of a range                                   |
| `isRangeEnd`     | `boolean` | The date is the end of a range                                     |
| `isToday`        | `boolean` | The date is today (only when `[showToday]` is enabled)             |
| `isDisabled`     | `boolean` | The date is disabled by min/max, `disabledDates` or the filter     |
| `isCurrentMonth` | `boolean` | The date belongs to the displayed month (false for leading/trailing days) |

**`month`** — `let-month` / `MonthTemplateContext`

| Property       | Type      | Description                                       |
| -------------- | --------- | ------------------------------------------------- |
| `$implicit`    | `number`  | Month number (1–12)                               |
| `month`        | `number`  | Month number (1–12)                               |
| `name`         | `string`  | Localized month name                              |
| `isSelected`   | `boolean` | This month is the active one                      |
| `isInRange`    | `boolean` | This month falls inside a selected range          |
| `isDisabled`   | `boolean` | The month is disabled                             |

**`year`** — `let-year` / `YearTemplateContext`

| Property     | Type      | Description                                |
| ------------ | --------- | ------------------------------------------ |
| `$implicit`  | `number`  | The year                                   |
| `year`       | `number`  | The year                                   |
| `isSelected` | `boolean` | This year is the active one                |
| `isInRange`  | `boolean` | This year falls inside a selected range    |
| `isDisabled` | `boolean` | The year is disabled                       |

### Example 1 — day with event indicators

Add a colored dot for days that have associated events, and emphasize today's date.

```typescript
import { Component } from '@angular/core';
import { QeydarDatePickerModule } from '@qeydar/datepicker';

interface CalendarEvent { date: string; color: string; }

@Component({
  selector: 'app-events-picker',
  standalone: true,
  imports: [QeydarDatePickerModule],
  template: `
    <qeydar-date-picker
      [(ngModel)]="value"
      [showToday]="true"
      [calendarType]="'jalali'"
      [format]="'yyyy/MM/dd'"
    >
      <ng-template qeydarTemplate="day" let-day let-events="eventsCount">
        <span class="qd-day">
          {{ day.getDate() }}
          <i
            *ngIf="events(day).length"
            class="qd-dot"
            [style.background]="events(day)[0].color"
          ></i>
        </span>
      </ng-template>
    </qeydar-date-picker>
  `,
  styles: [`
    .qd-day   { position: relative; display: inline-block; }
    .qd-dot   { position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%);
                width: 5px; height: 5px; border-radius: 50%; }
  `]
})
export class EventsPickerComponent {
  value: Date | string = '';
  private eventList: CalendarEvent[] = [
    { date: '1403/08/15', color: '#ff4d4f' },
    { date: '1403/08/16', color: '#52c41a' },
    { date: '1403/08/16', color: '#1677ff' },
  ];

  /** Returns the events attached to a given day. */
  events(day: Date): CalendarEvent[] {
    const key = day.toISOString().slice(0, 10);
    return this.eventList.filter(e => e.date === key);
  }
}
```

### Example 2 — highlighting Jalali holidays

Because the context exposes the raw `Date`, you can decorate Fridays (the Persian weekend) and bank holidays without giving up the picker's own disabled/selected styles.

```html
<qeydar-date-picker
  [(ngModel)]="value"
  [calendarType]="'jalali'"
  [rtl]="true"
>
  <ng-template qeydarTemplate="day" let-day>
    <span
      [class.qd-friday]="isFriday(day)"
      [class.qd-holiday]="isHoliday(day)"
    >
      {{ day.getDate() }}
    </span>
  </ng-template>
</qeydar-date-picker>
```

```typescript
isFriday(day: Date): boolean { return day.getDay() === 5; } // JS Friday === 5
isHoliday(day: Date): boolean {
  return this.holidays.some(h => h.getTime() === day.setHours(0,0,0,0));
}
```

> The CSS classes (`qd-friday`, `qd-holiday`) live in your component styles. Because they are applied to content **inside** the grid button, they compose with the grid's own `.selected`, `.in-range`, `.disabled` classes.

### Example 3 — colored month & year cells

```html
<qeydar-date-picker [(ngModel)]="value" [mode]="'month'">
  <ng-template qeydarTemplate="month" let-name let-month="month" let-isSelected="isSelected">
    <span [style.color]="isSelected ? '#fff' : monthColor(month)">
      {{ name }}
    </span>
  </ng-template>
</qeydar-date-picker>

<qeydar-date-picker [(ngModel)]="value" [mode]="'year'">
  <ng-template qeydarTemplate="year" let-year let-isDisabled="isDisabled">
    <span [class.text-muted]="isDisabled">
      {{ year }} {{ isDisabled ? '🔒' : '' }}
    </span>
  </ng-template>
</qeydar-date-picker>
```

```typescript
monthColor(month: number): string {
  const palette = ['#1677ff','#52c41a','#fa8c16','#722ed1','#eb2f96','#13c2c2',
                   '#f5222d','#faad14','#2f54eb','#a0d911','#fadb14','#08979c'];
  return palette[(month - 1) % palette.length];
}
```

---

## Headless slots (`toolbar`, `header`, `footer`, `body`)

These slots give you a full "headless" mode. They replace whole regions of the popup and hand you **callback functions** wired into the picker's real state machine, so your custom UI drives the same selection / validation / navigation logic.

| Slot     | Replaces                                                | When to use it                                                |
| -------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| `toolbar`| Nothing (it is additive)                                | Add quick actions above the header                            |
| `header` | The prev/next/title row                                 | Replace the navigation chrome with your own                   |
| `footer` | The whole footer                                        | Custom Confirm/Cancel/Today layout, or to inject helper text  |
| `body`   | The day grid **and** month grid **and** year grid       | Render a completely custom body (e.g. a wheel/dock picker)    |

> **`body` is an escape hatch.** When present, the default day/month/year grids are **not** created at all — you are responsible for rendering every column. Everything you need (the day list, month list, year list, selection flags, disabled flags, and the action callbacks) is in the context.

### Example 4 — custom header with custom title

```html
<qeydar-date-picker [(ngModel)]="value">
  <ng-template qeydarTemplate="header" let-ctx>
    <div class="qd-header">
      <button type="button" (click)="ctx.prev()" [disabled]="ctx.prevDisabled">‹</button>

      <button type="button" class="qd-title" (click)="ctx.showMonths()">
        {{ ctx.currentMonthName }} {{ ctx.currentYear }}
      </button>

      <button type="button" (click)="ctx.next()" [disabled]="ctx.nextDisabled">›</button>
    </div>
  </ng-template>
</qeydar-date-picker>
```

`HeaderTemplateContext` fields:

| Field              | Type                                | Description                                  |
| ------------------ | ----------------------------------- | -------------------------------------------- |
| `currentDate`      | `Date`                              | The month currently displayed                |
| `currentMonthName` | `string`                            | Localized month name                         |
| `currentYear`      | `number`                            | Year (localized to the active calendar)      |
| `viewMode`         | `'days' \| 'months' \| 'years'`     | Current view                                 |
| `mode`             | `'day' \| 'month' \| 'year'`        | Picker selection mode                        |
| `prevDisabled`     | `boolean`                           | Previous navigation is blocked (min date)    |
| `nextDisabled`     | `boolean`                           | Next navigation is blocked (max date)        |
| `prev()` / `next()`| `() => void`                        | Navigate backwards / forwards                |
| `showMonths()`     | `() => void`                        | Switch to the month selector                 |
| `showYears()`      | `() => void`                        | Switch to the year selector                  |

### Example 5 — quick-range toolbar

```html
<qeydar-date-picker
  [(ngModel)]="range"
  [isRange]="true"
  [calendarType]="'jalali'"
>
  <ng-template qeydarTemplate="toolbar" let-ctx>
    <div class="qd-toolbar">
      <button type="button" (click)="ctx.selectQuickRange(weekStart(), weekEnd())">این هفته</button>
      <button type="button" (click)="ctx.selectQuickRange(monthStart(), monthEnd())">این ماه</button>
      <button type="button" (click)="ctx.selectQuickDate(today)">امروز</button>
      <button type="button" (click)="ctx.close()">بستن</button>
    </div>
  </ng-template>
</qeydar-date-picker>
```

`ToolbarTemplateContext` fields:

| Field                                         | Description                                  |
| --------------------------------------------- | -------------------------------------------- |
| `currentDate`                                 | The displayed date                           |
| `mode` / `isRange`                            | Current mode and whether range selection is on |
| `selectQuickDate(date)`                       | Programmatic single-date selection           |
| `selectQuickRange(start, end)`                | Programmatic range selection                 |
| `close()`                                     | Close the picker                             |

### Example 6 — custom footer with Confirm / Clear

```html
<qeydar-date-picker
  [(ngModel)]="value"
  [format]="'yyyy/MM/dd HH:mm'"
  [showTimePicker]="true"
>
  <ng-template qeydarTemplate="footer" let-ctx>
    <div class="qd-footer">
      <span class="qd-hint" *ngIf="ctx.isRange">
        {{ formatRange(ctx.selectedStartDate, ctx.selectedEndDate) }}
      </span>

      <div class="qd-actions">
        <button type="button" (click)="ctx.today()">امروز</button>
        <button type="button" class="qd-clear" (click)="clear(ctx)">پاک‌کردن</button>
        <button type="button" class="qd-ok" (click)="ctx.confirm()">تأیید</button>
      </div>
    </div>
  </ng-template>
</qeydar-date-picker>
```

`FooterTemplateContext` fields:

| Field                                              | Description                                  |
| -------------------------------------------------- | -------------------------------------------- |
| `selectedDate`                                     | Single-mode selected date                    |
| `selectedStartDate` / `selectedEndDate`            | Range-mode bounds (nullable)                 |
| `isRange` / `showTimePicker`                       | Flags for conditional rendering              |
| `confirm()`                                        | Emit the current value and close             |
| `cancel()`                                         | Close without emitting                       |
| `today()`                                          | Jump to / select today                       |

### Example 7 — fully custom body (wheel picker)

This is the most powerful slot. `bodyContext` exposes everything the built-in grids use, so you can rebuild the calendar surface however you want.

```html
<qeydar-date-picker [(ngModel)]="value" [showSidebar]="false">
  <ng-template qeydarTemplate="body" let-c>
    <!-- Days view -->
    <div class="qd-weekdays">
      <span *ngFor="let w of c.weekDays">{{ w }}</span>
    </div>

    <div class="qd-grid">
      <button
        *ngFor="let day of c.days"
        type="button"
        class="qd-cell"
        [class.is-selected]="c.selection.isSelected(day)"
        [class.in-range]="c.selection.isInRange(day)"
        [class.is-today]="c.selection.isToday(day)"
        [disabled]="c.validation.isDateDisabled(day)"
        (click)="c.actions.selectDay(day)"
      >
        {{ day.getDate() }}
      </button>
    </div>

    <!-- A docked year rail that always lets the user jump across decades -->
    <div class="qd-year-rail">
      <button
        *ngFor="let y of c.utils.generateYearList(20)"
        type="button"
        [disabled]="c.validation.isYearDisabled(y)"
        (click)="c.actions.selectYear(y)"
      >{{ y }}</button>
    </div>
  </ng-template>
</qeydar-date-picker>
```

`BodyTemplateContext` shape:

```ts
{
  viewMode: 'days' | 'months' | 'years';
  currentDate: Date;
  days: Date[];                 // the 42-cell (6×7) day grid
  monthListNum: number[];       // [1 .. 12]
  yearList: number[];           // currently visible decade
  weekDays: string[];           // localized weekday headers

  selection: {
    isSelected(date): boolean;
    isInRange(date): boolean;
    isRangeStart(date): boolean;
    isRangeEnd(date): boolean;
    isToday(date): boolean;
  };

  validation: {
    isDateDisabled(date): boolean;
    isMonthDisabled(month): boolean;
    isYearDisabled(year): boolean;
  };

  actions: {
    selectDay(date, closeAfterSelection?): void;
    selectMonth(month): void;
    selectYear(year): void;
    goPrev(): void;
    goNext(): void;
  };

  utils: {
    generateYearList(length): number[];
  };
}
```

> `actions.selectDay(date, closeAfterSelection)` accepts an optional second argument; pass `true` to close the popup right after selecting.

---

## TypeScript context types

All of the context interfaces are exported from the package, so your own components can stay fully typed:

```ts
import {
  DayTemplateContext,
  MonthTemplateContext,
  YearTemplateContext,
  ToolbarTemplateContext,
  HeaderTemplateContext,
  FooterTemplateContext,
  BodyTemplateContext,
  DatePickerTemplateType,
  CustomTemplate          // the directive itself
} from '@qeydar/datepicker';
```

The directive's `selector` accepts `[qeydarTemplate]` and `[Template]` (legacy). The slot name is taken from the input `qeydarTemplate="..."` (or `Template="..."`).

---

## Styling notes

- Cell templates render **inside** the grid buttons, so the picker's own CSS classes (`selected`, `in-range`, `range-start`, `range-end`, `today`, `disabled`, `different-month`) still apply to the button wrapper. Style your inner content and let the wrapper handle state.
- Headless templates render in place of the built-in markup, so you own the full layout — add your own classes and styles freely.
- The popup uses `ViewEncapsulation.None`, so global selectors targeting `.qeydar-date-picker-popup .…` will hit your templates too.
- For theming variables you can reuse (colors, radius, etc.), see the **Styling** section of the main [README](../../README.md).

---

## Best practices & gotchas

1. **Don't re-create closures in the template.** The grids pass stable callback references to keep `OnPush` child inputs from changing on every change detection cycle. In the `body` slot the callbacks are already bound — call them directly (`c.actions.selectDay(day)`).
2. **Keep cell content light.** A day grid renders ~42 cells; heavy components or async work per cell will hurt scroll/render performance.
3. **Disabled dates are still your responsibility in `body`.** The grid disables cells for you when using `day`/`month`/`year` slots, but in `body` you must check `validation.isDateDisabled(date)` yourself before calling `selectDay`.
4. **`OnPush` hosts.** If your host component uses `OnPush`, make sure any data your template reads (e.g. the `events()` map above) triggers change detection. Mutating the same array reference won't.
5. **Mixing slots is fine.** You can override `day` and `footer` at the same time; every slot is optional and independent.
6. **A11y.** For interactive elements inside templates, keep `type="button"` and reasonable `aria-*` attributes. The picker traps focus inside the popup/modal, so plain buttons are keyboard-accessible.
7. **Legacy selector.** `<ng-template Template="day">` still works for backward compatibility, but prefer `qeydarTemplate` in new code.
