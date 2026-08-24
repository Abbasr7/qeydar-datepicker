import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  CalendarType,
  DatepickerMode,
  GregorianDateAdapter,
  JalaliDateAdapter,
  lang_En,
  lang_Fa,
  Lang_Locale,
  PickerModalOptions,
  PickerPresentation,
  RangeInputLabels,
  TimeValueType,
  ValueFormat,
} from 'projects/qeydar-datepicker/src/public-api';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuickDemoComponent } from './demos/quick-demo.component';
import { HeroDemoComponent } from './demos/hero-demo.component';
import { WheelDemoComponent } from './demos/wheel-demo.component';
import { HijriDemoComponent } from './demos/hijri-demo.component';
import { DisabledDates } from './demos/disabled/diabled-date';
import { DisabledTimes } from './demos/disabled/diabled-time';
import { CustomRender } from './demos/custom-render';
import { MaterialRender } from './demos/material-render';
import { DemoCodeViewerComponent } from './demos/code-viewer.component';

type DemoPart = 'datepicker' | 'timepicker' | 'hijri';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    JsonPipe,
    FormsModule,
    QeydarDatePickerModule,
    QuickDemoComponent,
    HeroDemoComponent,
    WheelDemoComponent,
    HijriDemoComponent,
    DisabledDates,
    DisabledTimes,
    CustomRender,
    MaterialRender,
    DemoCodeViewerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          width: '264px',
          opacity: 1,
        }),
      ),
      state(
        'out',
        style({
          width: '0',
          opacity: 0,
        }),
      ),
      transition('in => out', [animate('220ms ease-in-out')]),
      transition('out => in', [animate('220ms ease-in-out')]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  Version = '1.3.2';
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
  presentation: PickerPresentation = 'popover';
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

  demoHtmlCode = '';
  demoTsCode = '';
  pgLang = 'fa';
  lang_Locale: Lang_Locale = new lang_Fa();
  modalOptions: PickerModalOptions = {
    mobileSheet: true
  }

  constructor(
    private jalali: JalaliDateAdapter,
    private gregorian: GregorianDateAdapter,
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

  onChangeCalendarType(event: Event): void {
    this.calendarType = (event.target as HTMLSelectElement)
      .value as CalendarType;
    this.updateCode();
  }

  onChangeMode(event: Event): void {
    this.mode = (event.target as HTMLSelectElement).value as DatepickerMode;
    this.updateCode();
  }

  changeLangLocale(lang: 'fa' | 'en') {
    if (lang == 'fa') {
      this.lang_Locale = new lang_Fa();
    } else {
      this.lang_Locale = new lang_En();
    }
  }

  updateCode(): void {
    if (this.showPart === 'timepicker') {
      this.updateTimeCode();
    } else {
      this.updateDateCode();
    }
  }

  updateDateCode(): void {
    this.demoHtmlCode = `<qeydar-date-picker
  [rtl]="rtl"
  [calendarType]="calendarType"
  [mode]="mode"
  [format]="format"
  [valueFormat]="valueFormat"
  [isRange]="isRange"
  [showToday]="showToday"
  [showSidebar]="showSidebar"
  [isInline]="isInline"
  [presentation]="presentation"
  [allowEmpty]="allowEmpty"
  [disabled]="disabled"
  [readOnly]="readOnly"
  [readOnlyInput]="readOnlyInput"
  [presentation]="presentation"
  [lang]="lang_Locale"
  [(ngModel)]="selectedDate"
></qeydar-date-picker>`;

    this.demoTsCode = `import { Component } from '@angular/core';
import { CalendarType, DatepickerMode, lang_En, lang_Fa, Lang_Locale, PickerPresentation, ValueFormat } from '@qeydar/datepicker';

@Component({
  selector: 'app-date-example',
  templateUrl: './date-example.component.html',
})
export class DateExampleComponent {
  selectedDate = ${this.toCodeValue(this.selectedDate)};

  rtl = ${this.rtl};
  calendarType: CalendarType = '${this.calendarType}';
  mode: DatepickerMode = '${this.mode}';
  format = '${this.escapeCode(this.format)}';
  valueFormat: ValueFormat = '${this.valueFormat}';
  isRange = ${this.isRange};
  showToday = ${this.showToday};
  showSidebar = ${this.showSidebar};
  isInline = ${this.isInline};
  presentation: PickerPresentation = '${this.presentation}';
  allowEmpty = ${this.allowEmpty};
  disabled = ${this.disabled};
  readOnly = ${this.readOnly};
  readOnlyInput = ${this.readOnlyInput};
  presentation: PickerPresentation = ${this.presentation};
  lang_Locale: Lang_Locale = ${this.pgLang === 'fa' ? 'new lang_Fa()' : 'new lang_En()'};
}`;
  }

  updateTimeCode(): void {
    this.demoHtmlCode = `<qeydar-time-picker
  [rtl]="rtl"
  [showIcon]="showIcon"
  [displayFormat]="timeDisplayFormat"
  [valueType]="timeValueType"
  [minTime]="minTime"
  [maxTime]="maxTime"
  [inline]="isInline"
  [presentation]="presentation"
  [disabled]="disabled"
  [readOnly]="readOnly"
  [readOnlyInput]="readOnlyInput"
  [(ngModel)]="selectedTime"
></qeydar-time-picker>`;

    this.demoTsCode = `import { Component } from '@angular/core';
import { PickerPresentation, TimeValueType } from '@qeydar/datepicker';

@Component({
  selector: 'app-time-example',
  templateUrl: './time-example.component.html',
})
export class TimeExampleComponent {
  selectedTime = ${this.toCodeValue(this.selectedTime)};

  rtl = ${this.rtl};
  showIcon = ${this.showIcon};
  timeValueType: TimeValueType = '${this.timeValueType}';
  timeDisplayFormat = '${this.escapeCode(this.timeDisplayFormat)}';
  minTime = ${this.toCodeValue(this.minTime)};
  maxTime = ${this.toCodeValue(this.maxTime)};
  isInline = ${this.isInline};
  presentation: PickerPresentation = '${this.presentation}';
  disabled = ${this.disabled};
  readOnly = ${this.readOnly};
  readOnlyInput = ${this.readOnlyInput};
}`;
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
