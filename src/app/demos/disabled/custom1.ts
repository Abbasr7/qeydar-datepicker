import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
// import { BaseDatePickerComponent } from '../../projects/qeydar-datepicker/src/components/base-date-picker.component';
// import { DatePickerThemeService } from '../../projects/qeydar-datepicker/src/services/date-picker-theme.service';
// import { QeydarDatePickerService, DestroyService } from '../../projects/qeydar-datepicker/src/date-picker.service';
// import { JalaliDateAdapter, GregorianDateAdapter, DATE_ADAPTER } from '../../projects/qeydar-datepicker/src/date-adapter';
import { ChangeDetectorRef, ElementRef, Inject, Optional } from '@angular/core';
import {
  DestroyService,
  QeydarDatePickerService,
} from 'projects/qeydar-datepicker/src/date-picker.service';
import {
  BaseDatePickerComponent,
  DateAdapter,
} from 'projects/qeydar-datepicker/src/public-api';
import { DaysGridComponent } from 'projects/qeydar-datepicker/src/date-picker-popup/components/days-grid.component';
import { ValidationStrategyService } from 'projects/qeydar-datepicker/src/date-picker-popup/services/validation-strategy.service';
import { CalendarUtilsService } from 'projects/qeydar-datepicker/src/date-picker-popup/services/calendar-utils.service';
import { SelectionStrategyService } from 'projects/qeydar-datepicker/src/date-picker-popup/services/selection-strategy.service';

/**
 * مثال 1: Modern Card Style DatePicker
 * یک DatePicker مدرن با طراحی کارتی
 */
@Component({
  selector: 'app-modern-card-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DaysGridComponent],
  providers: [QeydarDatePickerService, DestroyService],
  template: `
    <div class="modern-card-picker">
      <div class="hero-panel">
        <div class="hero-badge">تقویم پیشرفته</div>
        <div class="hero-title">انتخابگر تاریخ با استایل اختصاصی</div>
        <div class="hero-subtitle">
          یک تجربه کاربری با طراحی نوآورانه و ابزارهای سریع برای انتخاب تاریخ
        </div>
      </div>

      <div class="picker-body">
        <div class="field-block">
          <label class="field-label">تاریخ هدف</label>
          <div class="field-control">
            <input
              type="text"
              [formControl]="dateInputControl"
              [placeholder]="getPlaceholder()"
              (click)="toggle()"
              class="date-input"
              [class.focused]="isOpen"
              readonly
            />
            <button
              type="button"
              class="toggle-btn"
              (click)="toggle()"
              [disabled]="disabled"
            >
              <span>📅</span>
            </button>
          </div>
          <div class="field-meta">
            <span>{{ selectedDate ? currentDateAdapter.format(selectedDate, 'EEEE, d MMMM yyyy') : 'برای انتخاب تاریخ کلیک کنید' }}</span>
            <span class="meta-pill">{{ isOpen ? 'باز است' : 'پنهان' }}</span>
          </div>
        </div>

        <div *ngIf="isOpen" class="picker-panel">
          <div class="calendar-shell">
            <div class="calendar-toolbar">
              <button class="nav-icon" (click)="previousMonth()" aria-label="ماه قبل">
                ‹
              </button>
              <div class="calendar-title">{{ currentMonthYear }}</div>
              <button class="nav-icon" (click)="nextMonth()" aria-label="ماه بعد">
                ›
              </button>
            </div>

            <div class="calendar-grid">
              <div class="weekday" *ngFor="let day of weekDays">{{ day }}</div>
              <qeydar-days-grid
                [days]="days"
                [weekDays]="weekDays"
                [currentDate]="calendarDate"
                [isSameMonth]="isSameMonth"
                [isSelected]="isSelected"
                [isInRange]="isInRange"
                [isRangeStart]="isRangeStart"
                [isRangeEnd]="isRangeEnd"
                [isToday]="isToday"
                [isDateDisabled]="isDateDisabledFn"
                [getDayNumber]="getDayNumber"
                (selectDay)="onDateSelected($event)"
                (mouseEnter)="onDateHovered($event)"
              ></qeydar-days-grid>
            </div>
          </div>

          <aside class="panel-insights">
            <div class="info-card">
              <div class="info-title">خلاصه تاریخ</div>
              <p>{{ selectedDate ? currentDateAdapter.format(selectedDate, 'EEEE') : 'یک تاریخ انتخاب نشده است' }}</p>
              <p class="info-value">{{ selectedDate ? currentDateAdapter.format(selectedDate, 'd MMMM yyyy') : '---' }}</p>
            </div>

            <div class="shortcut-card">
              <div class="shortcut-title">سریع‌تر انتخاب کن</div>
              <button class="shortcut-btn" (click)="selectToday()">امروز</button>
              <button class="shortcut-btn" (click)="selectTomorrow()">فردا</button>
              <button class="shortcut-btn" (click)="selectNextWeek()">هفته آینده</button>
            </div>

            <div class="actions-row">
              <button class="secondary-btn" (click)="clear()">پاک کردن</button>
              <button class="primary-btn" (click)="close()">تایید</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modern-card-picker {
        max-width: 760px;
        margin: 0 auto;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.1);
        background: linear-gradient(180deg, #ffffff 0%, #f7f9ff 100%);
        border: 1px solid rgba(31, 45, 61, 0.08);
      }

      .hero-panel {
        padding: 32px 32px 24px;
        background: linear-gradient(135deg, #4f46e5, #18b4d1);
        color: #ffffff;
      }

      .hero-badge {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
        font-size: 12px;
        letter-spacing: 0.05em;
        margin-bottom: 12px;
      }

      .hero-title {
        font-size: 28px;
        font-weight: 700;
        line-height: 1.1;
        margin-bottom: 10px;
      }

      .hero-subtitle {
        font-size: 14px;
        opacity: 0.9;
        max-width: 640px;
      }

      .picker-body {
        padding: 28px;
      }

      .field-block {
        display: grid;
        gap: 12px;
        margin-bottom: 24px;
      }

      .field-label {
        font-size: 14px;
        font-weight: 600;
        color: #334155;
      }

      .field-control {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
      }

      .date-input {
        width: 100%;
        padding: 16px 20px;
        border-radius: 16px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: #f8fbff;
        color: #0f172a;
        font-size: 16px;
      }

      .date-input.focused {
        border-color: #4f46e5;
        box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12);
      }

      .toggle-btn {
        background: #4f46e5;
        border: none;
        border-radius: 16px;
        color: white;
        min-width: 58px;
        cursor: pointer;
        transition: transform 0.2s ease, background 0.2s ease;
      }

      .toggle-btn:hover {
        transform: translateY(-1px);
        background: #4338ca;
      }

      .field-meta {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        color: #475569;
        font-size: 13px;
      }

      .meta-pill {
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(79, 70, 229, 0.08);
        color: #4338ca;
        white-space: nowrap;
      }

      .picker-panel {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 20px;
      }

      .calendar-shell {
        background: #ffffff;
        border-radius: 24px;
        padding: 22px;
        border: 1px solid rgba(148, 163, 184, 0.18);
      }

      .calendar-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
      }

      .nav-icon {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1px solid rgba(148, 163, 184, 0.24);
        background: #f8fbff;
        color: #334155;
        font-size: 22px;
        line-height: 1;
        cursor: pointer;
      }

      .calendar-title {
        font-size: 18px;
        font-weight: 700;
        color: #0f172a;
      }

      .calendar-grid {
        display: grid;
        gap: 12px;
      }

      .weekday {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        color: #64748b;
        text-align: center;
      }

      .panel-insights {
        display: grid;
        gap: 16px;
      }

      .info-card,
      .shortcut-card {
        background: #ffffff;
        border-radius: 24px;
        border: 1px solid rgba(148, 163, 184, 0.18);
        padding: 20px;
      }

      .info-title,
      .shortcut-title {
        font-size: 13px;
        font-weight: 600;
        color: #475569;
        margin-bottom: 12px;
      }

      .info-card p {
        margin: 6px 0;
        color: #0f172a;
      }

      .info-value {
        font-size: 18px;
        font-weight: 700;
        color: #4f46e5;
      }

      .shortcut-btn {
        width: 100%;
        padding: 14px 16px;
        border: 1px solid rgba(79, 70, 229, 0.2);
        border-radius: 16px;
        background: #f8fbff;
        color: #4f46e5;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
      }

      .shortcut-btn:hover {
        background: #eef2ff;
        transform: translateY(-1px);
      }

      .actions-row {
        display: grid;
        gap: 12px;
      }

      .secondary-btn,
      .primary-btn {
        width: 100%;
        padding: 14px 16px;
        border-radius: 16px;
        font-weight: 700;
        cursor: pointer;
      }

      .secondary-btn {
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: #f8fbff;
        color: #0f172a;
      }

      .primary-btn {
        border: none;
        background: #4f46e5;
        color: white;
      }

      .secondary-btn:hover {
        background: #eef2ff;
      }

      .primary-btn:hover {
        background: #4338ca;
      }

      @media (max-width: 900px) {
        .picker-panel {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ModernCardDatePicker extends BaseDatePickerComponent {
  currentMonthYear = '';
  calendarDate: Date;
  days: Date[] = [];
  weekDays: string[] = [];

  validationStrategyService: ValidationStrategyService = inject(
    ValidationStrategyService
  );
  calendarUtils: CalendarUtilsService = inject(CalendarUtilsService);
  selectionStrategy: SelectionStrategyService = inject(
    SelectionStrategyService
  );

  get dateInputControl(): FormControl {
    return this.form.get('dateInput') as FormControl;
  }

  get isSameMonth(): (d1: Date, d2: Date) => boolean {
    return (d1: Date, d2: Date) =>
      this.calendarUtils.isSameMonth(d1, d2, this.currentDateAdapter);
  }

  get isSelected(): (d: Date) => boolean {
    return (d: Date) =>
      this.selectionStrategy.isSelected(d, this.selectedDate, this.currentDateAdapter);
  }

  tempEndDate: Date;

  get isInRange(): (d: Date) => boolean {
    return (d: Date) =>
      this.selectionStrategy.isInRange(
        d,
        this.selectedStartDate,
        this.selectedEndDate,
        this.tempEndDate,
        this.currentDateAdapter
      );
  }

  get isRangeStart(): (d: Date) => boolean {
    return (d: Date) =>
      this.selectionStrategy.isRangeStart(d, this.selectedStartDate, this.currentDateAdapter);
  }

  get isRangeEnd(): (d: Date) => boolean {
    return (d: Date) =>
      this.selectionStrategy.isRangeEnd(d, this.selectedEndDate, this.currentDateAdapter);
  }

  get isToday(): (d: Date) => boolean {
    return (d: Date) =>
      this.calendarUtils.isToday(d, this.currentDateAdapter);
  }

  get isDateDisabledFn(): (d: Date) => boolean {
    return (d: Date) =>
      this.validationStrategyService.isDateDisabled(
        d,
        this.currentDateAdapter,
        this.minDate,
        this.maxDate,
        this.disabledDates,
        this.disabledDatesFilter,
        this.format
      );
  }

  get getDayNumber(): (d: Date) => number {
    return (d: Date) => this.currentDateAdapter.getDate(d);
  }

  get selectedDateLabel(): string {
    return this.selectedDate
      ? this.currentDateAdapter.format(this.selectedDate, 'EEEE, d MMMM yyyy')
      : 'هیچ تاریخی انتخاب نشده';
  }

  onDateHovered(date: Date): void {
    this.tempEndDate = this.selectionStrategy.handleMouseEnter(
      date,
      this.selectedStartDate,
      this.selectedEndDate
    );
  }

  protected setupUI(): void {
    this.calendarType = 'jalali';
    this.format = 'yyyy/MM/dd';
    this.setDateAdapter();
    this.calendarDate = this.currentDateAdapter.today();
    this.updateUI();
  }

  protected updateUI(): void {
    this.calendarDate = this.selectedDate || this.calendarDate || this.currentDateAdapter.today();
    this.currentMonthYear = this.currentDateAdapter.format(this.calendarDate, 'MMMM yyyy');
    this.days = this.calendarUtils.generateDaysGrid(this.calendarDate, this.currentDateAdapter);
    this.weekDays = this.calendarUtils.getWeekDays(this.currentDateAdapter);
    this.cdref.markForCheck();
  }

  override open(): void {
    this.calendarDate = this.selectedDate || this.currentDateAdapter.today();
    this.updateUI();
    super.open();
  }

  override onDateSelected(date: Date): void {
    super.onDateSelected(date);
    this.calendarDate = date || this.calendarDate;
    this.updateUI();
  }

  previousMonth(): void {
    this.calendarDate = this.calendarUtils.navigateToPrevMonth(
      this.calendarDate,
      this.currentDateAdapter
    );
    this.updateUI();
  }

  nextMonth(): void {
    this.calendarDate = this.calendarUtils.navigateToNextMonth(
      this.calendarDate,
      this.currentDateAdapter
    );
    this.updateUI();
  }

  selectToday(): void {
    const today = this.currentDateAdapter.today();
    this.onDateSelected(today);
  }

  selectTomorrow(): void {
    const tomorrow = this.currentDateAdapter.addDays(
      this.currentDateAdapter.today(),
      1
    );
    this.onDateSelected(tomorrow);
  }

  selectNextWeek(): void {
    const nextWeek = this.currentDateAdapter.addDays(
      this.currentDateAdapter.today(),
      7
    );
    this.onDateSelected(nextWeek);
  }

  clear(): void {
    this.resetValues();
    this.close();
  }
}

/**
 * مثال 2: Minimalist Clean DatePicker
 * یک DatePicker مینیمال و تمیز
 */
@Component({
  selector: 'app-minimalist-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [QeydarDatePickerService, DestroyService],
  template: `
    <div class="minimalist-picker">
      <div class="input-container">
        <input
          type="text"
          [formControl]="dateInputControl"
          [placeholder]="getPlaceholder()"
          (click)="toggle()"
          class="minimalist-input"
        />
        <div class="input-border"></div>
      </div>

      <div *ngIf="isOpen" class="minimalist-dropdown">
        <div class="dropdown-content">
          <div class="date-display" *ngIf="selectedDate">
            <div class="day">{{ getDayName() }}</div>
            <div class="date">{{ getFormattedDate() }}</div>
          </div>

          <div class="actions">
            <button class="minimal-btn" (click)="selectToday()">امروز</button>
            <button class="minimal-btn" (click)="selectYesterday()">
              دیروز
            </button>
            <button class="minimal-btn" (click)="selectTomorrow()">فردا</button>
          </div>

          <div class="footer">
            <button class="close-btn" (click)="close()">بستن</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .minimalist-picker {
        position: relative;
        max-width: 300px;
      }

      .input-container {
        position: relative;
      }

      .minimalist-input {
        width: 100%;
        padding: 16px 0;
        border: none;
        border-bottom: 2px solid var(--qeydar-border-color);
        background: transparent;
        font-size: 16px;
        color: var(--qeydar-text-color);
        transition: var(--qeydar-transition);
      }

      .minimalist-input:focus {
        outline: none;
        border-bottom-color: var(--qeydar-primary-color);
      }

      .minimalist-input::placeholder {
        color: var(--qeydar-text-color-secondary);
      }

      .input-border {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--qeydar-primary-color);
        transition: width 0.3s ease;
      }

      .minimalist-input:focus + .input-border {
        width: 100%;
      }

      .minimalist-dropdown {
        position: absolute;
        top: calc(100% + 16px);
        left: 0;
        right: 0;
        background: var(--qeydar-background-color);
        border: 1px solid var(--qeydar-border-color);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }

      .dropdown-content {
        padding: 24px;
      }

      .date-display {
        text-align: center;
        margin-bottom: 24px;
        padding: 20px;
        background: var(--qeydar-background-color-light);
        border-radius: 8px;
      }

      .day {
        font-size: 14px;
        color: var(--qeydar-text-color-secondary);
        margin-bottom: 4px;
      }

      .date {
        font-size: 24px;
        font-weight: 600;
        color: var(--qeydar-primary-color);
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 24px;
      }

      .minimal-btn {
        padding: 12px 16px;
        background: transparent;
        border: 1px solid var(--qeydar-border-color);
        border-radius: 6px;
        color: var(--qeydar-text-color);
        cursor: pointer;
        transition: var(--qeydar-transition-fast);
        text-align: left;
      }

      .minimal-btn:hover {
        background: var(--qeydar-primary-color);
        color: white;
        border-color: var(--qeydar-primary-color);
      }

      .footer {
        border-top: 1px solid var(--qeydar-border-color);
        padding-top: 16px;
        text-align: center;
      }

      .close-btn {
        background: none;
        border: none;
        color: var(--qeydar-text-color-secondary);
        cursor: pointer;
        font-size: 14px;
        transition: var(--qeydar-transition-fast);
      }

      .close-btn:hover {
        color: var(--qeydar-primary-color);
      }
    `,
  ],
})
export class MinimalistDatePicker extends BaseDatePickerComponent {
  protected setupUI(): void {
    this.calendarType = 'jalali';
    this.format = 'yyyy/MM/dd';
    this.setDateAdapter();
  }

  protected updateUI(): void {
    this.cdref.markForCheck();
  }

  get dateInputControl(): FormControl {
    return this.form.get('dateInput') as FormControl;
  }

  getDayName(): string {
    if (!this.selectedDate) return '';
    const dayNames = [
      'یکشنبه',
      'دوشنبه',
      'سه‌شنبه',
      'چهارشنبه',
      'پنج‌شنبه',
      'جمعه',
      'شنبه',
    ];
    const dayIndex = this.currentDateAdapter.getDayOfWeek(this.selectedDate);
    return dayNames[dayIndex];
  }

  getFormattedDate(): string {
    if (!this.selectedDate) return '';
    return this.currentDateAdapter.format(this.selectedDate, 'd MMMM yyyy');
  }

  selectToday(): void {
    const today = this.currentDateAdapter.today();
    this.onDateSelected(today);
  }

  selectYesterday(): void {
    const yesterday = this.currentDateAdapter.addDays(
      this.currentDateAdapter.today(),
      -1
    );
    this.onDateSelected(yesterday);
  }

  selectTomorrow(): void {
    const tomorrow = this.currentDateAdapter.addDays(
      this.currentDateAdapter.today(),
      1
    );
    this.onDateSelected(tomorrow);
  }
}
