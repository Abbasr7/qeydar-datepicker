import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';
import { DemoCodeViewerComponent } from './code-viewer.component';
import { JalaliDateAdapter } from 'projects/qeydar-datepicker/src/date-adapter';
import { BodyTemplateContext } from 'projects/qeydar-datepicker/src/public-api';

interface RangeValue {
  start: Date;
  end: Date;
}

/**
 * "Range" demo — a two-month, side-by-side range picker built on the body slot,
 * with live hover preview and a rich orchid color scheme.
 */
@Component({
  selector: 'range-demo',
  imports: [FormsModule, QeydarDatePickerModule, DemoCodeViewerComponent],
  template: `
    <div class="range-demo">
      <div class="range-demo-head">
        <div>
          <span class="slot-demo-kicker">Body slot · two-month range</span>
          <h3>Two months, one range</h3>
          <p>
            Pick a span across two Jalali months side by side — drag a live
            preview with hover, then confirm.
          </p>
        </div>
        <span class="slot-demo-tag">03</span>
      </div>

      <div class="range-preview" dir="rtl">
        <qeydar-date-picker
          class="range-picker"
          cssClass="range-popup"
          [rtl]="true"
          [calendarType]="'jalali'"
          [format]="'yyyy/MM/dd'"
          [valueFormat]="'date'"
          [isRange]="true"
          [showSidebar]="false"
          [isInline]="true"
          [(ngModel)]="rangeValue"
        >
          <ng-template qeydarTemplate="header" let-ctx>
            <div class="r-head">
              <button
                type="button"
                class="r-nav"
                aria-label="ماه قبل"
                (click)="shiftMonth(-1)"
              >‹</button>
              <div class="r-head-titles">
                <span class="r-head-title">{{ monthTitle(viewMonth) }}</span>
                <span class="r-head-title r-head-title--muted">{{ monthTitle(nextMonth) }}</span>
              </div>
              <button
                type="button"
                class="r-nav"
                aria-label="ماه بعد"
                (click)="shiftMonth(1)"
              >›</button>
            </div>
          </ng-template>

          <ng-template qeydarTemplate="body" let-ctx>
            <div class="r-body">
              <div
                class="r-month"
                (mouseleave)="hover = null"
              >
                <div class="r-weekdays">
                  @for (w of weekDays; track $index) { <span>{{ w }}</span> }
                </div>
                <div class="r-grid">
                  @for (d of leftGrid; track $index) {
                    <button
                      type="button"
                      [class]="cellClass(d, viewMonth)"
                      [disabled]="ctx.validation.isDateDisabled(d)"
                      (mouseenter)="hover = d"
                      (click)="onDayClick(ctx, d)"
                    >
                      {{ faDigits(this.jalali.getDate(d)) }}
                    </button>
                  }
                </div>
              </div>

              <div
                class="r-month"
                (mouseleave)="hover = null"
              >
                <div class="r-weekdays">
                  @for (w of weekDays; track $index) { <span>{{ w }}</span> }
                </div>
                <div class="r-grid">
                  @for (d of rightGrid; track $index) {
                    <button
                      type="button"
                      [class]="cellClass(d, nextMonth)"
                      [disabled]="ctx.validation.isDateDisabled(d)"
                      (mouseenter)="hover = d"
                      (click)="onDayClick(ctx, d)"
                    >
                      {{ faDigits(this.jalali.getDate(d)) }}
                    </button>
                  }
                </div>
              </div>
            </div>
          </ng-template>

          <ng-template qeydarTemplate="footer" let-ctx>
            <div class="r-footer">
              <div class="r-summary">
                @if (localStart && localEnd) {
                  <span class="r-summary-line">
                    از {{ formatShort(localStart) }} تا {{ formatShort(localEnd) }}
                  </span>
                  <strong class="r-nights">{{ nightsBetween() }} شب</strong>
                } @else if (localStart) {
                  <span class="r-summary-line">
                    شروع: {{ formatShort(localStart) }} — پایان را انتخاب کنید
                  </span>
                } @else {
                  <span class="r-summary-line">شروع محدوده را انتخاب کنید</span>
                }
              </div>
              <div class="r-actions">
                <button type="button" class="r-btn" (click)="clear()">پاک کردن</button>
                <button type="button" class="r-btn r-btn--primary" (click)="ctx.confirm()">تأیید</button>
              </div>
            </div>
          </ng-template>
        </qeydar-date-picker>

        <output class="r-readout" aria-live="polite">
          <span>مقدار خروجی</span>
          <strong>{{ rangeReadout() }}</strong>
        </output>
      </div>

      <demo-code-viewer
        [htmlCode]="htmlCode"
        [tsCode]="tsCode"
        [scssCode]="scssCode"
        htmlFile="range-demo.component.html"
        tsFile="range-demo.component.ts"
        scssFile="range-demo.component.scss"
      ></demo-code-viewer>
    </div>
  `,
  styles: [
    `
      .range-demo-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
      }

      .range-demo-head h3 {
        margin: 7px 0 5px;
        font-size: 18px;
        letter-spacing: -0.03em;
        color: #172238;
      }

      .range-demo-head p {
        max-width: 620px;
        margin: 0;
        color: #6b7588;
        font-size: 12px;
        line-height: 1.65;
      }

      .range-preview {
        display: grid;
        justify-items: center;
        gap: 14px;
        margin-top: 18px;
        padding: 24px 16px;
        border-radius: 14px;
        background: radial-gradient(120% 140% at 50% 0%, #f7f4ff 0%, #faf8ff 70%);
      }

      .range-picker {
        width: 100%;
        max-width: 600px;
      }

      /* ---------- Header ---------- */
      .r-head {
        display: grid;
        grid-template-columns: 32px 1fr 32px;
        align-items: center;
        gap: 8px;
        padding: 12px 14px;
        border-bottom: 1px solid #efe9fb;
      }

      .r-nav {
        display: grid;
        width: 30px;
        height: 30px;
        place-items: center;
        border: 1px solid #e7e0f6;
        border-radius: 9px;
        background: #fff;
        color: #6d5bd0;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        transition: background 140ms ease;
      }

      .r-nav:hover {
        background: #f4f0ff;
      }

      .r-head-titles {
        display: grid;
        grid-template-columns: 1fr 1fr;
        text-align: center;
      }

      .r-head-title {
        color: #3f2d8f;
        font-size: 13px;
        font-weight: 800;
      }

      .r-head-title--muted {
        color: #a99bd6;
      }

      /* ---------- Two months ---------- */
      .r-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
        padding: 10px 12px 12px;
      }

      .r-month {
        padding: 4px 6px;
      }

      .r-month + .r-month {
        border-right: 1px solid #efe9fb;
      }

      .r-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        margin-bottom: 4px;
        color: #a99bd6;
        font-size: 9px;
        font-weight: 800;
        text-align: center;
      }

      .r-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 3px;
      }

      .r-cell {
        position: relative;
        display: grid;
        aspect-ratio: 1;
        place-items: center;
        border: 0;
        border-radius: 10px;
        background: transparent;
        color: #3c3a5c;
        font-size: 11px;
        cursor: pointer;
        transition: background 140ms ease, color 140ms ease, box-shadow 140ms ease;
      }

      .r-cell:hover:not(:disabled) {
        background: #f1ebff;
      }

      .r-cell.is-out {
        color: #cfc7ea;
      }

      .r-cell.in-range {
        border-radius: 0;
        background: #f4ecff;
        color: #7c3aed;
      }

      .r-cell.is-start,
      .r-cell.is-end {
        border-radius: 10px;
        background: linear-gradient(135deg, #8b5cf6, #d946ef);
        color: #fff;
        box-shadow: 0 4px 10px rgba(139, 92, 246, 0.32);
      }

      .r-cell.is-today:not(.is-start):not(.is-end) {
        box-shadow: inset 0 0 0 2px #14b8a6;
      }

      .r-cell:disabled {
        color: #ddd7ef;
        cursor: default;
      }

      /* ---------- Footer ---------- */
      .r-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px;
        border-top: 1px solid #efe9fb;
      }

      .r-summary {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        min-width: 0;
        gap: 8px;
      }

      .r-summary-line {
        color: #7d7496;
        font-size: 11px;
        font-weight: 700;
      }

      .r-nights {
        padding: 3px 9px;
        border-radius: 999px;
        background: #f4ecff;
        color: #7c3aed;
        font-size: 10px;
        font-weight: 800;
      }

      .r-actions {
        display: flex;
        flex: 0 0 auto;
        gap: 8px;
      }

      .r-btn {
        padding: 8px 14px;
        border: 1px solid #e7e0f6;
        border-radius: 9px;
        background: #fff;
        color: #6d5bd0;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }

      .r-btn--primary {
        border-color: transparent;
        background: linear-gradient(135deg, #8b5cf6, #d946ef);
        color: #fff;
        box-shadow: 0 5px 12px rgba(139, 92, 246, 0.28);
      }

      .r-readout {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        max-width: 600px;
        padding: 12px 14px;
        border-radius: 10px;
        background: #fff;
        color: #8b95a7;
        font-size: 10px;
        box-shadow: 0 8px 20px rgba(62, 45, 143, 0.07);
      }

      .r-readout strong {
        color: #3f2d8f;
        font-size: 11px;
      }
    `,
  ],
})
export class RangeDemoComponent {
  readonly jalali = inject(JalaliDateAdapter);

  weekDays: string[] = this.jalali.getDayOfWeekNames('short');

  rangeValue: RangeValue | null;
  viewMonth: Date;
  localStart: Date | null;
  localEnd: Date | null;
  hover: Date | null = null;

  constructor() {
    const start = this.jalali.createDate(1405, 0, 5); // 5 فروردین ۱۴۰۵
    const end = this.jalali.createDate(1405, 1, 12); // 12 اردیبهشت ۱۴۰۵
    this.rangeValue = { start, end };
    this.localStart = start;
    this.localEnd = end;
    this.viewMonth = this.jalali.startOfMonth(start);
  }

  get nextMonth(): Date {
    return this.jalali.addMonths(this.viewMonth, 1);
  }

  get leftGrid(): Date[] {
    return this.buildGrid(this.viewMonth);
  }

  get rightGrid(): Date[] {
    return this.buildGrid(this.nextMonth);
  }

  private buildGrid(base: Date): Date[] {
    const start = this.jalali.startOfWeek(this.jalali.startOfMonth(base));
    return Array.from({ length: 42 }, (_, i) => this.jalali.addDays(start, i));
  }

  shiftMonth(delta: number): void {
    this.viewMonth = this.jalali.addMonths(this.viewMonth, delta);
  }

  onDayClick(ctx: BodyTemplateContext, d: Date): void {
    if (ctx.validation.isDateDisabled(d)) {
      return;
    }
    if (
      !this.localStart ||
      (this.localStart && this.localEnd) ||
      this.jalali.isBefore(d, this.localStart)
    ) {
      this.localStart = d;
      this.localEnd = null;
    } else {
      this.localEnd = d;
    }
    this.hover = null;
    ctx.actions.selectDay(d);
  }

  clear(): void {
    this.rangeValue = null;
    this.localStart = null;
    this.localEnd = null;
    this.hover = null;
  }

  isStart(d: Date): boolean {
    return !!this.localStart && this.jalali.isSameDay(d, this.localStart);
  }

  isEnd(d: Date): boolean {
    return !!this.localEnd && this.jalali.isSameDay(d, this.localEnd);
  }

  inRange(d: Date): boolean {
    if (!this.localStart) {
      return false;
    }
    const end = this.localEnd || this.hover;
    if (!end) {
      return false;
    }
    return this.jalali.isAfter(d, this.localStart) && this.jalali.isBefore(d, end);
  }

  isToday(d: Date): boolean {
    return this.jalali.isSameDay(d, this.jalali.today());
  }

  cellClass(d: Date, base: Date): string {
    const cls = ['r-cell'];
    if (!this.jalali.isSameMonth(d, base)) {
      cls.push('is-out');
      return cls.join(' ');
    }
    if (this.isStart(d)) {
      cls.push('is-start');
    }
    if (this.isEnd(d)) {
      cls.push('is-end');
    }
    if (this.inRange(d)) {
      cls.push('in-range');
    }
    if (this.isToday(d)) {
      cls.push('is-today');
    }
    return cls.join(' ');
  }

  monthTitle(d: Date): string {
    return `${this.jalali.format(d, 'MMMM')} ${this.faDigits(this.jalali.format(d, 'yyyy'))}`;
  }

  formatShort(d: Date): string {
    return this.faDigits(this.jalali.format(d, 'd MMMM'));
  }

  formatFull(d: Date): string {
    return this.faDigits(this.jalali.format(d, 'EEEE d MMMM yyyy'));
  }

  nightsBetween(): number {
    if (!this.localStart || !this.localEnd) {
      return 0;
    }
    return Math.round((this.localEnd.getTime() - this.localStart.getTime()) / 86400000);
  }

  rangeReadout(): string {
    if (!this.rangeValue) {
      return '—';
    }
    return `${this.formatFull(this.rangeValue.start)} ←→ ${this.formatFull(this.rangeValue.end)}`;
  }

  faDigits(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
  }

  htmlCode = `<!-- body: two Jalali months side by side with live range preview -->
<qeydar-date-picker
  class="range-picker"
  cssClass="range-popup"
  [rtl]="true"
  [calendarType]="'jalali'"
  [format]="'yyyy/MM/dd'"
  [valueFormat]="'date'"
  [isRange]="true"
  [showSidebar]="false"
  [isInline]="true"
  [(ngModel)]="rangeValue"
>
  <ng-template qeydarTemplate="header" let-ctx>
    <div class="r-head">
      <button type="button" class="r-nav" (click)="shiftMonth(-1)">‹</button>
      <div class="r-head-titles">
        <span class="r-head-title">{{ monthTitle(viewMonth) }}</span>
        <span class="r-head-title r-head-title--muted">{{ monthTitle(nextMonth) }}</span>
      </div>
      <button type="button" class="r-nav" (click)="shiftMonth(1)">›</button>
    </div>
  </ng-template>

  <ng-template qeydarTemplate="body" let-ctx>
    <div class="r-body">
      <div class="r-month" (mouseleave)="hover = null">
        <div class="r-weekdays">
          @for (w of weekDays; track $index) { <span>{{ w }}</span> }
        </div>
        <div class="r-grid">
          @for (d of leftGrid; track $index) {
            <button type="button" [class]="cellClass(d, viewMonth)"
              [disabled]="ctx.validation.isDateDisabled(d)"
              (mouseenter)="hover = d" (click)="onDayClick(ctx, d)">
              {{ faDigits(this.jalali.getDate(d)) }}
            </button>
          }
        </div>
      </div>

      <div class="r-month" (mouseleave)="hover = null">
        <div class="r-weekdays">
          @for (w of weekDays; track $index) { <span>{{ w }}</span> }
        </div>
        <div class="r-grid">
          @for (d of rightGrid; track $index) {
            <button type="button" [class]="cellClass(d, nextMonth)"
              [disabled]="ctx.validation.isDateDisabled(d)"
              (mouseenter)="hover = d" (click)="onDayClick(ctx, d)">
              {{ faDigits(this.jalali.getDate(d)) }}
            </button>
          }
        </div>
      </div>
    </div>
  </ng-template>

  <ng-template qeydarTemplate="footer" let-ctx>
    <div class="r-footer">
      <div class="r-summary">
        @if (localStart && localEnd) {
          <span class="r-summary-line">از {{ formatShort(localStart) }} تا {{ formatShort(localEnd) }}</span>
          <strong class="r-nights">{{ nightsBetween() }} شب</strong>
        } @else if (localStart) {
          <span class="r-summary-line">شروع: {{ formatShort(localStart) }} — پایان را انتخاب کنید</span>
        } @else {
          <span class="r-summary-line">شروع محدوده را انتخاب کنید</span>
        }
      </div>
      <div class="r-actions">
        <button type="button" class="r-btn" (click)="clear()">پاک کردن</button>
        <button type="button" class="r-btn r-btn--primary" (click)="ctx.confirm()">تأیید</button>
      </div>
    </div>
  </ng-template>
</qeydar-date-picker>`;

  tsCode = `import { Component, inject } from '@angular/core';
import { JalaliDateAdapter, BodyTemplateContext } from '@qeydar/datepicker';

interface RangeValue { start: Date; end: Date; }

@Component({
  selector: 'app-range-demo',
  templateUrl: './range-demo.component.html',
})
export class RangeDemoComponent {
  readonly jalali = inject(JalaliDateAdapter);
  weekDays: string[] = this.jalali.getDayOfWeekNames('short');

  rangeValue: RangeValue | null;
  viewMonth: Date;
  localStart: Date | null;
  localEnd: Date | null;
  hover: Date | null = null;

  constructor() {
    const start = this.jalali.createDate(1405, 0, 5);  // 5 فروردین
    const end = this.jalali.createDate(1405, 1, 12);   // 12 اردیبهشت
    this.rangeValue = { start, end };
    this.localStart = start;
    this.localEnd = end;
    this.viewMonth = this.jalali.startOfMonth(start);
  }

  get nextMonth(): Date { return this.jalali.addMonths(this.viewMonth, 1); }
  get leftGrid(): Date[] { return this.buildGrid(this.viewMonth); }
  get rightGrid(): Date[] { return this.buildGrid(this.nextMonth); }

  private buildGrid(base: Date): Date[] {
    const start = this.jalali.startOfWeek(this.jalali.startOfMonth(base));
    return Array.from({ length: 42 }, (_, i) => this.jalali.addDays(start, i));
  }

  shiftMonth(delta: number): void {
    this.viewMonth = this.jalali.addMonths(this.viewMonth, delta);
  }

  onDayClick(ctx: BodyTemplateContext, d: Date): void {
    if (ctx.validation.isDateDisabled(d)) return;
    if (!this.localStart || (this.localStart && this.localEnd) || this.jalali.isBefore(d, this.localStart)) {
      this.localStart = d;
      this.localEnd = null;
    } else {
      this.localEnd = d;
    }
    this.hover = null;
    ctx.actions.selectDay(d);
  }

  clear(): void {
    this.rangeValue = null;
    this.localStart = null;
    this.localEnd = null;
    this.hover = null;
  }

  cellClass(d: Date, base: Date): string {
    const cls = ['r-cell'];
    if (!this.jalali.isSameMonth(d, base)) {
      cls.push('is-out');
      return cls.join(' ');
    }
    if (this.localStart && this.jalali.isSameDay(d, this.localStart)) cls.push('is-start');
    if (this.localEnd && this.jalali.isSameDay(d, this.localEnd)) cls.push('is-end');
    const end = this.localEnd || this.hover;
    if (this.localStart && end && this.jalali.isAfter(d, this.localStart) && this.jalali.isBefore(d, end)) {
      cls.push('in-range');
    }
    if (this.jalali.isSameDay(d, this.jalali.today())) cls.push('is-today');
    return cls.join(' ');
  }

  monthTitle(d: Date): string {
    return \`\${this.jalali.format(d, 'MMMM')} \${this.faDigits(this.jalali.format(d, 'yyyy'))}\`;
  }

  formatShort(d: Date): string { return this.faDigits(this.jalali.format(d, 'd MMMM')); }
  formatFull(d: Date): string { return this.faDigits(this.jalali.format(d, 'EEEE d MMMM yyyy')); }

  nightsBetween(): number {
    if (!this.localStart || !this.localEnd) return 0;
    return Math.round((this.localEnd.getTime() - this.localStart.getTime()) / 86400000);
  }

  faDigits(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return String(value).replace(/\\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
  }
}`;

  scssCode = `// Popup chrome (global): .range-popup { max-width: 600px; border-radius: 16px; }
// .range-popup .date-picker-content { display: block; max-height: none; }
// .range-popup .calendar { width: auto; max-width: none; padding: 0; }

.r-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 10px 12px 12px;
}

.r-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.r-cell {
  aspect-ratio: 1;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #3c3a5c;
  font-size: 11px;
  cursor: pointer;
}

.r-cell.in-range {
  border-radius: 0;
  background: #f4ecff;
  color: #7c3aed;
}

.r-cell.is-start,
.r-cell.is-end {
  border-radius: 10px;
  background: linear-gradient(135deg, #8b5cf6, #d946ef);
  color: #fff;
  box-shadow: 0 4px 10px rgba(139, 92, 246, 0.32);
}

.r-cell.is-today:not(.is-start):not(.is-end) {
  box-shadow: inset 0 0 0 2px #14b8a6;
}`;
}
