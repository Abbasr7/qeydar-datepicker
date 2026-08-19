import { Component } from '@angular/core';
import { CalendarUtilsService, JalaliDateAdapter, QeydarDatePickerService } from 'projects/qeydar-datepicker/src/public-api';

interface DateRangeValue {
  start: Date;
  end: Date;
}

type WheelColumn = 'day' | 'month' | 'year';

@Component({
  selector: 'slot-demos',
  template: `
    <section class="slot-showcase">
      <div class="showcase-heading">
        <div>
          <span class="eyebrow">SLOT-BASED CUSTOM UI</span>
          <h2>Three ways to make the picker yours</h2>
          <p>
            Toolbar, header, footer, and body slots — all backed by the same
            date-selection logic.
          </p>
        </div>
        <span class="version-chip">Angular 14 compatible</span>
      </div>

      <div class="demo-grid">
        <article class="demo-card quick-card">
          <div class="card-topline">
            <span class="card-index">01</span>
            <span class="card-tag">Toolbar + footer</span>
          </div>
          <h3>Shortcuts for real life</h3>
          <p class="card-copy">
            Give frequent choices a place above the calendar and keep
            confirmation actions close at hand.
          </p>
          <div class="preview-surface quick-surface">
            <qeydar-date-picker
              class="reference-picker"
              [calendarType]="'gregorian'"
              [format]="'MMM d, yyyy'"
              [valueFormat]="'date'"
              [isRange]="true"
              [showSidebar]="false"
              [(ngModel)]="quickRange"
            >
              <ng-template qeydarTemplate="toolbar" let-context>
                <div class="quick-toolbar">
                  <button
                    type="button"
                    class="quick-choice active"
                    (click)="context.selectQuickDate(today)"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    class="quick-choice"
                    (click)="context.selectQuickDate(tomorrow)"
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    class="quick-choice"
                    (click)="
                      context.selectQuickRange(nextWeek.start, nextWeek.end)
                    "
                  >
                    Next week
                  </button>
                </div>
              </ng-template>
              <ng-template qeydarTemplate="footer" let-context>
                <div class="quick-footer">
                  <div class="note-line">
                    <span class="note-glyph">◆</span
                    ><span>Don't forget to do something...</span>
                  </div>
                  <div class="footer-actions">
                    <button
                      type="button"
                      class="secondary-action"
                      (click)="context.cancel()"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="primary-action"
                      (click)="context.confirm()"
                    >
                      Enter
                    </button>
                  </div>
                </div>
              </ng-template>
            </qeydar-date-picker>
          </div>
          <div class="selection-readout">
            <span>Selected range</span>
            <strong>{{ formatRange(quickRange) }}</strong>
          </div>
        </article>

        <article class="demo-card hero-card">
          <div class="card-topline">
            <span class="card-index">02</span>
            <span class="card-tag">Header + footer</span>
          </div>
          <h3>A header with a point of view</h3>
          <p class="card-copy">
            Replace the compact chrome with a strong date summary while the
            calendar body stays familiar.
          </p>
          <div class="preview-surface hero-surface">
            <qeydar-date-picker
              class="reference-picker hero-picker"
              [calendarType]="'gregorian'"
              [format]="'EEE, MMM d'"
              [valueFormat]="'date'"
              [showSidebar]="false"
              [(ngModel)]="heroDate"
            >
              <ng-template qeydarTemplate="header" let-context>
                <div class="hero-header">
                  <span class="hero-kicker">SELECT DATE</span>
                  <div class="hero-date-row">
                    <strong>{{ formatHeroDate(context.currentDate) }}</strong>
                    <button
                      type="button"
                      class="edit-date"
                      aria-label="Show month selector"
                      (click)="context.showMonths()"
                    >
                      ↗
                    </button>
                  </div>
                </div>
              </ng-template>
              <ng-template
                qeydarTemplate="day"
                let-dayNumber="dayNumber"
                let-isSelected="isSelected"
                let-isToday="isToday"
                let-isCurrentMonth="isCurrentMonth"
              >
                <span
                  class="hero-day"
                  [class.selected-day]="isSelected"
                  [class.today-day]="isToday"
                  [class.muted-day]="!isCurrentMonth"
                  >{{ dayNumber }}</span
                >
              </ng-template>
              <ng-template qeydarTemplate="footer" let-context>
                <div class="hero-footer">
                  <button
                    type="button"
                    class="hero-footer-action"
                    (click)="context.cancel()"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="hero-footer-action confirm"
                    (click)="context.confirm()"
                  >
                    OK
                  </button>
                </div>
              </ng-template>
            </qeydar-date-picker>
          </div>
          <div class="selection-readout">
            <span>Selected date</span>
            <strong>{{ formatHeroDate(heroDate) }}</strong>
          </div>
        </article>

        <article class="demo-card wheel-card">
          <div class="card-topline">
            <span class="card-index">03</span>
            <span class="card-tag">Body replacement</span>
          </div>
          <h3>Three columns, one state</h3>
          <p class="card-copy">
            The body slot can own the whole calendar surface — perfect for a
            compact spinner or wheel picker.
          </p>
          <div class="preview-surface wheel-surface">
            <qeydar-date-picker
              class="reference-picker wheel-picker"
              [calendarType]="'gregorian'"
              [format]="'MMM d, yyyy'"
              [valueFormat]="'date'"
              [showSidebar]="false"
              [(ngModel)]="wheelDate"
              [dateAdapter]="jalali"
            >
              <ng-template qeydarTemplate="header" let-context>
                <div class="wheel-header">
                  <span class="hero-kicker">CHOOSE A DATE</span>
                  <strong>{{ formatHeroDate(context.currentDate) }}</strong>
                </div>
              </ng-template>
              <ng-template qeydarTemplate="body" let-context>
                <div
                  class="wheel-body"
                  role="group"
                  aria-label="Date wheel picker"
                >
                  <div class="wheel-column" aria-label="Day">
                    <button
                      type="button"
                      *ngFor="let day of context.days; trackBy: trackDate"
                      class="wheel-item"
                      [class.current]="context.selection.isSelected(day)"
                      [class.disabled]="context.validation.isDateDisabled(day)"
                      [disabled]="context.validation.isDateDisabled(day)"
                      (click)="context.actions.selectDay(day)"
                    >
                      {{ day.getDate() }}
                    </button>
                  </div>
                  <div class="wheel-column" aria-label="Month">
                    <button
                      type="button"
                      *ngFor="let month of context.monthListNum"
                      class="wheel-item"
                      [class.current]="
                        month === context.currentDate.getMonth() + 1
                      "
                      [disabled]="context.validation.isMonthDisabled(month)"
                      (click)="onMonthClick(context, month)"
                    >
                      {{ monthName(month) }}
                    </button>
                  </div>
                  <div class="wheel-column" aria-label="Year">
                    <button
                      type="button"
                      *ngFor="let year of wheelYearList"
                      class="wheel-item"
                      [class.current]="
                        year === context.currentDate.getFullYear()
                      "
                      [disabled]="context.validation.isYearDisabled(year)"
                      (click)="context.actions.selectYear(year)"
                    >
                      {{ year }}
                    </button>
                  </div>
                  <span class="wheel-focus" aria-hidden="true"></span>
                </div>
              </ng-template>
              <ng-template qeydarTemplate="footer" let-context>
                <div class="wheel-footer">
                  <button
                    type="button"
                    class="hero-footer-action"
                    (click)="context.cancel()"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="hero-footer-action confirm"
                    (click)="context.confirm()"
                  >
                    Done
                  </button>
                </div>
              </ng-template>
            </qeydar-date-picker>
          </div>
          <div class="selection-readout">
            <span>Selected date</span>
            <strong>{{ formatHeroDate(wheelDate) }}</strong>
          </div>
        </article>
      </div>

      <demo-code-viewer
        [htmlCode]="htmlCode"
        [tsCode]="tsCode"
        htmlFile="slot-demos.component.html"
        tsFile="slot-demos.component.ts"
      ></demo-code-viewer>
    </section>
  `,
  styles: [
    `
      :host {
        --ink: #162033;
        --muted: #6d7788;
        --line: #e8ebf1;
        --blue: #4468ef;
        --blue-dark: #2c4fc9;
        display: block;
        width: 100%;
      }

      .slot-showcase {
        position: relative;
        overflow: hidden;
        padding: 34px;
        border: 1px solid #e4e8f0;
        border-radius: 24px;
        background: linear-gradient(
          145deg,
          #f8faff 0%,
          #f2f5fb 52%,
          #eef2f9 100%
        );
        color: var(--ink);
        box-shadow: 0 18px 42px rgba(27, 47, 86, 0.08);
      }

      .slot-showcase::before,
      .slot-showcase::after {
        position: absolute;
        content: '';
        pointer-events: none;
        border-radius: 999px;
        filter: blur(2px);
      }

      .slot-showcase::before {
        width: 260px;
        height: 260px;
        top: -170px;
        right: 7%;
        background: rgba(125, 151, 255, 0.18);
      }

      .slot-showcase::after {
        width: 180px;
        height: 180px;
        bottom: -120px;
        left: 4%;
        background: rgba(82, 214, 190, 0.12);
      }

      .showcase-heading,
      .demo-grid {
        position: relative;
        z-index: 1;
      }

      .showcase-heading {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 28px;
      }

      .eyebrow,
      .card-tag,
      .hero-kicker {
        display: block;
        color: #72809a;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .showcase-heading h2 {
        margin: 8px 0 6px;
        font-size: clamp(24px, 3vw, 36px);
        letter-spacing: -0.045em;
        line-height: 1.08;
      }

      .showcase-heading p {
        max-width: 620px;
        margin: 0;
        color: var(--muted);
        font-size: 14px;
      }

      .version-chip {
        flex: 0 0 auto;
        padding: 8px 12px;
        border: 1px solid #d9e0f2;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.72);
        color: #56627a;
        font-size: 11px;
        font-weight: 700;
      }

      .demo-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      .demo-card {
        min-width: 0;
        overflow: hidden;
        border: 1px solid rgba(222, 228, 239, 0.95);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.78);
        box-shadow: 0 12px 26px rgba(34, 54, 94, 0.06);
      }

      .card-topline,
      .demo-card h3,
      .card-copy,
      .selection-readout {
        margin-right: 20px;
        margin-left: 20px;
      }

      .card-topline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 18px;
      }

      .card-index {
        color: #a6afc0;
        font-size: 11px;
        font-variant-numeric: tabular-nums;
        font-weight: 800;
        letter-spacing: 0.1em;
      }

      .card-tag {
        color: #4d67c7;
        font-size: 9px;
        letter-spacing: 0.1em;
      }

      .demo-card h3 {
        margin-top: 16px;
        margin-bottom: 7px;
        font-size: 20px;
        letter-spacing: -0.035em;
      }

      .card-copy {
        min-height: 42px;
        margin-top: 0;
        color: var(--muted);
        font-size: 12px;
        line-height: 1.55;
      }

      .preview-surface {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        min-height: 360px;
        margin-top: 18px;
        padding: 18px 12px 0;
        overflow: hidden;
        background: #f7f8fb;
      }

      .quick-surface {
        background: linear-gradient(160deg, #f4f5f9, #fbfbfd);
      }

      .hero-surface {
        padding-top: 24px;
        background: linear-gradient(135deg, #d8e8f8, #edf5fc);
      }

      .wheel-surface {
        padding-top: 24px;
        background: radial-gradient(circle at 50% 0%, #f9fbff 0%, #eff3fb 68%);
      }

      .reference-picker {
        display: block;
        width: 100%;
      }

      .reference-picker ::ng-deep .date-picker-popup {
        width: 100%;
        max-width: 320px;
        margin: 0 auto;
        border: 1px solid #e4e7ee;
        border-radius: 15px;
        background: #fff;
        box-shadow: 0 12px 24px rgba(36, 51, 85, 0.1);
      }

      .reference-picker ::ng-deep .date-picker-content {
        display: block;
        max-height: none;
      }

      .reference-picker ::ng-deep .calendar {
        width: auto;
        max-width: none;
        padding: 12px;
      }

      .reference-picker ::ng-deep .header {
        border: 0;
        background: #f9fafc;
        border-radius: 9px;
      }

      .reference-picker ::ng-deep .weekdays {
        color: #98a1b2;
        font-size: 10px;
      }

      .reference-picker ::ng-deep .days button,
      .reference-picker ::ng-deep .months button,
      .reference-picker ::ng-deep .years button {
        min-height: 30px;
        border-radius: 9px;
        color: #374154;
        font-size: 12px;
      }

      .reference-picker ::ng-deep .days button.selected,
      .reference-picker ::ng-deep .months button.selected,
      .reference-picker ::ng-deep .years button.selected {
        background: var(--blue);
        color: #fff;
      }

      .quick-toolbar {
        display: flex;
        gap: 6px;
        margin: 0 0 12px;
      }

      .quick-choice,
      .secondary-action,
      .primary-action,
      .hero-footer-action,
      .wheel-item,
      .edit-date {
        border: 0;
        font: inherit;
        cursor: pointer;
      }

      .quick-choice {
        flex: 1;
        padding: 9px 5px;
        border: 1px solid transparent;
        border-radius: 9px;
        background: #f5f6f9;
        color: #667084;
        font-size: 11px;
        transition:
          background 0.18s ease,
          color 0.18s ease,
          border-color 0.18s ease;
      }

      .quick-choice.active,
      .quick-choice:hover {
        border-color: #cbd6fc;
        background: #f4f6ff;
        color: #3f5fd1;
      }

      .quick-footer {
        padding: 12px 14px 14px;
        border-top: 1px solid #edf0f5;
      }

      .note-line {
        display: flex;
        align-items: center;
        gap: 7px;
        color: #747d8e;
        font-size: 10px;
      }

      .note-glyph {
        color: #626b7a;
        font-size: 12px;
        transform: rotate(45deg);
      }

      .footer-actions,
      .hero-footer {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }

      .secondary-action,
      .primary-action {
        flex: 1;
        padding: 9px 12px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
      }

      .secondary-action {
        border: 1px solid #e2e5eb;
        background: #fff;
        color: #6b7484;
      }

      .primary-action {
        background: linear-gradient(135deg, #5779f7, #3f61db);
        color: #fff;
        box-shadow: 0 5px 10px rgba(68, 104, 239, 0.22);
      }

      .hero-picker ::ng-deep .calendar {
        padding-top: 0;
      }

      .hero-header {
        margin: -12px -12px 12px;
        padding: 20px 18px 17px;
        background: linear-gradient(145deg, #9bb8d4, #a9c6e0);
        color: #fff;
      }

      .hero-kicker {
        color: rgba(255, 255, 255, 0.8);
        font-size: 9px;
      }

      .hero-date-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-top: 25px;
      }

      .hero-date-row strong {
        font-size: 24px;
        letter-spacing: -0.05em;
      }

      .edit-date {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.18);
        color: #fff;
        font-size: 15px;
        transform: rotate(-45deg);
      }

      .hero-picker ::ng-deep .header {
        border: 0;
        background: transparent;
      }

      .hero-day {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        color: #263448;
        font-size: 11px;
      }

      .hero-day.selected-day {
        background: #8faec9;
        color: #fff;
      }

      .hero-day.today-day {
        border: 1px solid #8faec9;
      }

      .hero-day.muted-day {
        color: #a9b2bf;
      }

      .hero-footer {
        justify-content: flex-end;
        padding: 0 4px 3px;
      }

      .hero-footer-action {
        padding: 6px 9px;
        background: transparent;
        color: #9aa4b3;
        font-size: 11px;
        font-weight: 700;
      }

      .hero-footer-action.confirm {
        color: #7592ac;
      }

      .wheel-picker ::ng-deep .calendar {
        padding: 0 10px 10px;
      }

      .wheel-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin: -1px -2px 12px;
        padding: 0 4px 12px;
        border-bottom: 1px solid #edf0f5;
      }

      .wheel-header .hero-kicker {
        color: #71809a;
      }

      .wheel-header strong {
        color: #25334c;
        font-size: 13px;
      }

      .wheel-body {
        position: relative;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        height: 205px;
        overflow: hidden;
        border-radius: 12px;
        background: linear-gradient(90deg, #f7f9fd, #fff, #f7f9fd);
      }

      .wheel-column {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 1px;
        overflow-y: auto;
        padding: 80px 2px;
        scrollbar-width: none;
        scroll-snap-type: y proximity;
      }

      .wheel-column::-webkit-scrollbar {
        display: none;
      }

      .wheel-item {
        flex: 0 0 34px;
        border-radius: 8px;
        background: transparent;
        color: #a2abba;
        font-size: 12px;
        scroll-snap-align: center;
        transition:
          color 0.18s ease,
          background 0.18s ease,
          transform 0.18s ease;
      }

      .wheel-item.current {
        background: #edf1ff;
        color: #3f5fd1;
        font-weight: 800;
        transform: scale(1.04);
      }

      .wheel-item:disabled {
        color: #d4d9e2;
        cursor: not-allowed;
      }

      .wheel-focus {
        position: absolute;
        z-index: 0;
        top: 85px;
        right: 6px;
        left: 6px;
        height: 34px;
        border-top: 1px solid #dce3f6;
        border-bottom: 1px solid #dce3f6;
        pointer-events: none;
      }

      .wheel-footer {
        display: flex;
        justify-content: flex-end;
        gap: 4px;
        padding-top: 9px;
      }

      .selection-readout {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 13px 0 15px;
        color: #8b95a7;
        font-size: 10px;
      }

      .selection-readout strong {
        color: #34415b;
        font-size: 11px;
      }

      @media (max-width: 1100px) {
        .demo-grid {
          grid-template-columns: 1fr;
        }

        .preview-surface {
          min-height: 0;
        }

        .reference-picker {
          max-width: 360px;
        }
      }

      @media (max-width: 640px) {
        .slot-showcase {
          padding: 22px 14px;
          border-radius: 16px;
        }

        .showcase-heading {
          display: block;
        }

        .version-chip {
          display: inline-block;
          margin-top: 14px;
        }
      }
    `,
  ],
})
export class SlotDemosComponent {
  today = new Date();
  tomorrow = this.addDays(this.today, 1);
  nextWeek: DateRangeValue = {
    start: this.addDays(this.today, 7),
    end: this.addDays(this.today, 13),
  };
  quickRange: DateRangeValue = {
    start: this.today,
    end: this.today,
  };
  heroDate = this.today;
  wheelDate = this.today;

  jalali = new JalaliDateAdapter()
  wheelYearList: number[];
  wheelMonthList: string[];
  wheelDayList: number[];

  constructor(public calendarUtils: CalendarUtilsService) {
    const currentYear = calendarUtils.getCurrentYear(new Date(), this.jalali);
    this.wheelYearList = Array.from({ length: 101 }, (_, i) => currentYear - i);

    const monthYear = calendarUtils.getMonthNames(this.jalali);
    this.wheelMonthList = calendarUtils.getMonthNames(this.jalali);

    // this.calendarUtils.
  }

  trackDate(index: number, date: Date): number {
    return date.getTime();
  }

  monthName(month: number): string {
    const name = this.calendarUtils.getMonthName(month,this.jalali);
    return name;
  }

  formatHeroDate(date: Date | null): string {
    if (!date) {
      return 'Choose a date';
    }
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  formatRange(range: DateRangeValue): string {
    if (!range) {
      return 'Choose a range';
    }
    const format = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${format.format(range.start)} – ${format.format(range.end)}`;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  onMonthClick(ct: any, month: any) {
    ct.actions.selectMonth(month);
    console.log(ct);
  }

  htmlCode = `<!-- 01 · Toolbar + footer shortcuts -->
<qeydar-date-picker
  class="reference-picker"
  [calendarType]="'gregorian'"
  [format]="'MMM d, yyyy'"
  [valueFormat]="'date'"
  [isRange]="true"
  [showSidebar]="false"
  [(ngModel)]="quickRange"
>
  <ng-template qeydarTemplate="toolbar" let-context>
    <div class="quick-toolbar">
      <button type="button" class="quick-choice active" (click)="context.selectQuickDate(today)">Today</button>
      <button type="button" class="quick-choice" (click)="context.selectQuickDate(tomorrow)">Tomorrow</button>
      <button type="button" class="quick-choice" (click)="context.selectQuickRange(nextWeek.start, nextWeek.end)">Next week</button>
    </div>
  </ng-template>
  <ng-template qeydarTemplate="footer" let-context>
    <div class="quick-footer">
      <div class="note-line"><span class="note-glyph">◆</span><span>Don't forget to do something...</span></div>
      <div class="footer-actions">
        <button type="button" class="secondary-action" (click)="context.cancel()">Cancel</button>
        <button type="button" class="primary-action" (click)="context.confirm()">Enter</button>
      </div>
    </div>
  </ng-template>
</qeydar-date-picker>

<!-- 02 · Custom header + day cells + footer -->
<qeydar-date-picker
  class="reference-picker hero-picker"
  [calendarType]="'gregorian'"
  [format]="'EEE, MMM d'"
  [valueFormat]="'date'"
  [showSidebar]="false"
  [(ngModel)]="heroDate"
>
  <ng-template qeydarTemplate="header" let-context>
    <div class="hero-header">
      <span class="hero-kicker">SELECT DATE</span>
      <div class="hero-date-row">
        <strong>{{ formatHeroDate(context.currentDate) }}</strong>
        <button type="button" class="edit-date" aria-label="Show month selector" (click)="context.showMonths()">↗</button>
      </div>
    </div>
  </ng-template>
  <ng-template qeydarTemplate="day" let-dayNumber="dayNumber" let-isSelected="isSelected" let-isToday="isToday" let-isCurrentMonth="isCurrentMonth">
    <span class="hero-day" [class.selected-day]="isSelected" [class.today-day]="isToday" [class.muted-day]="!isCurrentMonth">{{ dayNumber }}</span>
  </ng-template>
  <ng-template qeydarTemplate="footer" let-context>
    <div class="hero-footer">
      <button type="button" class="hero-footer-action" (click)="context.cancel()">Cancel</button>
      <button type="button" class="hero-footer-action confirm" (click)="context.confirm()">OK</button>
    </div>
  </ng-template>
</qeydar-date-picker>

<!-- 03 · Full body replacement (wheel picker) -->
<qeydar-date-picker
  class="reference-picker wheel-picker"
  [calendarType]="'gregorian'"
  [format]="'MMM d, yyyy'"
  [valueFormat]="'date'"
  [showSidebar]="false"
  [(ngModel)]="wheelDate"
>
  <ng-template qeydarTemplate="header" let-context>
    <div class="wheel-header">
      <span class="hero-kicker">CHOOSE A DATE</span>
      <strong>{{ formatHeroDate(context.currentDate) }}</strong>
    </div>
  </ng-template>
  <ng-template qeydarTemplate="body" let-context>
    <div class="wheel-body" role="group" aria-label="Date wheel picker">
      <div class="wheel-column" aria-label="Day">
        <button
          type="button"
          *ngFor="let day of context.days; trackBy: trackDate"
          class="wheel-item"
          [class.current]="context.selection.isSelected(day)"
          [class.disabled]="context.validation.isDateDisabled(day)"
          [disabled]="context.validation.isDateDisabled(day)"
          (click)="context.actions.selectDay(day)"
        >{{ day.getDate() }}</button>
      </div>
      <div class="wheel-column" aria-label="Month">
        <button
          type="button"
          *ngFor="let month of context.monthListNum"
          class="wheel-item"
          [class.current]="month === context.currentDate.getMonth() + 1"
          [disabled]="context.validation.isMonthDisabled(month)"
          (click)="context.actions.selectMonth(month)"
        >{{ monthName(month) }}</button>
      </div>
      <div class="wheel-column" aria-label="Year">
        <button
          type="button"
          *ngFor="let year of context.yearList"
          class="wheel-item"
          [class.current]="year === context.currentDate.getFullYear()"
          [disabled]="context.validation.isYearDisabled(year)"
          (click)="context.actions.selectYear(year)"
        >{{ year }}</button>
      </div>
      <span class="wheel-focus" aria-hidden="true"></span>
    </div>
  </ng-template>
  <ng-template qeydarTemplate="footer" let-context>
    <div class="wheel-footer">
      <button type="button" class="hero-footer-action" (click)="context.cancel()">Cancel</button>
      <button type="button" class="hero-footer-action confirm" (click)="context.confirm()">Done</button>
    </div>
  </ng-template>
</qeydar-date-picker>`;

  tsCode = `import { Component } from '@angular/core';

interface DateRangeValue {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-slot-demos',
  templateUrl: './slot-demos.component.html',
})
export class SlotDemosComponent {
  today = new Date();
  tomorrow = this.addDays(this.today, 1);
  nextWeek: DateRangeValue = {
    start: this.addDays(this.today, 7),
    end: this.addDays(this.today, 13)
  };
  quickRange: DateRangeValue = { start: this.today, end: this.today };
  heroDate = this.today;
  wheelDate = this.today;

  trackDate(index: number, date: Date): number {
    return date.getTime();
  }

  monthName(month: number): string {
    return new Intl.DateTimeFormat('en-US', { month: 'short' })
      .format(new Date(2020, month - 1, 1));
  }

  formatHeroDate(date: Date | null): string {
    if (!date) {
      return 'Choose a date';
    }
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  formatRange(range: DateRangeValue): string {
    if (!range) {
      return 'Choose a range';
    }
    const format = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    return \`\${format.format(range.start)} – \${format.format(range.end)}\`;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}`;
}
