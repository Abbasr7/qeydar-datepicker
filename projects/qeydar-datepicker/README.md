<div align="center">
  <a href="https://www.npmjs.com/package/@qeydar/datepicker" target="_blank">
    <img src="https://img.shields.io/badge/Npm-v3.0.0-blue" alt="NPM Version" />
  </a>
  <img src="https://img.shields.io/badge/Angular-%E2%89%A520.0.0-fe019a" alt="Angular Version" />
</div>

# Qeydar Date and Time Pickers

A comprehensive package providing separate DatePicker and TimePicker components for Angular applications, with support for both Jalali (Persian) and Gregorian calendars.
This package supports Angular 14 and above. Specific version compatibility:

| Package Version | Angular Version | Description      |
| --------------- | --------------- | ---------------- |
| 1.x.x           | ≥14.0.0         |                  |
| 2.x.x           | ≥14.0.0,20.0.0≥         | +Custom Templates, Modal Presentation, support Ng14 to Ng20 |
| 3.x.x           | ≥21.0.0        | Ng 21+ |

## Demo
You can see the online [Demo](https://qeydar-datepicker-git-master-abbasr7s-projects.vercel.app/)

## Guides

In-depth guides for advanced features:

| Topic | Description |
| ----- | ----------- |
| [Custom Templates](https://github.com/Abbasr7/qeydar-datepicker/blob/master/projects/qeydar-datepicker/CUSTOM_TEMPLATES.md) | Override day/month/year cells and headless regions (toolbar, header, footer, body) with `qeydarTemplate`. |
| [Modal Presentation](https://github.com/Abbasr7/qeydar-datepicker/blob/master/projects/qeydar-datepicker/MODAL_MODE.md) | Open pickers as a centered dialog with backdrop, focus trap, animations, and mobile bottom sheet. |
| [Custom Adapters](https://github.com/Abbasr7/qeydar-datepicker/blob/master/projects/qeydar-datepicker/CUSTOM_ADAPTERS.md) | Implement any calendar system (Jalali, Hijri, …) via a `DateAdapter`. |

## Components

This package includes two main components:

1. `QeydarDatePicker`: A flexible date picker with range selection support and time selection
2. `QeydarTimePicker`: A standalone time picker with 12/24 hour format support

## Features

### DatePicker

- 📅 Support for both Jalali (Persian) and Gregorian calendars
- 🎯 Single date and date range selection
- ⏰ Integrated time selection support
- 🌐 Multilingual support (English/Persian)
- 📏 Min/Max date restrictions
- 🎨 Customizable styles
- 📱 Responsive design
- ⌨️ Keyboard navigation
- 🔄 Form integration
- 📋 Custom period labels
- 📐 Multiple placement options
- 🔄 Value format flexibility (string/Date object)
- 🎯 Today button support
- 🚫 Disabled dates support with custom filtering
- 🎨 Custom templates for days, months, and years
- 🧩 Headless templates for toolbar, header, footer, and the whole calendar body
- 🪟 Modal/dialog presentation with backdrop, focus trap, animations & mobile bottom sheet
- 🔒 Read-only mode support

### TimePicker

- ⏰ 12/24 hour format support
- ⏱️ Optional seconds display
- 🔒 Time range restrictions
- 🎭 Time input mask
- 🌐 Multilingual AM/PM
- 📍 Inline display mode
- 🪟 Modal/dialog presentation (shared with DatePicker)
- 🔄 Date adapter integration
- 🚫 Disabled times support with custom filtering

## Installation

```bash
npm install @angular/cdk@<COMPATIBLE_VERSION> @qeydar/datepicker
```

### Dependencies

```json
{
  "@angular/cdk": ">=14.0.0",
  "date-fns": ">=4.0.0",
  "date-fns-jalali": ">=4.0.0"
}
```

### Required Styles

```css
@import "@angular/cdk/overlay-prebuilt.css";
```

## DatePicker Usage

### Basic Usage

```typescript
// app.module.ts
import { QeydarDatePickerModule } from "@qeydar/datepicker";

@NgModule({
  imports: [QeydarDatePickerModule],
})
export class AppModule {}

// component.ts
@Component({
  template: `
    <qeydar-date-picker
      [(ngModel)]="selectedDate"
      [calendarType]="'jalali'"
    ></qeydar-date-picker>
  `,
})
export class AppComponent {
  selectedDate: Date | string = "1403/01/01"; // Can accept both Date object and string
}
```

### Range Selection

The DatePicker supports flexible range selection with multiple ways to handle values:

```typescript
@Component({
  template: `
    <qeydar-date-picker
      [(ngModel)]="dateRange"
      [isRange]="true"
      [rangeInputLabels]="{ start: 'From', end: 'To' }"
      [emitInDateFormat]="false"
      [calendarType]="'jalali'"
    ></qeydar-date-picker>
  `,
})
export class AppComponent {
  // Using string values
  dateRange = {
    start: "1403/08/12",
    end: "1403/08/15",
  };

  // Using mixed values (string and Date)
  dateRange2 = {
    start: "1403/08/12",
    end: new Date(),
  };

  // Using Date objects
  dateRange3 = {
    start: new Date("2024-01-01"),
    end: new Date("2024-01-07"),
  };

  // With emitInDateFormat=true, values will be emitted as Date objects
  onRangeChange(range: { start: Date; end: Date }) {
    console.log("Start:", range.start);
    console.log("End:", range.end);
  }
}
```

### Range Selection with Predefined Periods

```typescript
// Define custom period labels
const customLabels: CustomLabels[] = [
  {
    label: 'This Week',
    value: [new Date('2024-01-01'), new Date('2024-01-07')]
  },
  {
    label: 'Last 7 Days',
    value: ['1403/08/05', '1403/08/12'] // Can use strings for Jalali dates
  },
  {
    label: 'Custom Range',
    value: 'custom'
  }
];

@Component({
  template: `
    <qeydar-date-picker
      [(ngModel)]="dateRange"
      [isRange]="true"
      [customLabels]="customLabels"
      (onChangeValue)="onRangeChange($event)"
    ></qeydar-date-picker>
  `
})
```

### Date and Time Selection

```typescript
@Component({
  template: `
    <qeydar-date-picker
      [(ngModel)]="selectedDateTime"
      [format]="'yyyy/MM/dd HH:mm:ss'"
      [showTimePicker]="true"
      [timeDisplayFormat]="'HH:mm'"
      [showToday]="true"
    ></qeydar-date-picker>
  `,
})
export class AppComponent {
  selectedDateTime: Date | string = new Date();
}
```

### Value Format Options

```typescript
@Component({
  template: `
    <qeydar-date-picker
      [(ngModel)]="selectedDate"
      [valueFormat]="'gregorian'"  // 'gregorian' | 'jalali' | 'date'
      [calendarType]="'jalali'"
    ></qeydar-date-picker>
  `
})
```

### Disabled Dates

```typescript
@Component({
  template: `
    <qeydar-date-picker
      [(ngModel)]="selectedDate"
      [disabledDates]="disabledDates"
      [disabledDatesFilter]="disabledDatesFilter"
    ></qeydar-date-picker>
  `,
})
export class AppComponent {
  // These will disable the entire day
  disabledDates = [
    new Date(2024, 0, 1), // Jan 1, 2024
    new Date(2024, 11, 25), // Dec 25, 2024
    "2024/01/15", // Jan 15, 2024
  ];

  // This will disable specific days advanced
  disabledDatesFilter = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Disable weekends
  };
}
```

### Custom Templates

The DatePicker supports fully customizable templates. You can override individual **cells** (`day`, `month`, `year`) or take over whole **regions** of the popup (`toolbar`, `header`, `footer`, `body`) using the `qeydarTemplate` directive — while keeping all the picker's date logic, range selection, validation, and form integration intact.

> 📖 For the complete guide — every context field, real-world examples (event indicators, Jalali holidays, quick-range toolbar, wheel-picker body), TypeScript types, and styling tips — see **[CUSTOM_TEMPLATES.md](https://github.com/Abbasr7/qeydar-datepicker/blob/master/projects/qeydar-datepicker/CUSTOM_TEMPLATES.md)**.

**Cell templates** replace the content *inside* each grid button (state classes like `.selected`, `.in-range`, `.disabled` still apply to the button wrapper):

```typescript
@Component({
  template: `
    <qeydar-date-picker [(ngModel)]="selectedDate">
      <!-- Custom day template: receives a typed DayTemplateContext -->
      <ng-template qeydarTemplate="day" let-day let-isSelected="isSelected" let-isToday="isToday">
        <span [class.my-today]="isToday">
          {{ day.getDate() }}
          <span *ngIf="isSpecialDay(day)" class="special-indicator">*</span>
        </span>
      </ng-template>

      <!-- Custom month template: receives MonthTemplateContext -->
      <ng-template qeydarTemplate="month" let-name let-month="month" let-isDisabled="isDisabled">
        <span [class.my-muted]="isDisabled">{{ name }}</span>
      </ng-template>

      <!-- Custom year template: receives YearTemplateContext -->
      <ng-template qeydarTemplate="year" let-year let-isSelected="isSelected">
        <strong *ngIf="isSelected; else plain">{{ year }}</strong>
        <ng-template #plain>{{ year }}</ng-template>
      </ng-template>
    </qeydar-date-picker>
  `,
})
export class AppComponent {
  isSpecialDay(date: Date): boolean {
    // Your custom logic
    return date.getDate() === 1;
  }
}
```

### Slot Templates (Headless Regions)

**Headless slots** replace entire regions of the popup and hand you callback functions wired into the picker's real state machine. `body` is an escape hatch — when it is present, the default day/month/year grids are **not** created, so you must render every column yourself:

```html
<qeydar-date-picker [(ngModel)]="selectedDate">
  <!-- Toolbar: quick actions rendered above the header -->
  <ng-template qeydarTemplate="toolbar" let-ctx>
    <button type="button" (click)="ctx.selectQuickDate(today)">Today</button>
  </ng-template>

  <!-- Header: replaces the prev/next/title row -->
  <ng-template qeydarTemplate="header" let-ctx>
    <button type="button" (click)="ctx.prev()" [disabled]="ctx.prevDisabled">‹</button>
    <span (click)="ctx.showMonths()">{{ ctx.currentMonthName }} {{ ctx.currentYear }}</span>
    <button type="button" (click)="ctx.next()" [disabled]="ctx.nextDisabled">›</button>
  </ng-template>

  <!-- Body: replace all day/month/year grids (escape hatch) -->
  <ng-template qeydarTemplate="body" let-ctx>
    <div class="my-grid">
      <button
        type="button"
        *ngFor="let day of ctx.days"
        [disabled]="ctx.validation.isDateDisabled(day)"
        (click)="ctx.actions.selectDay(day)"
      >{{ day.getDate() }}</button>
    </div>
  </ng-template>

  <!-- Footer: replaces the description/today/OK row -->
  <ng-template qeydarTemplate="footer" let-ctx>
    <button type="button" (click)="ctx.today()">Today</button>
    <button type="button" (click)="ctx.confirm()">OK</button>
  </ng-template>
</qeydar-date-picker>
```

Each slot exposes a typed context (`ToolbarTemplateContext`, `HeaderTemplateContext`, `BodyTemplateContext`, `FooterTemplateContext`) with bound action callbacks. The legacy selector `<ng-template Template="day">` still works for backward compatibility. See **[CUSTOM_TEMPLATES.md](https://github.com/Abbasr7/qeydar-datepicker/blob/master/projects/qeydar-datepicker/CUSTOM_TEMPLATES.md)** for the full context reference.

### Read-only Mode

The DatePicker now supports two types of read-only modes:

```typescript
@Component({
  template: `
    <!-- Completely read-only - prevents both input and calendar interaction -->
    <qeydar-date-picker
      [(ngModel)]="selectedDate"
      [readOnly]="true"
    ></qeydar-date-picker>

    <!-- Read-only input but allows calendar interaction -->
    <qeydar-date-picker
      [(ngModel)]="selectedDate"
      [readOnlyInput]="true"
    ></qeydar-date-picker>
  `
})
```

## TimePicker Usage

The TimePicker is a separate component for time selection:

```typescript
@Component({
  template: `
    <qeydar-time-picker
      [(ngModel)]="selectedTime"
      [timeFormat]="'24'"
      [showSeconds]="true"
      [minTime]="'09:00'"
      [maxTime]="'17:00'"
    ></qeydar-time-picker>
  `,
})
export class AppComponent {
  selectedTime = "14:30:00";

  // Or using Date object with valueType="date"
  selectedDateTime = new Date();
}
```

### TimePicker with Custom Format

```typescript
<qeydar-time-picker
  [(ngModel)]="time"
  [timeFormat]="'12'"
  [displayFormat]="'hh:mm a'"
  [rtl]="true"
  (timeChange)="onTimeChange($event)"
></qeydar-time-picker>
```

### Inline Mode with Date Adapter

```typescript
@Component({
  template: `
    <qeydar-time-picker
      [(ngModel)]="time"
      [inline]="true"
      [dateAdapter]="dateAdapter"
      [timeDisplayFormat]="'HH:mm:ss'"
      (timeChange)="onTimeChange($event)"
    ></qeydar-time-picker>
  `,
})
export class AppComponent {
  constructor(public dateAdapter: GregorianDateAdapter) {}
}
```

### Disabled Times

```typescript
@Component({
  template: `
    <qeydar-time-picker
      [(ngModel)]="selectedTime"
      [disabledTimesFilter]="disabledTimesFilter"
    ></qeydar-time-picker>
  `,
})
export class AppComponent {
  // Disable lunch hours (12:00-13:00)
  disabledTimesFilter = (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Disable specific hour
    if (hour === 12) return true;

    // Disable specific minutes
    if (minute === 45) return true;

    return false;
  };
}
```

### Custom Adapters
For details on implementing custom adapters, see the [CUSTOM_ADAPTERS.md](https://github.com/Abbasr7/qeydar-datepicker/blob/master/projects/qeydar-datepicker/CUSTOM_ADAPTERS.md) guide.

## Modal Presentation

Both the DatePicker and TimePicker can open in a centered **modal dialog** (with a dimmed backdrop, focus trap, Escape/backdrop-to-close, animations, and an automatic mobile bottom sheet) instead of the default popover. Just set `presentation` to `'modal'`:

```html
<!-- DatePicker as a modal -->
<qeydar-date-picker
  [(ngModel)]="value"
  [calendarType]="'jalali'"
  [presentation]="'modal'"
></qeydar-date-picker>

<!-- TimePicker as a modal -->
<qeydar-time-picker
  [(ngModel)]="time"
  [presentation]="'modal'"
  [modalOptions]="{ animation: 'slide-up', hideHeader: true }"
></qeydar-time-picker>
```

Fine-tune the dialog with `modalOptions`:

```typescript
modalOptions: PickerModalOptions = {
  animation: 'zoom',          // 'zoom' | 'slide-up' | 'fade'
  hasBackdrop: true,
  closeOnEscape: true,
  closeOnBackdropClick: true,
  restoreFocus: true,
  hideHeader: false,
  mobileSheet: true,          // dock to bottom as a sheet on < 480px screens
  panelClass: 'my-brand-modal',
  backdropClass: 'my-backdrop',
};
```

| `modalOptions`         | Type                                 | Default  | Description                                                |
| ---------------------- | ------------------------------------ | -------- | ---------------------------------------------------------- |
| `animation`            | `'zoom' \| 'slide-up' \| 'fade'`     | `'zoom'` | Entrance/exit animation (`'zoom'` becomes a sheet on mobile) |
| `hasBackdrop`          | `boolean`                            | `true`   | Render the dimmed backdrop                                 |
| `backdropClass`        | `string`                             | —        | Extra class on the backdrop element                        |
| `panelClass`           | `string \| string[]`                 | —        | Extra class(es) on the overlay pane (scope custom styles)  |
| `closeOnEscape`        | `boolean`                            | `true`   | Close on `Escape`                                          |
| `closeOnBackdropClick` | `boolean`                            | `true`   | Close when the backdrop / dialog padding is clicked        |
| `restoreFocus`         | `boolean`                            | `true`   | Restore focus to the trigger when the modal closes         |
| `hideHeader`           | `boolean`                            | `false`  | Hide the modal title bar                                   |
| `mobileSheet`          | `boolean`                            | `true`   | On viewports < 480px, dock to the bottom as a sheet        |

The modal reuses the picker's `rtl` setting for direction and the `lang` config for the localized title, supports automatic dark mode, and is fully composable with custom templates (e.g. a modal with a custom footer).

> 📖 For the complete guide — animations, mobile bottom sheet, RTL, theming CSS variables, accessibility, and combining modal + custom templates — see **[MODAL_MODE.md](https://github.com/Abbasr7/qeydar-datepicker/blob/master/projects/qeydar-datepicker/MODAL_MODE.md)**.

## API Reference

### DatePicker Inputs

| Input               | Type                              | Default      | Description                                                |
| ------------------- | --------------------------------- | ------------ | ---------------------------------------------------------- |
| rtl                 | boolean                           | false        | Right-to-left mode                                         |
| mode                | 'day' \| 'month' \| 'year'        | 'day'        | Selection mode                                             |
| isRange             | boolean                           | false        | Enable range selection                                     |
| format              | string                            | 'yyyy/MM/dd' | Date format                                                |
| calendarType        | 'jalali' \| 'gregorian'           | 'gregorian'  | Calendar type                                              |
| minDate             | Date                              | null         | Minimum selectable date                                    |
| maxDate             | Date                              | null         | Maximum selectable date                                    |
| cssClass            | string                            | ''           | Custom CSS class                                           |
| footerDescription   | string                            | ''           | Footer description text                                    |
| rangeInputLabels    | RangeInputLabels                  | undefined    | Labels for range inputs                                    |
| inputLabel          | string                            | undefined    | Label for single input                                     |
| placement           | Placement                         | 'bottomLeft' | Dropdown placement                                         |
| disabled            | boolean                           | false        | Disable the datepicker                                     |
| isInline            | boolean                           | false        | Show calendar inline                                       |
| presentation        | 'popover' \| 'modal'              | 'popover'    | Open as a popover (anchored) or a centered modal dialog     |
| modalOptions        | PickerModalOptions                | {}           | Options for the modal dialog (see [Modal Presentation](#modal-presentation)) |
| showSidebar         | boolean                           | true         | Show sidebar with months/years                             |
| showToday           | boolean                           | false        | Highlight today's date                                     |
| valueFormat         | 'gregorian' \| 'jalali' \| 'date' | 'gregorian'  | Output value format                                        |
| disableInputMask    | boolean                           | false        | To disable input mask                                      |
| disabledDates       | Array<Date \| string>             | []           | Array of Date/string values to disable the entire day      |
| disabledDatesFilter | (date: Date) => boolean           | undefined    | Function to determine if a date should be disabled         |
| disabledTimesFilter | (date: Date) => boolean           | undefined    | Function to determine if a time of date should be disabled |
| allowEmpty          | boolean                           | true         | Allow empty value                                          |
| readOnly            | boolean                           | false        | Make the entire component read-only                        |
| readOnlyInput       | boolean                           | false        | Make only the input field read-only                        |

### DatePicker Outputs

| Output        | Type                  | Description                     |
| ------------- | --------------------- | ------------------------------- |
| onFocus       | EventEmitter<any>     | Fires when input receives focus |
| onBlur        | EventEmitter<any>     | Fires when input loses focus    |
| onChangeValue | EventEmitter<any>     | Fires when value changes        |
| onOpenChange  | EventEmitter<boolean> | Fires when picker opens/closes  |

### TimePicker Inputs

| Input               | Type                    | Default       | Description                                        |
| ------------------- | ----------------------- | ------------- | -------------------------------------------------- |
| placeholder         | string                  | 'Select time' | Input placeholder                                  |
| displayFormat       | string                  | 'hh:mm a'     | Time display format                                |
| minTime             | string                  | undefined     | Minimum selectable time                            |
| maxTime             | string                  | undefined     | Maximum selectable time                            |
| valueType           | 'string' \| 'date'      | 'string'      | Output value type                                  |
| cssClass            | string                  | ''            | Custom CSS class                                   |
| showIcon            | boolean                 | true          | Show clock icon                                    |
| rtl                 | boolean                 | false         | Right-to-left mode                                 |
| lang                | Lang_Locale             | lang_En       | Language settings                                  |
| inline              | boolean                 | false         | Show time picker inline (without popup)            |
| presentation        | 'popover' \| 'modal'    | 'popover'     | Open as a popover (anchored) or a centered modal dialog |
| modalOptions        | PickerModalOptions      | {}            | Options for the modal dialog (see [Modal Presentation](#modal-presentation)) |
| dateAdapter         | DateAdapter<Date>       | undefined     | Custom date adapter for time manipulation          |
| disableInputMask    | boolean                 | false         | To disable input mask                              |
| disabledTimesFilter | (date: Date) => boolean | undefined     | Function to determine if a time should be disabled |
| disabled            | boolean                 | false         | Disable the time picker                            |
| allowEmpty          | boolean                 | true          | Allow empty value                                  |

### TimePicker Outputs

| Output     | Type                  | Description                    |
| ---------- | --------------------- | ------------------------------ |
| timeChange | EventEmitter<any>     | Fires when time changes        |
| openChange | EventEmitter<boolean> | Fires when picker opens/closes |

## Form Integration Examples

### Reactive Forms with Both Components

```typescript
@Component({
  template: `
    <form [formGroup]="form">
      <!-- Date Range -->
      <qeydar-date-picker
        formControlName="dateRange"
        [isRange]="true"
        [calendarType]="'jalali'"
      ></qeydar-date-picker>

      <!-- Time -->
      <qeydar-time-picker
        formControlName="time"
        [timeFormat]="'24'"
      ></qeydar-time-picker>
    </form>
  `,
})
export class AppComponent {
  form = this.fb.group({
    dateRange: [
      {
        start: "1403/08/12",
        end: new Date(),
      },
    ],
    time: ["14:30"],
  });

  constructor(private fb: FormBuilder) {}
}
```

#### Inline Mode

```typescript
<qeydar-time-picker
  [(ngModel)]="time"
  [inline]="true"
  [timeFormat]="'24'"
  [displayFormat]="'HH:mm:ss'"
></qeydar-time-picker>
```

### Calendar Types and Localization

The TimePicker automatically adapts to your chosen calendar system:

```typescript
// Jalali (Persian) Time Picker
<qeydar-time-picker
  [(ngModel)]="time"
  [rtl]="true"
  [timeFormat]="'12'"
></qeydar-time-picker>

// Gregorian Time Picker
<qeydar-time-picker
  [(ngModel)]="time"
  [rtl]="false"
  [timeFormat]="'24'"
></qeydar-time-picker>
```

### Template-driven Forms

```typescript
<form #form="ngForm">
  <qeydar-date-picker
    [(ngModel)]="dateRange"
    name="dateRange"
    [isRange]="true"
    required
  ></qeydar-date-picker>

  <qeydar-time-picker
    [(ngModel)]="time"
    name="time"
    required
  ></qeydar-time-picker>
</form>
```

## Styling

Both components can be styled using CSS variables:

```css
.qeydar-time-picker {
  --primary-color: #40a9ff;
  --border-color: #d9d9d9;
  --text-color: #666;
  --background-color: white;
  --hover-background: #f5f5f5;
  --selected-background: #e6f4ff;
  --selected-text-color: #1890ff;
  --disabled-color: #d9d9d9;
}

/* Inline mode specific styles */
.time-picker-popup.inline {
  border: 1px solid var(--border-color);
  border-radius: 8px;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
