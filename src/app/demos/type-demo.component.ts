import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';
import { DemoCodeViewerComponent } from './code-viewer.component';
import { JalaliDateAdapter } from 'projects/qeydar-datepicker/src/date-adapter';

/**
 * "Type" demo — a calendar whose pink hero header reflects the selected day,
 * rendered entirely through the `header`, `day` and `footer` template slots.
 */
@Component({
  selector: 'type-demo',
  imports: [FormsModule, QeydarDatePickerModule, DemoCodeViewerComponent],
  template: `
    <div class="type-demo">
      <div class="type-demo-head">
        <div>
          <span class="slot-demo-kicker">Header · day · footer slots</span>
          <h3>A blush header with presence</h3>
          <p>
            A pink hero header mirrors the selected Jalali date while the grid
            and the actions stay fully functional.
          </p>
        </div>
        <span class="slot-demo-tag">01</span>
      </div>

      <div class="type-preview" dir="rtl">
        <qeydar-date-picker
          class="type-picker"
          cssClass="type-popup"
          [rtl]="true"
          [calendarType]="'jalali'"
          [format]="'yyyy/MM/dd'"
          [valueFormat]="'date'"
          [showSidebar]="false"
          [isInline]="true"
          [(ngModel)]="pickedDate"
        >
          <!-- Pink hero header -->
          <ng-template qeydarTemplate="header" let-ctx>
            <div class="type-header">
              <div class="type-header-top">
                <span class="type-kicker">انتخاب تاریخ</span>
                <div class="type-nav">
                  <button
                    type="button"
                    class="type-nav-btn"
                    [disabled]="ctx.prevDisabled"
                    aria-label="ماه قبل"
                    (click)="ctx.prev()"
                  >‹</button>
                  <button
                    type="button"
                    class="type-nav-btn"
                    [disabled]="ctx.nextDisabled"
                    aria-label="ماه بعد"
                    (click)="ctx.next()"
                  >›</button>
                </div>
              </div>

              <div class="type-hero">
                <span class="type-weekday">{{ weekdayOf(pickedDate) }}</span>
                <span class="type-day">{{ faDigits(dayOf(pickedDate)) }}</span>
                <span class="type-monthyear">
                  {{ monthNameOf(pickedDate) }}
                  {{ faDigits(yearOf(pickedDate)) }}
                </span>
              </div>

              <button
                type="button"
                class="type-switch"
                (click)="ctx.showMonths()"
              >
                {{ ctx.currentMonthName }} {{ faDigits(ctx.currentYear) }}
                <span class="type-switch-arrow" aria-hidden="true">⌄</span>
              </button>
            </div>
          </ng-template>

          <!-- Day cells -->
          <ng-template
            qeydarTemplate="day"
            let-day
            let-dayNumber="dayNumber"
            let-isSelected="isSelected"
            let-isCurrentMonth="isCurrentMonth"
          >
            <span
              class="type-day-cell"
              [class.is-sel]="isSelected"
              [class.is-today]="isToday(day)"
              [class.is-out]="!isCurrentMonth"
              >{{ faDigits(dayNumber) }}</span
            >
          </ng-template>

          <!-- Footer actions -->
          <ng-template qeydarTemplate="footer" let-ctx>
            <div class="type-footer">
              <span class="type-footer-hint">{{ formatFull(pickedDate) }}</span>
              <div class="type-footer-actions">
                <button
                  type="button"
                  class="type-btn"
                  (click)="ctx.today()"
                >امروز</button>
                <button
                  type="button"
                  class="type-btn type-btn--primary"
                  (click)="ctx.confirm()"
                >تأیید</button>
              </div>
            </div>
          </ng-template>
        </qeydar-date-picker>

        <output class="type-readout" aria-live="polite">
          <span>مقدار خروجی</span>
          <strong>{{ formatFull(pickedDate) }}</strong>
        </output>
      </div>

      <demo-code-viewer
        [htmlCode]="htmlCode"
        [tsCode]="tsCode"
        [scssCode]="scssCode"
        htmlFile="type-demo.component.html"
        tsFile="type-demo.component.ts"
        scssFile="type-demo.component.scss"
      ></demo-code-viewer>
    </div>
  `,
  styles: [
    `
      .type-demo-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
      }

      .type-demo-head h3 {
        margin: 7px 0 5px;
        font-size: 18px;
        letter-spacing: -0.03em;
        color: #172238;
      }

      .type-demo-head p {
        max-width: 560px;
        margin: 0;
        color: #6b7588;
        font-size: 12px;
        line-height: 1.65;
      }

      .type-preview {
        display: grid;
        justify-items: center;
        gap: 14px;
        margin-top: 18px;
        padding: 24px 16px;
        border-radius: 14px;
        background: radial-gradient(120% 140% at 50% 0%, #fff5f8 0%, #fdeef3 70%);
      }

      .type-picker {
        width: 100%;
        max-width: 340px;
      }

      /* ---------- Pink header ---------- */
      .type-header {
        padding: 20px 18px 14px;
        background: linear-gradient(150deg, #ff8fb8 0%, #ff5d8f 52%, #f43f5e 100%);
        color: #fff;
      }

      .type-header-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .type-kicker {
        color: rgba(255, 255, 255, 0.85);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .type-nav {
        display: inline-flex;
        gap: 4px;
      }

      .type-nav-btn {
        display: grid;
        width: 26px;
        height: 26px;
        place-items: center;
        border: 0;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.18);
        color: #fff;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        transition: background 140ms ease, opacity 140ms ease;
      }

      .type-nav-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
      }

      .type-nav-btn:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .type-hero {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 22px;
      }

      .type-weekday {
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.22);
        font-size: 12px;
        font-weight: 700;
      }

      .type-day {
        font-size: 44px;
        font-weight: 800;
        letter-spacing: -0.04em;
        line-height: 1;
        text-shadow: 0 2px 10px rgba(160, 29, 73, 0.25);
      }

      .type-monthyear {
        color: rgba(255, 255, 255, 0.92);
        font-size: 13px;
        font-weight: 700;
      }

      .type-switch {
        display: flex;
        align-items: center;
        gap: 6px;
        width: 100%;
        margin-top: 16px;
        padding: 8px 12px;
        border: 0;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.16);
        color: #fff;
        font-size: 11px;
        font-weight: 700;
        text-align: right;
        cursor: pointer;
        transition: background 140ms ease;
      }

      .type-switch:hover {
        background: rgba(255, 255, 255, 0.26);
      }

      .type-switch-arrow {
        margin-right: auto;
        font-size: 14px;
      }

      /* ---------- Day cells ---------- */
      .type-day-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        color: inherit;
        font-size: 12px;
      }

      .type-day-cell.is-today {
        box-shadow: inset 0 0 0 2px #f43f5e;
        border-radius: 12px;
      }

      /* ---------- Footer ---------- */
      .type-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 12px 16px;
        border-top: 1px solid #f3e8ed;
      }

      .type-footer-hint {
        min-width: 0;
        overflow: hidden;
        color: #b17a90;
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .type-footer-actions {
        display: flex;
        flex: 0 0 auto;
        gap: 8px;
      }

      .type-btn {
        padding: 8px 14px;
        border: 1px solid #f2c8d6;
        border-radius: 9px;
        background: #fff;
        color: #c2547c;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }

      .type-btn--primary {
        border-color: transparent;
        background: linear-gradient(150deg, #ff7db2, #f43f5e);
        color: #fff;
        box-shadow: 0 5px 12px rgba(244, 63, 94, 0.28);
      }

      .type-readout {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        max-width: 340px;
        padding: 12px 14px;
        border-radius: 10px;
        background: #fff;
        color: #b17a90;
        font-size: 10px;
        box-shadow: 0 8px 20px rgba(244, 63, 94, 0.08);
      }

      .type-readout strong {
        color: #8f2c54;
        font-size: 11px;
      }
    `,
  ],
})
export class TypeDemoComponent {
  readonly jalali = inject(JalaliDateAdapter);

  pickedDate: Date = this.jalali.createDate(1405, 3, 24); // 24 تیر ۱۴۰۵

  weekdayOf(date: Date | null): string {
    return date ? this.jalali.format(date, 'EEEE') : '—';
  }

  dayOf(date: Date | null): string {
    return date ? this.jalali.format(date, 'd') : '—';
  }

  monthNameOf(date: Date | null): string {
    return date ? this.jalali.format(date, 'MMMM') : '';
  }

  yearOf(date: Date | null): string {
    return date ? this.jalali.format(date, 'yyyy') : '';
  }

  formatFull(date: Date | null): string {
    return date ? this.faDigits(this.jalali.format(date, 'EEEE d MMMM yyyy')) : '—';
  }

  isToday(date: Date): boolean {
    return this.jalali.isSameDay(date, this.jalali.today());
  }

  faDigits(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
  }

  htmlCode = `<!-- header: a pink hero that mirrors the selected Jalali date -->
<qeydar-date-picker
  class="type-picker"
  cssClass="type-popup"
  [rtl]="true"
  [calendarType]="'jalali'"
  [format]="'yyyy/MM/dd'"
  [valueFormat]="'date'"
  [showSidebar]="false"
  [isInline]="true"
  [(ngModel)]="pickedDate"
>
  <ng-template qeydarTemplate="header" let-ctx>
    <div class="type-header">
      <div class="type-header-top">
        <span class="type-kicker">انتخاب تاریخ</span>
        <div class="type-nav">
          <button type="button" class="type-nav-btn" [disabled]="ctx.prevDisabled" (click)="ctx.prev()">‹</button>
          <button type="button" class="type-nav-btn" [disabled]="ctx.nextDisabled" (click)="ctx.next()">›</button>
        </div>
      </div>
      <div class="type-hero">
        <span class="type-weekday">{{ weekdayOf(pickedDate) }}</span>
        <span class="type-day">{{ faDigits(dayOf(pickedDate)) }}</span>
        <span class="type-monthyear">{{ monthNameOf(pickedDate) }} {{ faDigits(yearOf(pickedDate)) }}</span>
      </div>
      <button type="button" class="type-switch" (click)="ctx.showMonths()">
        {{ ctx.currentMonthName }} {{ faDigits(ctx.currentYear) }} <span aria-hidden="true">⌄</span>
      </button>
    </div>
  </ng-template>

  <ng-template qeydarTemplate="day" let-day let-dayNumber="dayNumber" let-isSelected="isSelected" let-isCurrentMonth="isCurrentMonth">
    <span class="type-day-cell" [class.is-sel]="isSelected" [class.is-today]="isToday(day)" [class.is-out]="!isCurrentMonth">
      {{ faDigits(dayNumber) }}
    </span>
  </ng-template>

  <ng-template qeydarTemplate="footer" let-ctx>
    <div class="type-footer">
      <span class="type-footer-hint">{{ formatFull(pickedDate) }}</span>
      <div class="type-footer-actions">
        <button type="button" class="type-btn" (click)="ctx.today()">امروز</button>
        <button type="button" class="type-btn type-btn--primary" (click)="ctx.confirm()">تأیید</button>
      </div>
    </div>
  </ng-template>
</qeydar-date-picker>`;

  tsCode = `import { Component, inject } from '@angular/core';
import { JalaliDateAdapter } from '@qeydar/datepicker';

@Component({
  selector: 'app-type-demo',
  templateUrl: './type-demo.component.html',
})
export class TypeDemoComponent {
  readonly jalali = inject(JalaliDateAdapter);

  pickedDate: Date = this.jalali.createDate(1405, 3, 24); // 24 تیر ۱۴۰۵

  weekdayOf(date: Date | null): string {
    return date ? this.jalali.format(date, 'EEEE') : '—';
  }

  dayOf(date: Date | null): string {
    return date ? this.jalali.format(date, 'd') : '—';
  }

  monthNameOf(date: Date | null): string {
    return date ? this.jalali.format(date, 'MMMM') : '';
  }

  yearOf(date: Date | null): string {
    return date ? this.jalali.format(date, 'yyyy') : '';
  }

  formatFull(date: Date | null): string {
    return date ? this.faDigits(this.jalali.format(date, 'EEEE d MMMM yyyy')) : '—';
  }

  isToday(date: Date): boolean {
    return this.jalali.isSameDay(date, this.jalali.today());
  }

  faDigits(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return String(value).replace(/\\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
  }
}`;

  scssCode = `// Popup chrome (global, since the popup renders inside the CDK overlay):
// .type-popup { max-width: 340px; border-radius: 16px; }
// .type-popup .date-picker-content { display: block; max-height: none; }
// .type-popup .calendar { width: auto; max-width: none; padding: 0; }
// .type-popup .days button.selected { background: linear-gradient(150deg, #ff7db2, #f43f5e); color: #fff; }

.type-header {
  padding: 20px 18px 14px;
  background: linear-gradient(150deg, #ff8fb8 0%, #ff5d8f 52%, #f43f5e 100%);
  color: #fff;
}

.type-hero {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.type-weekday {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  font-size: 12px;
  font-weight: 700;
}

.type-day {
  font-size: 44px;
  font-weight: 800;
  line-height: 1;
}

.type-day-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: inherit;
  font-size: 12px;
}

.type-day-cell.is-today {
  box-shadow: inset 0 0 0 2px #f43f5e;
  border-radius: 12px;
}

.type-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 16px;
  border-top: 1px solid #f3e8ed;
}

.type-btn--primary {
  border: 0;
  border-radius: 9px;
  background: linear-gradient(150deg, #ff7db2, #f43f5e);
  color: #fff;
}`;
}
