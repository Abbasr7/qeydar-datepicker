import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { CalendarType, DATE_ADAPTER, DatepickerMode, GregorianDateAdapter, JalaliDateAdapter, RangeInputLabels, TimeValueType, ValueFormat } from 'projects/qeydar-datepicker/src/public-api';

type DemoPart = 'datepicker' | 'timepicker' | 'hijri';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        width: '264px',
        opacity: 1,
      })),
      state('out', style({
        width: '0',
        opacity: 0,
      })),
      transition('in => out', [animate('220ms ease-in-out')]),
      transition('out => in', [animate('220ms ease-in-out')]),
    ])
  ],
})
export class AppComponent implements OnInit {
  Version = '1.2.4';
  isSidebarOpen = true;
  showPart: DemoPart = 'datepicker';

  selectedDate: any = '1403/02/11';
  selectedTime: any = new Date();

  rtl = true;
  calendarType: CalendarType = 'jalali';
  mode: DatepickerMode = 'day';
  isRange = false;
  format = 'yyyy/MM/dd HH:mm';
  footerDescription = '';
  inputLabel = '';
  rangeInputLabel: RangeInputLabels = { start: '', end: '' };
  disabled = false;
  showSidebar = false;
  valueFormat: ValueFormat = 'jalali';
  showToday = false;
  isInline = false;
  maxDate: Date | string;
  minDate: Date | string;
  showIcon = true;
  allowEmpty = true;
  timeValueType: TimeValueType = 'string';
  timeDisplayFormat = 'HH:mm:ss';
  maxTime: string;
  minTime: string;
  readOnly = false;
  readOnlyInput = false;

  dateCodeOpen = false;
  timeCodeOpen = false;
  demoCode = '';

  constructor(
    private jalali: JalaliDateAdapter,
    private gregorian: GregorianDateAdapter
  ) {}

  ngOnInit(): void {
    this.updateCode();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  selectPart(part: DemoPart): void {
    this.showPart = part;
    this.updateCode();
  }

  toggleDateCode(): void {
    this.dateCodeOpen = !this.dateCodeOpen;
    if (this.dateCodeOpen) {
      this.updateDateCode();
    }
  }

  toggleTimeCode(): void {
    this.timeCodeOpen = !this.timeCodeOpen;
    if (this.timeCodeOpen) {
      this.updateTimeCode();
    }
  }

  onChangeCalendarType(event: Event): void {
    this.calendarType = (event.target as HTMLSelectElement).value as CalendarType;
    this.updateCode();
  }

  onChangeMode(event: Event): void {
    this.mode = (event.target as HTMLSelectElement).value as DatepickerMode;
    this.updateCode();
  }

  updateCode(): void {
    if (this.showPart === 'timepicker') {
      this.updateTimeCode();
    } else {
      this.updateDateCode();
    }
  }

  updateDateCode(): void {
    this.demoCode = `<qeydar-date-picker
  [rtl]="rtl"
  [calendarType]="calendarType"
  [mode]="mode"
  [format]="format"
  [valueFormat]="valueFormat"
  [isRange]="isRange"
  [showToday]="showToday"
  [showSidebar]="showSidebar"
  [isInline]="isInline"
  [allowEmpty]="allowEmpty"
  [disabled]="disabled"
  [readOnly]="readOnly"
  [readOnlyInput]="readOnlyInput"
  [(ngModel)]="selectedDate"
></qeydar-date-picker>

selectedDate: {{ this.toCodeValue(this.selectedDate) }}

// Current settings
rtl = ${this.rtl};
calendarType: CalendarType = '${this.calendarType}';
mode: DatepickerMode = '${this.mode}';
format = '${this.escapeCode(this.format)}';
valueFormat: ValueFormat = '${this.valueFormat}';
isRange = ${this.isRange};
showToday = ${this.showToday};
showSidebar = ${this.showSidebar};
isInline = ${this.isInline};
allowEmpty = ${this.allowEmpty};
disabled = ${this.disabled};
readOnly = ${this.readOnly};
readOnlyInput = ${this.readOnlyInput};`;
  }

  updateTimeCode(): void {
    this.demoCode = `<qeydar-time-picker
  [rtl]="rtl"
  [showIcon]="showIcon"
  [displayFormat]="timeDisplayFormat"
  [valueType]="timeValueType"
  [minTime]="minTime"
  [maxTime]="maxTime"
  [inline]="isInline"
  [disabled]="disabled"
  [readOnly]="readOnly"
  [readOnlyInput]="readOnlyInput"
  [(ngModel)]="selectedTime"
></qeydar-time-picker>

selectedTime: {{ this.toCodeValue(this.selectedTime) }}

// Current settings
rtl = ${this.rtl};
showIcon = ${this.showIcon};
timeValueType: TimeValueType = '${this.timeValueType}';
timeDisplayFormat = '${this.escapeCode(this.timeDisplayFormat)}';
isInline = ${this.isInline};
disabled = ${this.disabled};
allowEmpty = ${this.allowEmpty};
readOnly = ${this.readOnly};
readOnlyInput = ${this.readOnlyInput};`;
  }

  private toCodeValue(value: any): string {
    if (value === undefined) {
      return 'undefined';
    }
    if (value instanceof Date) {
      return `new Date('${value.toISOString()}')`;
    }
    return JSON.stringify(value);
  }

  private escapeCode(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }

  onChange(event: any): void {
    console.log('event:', event);
  }

  onChangeHijri(event: any): void {
    console.log('Hijri event:', event);
  }
}
