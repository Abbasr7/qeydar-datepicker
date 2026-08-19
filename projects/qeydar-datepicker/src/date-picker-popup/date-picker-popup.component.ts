import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener, OnDestroy, ChangeDetectionStrategy, TemplateRef, QueryList, ViewEncapsulation, Inject } from '@angular/core';
import { DateAdapter, GregorianDateAdapter, JalaliDateAdapter } from '../date-adapter';
import { CustomLabels, DateRange, Lang_Locale, YearRange } from '../utils/models';
import { DestroyService, QeydarDatePickerService } from '../date-picker.service';
import { DatepickerMode } from '../utils/types';
import { TimePickerComponent } from '../time-picker/time-picker.component';
import { Subscription, takeUntil } from 'rxjs';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { CustomTemplate } from '../utils/template.directive';
import { CalendarHeaderComponent } from './components/calendar-header.component';
import { CalendarSidebarComponent } from './components/calendar-sidebar.component';
import { DaysGridComponent } from './components/days-grid.component';
import { MonthsGridComponent } from './components/months-grid.component';
import { YearsGridComponent } from './components/years-grid.component';
import { CalendarFooterComponent } from './components/calendar-footer.component';
import { CalendarUtilsService } from './services/calendar-utils.service';
import { ValidationStrategyService } from './services/validation-strategy.service';
import { SelectionStrategyService } from './services/selection-strategy.service';
import {
  BodyTemplateContext,
  FooterTemplateContext,
  HeaderTemplateContext,
  ToolbarTemplateContext,
  DatePickerTemplateMap
} from '../utils/template-contexts';

@Component({
  selector: 'qeydar-date-picker-popup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'qeydar-date-picker-popup'
  },
  imports: [
    NgIf,
    NgTemplateOutlet,
    TimePickerComponent,
    CalendarHeaderComponent,
    CalendarSidebarComponent,
    DaysGridComponent,
    MonthsGridComponent,
    YearsGridComponent,
    CalendarFooterComponent
  ],
  template: `
    <div class="date-picker-popup" [class.rtl]="rtl" [class]="cssClass" [class.readOnly]="readOnly" tabindex="-1">
      <div class="date-picker-content">
        <qeydar-calendar-sidebar
          *ngIf="showSidebar"
          [showSidebar]="showSidebar"
          [isRange]="isRange"
          [viewMode]="viewMode"
          [periods]="periods"
          [monthListNum]="monthListNum"
          [yearList]="yearList"
          [yearRanges]="yearRanges"
          [isActivePeriod]="isActivePeriodFn"
          [getMonthName]="getMonthNameFn"
          [isActiveMonth]="isActiveMonthFn"
          [isMonthDisabled]="isMonthDisabledFn"
          [isActiveYear]="isActiveYearFn"
          [isYearDisabled]="isYearDisabledFn"
          [isActiveYearRange]="isActiveYearRangeFn"
          [isYearRangeDisabled]="isYearRangeDisabledFn"
          (selectPeriod)="selectPeriod($event)"
          (selectMonth)="selectMonth($event, false)"
          (selectYear)="selectYear($event, true)"
          (selectYearRange)="selectYearRange($event)"
        ></qeydar-calendar-sidebar>
        <div class="calendar">
          <ng-container *ngIf="toolbarTemplate">
            <ng-container [ngTemplateOutlet]="toolbarTemplate" [ngTemplateOutletContext]="getTemplateOutletContext(toolbarContext)"></ng-container>
          </ng-container>

          <ng-container *ngIf="headerTemplate; else defaultHeaderTemplate">
            <ng-container [ngTemplateOutlet]="headerTemplate" [ngTemplateOutletContext]="getTemplateOutletContext(headerContext)"></ng-container>
          </ng-container>
          <ng-template #defaultHeaderTemplate>
            <qeydar-calendar-header
              [mode]="mode"
              [currentMonthName]="getCurrentMonthName()"
              [currentYear]="getCurrentYear()"
              [prevDisabled]="isPrevMonthDisabled()"
              [nextDisabled]="isNextMonthDisabled()"
              (prev)="goPrev()"
              (next)="goNext()"
              (showMonths)="showMonthSelector()"
              (showYears)="showYearSelector()"
            ></qeydar-calendar-header>
          </ng-template>

          <ng-container *ngIf="bodyTemplate; else defaultBodyTemplate">
            <ng-container [ngTemplateOutlet]="bodyTemplate" [ngTemplateOutletContext]="getTemplateOutletContext(bodyContext)"></ng-container>
          </ng-container>
          <ng-template #defaultBodyTemplate>
            <qeydar-days-grid
              [viewMode]="viewMode"
              [days]="days"
              [weekDays]="getWeekDays()"
              [currentDate]="currentDate"
              [dayTemplate]="$any(dayTemplate)"
              [isSameMonth]="isSameMonthFn"
              [isSelected]="isSelectedFn"
              [isInRange]="isInRangeFn"
              [isRangeStart]="isRangeStartFn"
              [isRangeEnd]="isRangeEndFn"
              [isToday]="isTodayFn"
              [isDateDisabled]="isDateDisabledFn"
              [getDayNumber]="getDayNumberFn"
              (selectDay)="selectDate($event)"
              (mouseEnter)="onMouseEnter($event, $any(null))"
            ></qeydar-days-grid>

            <qeydar-months-grid
              [viewMode]="viewMode"
              [monthListNum]="monthListNum"
              [monthTemplate]="$any(monthTemplate)"
              [isActiveMonthNumber]="isActiveMonthNumberFn"
              [isMonthDisabled]="isMonthDisabledFn"
              [isMonthInRange]="isMonthInRangeFn"
              [isMonthRangeStart]="isMonthRangeStartFn"
              [isMonthRangeEnd]="isMonthRangeEndFn"
              [getMonthName]="getMonthNameFn"
              (selectMonth)="selectMonth($event,false)"
              (mouseEnter)="onMonthHover($event)"
              (mouseLeave)="onMouseLeave()"
            ></qeydar-months-grid>

            <qeydar-years-grid
              [viewMode]="viewMode"
              [mode]="mode"
              [yearList]="yearList"
              [yearTemplate]="$any(yearTemplate)"
              [isActiveYear]="isActiveYearNumberFn"
              [isYearInRange]="isYearInRangeFn"
              [isYearRangeStart]="isYearRangeStartFn"
              [isYearRangeEnd]="isYearRangeEndFn"
              [isYearDisabled]="isYearDisabledFn"
              (selectYear)="selectYear($event)"
              (mouseEnter)="onYearHover($event)"
              (mouseLeave)="onMouseLeave()"
            ></qeydar-years-grid>
          </ng-template>
        </div>

        <!-- Time Picker Integration -->
        <div *ngIf="showTimePicker" class="time-picker-section">
          <qeydar-time-picker
            #timePicker
            [rtl]="rtl"
            [dateAdapter]="dateAdapter"
            [valueType]="'date'"
            [displayFormat]="timeDisplayFormat"
            [inline]="true"
            [disabledTimesFilter]="disabledTimesFilter"
            [cssClass]="'embedded-time-picker'"
            [selectedDate]="selectedDate"
            (timeChange)="onTimeChange($event)"
          ></qeydar-time-picker>
        </div>
      </div>
      <ng-container *ngIf="footerTemplate; else defaultFooterTemplate">
        <ng-container [ngTemplateOutlet]="footerTemplate" [ngTemplateOutletContext]="getTemplateOutletContext(footerContext)"></ng-container>
      </ng-container>
      <ng-template #defaultFooterTemplate>
        <qeydar-calendar-footer
          *ngIf="footerDescription || showTimePicker || showToday"
          [footerDescription]="footerDescription"
          [showTimePicker]="showTimePicker"
          [showToday]="showToday"
          [okLabel]="lang.ok"
          [todayLabel]="lang.today"
          (okClick)="onOkClick()"
          (todayClick)="onTodayClick()"
        ></qeydar-calendar-footer>
      </ng-template>
    </div>
  `,
  styleUrls: ['./date-picker-popup.component.scss']
})
export class DatePickerPopupComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // ========== Input Properties ==========
  @Input() rtl = false;
  @Input() selectedDate: Date | null = null;
  @Input() selectedStartDate: Date | null = null;
  @Input() selectedEndDate: Date | null = null;
  @Input() mode: DatepickerMode = 'day';
  @Input() isRange = false;
  @Input() customLabels: Array<CustomLabels> = [];
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() cssClass = '';
  @Input() footerDescription = '';
  @Input() activeInput: 'start' | 'end' | '' = null;
  @Input() showSidebar = true;
  @Input() showToday: boolean;
  @Input() showTimePicker = false;
  @Input() timeDisplayFormat = 'HH:mm';
  @Input() dateFormat: string;
  @Input() readOnly: boolean;
  @Input() disabledDates: Array<Date | string> = [];
  @Input() disabledDatesFilter: (date: Date) => boolean;
  @Input() disabledTimesFilter: (date: Date) => boolean;
  private _templates: QueryList<CustomTemplate> | null = null;
  private templatesSubscription?: Subscription;
  private hasResolvedTemplates = false;

  @Input()
  set templates(value: QueryList<CustomTemplate> | null) {
    if (this._templates === value) {
      return;
    }

    this.templatesSubscription?.unsubscribe();
    this._templates = value;
    this.templatesSubscription = value?.changes
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.resolveTemplates());
    if (this.hasResolvedTemplates || value) {
      this.resolveTemplates();
    }
  }
  get templates(): QueryList<CustomTemplate> | null {
    return this._templates;
  }

  @Input() dateAdapter: DateAdapter<Date>;

  /** Optional template inserted above the calendar header. */
  toolbarTemplate: TemplateRef<unknown> | null = null;
  /** Optional template replacing the built-in calendar header. */
  headerTemplate: TemplateRef<unknown> | null = null;
  /** Optional template replacing the built-in calendar footer. */
  footerTemplate: TemplateRef<unknown> | null = null;
  /** Optional template replacing all default calendar grids. */
  bodyTemplate: TemplateRef<unknown> | null = null;

  // ========== Output Properties ==========
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() dateRangeSelected = new EventEmitter<DateRange>();
  @Output() closePicker = new EventEmitter<void>();
  @Output() clickInside = new EventEmitter<boolean>();

  // ========== ViewChild Properties ==========
  @ViewChild(CalendarSidebarComponent) sidebar: CalendarSidebarComponent;
  @ViewChild(TimePickerComponent) timePicker: TimePickerComponent;

  // ========== Class Properties ==========
  weekDays: string[] = [];
  periods: Array<CustomLabels> = [];
  days: Date[] = [];
  currentDate: Date;
  selectedPeriod: any = '';
  tempEndDate: Date | null = null;
  monthListNum = Array.from({ length: 12 }, (_, i) => i + 1);
  yearList: number[] = [];
  yearRanges: Array<YearRange> = [];
  viewMode: 'days' | 'months' | 'years' = 'days';
  lang: Lang_Locale;
  timeoutId: any = null;
  dayTemplate: TemplateRef<any>;
  monthTemplate: TemplateRef<any>;
  yearTemplate: TemplateRef<any>;
  private resolvedTemplates: DatePickerTemplateMap = {};

  // Stable callback references keep OnPush child inputs from changing on every check.
  readonly isActivePeriodFn = this.isActivePeriod.bind(this);
  readonly getMonthNameFn = this.getMonthName.bind(this);
  readonly isActiveMonthFn = this.isActiveMonth.bind(this);
  readonly isMonthDisabledFn = this.isMonthDisabled.bind(this);
  readonly isActiveYearFn = this.isActiveYear.bind(this);
  readonly isYearDisabledFn = this.isYearDisabled.bind(this);
  readonly isActiveYearRangeFn = this.isActiveYearRange.bind(this);
  readonly isYearRangeDisabledFn = this.isYearRangeDisabled.bind(this);
  readonly isSameMonthFn = this.isSameMonth.bind(this);
  readonly isSelectedFn = this.isSelected.bind(this);
  readonly isInRangeFn = this.isInRange.bind(this);
  readonly isRangeStartFn = this.isRangeStart.bind(this);
  readonly isRangeEndFn = this.isRangeEnd.bind(this);
  readonly isTodayFn = this.isToday.bind(this);
  readonly isDateDisabledFn = this.isDateDisabled.bind(this);
  readonly getDayNumberFn = (date: Date): number => this.dateAdapter.getDate(date);
  readonly isActiveMonthNumberFn = (month: number): boolean =>
    !!this.currentDate && month === this.dateAdapter.getMonth(this.currentDate) + 1;
  readonly isMonthInRangeFn = this.isMonthInRange.bind(this);
  readonly isMonthRangeStartFn = this.isMonthRangeStart.bind(this);
  readonly isMonthRangeEndFn = this.isMonthRangeEnd.bind(this);
  readonly isActiveYearNumberFn = (year: number): boolean =>
    !!this.currentDate && year === this.dateAdapter.getYear(this.currentDate);
  readonly isYearInRangeFn = this.isYearInRange.bind(this);
  readonly isYearRangeStartFn = this.isYearRangeStart.bind(this);
  readonly isYearRangeEndFn = this.isYearRangeEnd.bind(this);
  readonly selectQuickDateFn = (date: Date): void => this.selectDate(date);
  readonly selectQuickRangeFn = (start: Date, end: Date): void => this.selectQuickRange(start, end);
  readonly closeFn = (): void => this.closeDatePicker();
  readonly prevFn = (): void => this.goPrev();
  readonly nextFn = (): void => this.goNext();
  readonly showMonthsFn = (): void => this.showMonthSelector();
  readonly showYearsFn = (): void => this.showYearSelector();
  readonly confirmFn = (): void => this.onOkClick();
  readonly cancelFn = (): void => this.closeDatePicker();
  readonly todayFn = (): void => this.onTodayClick();
  readonly selectDayFn = (date: Date): void => this.selectDate(date);
  readonly selectMonthFn = (month: number): void => this.selectMonth(month, false);
  readonly selectYearFn = (year: number): void => this.selectYear(year);
  readonly goPrevFn = (): void => this.goPrev();
  readonly goNextFn = (): void => this.goNext();

  getTemplateOutletContext<T extends object>(context: T): { $implicit: T } & T {
    return { $implicit: context, ...context };
  }

  get toolbarContext(): ToolbarTemplateContext {
    return {
      currentDate: this.currentDate || new Date(),
      mode: this.mode,
      isRange: this.isRange,
      selectQuickDate: this.selectQuickDateFn,
      selectQuickRange: this.selectQuickRangeFn,
      close: this.closeFn
    };
  }

  get headerContext(): HeaderTemplateContext {
    return {
      currentDate: this.currentDate || new Date(),
      currentMonthName: this.currentDate ? this.getCurrentMonthName() : '',
      currentYear: this.currentDate ? this.getCurrentYear() : 0,
      viewMode: this.viewMode,
      mode: this.mode,
      prevDisabled: this.isPrevMonthDisabled(),
      nextDisabled: this.isNextMonthDisabled(),
      prev: this.prevFn,
      next: this.nextFn,
      showMonths: this.showMonthsFn,
      showYears: this.showYearsFn
    };
  }

  get footerContext(): FooterTemplateContext {
    return {
      selectedDate: this.selectedDate,
      selectedStartDate: this.selectedStartDate,
      selectedEndDate: this.selectedEndDate,
      isRange: this.isRange,
      showTimePicker: this.showTimePicker,
      confirm: this.confirmFn,
      cancel: this.cancelFn,
      today: this.todayFn
    };
  }

  get bodyContext(): BodyTemplateContext {
    return {
      viewMode: this.viewMode,
      currentDate: this.currentDate || new Date(),
      days: this.days,
      monthListNum: this.monthListNum,
      yearList: this.generateYearList(120),
      weekDays: this.getWeekDays(),
      selection: {
        isSelected: this.isSelectedFn,
        isInRange: this.isInRangeFn,
        isRangeStart: this.isRangeStartFn,
        isRangeEnd: this.isRangeEndFn,
        isToday: this.isTodayFn
      },
      validation: {
        isDateDisabled: this.isDateDisabledFn,
        isMonthDisabled: this.isMonthDisabledFn,
        isYearDisabled: this.isYearDisabledFn
      },
      actions: {
        selectDay: this.selectDayFn,
        selectMonth: this.selectMonthFn,
        selectYear: this.selectYearFn,
        goPrev: this.goPrevFn,
        goNext: this.goNextFn
      },
      utils: {
        generateYearList: this.generateYearList.bind(this)
      }
    };
  }

  // ========== Getters ==========
  public get getDate(): Date {
    return this.selectedDate || this.selectedStartDate || this.selectedEndDate || new Date();
  }

  constructor(
    public el: ElementRef,
    public cdr: ChangeDetectorRef, 
    public dpService: QeydarDatePickerService,
    public jalali: JalaliDateAdapter,
    public gregorian: GregorianDateAdapter,
    public destroy$: DestroyService,
    private calendarUtils: CalendarUtilsService,
    private validationStrategy: ValidationStrategyService,
    private selectionStrategy: SelectionStrategyService,
  ) {
    cdr.markForCheck();
  }

  // ========== Lifecycle Hooks ==========
  ngOnInit() {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.handleChanges(changes);
  }

  ngAfterViewInit() {
    this.scrollToSelectedItem();
    this.setTimePickerDate();
  }

  ngOnDestroy(): void {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }
    this.templatesSubscription?.unsubscribe();
  }

  private resolveTemplates(): void {
    this.hasResolvedTemplates = true;
    this.resolvedTemplates = {};
    this.dayTemplate = undefined;
    this.monthTemplate = undefined;
    this.yearTemplate = undefined;
    this.toolbarTemplate = null;
    this.headerTemplate = null;
    this.footerTemplate = null;
    this.bodyTemplate = null;

    this.templates?.forEach((item) => {
      const templateType = item.getType();
      if (templateType === 'quarter') {
        // TODO: no quarters grid exists yet, so this legacy slot remains inert.
        return;
      }

      if (templateType === 'day' || templateType === 'month' || templateType === 'year' ||
          templateType === 'toolbar' || templateType === 'header' || templateType === 'footer' ||
          templateType === 'body') {
        this.resolvedTemplates[templateType] = item.template;
      }
    });

    this.dayTemplate = this.resolvedTemplates.day as TemplateRef<any>;
    this.monthTemplate = this.resolvedTemplates.month as TemplateRef<any>;
    this.yearTemplate = this.resolvedTemplates.year as TemplateRef<any>;
    this.toolbarTemplate = this.resolvedTemplates.toolbar || null;
    this.headerTemplate = this.resolvedTemplates.header || null;
    this.footerTemplate = this.resolvedTemplates.footer || null;
    this.bodyTemplate = this.resolvedTemplates.body || null;
    this.cdr.markForCheck();
  }
  // ========== Initialization Methods ==========
  initializeComponent(): void {
    this.setDateAdapter();
    this.setInitialDate();
    this.generateCalendar();
    this.weekDays = this.calendarUtils.getWeekDays(this.dateAdapter);
    if (this.mode === 'year') {
      this.showYearSelector();
    }
    this.initLabels();
  }

  initLabels(): void {
    const today = this.dateAdapter.today();
    if (this.customLabels?.length) {
      this.periods = this.customLabels;
    } else if (this.isRange) {
      this.generateDefaultPeriods(today);
    }
  }

  generateDefaultPeriods(today: Date): void {
    this.periods = this.calendarUtils.generateDefaultPeriods(today, this.lang);
  }

  // ========== Date Adapter Methods ==========
  setDateAdapter(): void {
    this.lang = this.dpService.locale;
  }

  // ========== Calendar Generation Methods ==========
  generateCalendar(): void {
    this.days = this.calendarUtils.generateDaysGrid(this.currentDate, this.dateAdapter);
  }

  // ========== View Mode Management ==========
  setViewMode(): void {
    this.viewMode = this.calendarUtils.determineViewMode(this.mode);
    if (this.mode === 'month') {
      this.generateYearList(15);
    }
  }

  showMonthSelector(): void {
    this.viewMode = 'months';
    this.generateYearList(15);
    this.scrollToSelectedItem(this.dateAdapter.getYear(this.getDate));
    this.cdr.markForCheck();
  }

  showYearSelector(): void {
    this.viewMode = 'years';
    this.generateYearRanges();
    this.generateYearList();
    this.scrollToSelectedItem();
    this.cdr.markForCheck();
  }

  // ========== Time Selection Methods ==========
  onTimeChange(time: string | Date): void {
    const timeDate = time instanceof Date ? time : new Date(time);
    
    if (!this.isRange) {
      this.updateSingleDateTime(timeDate);
    } else {
      this.updateRangeDateTime(timeDate);
    }
  }

  updateSingleDateTime(timeDate: Date): void {
    if (!this.selectedDate) {
      this.selectedDate = this.dateAdapter.today();
    }

    const result = this.selectionStrategy.updateSingleTime(timeDate, this.selectedDate);
    this.selectedDate = result.selectedDate;
  }

  updateRangeDateTime(timeDate: Date): void {
    const result = this.selectionStrategy.updateRangeTime(
      timeDate, 
      this.activeInput, 
      this.selectedStartDate, 
      this.selectedEndDate
    );
    
    this.selectedStartDate = result.selectedStartDate;
    this.selectedEndDate = result.selectedEndDate;
    
    if (result.shouldEmit) {
      if (this.activeInput === 'start') {
        this.dateRangeSelected.emit({ start: this.selectedStartDate, end: null });
      } else if (this.activeInput === 'end') {
        clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
          this.dateRangeSelected.emit({ start: this.selectedStartDate, end: this.selectedEndDate });
        }, 300);
      }
    }
  }


  setTimePickerDate(date?: Date) {
    if (this.showTimePicker) {
      if (this.isRange) {
        this.dpService.activeInput$.asObservable()
          .pipe(
            takeUntil(this.destroy$)
          )
          .subscribe(active => {
            if (active == 'start') {
              this.timePicker.updateFromDate(this.selectedStartDate);
            } else {
              this.timePicker.updateFromDate(this.selectedEndDate);
            }
            this.timePicker.scrollToTime();
          });
      } else {
        this.timePicker.updateFromDate(date || this.selectedDate);
        this.timePicker.scrollToTime();
      }
    }
  }

  // ========== Date Selection Methods ==========
  selectDate(date: Date): void {
    if (this.isDateDisabled(date)) return;

    if (this.showTimePicker) {
      const existingDate = this.isRange ? 
        (this.activeInput === 'start' ? this.selectedStartDate : this.selectedEndDate) :
        this.selectedDate;

      if (existingDate) {
        date = this.selectionStrategy.applyTimeToDate(date, existingDate);
      }
    } else {
      date = this.selectionStrategy.applyTimeToDate(date, new Date());
    }

    if (this.isRange) {
      this.handleRangeSelection(date);
    } else {
      this.handleSingleSelection(date);
    }
    this.currentDate = date;
    this.cdr.markForCheck();
  }

  handleRangeSelection(date: Date): void {
    const prevStartDate = this.selectedStartDate;
    const prevEndDate = this.selectedEndDate;
    
    const result = this.selectionStrategy.handleRangeSelection(
      date, 
      this.selectedStartDate, 
      this.selectedEndDate, 
      this.showTimePicker
    );
    
    this.selectedStartDate = result.selectedStartDate;
    this.selectedEndDate = result.selectedEndDate;
    
    if (!this.showTimePicker) {
      this.activeInput = result.activeInput;
      this.dpService.activeInput$.next(result.activeInput);
    } else if (this.showTimePicker) {
      this.activeInput = result.activeInput;
      this.dpService.activeInput$.next(result.activeInput);
    }
    
    if (result.shouldEmit) {
      this.dateRangeSelected.emit({ start: this.selectedStartDate, end: this.selectedEndDate });
    }

    if (prevStartDate !== this.selectedStartDate || prevEndDate !== this.selectedEndDate)
      this.cdr.markForCheck();
  }

  handleSingleSelection(date: Date): void {
    const result = this.selectionStrategy.handleSingleSelection(date, this.selectedDate, this.showTimePicker);
    this.selectedDate = result.selectedDate;
    if (result.shouldEmit) {
      this.dateSelected.emit(result.selectedDate);
    }
  }

  selectMonth(month: number, closeAfterSelection: boolean = false): void {
    if (this.isMonthDisabled(month)) return;

    // Preserve the day when just navigating between modes; use day 1 only for mode finalization
    const dayToUse = (this.mode === 'month' || closeAfterSelection) ? 1 : this.dateAdapter.getDate(this.currentDate);

    // Create the new date and preserve existing time portion when available
    let newDate = this.dateAdapter.createDate(
      this.dateAdapter.getYear(this.currentDate),
      month - 1,
      dayToUse
    );

    const existingDate = this.isRange ? (this.activeInput === 'start' ? this.selectedStartDate : this.selectedEndDate) : this.selectedDate;
    if (existingDate) {
      newDate = this.selectionStrategy.applyTimeToDate(newDate, existingDate);
    }
    this.currentDate = newDate;

    if (this.isRange && this.mode === 'month') {
      this.handleRangeSelection(this.currentDate);
      return;
    }

    if (this.mode === 'month' || closeAfterSelection) {
      this.selectedDate = this.currentDate;
      this.dateSelected.emit(this.currentDate);
      this.closeDatePicker();
    } else {
      this.viewMode = 'days';
      this.generateCalendar();
      this.cdr.detectChanges();
    }

    this.scrollToSelectedItem(month);
  }

  selectYear(year: number, sideSelector = false): void {
    if (this.isYearDisabled(year)) return;

    // Preserve day and month when just navigating between modes
    const dayToUse = this.mode === 'year' ? 1 : this.dateAdapter.getDate(this.currentDate);
    const monthToUse = this.dateAdapter.getMonth(this.currentDate);

    // Create the new date and preserve existing time portion when available
    let newDate = this.dateAdapter.createDate(
      year,
      monthToUse,
      dayToUse
    );

    const existingDateForYear = this.isRange ? (this.activeInput === 'start' ? this.selectedStartDate : this.selectedEndDate) : this.selectedDate;
    if (existingDateForYear) {
      newDate = this.selectionStrategy.applyTimeToDate(newDate, existingDateForYear);
    }
    this.currentDate = newDate;

    if (this.isRange && this.mode === 'year') {
      this.handleRangeSelection(this.currentDate);
      return;
    }

    if (this.mode === 'year') {
      this.selectedDate = this.currentDate;
      this.dateSelected.emit(this.currentDate);
      this.closeDatePicker();
      return;
    }

    if (sideSelector) {
      this.currentDate = this.dateAdapter.setYear(this.selectedDate, year);
      this.scrollToSelectedItem(year);
    } else {
      this.viewMode = 'months';
      this.cdr.detectChanges();
    }
  }

  // ========== Navigation Methods ==========
  goPrev(): void {
    if (this.viewMode === 'days') {
      this.prevMonth();
      this.cdr.detectChanges();
      return;
    }

    let id: number;
    if (this.viewMode === 'months') {
      this.currentDate = this.calendarUtils.navigateToPrevYear(this.currentDate, this.dateAdapter);
      id = this.dateAdapter.getYear(this.currentDate);
    }

    if (this.viewMode === 'years') {
      this.yearList = this.calendarUtils.navigateToPrevYearRange(this.yearList);
      id = this.yearList[0];
    }

    this.cdr.detectChanges();
    this.scrollToSelectedItem(id);
  }

  goNext(): void {
    if (this.viewMode === 'days') {
      this.nextMonth();
      this.cdr.detectChanges();
      return;
    }

    let id: number;
    if (this.viewMode === 'months') {
      this.currentDate = this.calendarUtils.navigateToNextYear(this.currentDate, this.dateAdapter);
      id = this.dateAdapter.getYear(this.currentDate);
    }

    if (this.viewMode === 'years') {
      this.yearList = this.calendarUtils.navigateToNextYearRange(this.yearList);
      id = this.yearList[0];
    }

    this.cdr.detectChanges();
    this.scrollToSelectedItem(id);
  }

  prevMonth(): void {
    if (this.isPrevMonthDisabled()) return;
    this.currentDate = this.calendarUtils.navigateToPrevMonth(this.currentDate, this.dateAdapter);
    this.generateCalendar();
    this.scrollToSelectedItem(this.dateAdapter.getMonth(this.currentDate) + 1);
  }

  nextMonth(): void {
    if (this.isNextMonthDisabled()) return;
    this.currentDate = this.calendarUtils.navigateToNextMonth(this.currentDate, this.dateAdapter);
    this.generateCalendar();
    this.scrollToSelectedItem(this.dateAdapter.getMonth(this.currentDate) + 1);
  }

  // ========== State Check Methods ==========
  isSelected(date: Date): boolean {
    if (this.isRange) {
      return this.selectionStrategy.isRangeSelected(date, this.selectedStartDate, this.selectedEndDate, this.dateAdapter);
    }
    return this.selectionStrategy.isSelected(date, this.selectedDate, this.dateAdapter);
  }

  isRangeStart(date: Date): boolean {
    return this.isRange && this.selectionStrategy.isRangeStart(date, this.selectedStartDate, this.dateAdapter);
  }

  isRangeEnd(date: Date): boolean {
    return this.isRange && this.selectionStrategy.isRangeEnd(date, this.selectedEndDate, this.dateAdapter);
  }

  isInRange(date: Date): boolean {
    return this.isRange && this.selectionStrategy.isInRange(date, this.selectedStartDate, this.selectedEndDate, this.tempEndDate, this.dateAdapter);
  }

  isToday(date: Date): boolean {
    return this.selectionStrategy.isToday(date, this.dateAdapter, this.showToday);
  }

  isActiveMonth(month: number): boolean {
    return this.calendarUtils.isActiveMonth(month, this.currentDate, this.dateAdapter);
  }

  isActiveYear(year: number): boolean {
    return this.calendarUtils.isActiveYear(year, this.currentDate, this.dateAdapter);
  }

  isMonthRangeStart(month: number): boolean {
    if (!this.isRange || !this.selectedStartDate) return false;
    const year = this.dateAdapter.getYear(this.currentDate);
    return this.dateAdapter.getYear(this.selectedStartDate) === year && this.dateAdapter.getMonth(this.selectedStartDate) === month - 1;
  }

  isMonthRangeEnd(month: number): boolean {
    if (!this.isRange || !this.selectedStartDate) return false;
    const endDate = this.selectedEndDate || this.tempEndDate;
    if (!endDate) return false;
    const year = this.dateAdapter.getYear(this.currentDate);
    return this.dateAdapter.getYear(endDate) === year && this.dateAdapter.getMonth(endDate) === month - 1;
  }

  isMonthInRange(month: number): boolean {
    if (!this.isRange || !this.selectedStartDate) return false;
    const endDate = this.selectedEndDate || this.tempEndDate;
    if (!endDate) return false;

    const year = this.dateAdapter.getYear(this.currentDate);
    const startYear = this.dateAdapter.getYear(this.selectedStartDate);
    const endYear = this.dateAdapter.getYear(endDate);
    const startMonth = this.dateAdapter.getMonth(this.selectedStartDate) + 1;
    const endMonth = this.dateAdapter.getMonth(endDate) + 1;

    if (year < startYear || year > endYear) {
      return false;
    }

    if (startYear === endYear) {
      return year === startYear && month > startMonth && month < endMonth;
    }

    if (year === startYear) {
      return month > startMonth;
    }

    if (year === endYear) {
      return month < endMonth;
    }

    return true;
  }

  isYearRangeStart(year: number): boolean {
    return this.isRange && this.selectedStartDate && this.dateAdapter.getYear(this.selectedStartDate) === year;
  }

  isYearRangeEnd(year: number): boolean {
    if (!this.isRange || !this.selectedStartDate) return false;
    const endDate = this.selectedEndDate || this.tempEndDate;
    if (!endDate) return false;
    return this.dateAdapter.getYear(endDate) === year;
  }

  isYearInRange(year: number): boolean {
    if (!this.isRange || !this.selectedStartDate) return false;
    const endDate = this.selectedEndDate || this.tempEndDate;
    if (!endDate) return false;
    const startYear = this.dateAdapter.getYear(this.selectedStartDate);
    const endYear = this.dateAdapter.getYear(endDate);
    return year > startYear && year < endYear;
  }

  isActiveYearRange(startYear: number): boolean {
    return this.calendarUtils.isActiveYearRange(startYear, this.yearList);
  }

  // ========== Disabled State Methods ==========
  isDateDisabled(date: Date): boolean {
    return this.validationStrategy.isDateDisabled(
      date, 
      this.dateAdapter, 
      this.minDate, 
      this.maxDate, 
      this.disabledDates, 
      this.disabledDatesFilter, 
      this.dateFormat
    );
  }

  isMonthDisabled(month: number): boolean {
    const year = this.dateAdapter.getYear(this.currentDate);
    return this.validationStrategy.isMonthDisabled(
      month, 
      year, 
      this.dateAdapter, 
      this.minDate, 
      this.maxDate, 
      this.disabledDates, 
      this.disabledDatesFilter, 
      this.dateFormat
    );
  }

  isYearDisabled(year: number): boolean {
    return this.validationStrategy.isYearDisabled(
      year, 
      this.dateAdapter, 
      this.minDate, 
      this.maxDate, 
      this.disabledDates, 
      this.disabledDatesFilter, 
      this.dateFormat
    );
  }

  isYearRangeDisabled(yearRange: YearRange): boolean {
    return this.validationStrategy.isYearRangeDisabled(
      yearRange, 
      this.dateAdapter, 
      this.minDate, 
      this.maxDate, 
      this.disabledDates, 
      this.disabledDatesFilter, 
      this.dateFormat
    );
  }

  isPrevMonthDisabled(): boolean {
    return this.validationStrategy.isPrevNavigationDisabled(
      this.currentDate, 
      this.viewMode, 
      this.dateAdapter, 
      this.minDate, 
      this.yearList
    );
  }

  isNextMonthDisabled(): boolean {
    return this.validationStrategy.isNextNavigationDisabled(
      this.currentDate, 
      this.viewMode, 
      this.dateAdapter, 
      this.maxDate, 
      this.yearList
    );
  }

  parseDisabledDates(): Date[] {
    return this.validationStrategy.parseDisabledDates(this.disabledDates, this.dateAdapter, this.dateFormat);
  }

  // ========== Event Handlers ==========
  onMouseEnter(date: Date, event: Event): void {
    this.tempEndDate = this.selectionStrategy.handleMouseEnter(date, this.selectedStartDate, this.selectedEndDate);
  }

  onMouseLeave(): void {
    this.tempEndDate = null;
  }

  onMonthHover(month: number): void {
    if (!this.isRange || this.selectedEndDate || !this.selectedStartDate) return;
    const year = this.dateAdapter.getYear(this.currentDate);
    const date = this.dateAdapter.createDate(year, month - 1, 1);
    this.tempEndDate = this.selectionStrategy.handleMouseEnter(date, this.selectedStartDate, this.selectedEndDate);
  }

  onYearHover(year: number): void {
    if (!this.isRange || this.selectedEndDate || !this.selectedStartDate) return;
    const date = this.dateAdapter.createDate(year, this.dateAdapter.getMonth(this.currentDate), 1);
    this.tempEndDate = this.selectionStrategy.handleMouseEnter(date, this.selectedStartDate, this.selectedEndDate);
  }

  @HostListener('click')
  onClickInside(): void {
    this.clickInside.emit(true);
  }

  // ========== Utility Methods ==========
  getMonthName(month: number): string {
    return this.calendarUtils.getMonthName(month, this.dateAdapter);
  }

  getCurrentMonthName(): string {
    return this.calendarUtils.getCurrentMonthName(this.currentDate, this.dateAdapter);
  }

  getCurrentYear(): number {
    return this.calendarUtils.getCurrentYear(this.currentDate, this.dateAdapter);
  }

  getWeekDays(): string[] {
    return this.calendarUtils.getWeekDays(this.dateAdapter);
  }

  isSameMonth(date1: Date, date2: Date): boolean {
    return this.calendarUtils.isSameMonth(date1, date2, this.dateAdapter);
  }

  closeDatePicker(): void {
    this.closePicker.emit();
  }

  private selectQuickRange(start: Date, end: Date): void {
    this.dateRangeSelected.emit({ start, end });
  }

  // ========== Year Management Methods ==========
  generateYearRanges(length: number = 15): void {
    this.yearRanges = this.calendarUtils.generateYearRanges(length, this.dateAdapter, this.currentDate);
  }

  generateYearList(length: number = 15): number[] {
    // In range mode, prioritize start date to show the beginning of the range
    let date: Date;
    if (this.isRange && this.selectedStartDate) {
      date = this.selectedStartDate;
    } else {
      date = this.selectedDate || this.selectedEndDate || this.selectedStartDate || new Date();
    }
    const currentYear = this.dateAdapter.getYear(date);
    
    this.yearList = this.calendarUtils.generateYearList(currentYear, length);
    return this.yearList
  }

  selectYearRange(startYear: number): void {
    this.yearList = Array.from({ length: 15 }, (_, i) => startYear + i);
    this.viewMode = 'years';
    this.cdr.detectChanges();
    this.scrollToSelectedItem(startYear);
  }

  // ========== Period Selection Methods ==========
  isActivePeriod(period: CustomLabels): boolean {
    return this.selectionStrategy.isActivePeriod(
      period,
      this.selectedStartDate,
      this.selectedEndDate,
      this.dateAdapter,
      this.periods
    );
  }

  selectPeriod(period: CustomLabels): void {
    const result = this.selectionStrategy.selectPeriod(period);
    this.selectedPeriod = result.selectedPeriod;
    
    if (!result.isCustom && result.dateRange) {
      this.dateRangeSelected.emit(result.dateRange);
    }
  }

  onTodayClick() {
    this.currentDate = this.selectedDate = new Date();
    this.viewMode = 'days';
    this.generateCalendar();
    this.selectDate(this.currentDate);
    this.setTimePickerDate(this.currentDate);
    this.cdr.detectChanges();
  }

  onOkClick() {
    if (this.isRange) {
      this.dateRangeSelected.emit({ start: this.selectedStartDate, end: this.selectedEndDate });
      this.closeDatePicker()
    } else {
      this.dateSelected.emit(this.selectedDate);
    }
  }

  // ========== Scroll Management ==========
  scrollToSelectedItem(id: number | null = null): void {
    if (!this.showSidebar) return;

    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }

    const itemId = this.determineScrollItemId(id);
    if (!itemId || !this.sidebar || !this.sidebar.itemSelector) return;

    this.timeoutId = setTimeout(() => {
      const selectedElement = this.sidebar.itemSelector.nativeElement.querySelector(`#selector_${itemId}`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  }

  determineScrollItemId(id: number | null): number | null {
    if (id != null) return id;
    if (!this.getDate) return null;

    return this.calendarUtils.getScrollItemId(this.viewMode, this.getDate, this.dateAdapter, this.yearRanges);
  }

  // ========== State Management ==========
  handleChanges(changes: SimpleChanges): void {
    if (changes['dateAdapter']) {
      this.setDateAdapter();
      this.weekDays = this.dateAdapter.getDayOfWeekNames('short');
    }
    
    if (changes['selectedDate'] || 
        changes['selectedStartDate'] || 
        changes['selectedEndDate'] || 
        changes['mode'] || 
        changes['dateAdapter']) {
      this.tempEndDate = null;
      this.setInitialDate();
      this.generateCalendar();
      if (changes['mode']) {
        this.scrollToSelectedItem();
      }
    }
    
    if (changes['minDate'] || changes['maxDate']) {
      this.adjustCurrentDateToValidRange();
    }
  }

  setInitialDate(): void {
    this.currentDate = this.determineInitialDate();
    this.setViewMode();
    this.adjustCurrentDateToValidRange();
  }

  determineInitialDate(): Date {
    if (this.isRange) {
      if ((this.mode === 'month' || this.mode === 'year') && this.selectedStartDate) {
        return this.selectedStartDate;
      }
      if (this.activeInput === 'start') {
        return this.selectedStartDate || this.dateAdapter.today();
      }
      return this.selectedEndDate || this.selectedStartDate || this.dateAdapter.today();
    }
    
    return this.selectedDate || this.dateAdapter.today();
  }

  adjustCurrentDateToValidRange(): void {
    const adjustedDate = this.validationStrategy.adjustDateToValidRange(
      this.currentDate, 
      this.dateAdapter, 
      this.minDate, 
      this.maxDate
    );

    if (!this.dateAdapter.isSameDay(this.currentDate, adjustedDate)) {
      this.currentDate = adjustedDate;
      this.generateCalendar();
    }
  }
}
