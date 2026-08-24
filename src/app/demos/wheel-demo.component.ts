import { AfterViewChecked, Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DateAdapter,
  GregorianDateAdapter,
  JalaliDateAdapter,
} from 'projects/qeydar-datepicker/src/date-adapter';
import {
  BodyTemplateContext,
  FooterTemplateContext,
  PickerModalOptions,
  PickerPresentation,
} from 'projects/qeydar-datepicker/src/public-api';
import { DemoCodeViewerComponent } from './code-viewer.component';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';

@Component({
  selector: 'wheel-demo',
  imports: [FormsModule, DemoCodeViewerComponent, QeydarDatePickerModule],
  template: `
    <div class="slot-demo wheel-demo">
      <div class="slot-demo-head">
        <div>
          <span class="slot-demo-kicker">Body slot · wheel picker</span>
          <h3>Spin to the date you need</h3>
          <p>
            A complete wheel picker built on the body slot — day, month, and
            year columns stay in sync and reopen centered on your selection.
          </p>
        </div>
        <div class="wheel-cal-toggle" role="group" aria-label="Calendar type">
          <button
            type="button"
            [class.active]="calendarType === 'jalali'"
            (click)="setCalendar('jalali')"
          >
            Jalali
          </button>
          <button
            type="button"
            [class.active]="calendarType === 'gregorian'"
            (click)="setCalendar('gregorian')"
          >
            Gregorian
          </button>
        </div>
      </div>

      <div class="wheel-preview" [dir]="rtl ? 'rtl' : 'ltr'">
        <qeydar-date-picker
          class="slot-demo-picker"
          cssClass="slot-demo-popup wheel-popup"
          [rtl]="rtl"
          [calendarType]="calendarType"
          [dateAdapter]="adapter"
          [format]="'yyyy/MM/dd'"
          [valueFormat]="'date'"
          [showSidebar]="false"
          [presentation]="presentation"
          [modalOptions]="modalOptions"
          [(ngModel)]="selectedDate"
        >
          <ng-template qeydarTemplate="header" let-context>
            <!-- {{ sync(context) }} -->
            <div class="wheel-header">
              <span class="wheel-kicker">{{
                calendarType === 'jalali' ? 'انتخاب تاریخ' : 'SELECT A DATE'
              }}</span>
              <strong class="wheel-date">{{ formatComposed() }}</strong>
            </div>
          </ng-template>

          <ng-template qeydarTemplate="body" let-context>
            {{ sync(context) }}
            <div
              class="wheel {{ rootClass }}"
              role="group"
              aria-label="Wheel date picker"
            >
              <div
                class="wheel-col wheel-col--day"
                (scroll)="onColumnScroll($event, 'day')"
              >
                <span class="wheel-spacer" aria-hidden="true"></span>
                @for (d of dayList; track d) {
                  <button
                    type="button"
                    class="wheel-item"
                    [class.wheel-item--active]="d === pickedDay"
                    [class.wheel-item--today]="isToday('day', d)"
                    [class.wheel-item--disabled]="isDayDisabled(d)"
                    [disabled]="isDayDisabled(d)"
                    [attr.data-value]="d"
                    [attr.aria-label]="'Day ' + d"
                    (click)="onDayClick(d)"
                  >
                    {{ d }}
                  </button>
                }
                <span class="wheel-spacer" aria-hidden="true"></span>
              </div>
              <div
                class="wheel-col wheel-col--month"
                (scroll)="onColumnScroll($event, 'month')"
              >
                <span class="wheel-spacer" aria-hidden="true"></span>
                @for (m of monthList; track m; let i = $index) {
                  <button
                    type="button"
                    class="wheel-item"
                    [class.wheel-item--active]="i + 1 === activeMonth"
                    [class.wheel-item--today]="isToday('month', i + 1)"
                    [class.wheel-item--disabled]="isMonthDisabled(i + 1)"
                    [disabled]="isMonthDisabled(i + 1)"
                    [attr.data-value]="i + 1"
                    [attr.aria-label]="m"
                    (click)="onMonthClick(i + 1)"
                  >
                    {{ m }}
                  </button>
                }
                <span class="wheel-spacer" aria-hidden="true"></span>
              </div>
              <div
                class="wheel-col wheel-col--year"
                (scroll)="onColumnScroll($event, 'year')"
              >
                <span class="wheel-spacer" aria-hidden="true"></span>
                @for (y of yearList; track y) {
                  <button
                    type="button"
                    class="wheel-item"
                    [class.wheel-item--active]="y === activeYear"
                    [class.wheel-item--today]="isToday('year', y)"
                    [class.wheel-item--disabled]="isYearDisabled(y)"
                    [disabled]="isYearDisabled(y)"
                    [attr.data-value]="y"
                    [attr.aria-label]="y"
                    (click)="onYearClick(y)"
                  >
                    {{ y }}
                  </button>
                }
                <span class="wheel-spacer" aria-hidden="true"></span>
              </div>
              <div class="wheel-focus" aria-hidden="true"></div>
            </div>
          </ng-template>

          <ng-template qeydarTemplate="footer" let-context>
            <div class="wheel-footer">
              <span class="wheel-footer-hint">{{
                calendarType === 'jalali'
                  ? 'تاریخ را تایید کنید'
                  : 'Confirm the date'
              }}</span>
              <div class="wheel-footer-actions">
                <button
                  type="button"
                  class="wheel-btn"
                  (click)="context.cancel()"
                >
                  {{ calendarType === 'jalali' ? 'انصراف' : 'Cancel' }}
                </button>
                <button
                  type="button"
                  class="wheel-btn wheel-btn--primary"
                  (click)="onConfirm(context)"
                >
                  {{ calendarType === 'jalali' ? 'تایید' : 'Done' }}
                </button>
              </div>
            </div>
          </ng-template>
        </qeydar-date-picker>

        <output class="wheel-output" aria-live="polite">
          <span>{{
            calendarType === 'jalali' ? 'مقدار انتخاب‌شده' : 'Selected value'
          }}</span>
          <strong>{{ formatOutput() }}</strong>
        </output>
      </div>

      <demo-code-viewer
        [htmlCode]="htmlCode"
        [tsCode]="tsCode"
        [scssCode]="scssCode"
        htmlFile="wheel-demo.component.html"
        tsFile="wheel-demo.component.ts"
        scssFile="wheel-demo.component.scss"
      ></demo-code-viewer>
    </div>
  `,
  styles: [
    `
      .wheel-preview {
        display: grid;
        justify-items: center;
        gap: 14px;
        margin-top: 18px;
        padding: 22px;
        border-radius: 14px;
        background: linear-gradient(160deg, #eef2fb, #f8fafd);
      }

      .wheel-preview qeydar-date-picker {
        max-width: 340px;
      }

      .wheel-cal-toggle {
        display: inline-flex;
        flex: 0 0 auto;
        gap: 2px;
        padding: 3px;
        border-radius: 9px;
        background: #eef1f7;
      }

      .wheel-cal-toggle button {
        padding: 6px 12px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #6b7588;
        font-size: 10px;
        font-weight: 800;
        cursor: pointer;
        transition:
          background 140ms ease,
          color 140ms ease;
      }

      .wheel-cal-toggle button.active {
        background: #fff;
        color: #344dc7;
        box-shadow: 0 1px 4px rgba(28, 43, 78, 0.14);
      }

      .wheel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px;
        border-bottom: 1px solid #edf0f5;
      }

      .wheel-kicker {
        color: #71809a;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .wheel-date {
        color: #25334c;
        font-size: 13px;
        font-weight: 800;
      }

      .wheel {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, 84px);
        justify-content: center;
        gap: 8px;
        padding: 0 8px 6px;
      }

      .wheel-col {
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 216px;
        overflow-y: auto;
        padding: 0 4px;
        scrollbar-width: none;
        scroll-snap-type: y mandatory;
        -webkit-overflow-scrolling: touch;
        mask-image: linear-gradient(
          to bottom,
          transparent,
          #000 22%,
          #000 78%,
          transparent
        );
        -webkit-mask-image: linear-gradient(
          to bottom,
          transparent,
          #000 22%,
          #000 78%,
          transparent
        );
      }

      .wheel-col::-webkit-scrollbar {
        display: none;
      }

      .wheel-spacer {
        flex: 0 0 90px;
      }

      .wheel-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 36px;
        flex: 0 0 36px;
        margin: 0;
        border: 0;
        border-radius: 9px;
        background: transparent;
        color: #6b7588;
        font-size: 13px;
        cursor: pointer;
        scroll-snap-align: center;
        transition:
          color 0.16s ease,
          background 0.16s ease,
          transform 0.16s ease;
        -webkit-tap-highlight-color: transparent;
      }

      .wheel-item:hover:not(:disabled) {
        background: #f0f3ff;
        color: #344dc7;
      }

      .wheel-item:focus-visible {
        outline: 2px solid rgba(68, 104, 239, 0.4);
        outline-offset: -2px;
      }

      .wheel-item--active {
        background: linear-gradient(135deg, #5779f7, #3f61db);
        color: #fff;
        font-weight: 800;
        box-shadow: 0 6px 14px rgba(68, 104, 239, 0.35);
        transform: scale(1.05);
      }

      .wheel-item--active:hover {
        background: linear-gradient(135deg, #5779f7, #3f61db);
        color: #fff;
      }

      .wheel-item--today:not(.wheel-item--active) {
        color: #4468ef;
        font-weight: 700;
      }

      .wheel-item--today:not(.wheel-item--active)::after {
        position: absolute;
        bottom: 2px;
        left: 50%;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #ef6e9b;
        content: '';
        transform: translateX(-50%);
      }

      .wheel-item:disabled {
        color: #d4d9e2;
        cursor: not-allowed;
      }

      .wheel-focus {
        position: absolute;
        z-index: 0;
        top: 90px;
        right: 8px;
        left: 8px;
        height: 36px;
        border-top: 1px solid #dce3f6;
        border-bottom: 1px solid #dce3f6;
        border-radius: 10px;
        background: rgba(93, 117, 240, 0.06);
        pointer-events: none;
      }

      .wheel-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px 14px;
        border-top: 1px solid #edf0f5;
      }

      .wheel-footer-hint {
        color: #8b95a7;
        font-size: 10px;
      }

      .wheel-footer-actions {
        display: flex;
        gap: 8px;
      }

      .wheel-btn {
        padding: 8px 14px;
        border: 1px solid #e2e5eb;
        border-radius: 8px;
        background: #fff;
        color: #6b7484;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }

      .wheel-btn--primary {
        border-color: transparent;
        background: linear-gradient(135deg, #5779f7, #3f61db);
        color: #fff;
        box-shadow: 0 5px 10px rgba(68, 104, 239, 0.22);
      }

      .wheel-output {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: min(100%, 340px);
        gap: 12px;
        padding: 11px 13px;
        border-radius: 9px;
        background: #fff;
        color: #6b7588;
        font-size: 11px;
      }

      .wheel-output strong {
        color: #172238;
        direction: ltr;
        font-size: 11px;
      }

      @media (max-width: 420px) {
        .wheel {
          grid-template-columns: repeat(3, 74px);
          gap: 4px;
          padding: 0 4px 6px;
        }
      }
    `,
  ],
})
export class WheelDemoComponent implements AfterViewChecked, OnDestroy {
  private static uid = 0;

  calendarType: 'jalali' | 'gregorian' = 'jalali';
  jalali = new JalaliDateAdapter();
  gregorian = new GregorianDateAdapter();
  selectedDate: Date | string = new Date();

  dayList: number[] = [];
  monthList: string[] = [];
  yearList: number[] = [];
  pickedDay = 1;
  activeMonth = 1;
  activeYear = 1400;
  todayDay: number | null = null;
  todayMonth: number | null = null;
  todayYear: number | null = null;
  presentation: PickerPresentation = 'modal';
  modalOptions: PickerModalOptions = {
    mobileSheet: true,
  };

  rootClass = `wheel-demo-root-${++WheelDemoComponent.uid}`;

  private ctx: BodyTemplateContext | null = null;
  private syncKey = '';
  private recenterNeeded = false;
  private wasOpen = false;
  private firstRun = true;
  private lastYear = NaN;
  private lastMonth = NaN;
  private lastDay = NaN;
  private scrollTimer: any = null;
  private suppressScrollUntil = 0;

  get rtl(): boolean {
    return this.calendarType === 'jalali';
  }

  get adapter(): DateAdapter<Date> {
    return this.calendarType === 'jalali' ? this.jalali : this.gregorian;
  }

  ngAfterViewChecked(): void {
    const open = !!document.querySelector(`.${this.rootClass} .wheel-col`);
    if (open) {
      if (!this.wasOpen) {
        this.wasOpen = true;
        this.recenterNeeded = false;
        setTimeout(() => this.centerColumns(), 0);
      } else if (this.recenterNeeded) {
        this.recenterNeeded = false;
        this.centerColumns();
      }
    } else {
      this.wasOpen = false;
    }
  }

  ngOnDestroy(): void {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
  }

  sync(context: any): string {
    this.ctx = context;
    const key = context.currentDate
      ? String(context.currentDate.getTime())
      : 'none';
    if (key !== this.syncKey) {
      this.syncKey = key;
      this.refresh(context.currentDate);
      this.recenterNeeded = true;
    }
    return '';
  }

  trackValue(_index: number, value: any): any {
    return value;
  }

  setCalendar(type: 'jalali' | 'gregorian'): void {
    if (this.calendarType === type) {
      return;
    }
    this.calendarType = type;
    this.syncKey = '';
    this.recenterNeeded = true;
  }

  onDayClick(day: number): void {
    if (this.isDayDisabled(day) || !this.ctx) {
      return;
    }
    this.pickedDay = day;
    this.recenterNeeded = true;
    const date = this.adapter.createDate(
      this.activeYear,
      this.activeMonth - 1,
      day,
    );
    this.ctx.actions.selectDay(date, false);
  }

  onMonthClick(month: number): void {
    if (this.isMonthDisabled(month) || !this.ctx) {
      return;
    }

    this.ctx.actions.selectMonth(month);
  }

  onYearClick(year: number): void {
    if (this.isYearDisabled(year) || !this.ctx) {
      return;
    }
    this.ctx.actions.selectYear(year);
  }

  // Scrolling a column settles on the centered value — the classic wheel
  // interaction. Day stays local; month/year go through the picker actions
  // so the sibling columns (day count, year range) stay in sync.
  onColumnScroll(event: Event, part: 'day' | 'month' | 'year'): void {
    if (Date.now() < this.suppressScrollUntil) {
      return;
    }
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
    }
    this.scrollTimer = setTimeout(() => {
      const col = event.target as HTMLElement;
      if (!col.isConnected) {
        return;
      }
      const index = Math.round(col.scrollTop / 36);
      if (part === 'day') {
        const day =
          this.dayList[Math.max(0, Math.min(index, this.dayList.length - 1))];
        if (day !== undefined && !this.isDayDisabled(day)) {
          this.pickedDay = day;
          this.recenterNeeded = true;
        }
      } else if (part === 'month') {
        const month = Math.max(1, Math.min(index + 1, 12));
        if (!this.isMonthDisabled(month)) {
          this.onMonthClick(month);
        }
      } else {
        const year =
          this.yearList[Math.max(0, Math.min(index, this.yearList.length - 1))];
        if (year !== undefined && !this.isYearDisabled(year)) {
          this.onYearClick(year);
        }
      }
    }, 150);
  }

  onConfirm(ctx: FooterTemplateContext): void {
    if (!ctx) {
      return;
    }
    ctx.confirm();
  }

  isDayDisabled(day: number): boolean {
    if (!this.ctx) {
      return false;
    }
    const date = this.adapter.createDate(
      this.activeYear,
      this.activeMonth - 1,
      day,
    );
    return this.ctx.validation?.isDateDisabled(date);
  }

  isMonthDisabled(month: number): boolean {
    return this.ctx ? this.ctx.validation?.isMonthDisabled(month) : false;
  }

  isYearDisabled(year: number): boolean {
    return this.ctx ? this.ctx.validation?.isYearDisabled(year) : false;
  }

  isToday(part: 'day' | 'month' | 'year', value: number): boolean {
    if (
      this.todayYear === null ||
      this.todayMonth === null ||
      this.todayDay === null
    ) {
      return false;
    }
    if (part === 'day') {
      return (
        value === this.todayDay &&
        this.activeMonth === this.todayMonth &&
        this.activeYear === this.todayYear
      );
    }
    if (part === 'month') {
      return value === this.todayMonth && this.activeYear === this.todayYear;
    }
    return value === this.todayYear;
  }

  formatComposed(): string {
    const date = this.adapter.createDate(
      this.activeYear,
      this.activeMonth - 1,
      this.pickedDay,
    );
    const weekday = this.adapter.format(date, 'EEEE');
    const month = this.adapter.getMonthNames('long')[this.activeMonth - 1];
    if (this.calendarType === 'jalali') {
      return `${weekday}، ${this.pickedDay} ${month} ${this.activeYear}`;
    }
    return `${weekday}, ${month} ${this.pickedDay}, ${this.activeYear}`;
  }

  formatOutput(): string {
    const date = this.selectedDate instanceof Date ? this.selectedDate : null;
    if (!date) {
      return '—';
    }
    return this.adapter.format(
      date,
      this.calendarType === 'jalali' ? 'yyyy/MM/dd' : 'MM/dd/yyyy',
    );
  }

  private refresh(date: Date): void {
    const year = this.adapter.getYear(date) ?? new Date().getFullYear();
    const month = (this.adapter.getMonth(date) ?? 0) + 1;
    const dim = this.adapter.getDaysInMonth(date) ?? 31;
    const day = this.adapter.getDate(date) ?? 1;

    const monthChanged = month !== this.lastMonth;
    const yearChanged = year !== this.lastYear;
    const dayChanged = day !== this.lastDay;

    this.lastYear = year;
    this.lastMonth = month;
    this.lastDay = day;

    this.activeYear = year;
    this.activeMonth = month;
    this.dayList = Array.from({ length: dim }, (_, i) => i + 1);

    if (this.firstRun) {
      this.firstRun = false;
      this.pickedDay = Math.min(day, dim);
    } else if (monthChanged || yearChanged) {
      this.pickedDay = Math.min(Math.max(this.pickedDay, 1), dim);
    } else if (dayChanged) {
      this.pickedDay = Math.min(day, dim);
    }

    const monthNames = this.adapter.getMonthNames('long');
    if (
      this.monthList.length !== monthNames.length ||
      this.monthList[0] !== monthNames[0]
    ) {
      this.monthList = monthNames.slice();
    }

    const first = this.yearList[0];
    const last = this.yearList[this.yearList.length - 1];
    if (!this.yearList.length || year < first || year > last) {
      const start = year - 80;
      this.yearList = Array.from({ length: 121 }, (_, i) => start + i);
    }

    const today = new Date();
    this.todayYear = this.adapter.getYear(today) ?? new Date().getFullYear();
    this.todayMonth = (this.adapter.getMonth(today) ?? 0) + 1;
    this.todayDay = this.adapter.getDate(today) ?? 1;
  }

  private centerColumns(): void {
    this.centerCol(`.${this.rootClass} .wheel-col--day`, this.pickedDay);
    this.centerCol(`.${this.rootClass} .wheel-col--month`, this.activeMonth);
    this.centerCol(`.${this.rootClass} .wheel-col--year`, this.activeYear);
  }

  private centerCol(selector: string, value: number): void {
    const col = document.querySelector(selector) as HTMLElement | null;
    if (!col) {
      return;
    }
    const item = col.querySelector(
      `[data-value="${value}"]`,
    ) as HTMLElement | null;
    if (!item) {
      return;
    }
    // Layout-based math (offsetTop/clientHeight) is immune to the popup's
    // scaleY entrance animation, unlike getBoundingClientRect.
    const target = item.offsetTop - (col.clientHeight - item.offsetHeight) / 2;
    const clamped = Math.max(
      0,
      Math.min(target, col.scrollHeight - col.clientHeight),
    );
    const delta = Math.abs(clamped - col.scrollTop);
    this.suppressScrollUntil = Date.now() + 250;
    col.scrollTo({ top: clamped, behavior: delta < 120 ? 'smooth' : 'auto' });
  }

  htmlCode = `<!-- header: live preview of the composed date -->
<qeydar-date-picker
  class="slot-demo-picker"
  cssClass="slot-demo-popup wheel-popup"
  [rtl]="rtl"
  [calendarType]="calendarType"
  [dateAdapter]="adapter"
  [format]="'yyyy/MM/dd'"
  [valueFormat]="'date'"
  [showSidebar]="false"
  [presentation]="presentation"
  [modalOptions]="modalOptions"
  [(ngModel)]="selectedDate"
>
  <ng-template qeydarTemplate="header" let-context>
    <div class="wheel-header">
      <span class="wheel-kicker">SELECT A DATE</span>
      <strong class="wheel-date">{{ formatComposed() }}</strong>
    </div>
  </ng-template>

  <!-- body: three synchronized wheel columns replace the whole calendar -->
  <ng-template qeydarTemplate="body" let-context>
    <div class="wheel" role="group" aria-label="Wheel date picker">
      <div class="wheel-col wheel-col--day" (scroll)="onColumnScroll($event, 'day')">
        <span class="wheel-spacer" aria-hidden="true"></span>
        @for (d of dayList; track d) {
        <button
          type="button"
          class="wheel-item"
          [class.wheel-item--active]="d === pickedDay"
          [class.wheel-item--disabled]="isDayDisabled(d)"
          [disabled]="isDayDisabled(d)"
          [attr.data-value]="d"
          (click)="onDayClick(d)"
        >{{ d }}</button>
        }
        <span class="wheel-spacer" aria-hidden="true"></span>
      </div>
      <div class="wheel-col wheel-col--month" (scroll)="onColumnScroll($event, 'month')">
        <span class="wheel-spacer" aria-hidden="true"></span>
        @for (m of monthList; track m; let i = $index) {
        <button
          type="button"
          class="wheel-item"
          [class.wheel-item--active]="i + 1 === activeMonth"
          [class.wheel-item--disabled]="isMonthDisabled(i + 1)"
          [disabled]="isMonthDisabled(i + 1)"
          [attr.data-value]="i + 1"
          (click)="onMonthClick(i + 1)"
        >{{ m }}</button>
        }
        <span class="wheel-spacer" aria-hidden="true"></span>
      </div>
      <div class="wheel-col wheel-col--year" (scroll)="onColumnScroll($event, 'year')">
        <span class="wheel-spacer" aria-hidden="true"></span>
        @for (y of yearList; track y) {
        <button
          type="button"
          class="wheel-item"
          [class.wheel-item--active]="y === activeYear"
          [class.wheel-item--disabled]="isYearDisabled(y)"
          [disabled]="isYearDisabled(y)"
          [attr.data-value]="y"
          (click)="onYearClick(y)"
        >{{ y }}</button>
        }
        <span class="wheel-spacer" aria-hidden="true"></span>
      </div>
      <div class="wheel-focus" aria-hidden="true"></div>
    </div>
  </ng-template>

  <ng-template qeydarTemplate="footer" let-context>
    <div class="wheel-footer">
      <span class="wheel-footer-hint">Confirm the date</span>
      <div class="wheel-footer-actions">
        <button type="button" class="wheel-btn" (click)="context.cancel()">Cancel</button>
        <button type="button" class="wheel-btn wheel-btn--primary" (click)="onConfirm(context)">Done</button>
      </div>
    </div>
  </ng-template>
</qeydar-date-picker>`;

  tsCode = `import { AfterViewChecked, Component } from '@angular/core';
import { DateAdapter, GregorianDateAdapter, JalaliDateAdapter } from '@qeydar/datepicker';

@Component({
  selector: 'app-wheel-demo',
  templateUrl: './wheel-demo.component.html',
})
export class WheelDemoComponent implements AfterViewChecked {
  calendarType: 'jalali' | 'gregorian' = 'jalali';
  jalali = new JalaliDateAdapter();
  gregorian = new GregorianDateAdapter();
  selectedDate: Date | string = new Date();

  dayList: number[] = [];
  monthList: string[] = [];
  yearList: number[] = [];
  pickedDay = 1;
  activeMonth = 1;
  activeYear = 1400;

  private ctx: any = null;
  private syncKey = '';
  private recenterNeeded = false;
  private wasOpen = false;
  private firstRun = true;
  private lastYear = NaN;
  private lastMonth = NaN;
  private lastDay = NaN;
  private scrollTimer: any = null;
  private suppressScrollUntil = 0;
  presentation: PickerPresentation = 'modal';
  modalOptions: PickerModalOptions = {
    mobileSheet: true,
  };

  get rtl(): boolean {
    return this.calendarType === 'jalali';
  }

  get adapter(): DateAdapter<Date> {
    return this.calendarType === 'jalali' ? this.jalali : this.gregorian;
  }

  // Called on every change detection while the popup is open.
  // It rebuilds the three columns only when the picker's currentDate changes,
  // then asks for a re-center on the next AfterViewChecked pass.
  sync(context: any): string {
    this.ctx = context;
    const key = context.currentDate ? String(context.currentDate.getTime()) : 'none';
    if (key !== this.syncKey) {
      this.syncKey = key;
      this.refresh(context.currentDate);
      this.recenterNeeded = true;
    }
    return '';
  }

  ngAfterViewChecked(): void {
    const col = document.querySelector('.wheel-demo .wheel-col--day');
    const open = !!col;
    if (open) {
      if (!this.wasOpen) {
        this.wasOpen = true;
        this.recenterNeeded = false;
        setTimeout(() => this.centerColumns(), 0);
      } else if (this.recenterNeeded) {
        this.recenterNeeded = false;
        this.centerColumns();
      }
    } else {
      this.wasOpen = false;
    }
  }

  trackValue(_index: number, value: any): any {
    return value;
  }

  onDayClick(day: number): void {
    if (this.isDayDisabled(day)) return;
    this.pickedDay = day;
    this.recenterNeeded = true;
  }

  onMonthClick(month: number): void {
    if (this.isMonthDisabled(month) || !this.ctx) return;
    this.ctx.actions.selectMonth(month);
  }

  onYearClick(year: number): void {
    if (this.isYearDisabled(year) || !this.ctx) return;
    this.ctx.actions.selectYear(year);
  }

  // Scrolling a column settles on the centered value — the classic wheel
  // interaction. Day stays local; month/year go through the picker actions
  // so the sibling columns (day count, year range) stay in sync.
  onColumnScroll(event: Event, part: 'day' | 'month' | 'year'): void {
    if (Date.now() < this.suppressScrollUntil) return;
    if (this.scrollTimer) clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      const col = event.target as HTMLElement;
      if (!col.isConnected) return;
      const index = Math.round(col.scrollTop / 36);
      if (part === 'day') {
        const day = this.dayList[Math.max(0, Math.min(index, this.dayList.length - 1))];
        if (day !== undefined && !this.isDayDisabled(day)) {
          this.pickedDay = day;
          this.recenterNeeded = true;
        }
      } else if (part === 'month') {
        const month = Math.max(1, Math.min(index + 1, 12));
        if (!this.isMonthDisabled(month)) this.onMonthClick(month);
      } else {
        const year = this.yearList[Math.max(0, Math.min(index, this.yearList.length - 1))];
        if (year !== undefined && !this.isYearDisabled(year)) this.onYearClick(year);
      }
    }, 150);
  }

  // The only action that commits a value is selectDay, so the wheel
  // composes day + month + year and commits them together on confirm.
  onConfirm(ctx: any): void {
    if (!ctx) return;
    const date = this.adapter.createDate(
      this.activeYear,
      this.activeMonth - 1,
      this.pickedDay
    );
    ctx.actions.selectDay(date);
  }

  isDayDisabled(day: number): boolean {
    if (!this.ctx) return false;
    const date = this.adapter.createDate(this.activeYear, this.activeMonth - 1, day);
    return this.ctx.validation.isDateDisabled(date);
  }

  isMonthDisabled(month: number): boolean {
    return this.ctx ? this.ctx.validation.isMonthDisabled(month) : false;
  }

  isYearDisabled(year: number): boolean {
    return this.ctx ? this.ctx.validation.isYearDisabled(year) : false;
  }

  formatComposed(): string {
    const date = this.adapter.createDate(this.activeYear, this.activeMonth - 1, this.pickedDay);
    const weekday = this.adapter.format(date, 'EEEE');
    const month = this.adapter.getMonthNames('long')[this.activeMonth - 1];
    return \`\${weekday}, \${month} \${this.pickedDay}, \${this.activeYear}\`;
  }

  formatOutput(): string {
    const date = this.selectedDate instanceof Date ? this.selectedDate : null;
    if (!date) return '—';
    return this.adapter.format(date, 'yyyy/MM/dd');
  }

  private refresh(date: Date): void {
    const year = this.adapter.getYear(date) ?? new Date().getFullYear();
    const month = (this.adapter.getMonth(date) ?? 0) + 1;
    const dim = this.adapter.getDaysInMonth(date) ?? 31;
    const day = this.adapter.getDate(date) ?? 1;

    const monthChanged = month !== this.lastMonth;
    const yearChanged = year !== this.lastYear;
    const dayChanged = day !== this.lastDay;

    this.lastYear = year;
    this.lastMonth = month;
    this.lastDay = day;

    this.activeYear = year;
    this.activeMonth = month;
    this.dayList = Array.from({ length: dim }, (_, i) => i + 1);

    if (this.firstRun) {
      this.firstRun = false;
      this.pickedDay = Math.min(day, dim);
    } else if (monthChanged || yearChanged) {
      this.pickedDay = Math.min(Math.max(this.pickedDay, 1), dim);
    } else if (dayChanged) {
      this.pickedDay = Math.min(day, dim);
    }

    const monthNames = this.adapter.getMonthNames('long');
    if (this.monthList.length !== monthNames.length || this.monthList[0] !== monthNames[0]) {
      this.monthList = monthNames.slice();
    }

    const first = this.yearList[0];
    const last = this.yearList[this.yearList.length - 1];
    if (!this.yearList.length || year < first || year > last) {
      const start = year - 80;
      this.yearList = Array.from({ length: 121 }, (_, i) => start + i);
    }
  }

  private centerColumns(): void {
    this.centerCol('.wheel-demo .wheel-col--day', this.pickedDay);
    this.centerCol('.wheel-demo .wheel-col--month', this.activeMonth);
    this.centerCol('.wheel-demo .wheel-col--year', this.activeYear);
  }

  private centerCol(selector: string, value: number): void {
    const col = document.querySelector(selector) as HTMLElement | null;
    if (!col) return;
    const item = col.querySelector(\`[data-value="\${value}"]\`) as HTMLElement | null;
    if (!item) return;
    // Layout-based math is immune to the popup's scaleY entrance animation.
    const target = item.offsetTop - (col.clientHeight - item.offsetHeight) / 2;
    const clamped = Math.max(0, Math.min(target, col.scrollHeight - col.clientHeight));
    const delta = Math.abs(clamped - col.scrollTop);
    this.suppressScrollUntil = Date.now() + 250;
    col.scrollTo({ top: clamped, behavior: delta < 120 ? 'smooth' : 'auto' });
  }
}`;

  scssCode = `// Popup chrome (the popup renders inside the CDK overlay):
// .slot-demo-popup.wheel-popup .calendar { padding: 0; } — global styles.

.wheel {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 84px);
  justify-content: center;
  gap: 8px;
  padding: 0 8px 6px;
}

.wheel-col {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 216px;
  overflow-y: auto;
  padding: 0 4px;
  scrollbar-width: none;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent);
}

.wheel-col::-webkit-scrollbar {
  display: none;
}

.wheel-spacer {
  flex: 0 0 90px;
}

.wheel-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 36px;
  flex: 0 0 36px;
  margin: 0;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #6b7588;
  font-size: 13px;
  cursor: pointer;
  scroll-snap-align: center;
  transition: color 0.16s ease, background 0.16s ease, transform 0.16s ease;
}

.wheel-item:hover:not(:disabled) {
  background: #f0f3ff;
  color: #344dc7;
}

.wheel-item--active {
  background: linear-gradient(135deg, #5779f7, #3f61db);
  color: #fff;
  font-weight: 800;
  box-shadow: 0 6px 14px rgba(68, 104, 239, 0.35);
  transform: scale(1.05);
}

.wheel-item:disabled {
  color: #d4d9e2;
  cursor: not-allowed;
}

.wheel-focus {
  position: absolute;
  z-index: 0;
  top: 90px;
  right: 8px;
  left: 8px;
  height: 36px;
  border-top: 1px solid #dce3f6;
  border-bottom: 1px solid #dce3f6;
  border-radius: 10px;
  background: rgba(93, 117, 240, 0.06);
  pointer-events: none;
}

.wheel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px 14px;
  border-top: 1px solid #edf0f5;
}

.wheel-footer-hint {
  color: #8b95a7;
  font-size: 10px;
}

.wheel-footer-actions {
  display: flex;
  gap: 8px;
}

.wheel-btn {
  padding: 8px 14px;
  border: 1px solid #e2e5eb;
  border-radius: 8px;
  background: #fff;
  color: #6b7484;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.wheel-btn--primary {
  border-color: transparent;
  background: linear-gradient(135deg, #5779f7, #3f61db);
  color: #fff;
  box-shadow: 0 5px 10px rgba(68, 104, 239, 0.22);
}`;
}
