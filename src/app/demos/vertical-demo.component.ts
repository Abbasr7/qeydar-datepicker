import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';
import { DemoCodeViewerComponent } from './code-viewer.component';
import { JalaliDateAdapter } from 'projects/qeydar-datepicker/src/date-adapter';
import { BodyTemplateContext } from 'projects/qeydar-datepicker/src/public-api';

/**
 * "Vertical" demo — a scrollable vertical column of full dates beside the
 * month calendar. Both surfaces share the same selection state via the body slot.
 */
@Component({
  selector: 'vertical-demo',
  imports: [FormsModule, QeydarDatePickerModule, DemoCodeViewerComponent],
  template: `
    <div class="vertical-demo">
      <div class="vertical-demo-head">
        <div>
          <span class="slot-demo-kicker">Body slot · vertical agenda</span>
          <h3>A column for every day</h3>
          <p>
            A scrollable list of full dates sits beside the month grid; pick from
            either surface and the other follows instantly.
          </p>
        </div>
        <span class="slot-demo-tag">02</span>
      </div>

      <div class="vertical-preview" dir="rtl">
        <qeydar-date-picker
          class="vertical-picker"
          cssClass="vertical-popup"
          [rtl]="true"
          [calendarType]="'jalali'"
          [format]="'yyyy/MM/dd'"
          [valueFormat]="'date'"
          [showSidebar]="false"
          [isInline]="true"
          [(ngModel)]="pickedDate"
        >
          <ng-template qeydarTemplate="header" let-ctx>
            <div class="v-head">
              <button
                type="button"
                class="v-nav"
                [disabled]="ctx.prevDisabled"
                aria-label="ماه قبل"
                (click)="ctx.prev()"
              >‹</button>
              <div class="v-title">
                <strong>{{ ctx.currentMonthName }}</strong>
                <span>{{ faDigits(ctx.currentYear) }}</span>
              </div>
              <button
                type="button"
                class="v-nav"
                [disabled]="ctx.nextDisabled"
                aria-label="ماه بعد"
                (click)="ctx.next()"
              >›</button>
            </div>
          </ng-template>

          <ng-template qeydarTemplate="body" let-ctx>
            {{ sync(ctx) }}
            <div class="v-body">
              <!-- Vertical date column -->
              <div class="v-list" role="listbox" aria-label="روزهای ماه">
                @for (d of monthDays; track $index) {
                  <button
                    type="button"
                    class="v-item"
                    [id]="itemId(d)"
                    [class.is-sel]="ctx.selection.isSelected(d)"
                    [class.is-today]="isToday(d)"
                    (click)="ctx.actions.selectDay(d)"
                  >
                    <span class="v-wd">{{ weekdayOf(d) }}</span>
                    <span class="v-date">{{
                      faDigits(this.jalali.format(d, 'd MMMM yyyy'))
                    }}</span>
                  </button>
                }
              </div>

              <!-- Month calendar -->
              <div class="v-cal">
                <div class="v-weekdays">
                  @for (w of ctx.weekDays; track $index) {
                    <span>{{ w }}</span>
                  }
                </div>
                <div class="v-grid">
                  @for (d of ctx.days; track $index) {
                    <button
                      type="button"
                      class="v-cell"
                      [class.is-sel]="ctx.selection.isSelected(d)"
                      [class.is-today]="isToday(d)"
                      [class.is-out]="!sameMonth(d, ctx.currentDate)"
                      [disabled]="ctx.validation.isDateDisabled(d)"
                      (click)="ctx.actions.selectDay(d)"
                    >
                      {{ faDigits(this.jalali.getDate(d)) }}
                    </button>
                  }
                </div>
              </div>
            </div>
          </ng-template>

          <ng-template qeydarTemplate="footer" let-ctx>
            <div class="v-footer">
              <span class="v-summary">{{ formatFull(pickedDate) }}</span>
              <div class="v-actions">
                <button type="button" class="v-btn" (click)="ctx.today()">امروز</button>
                <button type="button" class="v-btn v-btn--primary" (click)="ctx.confirm()">تأیید</button>
              </div>
            </div>
          </ng-template>
        </qeydar-date-picker>

        <output class="v-readout" aria-live="polite">
          <span>مقدار خروجی</span>
          <strong>{{ formatFull(pickedDate) }}</strong>
        </output>
      </div>

      <demo-code-viewer
        [htmlCode]="htmlCode"
        [tsCode]="tsCode"
        [scssCode]="scssCode"
        htmlFile="vertical-demo.component.html"
        tsFile="vertical-demo.component.ts"
        scssFile="vertical-demo.component.scss"
      ></demo-code-viewer>
    </div>
  `,
  styles: [
    `
      .vertical-demo-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 18px;
      }

      .vertical-demo-head h3 {
        margin: 7px 0 5px;
        font-size: 18px;
        letter-spacing: -0.03em;
        color: #172238;
      }

      .vertical-demo-head p {
        max-width: 560px;
        margin: 0;
        color: #6b7588;
        font-size: 12px;
        line-height: 1.65;
      }

      .vertical-preview {
        display: grid;
        justify-items: center;
        gap: 14px;
        margin-top: 18px;
        padding: 24px 16px;
        border-radius: 14px;
        background: radial-gradient(120% 140% at 50% 0%, #f0f4ff 0%, #f7f9fd 70%);
      }

      .vertical-picker {
        width: 100%;
        max-width: 460px;
      }

      /* ---------- Header ---------- */
      .v-head {
        display: grid;
        grid-template-columns: 32px 1fr 32px;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-bottom: 1px solid #eef1f7;
      }

      .v-nav {
        display: grid;
        width: 30px;
        height: 30px;
        place-items: center;
        border: 1px solid #e6eaf3;
        border-radius: 9px;
        background: #fff;
        color: #5b6b9d;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
        transition: background 140ms ease;
      }

      .v-nav:hover:not(:disabled) {
        background: #eef1ff;
      }

      .v-nav:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .v-title {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 8px;
      }

      .v-title strong {
        color: #25334c;
        font-size: 14px;
      }

      .v-title span {
        color: #8b95a7;
        font-size: 11px;
        font-weight: 700;
      }

      /* ---------- Two-column body ---------- */
      .v-body {
        display: grid;
        grid-template-columns: 1.15fr 1fr;
        align-items: start;
        gap: 14px;
        padding: 14px;
      }

      .v-list {
        display: grid;
        gap: 4px;
        max-height: 320px;
        overflow-y: auto;
        padding: 2px;
        scrollbar-width: thin;
        scrollbar-color: #d3daea transparent;
      }

      .v-item {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 10px;
        padding: 9px 12px;
        border: 1px solid transparent;
        border-radius: 11px;
        background: #fff;
        color: #3a4660;
        text-align: right;
        cursor: pointer;
        transition:
          background 140ms ease,
          border-color 140ms ease,
          transform 140ms ease;
      }

      .v-item:hover {
        border-color: #dbe3f5;
        background: #f6f8ff;
      }

      .v-item.is-sel {
        border-color: #aebdfa;
        background: linear-gradient(135deg, #eef2ff, #e3eaff);
        color: #344dc7;
      }

      .v-item.is-today .v-wd {
        color: #22a994;
      }

      .v-wd {
        color: #93a0b8;
        font-size: 10px;
        font-weight: 800;
        white-space: nowrap;
      }

      .v-item.is-sel .v-wd {
        color: #4d68e9;
      }

      .v-date {
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
      }

      /* ---------- Month calendar ---------- */
      .v-cal {
        padding: 8px 4px;
        border: 1px solid #edf0f6;
        border-radius: 12px;
        background: #fff;
      }

      .v-weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        margin-bottom: 4px;
        color: #9aa6bd;
        font-size: 9px;
        font-weight: 800;
        text-align: center;
      }

      .v-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 3px;
      }

      .v-cell {
        position: relative;
        display: grid;
        aspect-ratio: 1;
        place-items: center;
        border: 0;
        border-radius: 9px;
        background: transparent;
        color: #3a4660;
        font-size: 11px;
        cursor: pointer;
        transition: background 140ms ease, color 140ms ease;
      }

      .v-cell:hover:not(:disabled) {
        background: #eef1ff;
      }

      .v-cell.is-out {
        color: #c3ccdc;
      }

      .v-cell.is-sel {
        background: #4d68e9;
        color: #fff;
        box-shadow: 0 4px 10px rgba(77, 104, 233, 0.28);
      }

      .v-cell.is-today:not(.is-sel) {
        box-shadow: inset 0 0 0 2px #22a994;
      }

      .v-cell:disabled {
        color: #d3d9e4;
        cursor: default;
      }

      /* ---------- Footer ---------- */
      .v-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 12px 14px;
        border-top: 1px solid #eef1f7;
      }

      .v-summary {
        min-width: 0;
        overflow: hidden;
        color: #7c88a0;
        font-size: 11px;
        font-weight: 700;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .v-actions {
        display: flex;
        flex: 0 0 auto;
        gap: 8px;
      }

      .v-btn {
        padding: 8px 14px;
        border: 1px solid #e2e6ef;
        border-radius: 9px;
        background: #fff;
        color: #66708a;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }

      .v-btn--primary {
        border-color: transparent;
        background: linear-gradient(135deg, #5779f7, #3f61db);
        color: #fff;
        box-shadow: 0 5px 12px rgba(68, 104, 239, 0.22);
      }

      .v-readout {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        width: 100%;
        max-width: 460px;
        padding: 12px 14px;
        border-radius: 10px;
        background: #fff;
        color: #8b95a7;
        font-size: 10px;
        box-shadow: 0 8px 20px rgba(28, 43, 78, 0.06);
      }

      .v-readout strong {
        color: #34415b;
        font-size: 11px;
      }
    `,
  ],
})
export class VerticalDemoComponent {
  readonly jalali = inject(JalaliDateAdapter);

  pickedDate: Date = this.jalali.createDate(1405, 3, 24); // 24 تیر ۱۴۰۵

  monthDays: Date[] = [];
  private lastSelectedKey = '';

  /** Copies the body context so the month list can be derived in component code. */
  sync(ctx: BodyTemplateContext): string {
    const start = this.jalali.startOfMonth(ctx.currentDate);
    const count = this.jalali.getNumDaysInMonth(ctx.currentDate);
    this.monthDays = Array.from({ length: count }, (_, i) =>
      this.jalali.addDays(start, i),
    );
    this.scrollSelectedIntoView();
    return '';
  }

  private scrollSelectedIntoView(): void {
    const key = this.pickedDate
      ? this.jalali.format(this.pickedDate, 'yyyy-MM-dd')
      : '';
    if (key === this.lastSelectedKey) {
      return;
    }
    this.lastSelectedKey = key;
    requestAnimationFrame(() => {
      document.getElementById(this.itemId(this.pickedDate))?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    });
  }

  itemId(date: Date): string {
    return 'vd-' + this.jalali.format(date, 'yyyy-MM-dd');
  }

  weekdayOf(date: Date): string {
    return this.jalali.format(date, 'EEEE');
  }

  sameMonth(date: Date, base: Date): boolean {
    return this.jalali.isSameMonth(date, base);
  }

  isToday(date: Date): boolean {
    return this.jalali.isSameDay(date, this.jalali.today());
  }

  formatFull(date: Date | null): string {
    return date ? this.faDigits(this.jalali.format(date, 'EEEE d MMMM yyyy')) : '—';
  }

  faDigits(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
  }

  htmlCode = `<!-- body: a vertical date column + the month calendar, sharing one selection -->
<qeydar-date-picker
  class="vertical-picker"
  cssClass="vertical-popup"
  [rtl]="true"
  [calendarType]="'jalali'"
  [format]="'yyyy/MM/dd'"
  [valueFormat]="'date'"
  [showSidebar]="false"
  [isInline]="true"
  [(ngModel)]="pickedDate"
>
  <ng-template qeydarTemplate="header" let-ctx>
    <div class="v-head">
      <button type="button" class="v-nav" [disabled]="ctx.prevDisabled" (click)="ctx.prev()">‹</button>
      <div class="v-title"><strong>{{ ctx.currentMonthName }}</strong><span>{{ faDigits(ctx.currentYear) }}</span></div>
      <button type="button" class="v-nav" [disabled]="ctx.nextDisabled" (click)="ctx.next()">›</button>
    </div>
  </ng-template>

  <ng-template qeydarTemplate="body" let-ctx>
    {{ sync(ctx) }}
    <div class="v-body">
      <div class="v-list">
        @for (d of monthDays; track $index) {
          <button type="button" class="v-item" [class.is-sel]="ctx.selection.isSelected(d)" [class.is-today]="isToday(d)" (click)="ctx.actions.selectDay(d)">
            <span class="v-wd">{{ weekdayOf(d) }}</span>
            <span class="v-date">{{ faDigits(this.jalali.format(d, 'd MMMM yyyy')) }}</span>
          </button>
        }
      </div>

      <div class="v-cal">
        <div class="v-weekdays">
          @for (w of ctx.weekDays; track $index) { <span>{{ w }}</span> }
        </div>
        <div class="v-grid">
          @for (d of ctx.days; track $index) {
            <button type="button" class="v-cell"
              [class.is-sel]="ctx.selection.isSelected(d)"
              [class.is-today]="isToday(d)"
              [class.is-out]="!sameMonth(d, ctx.currentDate)"
              [disabled]="ctx.validation.isDateDisabled(d)"
              (click)="ctx.actions.selectDay(d)">
              {{ faDigits(this.jalali.getDate(d)) }}
            </button>
          }
        </div>
      </div>
    </div>
  </ng-template>

  <ng-template qeydarTemplate="footer" let-ctx>
    <div class="v-footer">
      <span class="v-summary">{{ formatFull(pickedDate) }}</span>
      <div class="v-actions">
        <button type="button" class="v-btn" (click)="ctx.today()">امروز</button>
        <button type="button" class="v-btn v-btn--primary" (click)="ctx.confirm()">تأیید</button>
      </div>
    </div>
  </ng-template>
</qeydar-date-picker>`;

  tsCode = `import { Component, inject } from '@angular/core';
import { JalaliDateAdapter, BodyTemplateContext } from '@qeydar/datepicker';

@Component({
  selector: 'app-vertical-demo',
  templateUrl: './vertical-demo.component.html',
})
export class VerticalDemoComponent {
  readonly jalali = inject(JalaliDateAdapter);

  pickedDate: Date = this.jalali.createDate(1405, 3, 24); // 24 تیر ۱۴۰۵
  monthDays: Date[] = [];

  sync(ctx: BodyTemplateContext): string {
    const start = this.jalali.startOfMonth(ctx.currentDate);
    const count = this.jalali.getNumDaysInMonth(ctx.currentDate);
    this.monthDays = Array.from({ length: count }, (_, i) => this.jalali.addDays(start, i));
    return '';
  }

  itemId(date: Date): string { return 'vd-' + this.jalali.format(date, 'yyyy-MM-dd'); }
  weekdayOf(date: Date): string { return this.jalali.format(date, 'EEEE'); }
  sameMonth(date: Date, base: Date): boolean { return this.jalali.isSameMonth(date, base); }
  isToday(date: Date): boolean { return this.jalali.isSameDay(date, this.jalali.today()); }

  formatFull(date: Date | null): string {
    return date ? this.faDigits(this.jalali.format(date, 'EEEE d MMMM yyyy')) : '—';
  }

  faDigits(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return String(value).replace(/\\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
  }
}`;

  scssCode = `// Popup chrome (global): .vertical-popup { max-width: 460px; }
// .vertical-popup .date-picker-content { display: block; max-height: none; }
// .vertical-popup .calendar { width: auto; max-width: none; padding: 0; }

.v-body {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  align-items: start;
  gap: 14px;
  padding: 14px;
}

.v-list {
  display: grid;
  gap: 4px;
  max-height: 320px;
  overflow-y: auto;
}

.v-item {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 1px solid transparent;
  border-radius: 11px;
  background: #fff;
  color: #3a4660;
  text-align: right;
  cursor: pointer;
}

.v-item.is-sel {
  border-color: #aebdfa;
  background: linear-gradient(135deg, #eef2ff, #e3eaff);
  color: #344dc7;
}

.v-cell {
  aspect-ratio: 1;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #3a4660;
  font-size: 11px;
  cursor: pointer;
}

.v-cell.is-sel {
  background: #4d68e9;
  color: #fff;
  box-shadow: 0 4px 10px rgba(77, 104, 233, 0.28);
}`;
}
