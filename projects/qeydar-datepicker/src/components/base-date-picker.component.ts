import { Directive, ElementRef, Inject, Input, OnDestroy, OnInit, Optional, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DateAdapter, DATE_ADAPTER, JalaliDateAdapter, GregorianDateAdapter } from '../date-adapter';
import { CalendarType, DatepickerMode, Placement, RangePartType, ValueFormat } from '../utils/types';
import { CustomLabels, DateRange, Lang_Locale, RangeInputLabels } from '../utils/models';
import { QeydarDatePickerService, DestroyService } from '../date-picker.service';
import { DatePickerThemeService } from '../services/date-picker-theme.service';

/**
 * Base configuration interface for DatePicker
 */
export interface BaseDatePickerConfig {
  rtl?: boolean;
  mode?: DatepickerMode;
  isRange?: boolean;
  calendarType?: CalendarType;
  format?: string;
  placement?: Placement;
  disabled?: boolean;
  readOnly?: boolean;
  showTimePicker?: boolean;
  showSidebar?: boolean;
  showToday?: boolean;
  allowEmpty?: boolean;
  minDate?: Date | string | null;
  maxDate?: Date | string | null;
}

/**
 * Base DatePicker Component
 * Provides common functionality for all DatePicker variants
 */
@Directive()
export abstract class BaseDatePickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
  // ========== Input Properties ==========
  @Input() rtl = false;
  @Input() mode: DatepickerMode = 'day';
  @Input() isRange = false;
  @Input() customLabels: Array<CustomLabels>;
  @Input() calendarType: CalendarType = 'gregorian';
  @Input() lang: Lang_Locale;
  @Input() cssClass = '';
  @Input() footerDescription = '';
  @Input() rangeInputLabels: RangeInputLabels;
  @Input() inputLabel: string;
  @Input() placement: Placement = 'bottomRight';
  @Input() disabled = false;
  @Input() isInline = false;
  @Input() showSidebar = true;
  @Input() showToday = false;
  @Input() valueFormat: ValueFormat = 'gregorian';
  @Input() disableInputMask = false;
  @Input() disabledDates: Array<Date | string> = [];
  @Input() disabledDatesFilter: (date: Date) => boolean;
  @Input() disabledTimesFilter: (date: Date) => boolean;
  @Input() allowEmpty = false;
  @Input() readOnly = false;
  @Input() readOnlyInput = false;
  @Input() dateAdapter: DateAdapter<Date> | null = null;

  @Input() set minDate(date: Date | string | null) {
    if (date) {
      this._minDate = date;
    }
  }
  get minDate(): Date {
    return this._minDate;
  }

  @Input() set maxDate(date: Date | string | null) {
    if (date) {
      this._maxDate = date;
    }
  }
  get maxDate(): Date {
    return this._maxDate;
  }

  @Input() set format(value: string) {
    this._format = value;
    this.showTimePicker = this.hasTimeComponent(value);
    this.timeDisplayFormat = this.extractTimeFormat(value);
  }
  get format(): string {
    return this._format;
  }

  // ========== Output Properties ==========
  @Output() onFocus = new EventEmitter<any>();
  @Output() onBlur = new EventEmitter<any>();
  @Output() onChangeValue = new EventEmitter<any>();
  @Output() onOpenChange = new EventEmitter<boolean>();

  // ========== Protected Properties ==========
  protected destroy$ = new Subject<void>();
  protected _minDate: any;
  protected _maxDate: any;
  protected _format = 'yyyy/MM/dd';
  protected isInternalChange = false;
  protected lastEmittedValue: any = null;

  // ========== Public Properties ==========
  public isOpen = false;
  public selectedDate: Date | null = null;
  public selectedStartDate: Date | null = null;
  public selectedEndDate: Date | null = null;
  public form: FormGroup;
  public currentDateAdapter: DateAdapter<Date>;
  public activeInput: RangePartType = '';
  public showTimePicker = false;
  public timeDisplayFormat = 'HH:mm';

  // ========== ControlValueAccessor ==========
  public onChange: any = () => {};
  public onTouch: any = () => {};

  constructor(
    protected fb: FormBuilder,
    protected elementRef: ElementRef,
    protected cdref: ChangeDetectorRef,
    protected dpService: QeydarDatePickerService,
    protected themeService: DatePickerThemeService,
    protected jalali: JalaliDateAdapter,
    protected gregorian: GregorianDateAdapter,
    @Optional() @Inject(DATE_ADAPTER) protected injectedDateAdapter: DateAdapter<Date>
  ) {
    this.initializeForm();
  }

  // ========== Lifecycle Hooks ==========
  ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ========== Abstract Methods (must be implemented by derived classes) ==========
  protected abstract setupUI(): void;
  protected abstract updateUI(): void;

  // ========== Initialization Methods ==========
  protected initializeForm(): void {
    this.form = this.fb.group({
      dateInput: [''],
      startDateInput: [''],
      endDateInput: ['']
    });
  }

  protected initialize(): void {
    this.setDateAdapter();
    this.setupFormControls();
    this.setupUI();
    this.initializeLanguage();
  }

  protected initializeLanguage(): void {
    this.lang = this.calendarType === 'jalali' 
      ? this.dpService.locale_fa 
      : this.dpService.locale_en;
    this.dpService.locale = this.lang;
  }

  // ========== Date Adapter Methods ==========
  protected setDateAdapter(): void {
    // Priority 1: Custom dateAdapter from @Input
    if (this.dateAdapter) {
      this.currentDateAdapter = this.dateAdapter;
      return;
    }

    // Priority 2: Injected dateAdapter from provider
    if (this.injectedDateAdapter) {
      this.currentDateAdapter = this.injectedDateAdapter;
      return;
    }

    // Priority 3: Based on calendarType
    this.currentDateAdapter = this.calendarType === 'jalali' 
      ? this.jalali 
      : this.gregorian;
  }

  protected get valueAdapter(): DateAdapter<Date> {
    return this.valueFormat === 'jalali' ? this.jalali : this.gregorian;
  }

  // ========== Form Control Methods ==========
  protected setupFormControls(): void {
    if (this.isRange) {
      this.form.get('startDateInput')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => this.onInputChange(value, 'start'));
      
      this.form.get('endDateInput')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => this.onInputChange(value, 'end'));
    } else {
      this.form.get('dateInput')?.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(value => this.onInputChange(value));
    }
  }

  // ========== Input Handling Methods ==========
  protected onInputChange(value: string, inputType?: RangePartType): void {
    if (this.isInternalChange) return;

    if (this.isRange) {
      this.handleRangeInputChange(value, inputType);
    } else {
      this.handleSingleInputChange(value);
    }
    this.updateUI();
  }

  protected handleRangeInputChange(value: string, inputType?: RangePartType): void {
    const date = this.currentDateAdapter.parse(value, this.format);
    if (date) {
      if (inputType === 'start') {
        this.selectedStartDate = this.clampDate(date);
      } else if (inputType === 'end') {
        this.selectedEndDate = this.clampDate(date);
      }
      this.emitValueIfChanged();
    }
  }

  protected handleSingleInputChange(value: string): void {
    const date = this.currentDateAdapter.parse(value, this.format);
    if (date) {
      this.selectedDate = this.clampDate(date);
      this.emitValueIfChanged();
    }
  }

  // ========== Value Emission Methods ==========
  protected emitValueIfChanged(): void {
    const newValue = this.prepareValueForEmission();
    if (newValue && JSON.stringify(newValue) !== JSON.stringify(this.lastEmittedValue)) {
      this.lastEmittedValue = newValue;
      this.onChange(newValue);
      this.onChangeValue.emit(newValue);
    }
  }

  protected prepareValueForEmission(): any {
    if (this.isRange) {
      if (this.selectedStartDate && this.selectedEndDate) {
        return {
          start: this.convertDateToFormat(this.selectedStartDate),
          end: this.convertDateToFormat(this.selectedEndDate)
        };
      }
    } else if (this.selectedDate) {
      return this.convertDateToFormat(this.selectedDate);
    }
    return null;
  }

  protected convertDateToFormat(date: Date): any {
    if (!date) return null;

    switch (this.valueFormat) {
      case 'date':
        return date;
      case 'jalali':
        return this.jalali.format(date, this.format);
      case 'gregorian':
        return this.gregorian.format(date, this.format);
      default:
        return this.currentDateAdapter.format(date, this.format);
    }
  }

  // ========== Date Selection Methods ==========
  public onDateSelected(date: Date): void {
    const clampedDate = this.clampDate(date);
    if (this.isRange) {
      this.handleRangeDateSelection(clampedDate);
    } else {
      this.handleSingleDateSelection(clampedDate);
    }
    this.updateUI();
  }

  protected handleRangeDateSelection(date: Date): void {
    if (!this.selectedStartDate || 
        (this.selectedStartDate && this.selectedEndDate) ||
        this.currentDateAdapter.isBefore(date, this.selectedStartDate)) {
      this.selectedStartDate = date;
      this.selectedEndDate = null;
      this.updateFormValue('startDateInput', date);
      this.updateFormValue('endDateInput', null);
    } else {
      this.selectedEndDate = date;
      this.updateFormValue('endDateInput', date);
      this.emitValueIfChanged();
      this.close();
    }
  }

  protected handleSingleDateSelection(date: Date): void {
    this.selectedDate = date;
    if (date) {
      this.updateFormValue('dateInput', date);
      this.emitValueIfChanged();
    }
    this.close();
  }

  public onDateRangeSelected(dateRange: DateRange): void {
    this.selectedStartDate = this.clampDate(<Date>dateRange.start);
    this.updateFormValue('startDateInput', this.selectedStartDate);

    if (dateRange.end) {
      this.selectedEndDate = this.clampDate(<Date>dateRange.end);
      this.updateFormValue('endDateInput', this.selectedEndDate);
      this.emitValueIfChanged();
      if (!this.hasTimeComponent(this.format)) {
        this.close();
      }
    }
    this.updateUI();
  }

  protected updateFormValue(controlName: string, date: Date | null): void {
    this.isInternalChange = true;
    const value = date ? this.currentDateAdapter.format(date, this.format) : '';
    this.form.get(controlName)?.setValue(value, { emitEvent: false });
    this.isInternalChange = false;
  }

  // ========== Date Validation Methods ==========
  protected clampDate(date: Date): Date {
    if (!date) return date;

    let adjustedDate = this.currentDateAdapter.clone(date);

    if (this.minDate && this.currentDateAdapter.isBefore(adjustedDate, this.minDate)) {
      return this.minDate;
    }
    if (this.maxDate && this.currentDateAdapter.isAfter(adjustedDate, this.maxDate)) {
      return this.maxDate;
    }

    if (this.isDateDisabled(adjustedDate)) {
      adjustedDate = this.findNearestValidDate(adjustedDate);
    }

    adjustedDate = this.clampDateTime(adjustedDate, date);

    return adjustedDate;
  }

  protected clampDateTime(adjustedDate: Date, date: Date): Date {
    if (this.hasTimeComponent(this.format)) {
      adjustedDate.setHours(date.getHours());
      adjustedDate.setMinutes(date.getMinutes());
      adjustedDate.setSeconds(date.getSeconds());
      const { normalizedDate } = this.validateAndNormalizeTime(adjustedDate);
      adjustedDate = normalizedDate;
    }
    return adjustedDate;
  }

  protected findNearestValidDate(date: Date): Date {
    let nextDate = this.currentDateAdapter.addDays(date, 1);
    let prevDate = this.currentDateAdapter.addDays(date, -1);

    while (this.isDateDisabled(nextDate) && this.isDateDisabled(prevDate)) {
      nextDate = this.currentDateAdapter.addDays(nextDate, 1);
      prevDate = this.currentDateAdapter.addDays(prevDate, -1);
    }

    if (!this.isDateDisabled(nextDate)) {
      return nextDate;
    } else if (!this.isDateDisabled(prevDate)) {
      return prevDate;
    }
    return date;
  }

  protected validateAndNormalizeTime(date: Date): { isValid: boolean; normalizedDate: Date | null } {
    if (!this.currentDateAdapter) {
      return { isValid: false, normalizedDate: null };
    }

    let isValid = true;
    let normalizedDate = this.currentDateAdapter.clone(date);

    if (this.isTimeDisabled(normalizedDate)) {
      isValid = false;
      const startOfDay = this.currentDateAdapter.clone(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = this.currentDateAdapter.clone(date);
      endOfDay.setHours(23, 59, 59, 999);

      const currentMinutes = date.getHours() * 60 + date.getMinutes();
      const maxForwardMinutes = (24 * 60) - currentMinutes;

      // Check forward
      for (let i = 1; i <= maxForwardMinutes; i++) {
        const nextTime = this.currentDateAdapter.clone(date);
        nextTime.setHours(Math.floor((currentMinutes + i) / 60), (currentMinutes + i) % 60, 0);
        if (nextTime.getTime() <= endOfDay.getTime() && !this.isTimeDisabled(nextTime)) {
          normalizedDate = nextTime;
          break;
        }
      }

      // Check backward if not found
      if (this.isTimeDisabled(normalizedDate)) {
        for (let i = 1; i < currentMinutes; i++) {
          const prevTime = this.currentDateAdapter.clone(date);
          prevTime.setHours(Math.floor((currentMinutes - i) / 60), (currentMinutes - i) % 60, 0);
          if (prevTime.getTime() >= startOfDay.getTime() && !this.isTimeDisabled(prevTime)) {
            normalizedDate = prevTime;
            break;
          }
        }
      }

      if (this.isTimeDisabled(normalizedDate)) {
        normalizedDate = startOfDay;
      }
    }

    return { isValid, normalizedDate };
  }

  protected parseDisabledDates(): Date[] {
    return this.disabledDates.map(date => {
      if (date instanceof Date) {
        return this.currentDateAdapter.startOfDay(date);
      }
      const parsedDate = this.currentDateAdapter.parse(date, this.extractDateFormat(this.format));
      return parsedDate || null;
    }).filter(date => date !== null) as Date[];
  }

  protected isDateDisabled(date: Date): boolean {
    if (!date) return false;

    const dateToCheck = this.currentDateAdapter.startOfDay(date);
    const parsedDisabledDates = this.parseDisabledDates();
    const isDisabledDate = parsedDisabledDates.some(disabledDate =>
      this.currentDateAdapter.isSameDay(dateToCheck, disabledDate)
    );

    const isFilterDisabled = this.disabledDatesFilter
      ? this.disabledDatesFilter(dateToCheck)
      : false;

    return isDisabledDate || isFilterDisabled;
  }

  protected isTimeDisabled(date: Date): boolean {
    return this.disabledTimesFilter ? this.disabledTimesFilter(date) : false;
  }

  // ========== UI State Methods ==========
  public open(): void {
    if (this.isInline || this.isOpen || this.disabled || this.readOnly) {
      return;
    }
    this.isOpen = true;
    this.onOpenChange.emit(true);
    this.cdref.markForCheck();
  }

  public close(): void {
    if (this.isInline || !this.isOpen) {
      return;
    }
    this.isOpen = false;
    this.onOpenChange.emit(false);
    this.cdref.markForCheck();
  }

  public toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // ========== ControlValueAccessor Implementation ==========
  writeValue(value: any): void {
    if (value) {
      this.isInternalChange = true;

      if (this.isRange && typeof value === 'object') {
        const startDate = this.parseIncomingValue(value.start);
        const endDate = this.parseIncomingValue(value.end);

        if (startDate) {
          this.selectedStartDate = startDate;
          this.form.get('startDateInput')?.setValue(
            this.currentDateAdapter.format(startDate, this.format),
            { emitEvent: false }
          );
        }

        if (endDate) {
          this.selectedEndDate = endDate;
          this.form.get('endDateInput')?.setValue(
            this.currentDateAdapter.format(endDate, this.format),
            { emitEvent: false }
          );
        }
      } else {
        const parsedDate = this.parseIncomingValue(value);
        if (parsedDate) {
          this.selectedDate = parsedDate;
          this.form.get('dateInput')?.setValue(
            this.currentDateAdapter.format(parsedDate, this.format),
            { emitEvent: false }
          );
        }
      }

      this.lastEmittedValue = value;
      this.isInternalChange = false;
      this.updateUI();
      this.cdref.markForCheck();
    } else {
      this.resetValues();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdref.markForCheck();
  }

  // ========== Helper Methods ==========
  protected resetValues(): void {
    this.isInternalChange = true;
    this.selectedDate = null;
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.form.get('dateInput')?.setValue('', { emitEvent: false });
    this.form.get('startDateInput')?.setValue('', { emitEvent: false });
    this.form.get('endDateInput')?.setValue('', { emitEvent: false });
    this.lastEmittedValue = null;
    this.isInternalChange = false;
    this.updateUI();
  }

  protected parseIncomingValue(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;

    const parsedDate = this.valueAdapter.parse(value, this.format);
    return parsedDate || null;
  }

  protected hasTimeComponent(format: string): boolean {
    return /[Hh]|[m]|[s]|[a]/g.test(format);
  }

  protected extractTimeFormat(format: string): string {
    const timeMatch = format.match(/[Hh]{1,2}:mm(?::ss)?(?:\s*[aA])?/);
    return timeMatch ? timeMatch[0] : 'HH:mm';
  }

  protected extractDateFormat(format: string): string {
    const dateFormatMatch = format.match(/[yMd\/.-]+/);
    return dateFormatMatch ? dateFormatMatch[0] : '';
  }

  public getPlaceholder(inputType: string = null): string {
    if (inputType === 'start') return this.lang.startDate;
    if (inputType === 'end') return this.lang.endDate;

    switch (this.mode) {
      case 'month': return this.lang.selectMonth;
      case 'year': return this.lang.selectYear;
      default: return this.lang.selectDate;
    }
  }

  // ========== Configuration Methods ==========
  public applyConfig(config: Partial<BaseDatePickerConfig>): void {
    Object.assign(this, config);
    this.setDateAdapter();
    this.updateUI();
  }

  public getConfig(): BaseDatePickerConfig {
    return {
      rtl: this.rtl,
      mode: this.mode,
      isRange: this.isRange,
      calendarType: this.calendarType,
      format: this.format,
      placement: this.placement,
      disabled: this.disabled,
      readOnly: this.readOnly,
      showTimePicker: this.showTimePicker,
      showSidebar: this.showSidebar,
      showToday: this.showToday,
      allowEmpty: this.allowEmpty,
      minDate: this.minDate,
      maxDate: this.maxDate
    };
  }
}

