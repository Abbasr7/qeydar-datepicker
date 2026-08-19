import { Component } from '@angular/core';
import { JalaliDateAdapter } from 'projects/qeydar-datepicker/src/date-adapter';

@Component({
  selector: 'disabled-dates',
  template: `
    <div class="disabled-date-demo">
      <div class="disabled-demo-grid">
        <article class="disabled-demo-item">
          <div class="demo-item-heading"><span>01</span><h3>Specific dates</h3></div>
          <p>Disable a list of dates and weekends in Gregorian mode.</p>
          <qeydar-date-picker [(ngModel)]="selectedDate" [disabledDates]="disabledDates" [disabledDatesFilter]="disabledDatesFilter"></qeydar-date-picker>
        </article>
        <article class="disabled-demo-item" dir="rtl">
          <div class="demo-item-heading"><span>02</span><h3>Jalali rules</h3></div>
          <p>Use the adapter to disable Jalali years and months.</p>
          <qeydar-date-picker [rtl]="true" [calendarType]="'jalali'" [disabledDates]="disabledDatesJalali" [disabledDatesFilter]="disabledDatesFilterJalali" [(ngModel)]="selectedDate"></qeydar-date-picker>
        </article>
        <article class="disabled-demo-item">
          <div class="demo-item-heading"><span>03</span><h3>Disabled months</h3></div>
          <p>Apply a filter to an entire month selection view.</p>
          <qeydar-date-picker [(ngModel)]="selectedDate" [mode]="'month'" [disabledDatesFilter]="disabledDatesFilterMonth"></qeydar-date-picker>
        </article>
        <article class="disabled-demo-item">
          <div class="demo-item-heading"><span>04</span><h3>Disabled years</h3></div>
          <p>Keep unavailable years out of the year picker.</p>
          <qeydar-date-picker [(ngModel)]="selectedDate" [mode]="'year'" [disabledDatesFilter]="disabledDatesFilterYear"></qeydar-date-picker>
        </article>
        <article class="disabled-demo-item disabled-demo-item--wide">
          <div class="demo-item-heading"><span>05</span><h3>Date and time together</h3></div>
          <p>Combine date and time filters for a working-hours schedule.</p>
          <qeydar-date-picker [format]="'yyyy/MM/dd HH:mm'" [disabledDatesFilter]="disabledDatesFilterCombined" [disabledTimesFilter]="disabledTimesFilter" [(ngModel)]="selectedDate"></qeydar-date-picker>
        </article>
      </div>
      <demo-code-viewer
        [htmlCode]="htmlCode"
        [tsCode]="tsCode"
        htmlFile="disabled-dates.component.html"
        tsFile="disabled-dates.component.ts"
      ></demo-code-viewer>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .disabled-date-demo { color: #172238; }
    .disabled-demo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
    .disabled-demo-item { min-width: 0; padding: 15px; border: 1px solid #e3e8f1; border-radius: 14px; background: #fff; }
    .disabled-demo-item--wide { grid-column: span 2; }
    .demo-item-heading { display: flex; align-items: center; gap: 9px; }
    .demo-item-heading span { color: #4d68e9; font-size: 10px; font-weight: 800; }
    h3 { margin: 0; font-size: 13px; letter-spacing: -.02em; }
    p { min-height: 35px; margin: 7px 0 14px; color: #6b7588; font-size: 11px; line-height: 1.55; }
    qeydar-date-picker { display: block; }
    @media (max-width: 680px) { .disabled-demo-grid { grid-template-columns: 1fr; } .disabled-demo-item--wide { grid-column: span 1; } p { min-height: 0; } }
  `]
})
export class DisabledDates {
  selectedDate: Date | string = new Date();

  disabledDates = [new Date(), '2024/12/05', '2024/12/07'];
  disabledDatesFilter = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
  disabledDatesJalali = ['1403/09/01', '1403/09/15', '1403/10/01', new Date(2024, 8, 15), new Date(2024, 11, 25), new Date()];
  disabledDatesFilterJalali = (date: Date) => this.jalali.getYear(date) === 1407 || this.jalali.getMonth(date) === 0 || this.jalali.getMonth(date) === 1;
  disabledDatesFilterMonth = (date: Date) => date.getMonth() % 2 === 0;
  disabledDatesFilterYear = (date: Date) => {
    const yearRange: number[] = [];
    for (let i = 1; i <= 20; i++) yearRange.push(1996 + i);
    return yearRange.includes(date.getFullYear()) || [2019, 2021, 2026, 2027, 2030].includes(date.getFullYear());
  };
  disabledDatesFilterCombined = (date: Date) => date.getDay() === 5;
  disabledTimesFilter = (date: Date) => {
    const hour = date.getHours();
    const weekDay = date.getDay();
    if (weekDay === 0 || weekDay === 6) return true;
    return hour < 9 || hour >= 17;
  };

  constructor(private jalali: JalaliDateAdapter) {}

  htmlCode = `<!-- 01 · Specific dates + weekend filter -->
<qeydar-date-picker
  [(ngModel)]="selectedDate"
  [disabledDates]="disabledDates"
  [disabledDatesFilter]="disabledDatesFilter"
></qeydar-date-picker>

<!-- 02 · Jalali adapter rules -->
<qeydar-date-picker
  [rtl]="true"
  [calendarType]="'jalali'"
  [disabledDates]="disabledDatesJalali"
  [disabledDatesFilter]="disabledDatesFilterJalali"
  [(ngModel)]="selectedDate"
></qeydar-date-picker>

<!-- 03 · Month view filter -->
<qeydar-date-picker
  [(ngModel)]="selectedDate"
  [mode]="'month'"
  [disabledDatesFilter]="disabledDatesFilterMonth"
></qeydar-date-picker>

<!-- 04 · Year view filter -->
<qeydar-date-picker
  [(ngModel)]="selectedDate"
  [mode]="'year'"
  [disabledDatesFilter]="disabledDatesFilterYear"
></qeydar-date-picker>

<!-- 05 · Combined date + time rules -->
<qeydar-date-picker
  [format]="'yyyy/MM/dd HH:mm'"
  [disabledDatesFilter]="disabledDatesFilterCombined"
  [disabledTimesFilter]="disabledTimesFilter"
  [(ngModel)]="selectedDate"
></qeydar-date-picker>`;

  tsCode = `import { Component } from '@angular/core';
import { JalaliDateAdapter } from '@qeydar/datepicker';

@Component({
  selector: 'app-disabled-dates',
  templateUrl: './disabled-dates.component.html',
})
export class DisabledDatesComponent {
  selectedDate: Date | string = new Date();

  disabledDates = [new Date(), '2024/12/05', '2024/12/07'];

  disabledDatesFilter = (date: Date) =>
    date.getDay() === 0 || date.getDay() === 6;

  disabledDatesJalali = [
    '1403/09/01',
    '1403/09/15',
    '1403/10/01',
    new Date(2024, 8, 15),
    new Date(2024, 11, 25),
    new Date()
  ];

  disabledDatesFilterJalali = (date: Date) =>
    this.jalali.getYear(date) === 1407 ||
    this.jalali.getMonth(date) === 0 ||
    this.jalali.getMonth(date) === 1;

  disabledDatesFilterMonth = (date: Date) => date.getMonth() % 2 === 0;

  disabledDatesFilterYear = (date: Date) => {
    const yearRange: number[] = [];
    for (let i = 1; i <= 20; i++) yearRange.push(1996 + i);
    return yearRange.includes(date.getFullYear()) ||
      [2019, 2021, 2026, 2027, 2030].includes(date.getFullYear());
  };

  disabledDatesFilterCombined = (date: Date) => date.getDay() === 5;

  disabledTimesFilter = (date: Date) => {
    const hour = date.getHours();
    const weekDay = date.getDay();
    if (weekDay === 0 || weekDay === 6) return true;
    return hour < 9 || hour >= 17;
  };

  constructor(private jalali: JalaliDateAdapter) {}
}`;
}
