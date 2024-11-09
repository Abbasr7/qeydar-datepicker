import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { DateAdapter, GregorianDateAdapter, JalaliDateAdapter } from '../date-adapter';
import { CustomLabels, DateRange, Lang_Locale, YearRange } from './models';
import { QeydarDatePickerService } from '../date-picker.service';

@Component({
  selector: 'app-date-picker-popup',
  template: `
    <div class="date-picker-popup" [class.rtl]="rtl" [class]="cssClass" tabindex="-1">
      <div class="date-picker-content">
        <ng-container *ngIf="showSidebar">
          <div *ngIf="isRange" class="period-selector">
            <button
              *ngFor="let period of periods"
              tabindex="-1"
              [class.active]="isActivePeriod(period)"
              (click)="selectPeriod(period)"
            >
              {{ period.label }}
              <span *ngIf="period.arrow" class="arrow">→</span>
            </button>
          </div>
          <div *ngIf="!isRange" class="side-selector" #itemSelector>
            <ng-container *ngIf="viewMode == 'days'">
              <button 
                *ngFor="let month of monthListNum"
                tabindex="-1"
                [id]="'selector_'+month"
                [class.active]="isActiveMonth(month)"
                [disabled]="isMonthDisabled(month)"
                (click)="selectMonth(month, false)">
                {{ getMonthName(month) }}
              </button>
            </ng-container>
            <ng-container *ngIf="viewMode == 'months'">
              <button
                *ngFor="let year of yearList" 
                tabindex="-1"
                [id]="'selector_'+year"
                [class.active]="isActiveYear(year)"
                [disabled]="isYearDisabled(year)"
                (click)="selectYear(year, true)"
              >
                {{ year }}
              </button>
            </ng-container>
            <ng-container *ngIf="viewMode == 'years'">
              <button
                tabindex="-1"
                *ngFor="let yearRange of yearRanges" 
                [id]="'selector_'+yearRange.start"
                [class.active]="isActiveYearRange(yearRange.start)"
                [disabled]="isYearRangeDisabled(yearRange)"
                (click)="selectYearRange(yearRange.start)"
              >
                {{ yearRange.start }} - {{ yearRange.end }}
              </button>
            </ng-container>
          </div>
        </ng-container>
        <div class="calendar">
          <div class="header">
            <button class="qeydar-calendar-nav-left" (click)="goPrev()" [disabled]="isPrevMonthDisabled()" tabindex="-1"></button>
            <span class="month-year">
              <span class="month-name" (click)="showMonthSelector()">{{ getCurrentMonthName() }}</span>
              <span class="year" (click)="showYearSelector()">{{ getCurrentYear() }}</span>
            </span>
            <button class="qeydar-calendar-nav-right" (click)="goNext()" [disabled]="isNextMonthDisabled()" tabindex="-1"></button>
          </div>
          <div *ngIf="viewMode == 'days'">
            <div *ngIf="viewMode === 'days'" class="weekdays">
              <span *ngFor="let day of getWeekDays()">{{ day }}</span>
            </div>
            <div *ngIf="viewMode === 'days'" class="days">
              <button
                *ngFor="let day of days"
                tabindex="-1"
                [class.different-month]="!isSameMonth(day, currentDate)"
                [class.selected]="isSelected(day)"
                [class.in-range]="isInRange(day)"
                [class.range-start]="isRangeStart(day)"
                [class.range-end]="isRangeEnd(day)"
                [class.today]="isToday(day)"
                [disabled]="isDateDisabled(day)"
                (click)="selectDate(day)"
                (mouseenter)="onMouseEnter(day,$event)"
              >
                {{ dateAdapter.getDate(day) }}
              </button>
            </div>
          </div>
          <div *ngIf="viewMode === 'months' || mode == 'month'" class="months">
            <button
              *ngFor="let month of monthListNum"
              tabindex="-1"
              [class.selected]="month === dateAdapter.getMonth(currentDate) + 1"
              [disabled]="isMonthDisabled(month)"
              (click)="selectMonth(month,false)"
            >
              {{ getMonthName(month) }}
            </button>
          </div>
          <div *ngIf="viewMode === 'years' || mode == 'year'" class="years">
            <button
              *ngFor="let year of yearList"
              tabindex="-1"
              [class.selected]="year === dateAdapter.getYear(currentDate)"
              [disabled]="isYearDisabled(year)"
              (click)="selectYear(year)"
            >
              {{ year }}
            </button>
          </div>
        </div>
      </div>
      <div class="date-picker-footer" *ngIf="footerDescription">
        <div class="footer-description">
          {{ footerDescription }}
        </div>
        <!-- <div class="footer-actions">
          <button class="footer-button" (click)="onTodayClick()">{{ todayLabel }}</button>
          <button class="footer-button" (click)="onClearClick()">{{ clearLabel }}</button>
        </div> -->
      </div>
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
  @Input() mode: 'day' | 'month' | 'year' = 'day';
  @Input() isRange = false;
  @Input() customLabels: Array<CustomLabels> = [];
  @Input() calendarType: 'jalali' | 'georgian' = 'georgian';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() cssClass = '';
  @Input() footerDescription = '';
  @Input() activeInput: 'start' | 'end' | '' = null;
  @Input() showSidebar = true;
  @Input() showToday: boolean;

  // ========== Output Properties ==========
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() dateRangeSelected = new EventEmitter<DateRange>();
  @Output() closePicker = new EventEmitter<void>();
  @Output() clickInside = new EventEmitter<boolean>();

  // ========== ViewChild Properties ==========
  @ViewChild('itemSelector') itemSelector: ElementRef;

  // ========== Class Properties ==========
  dateAdapter: DateAdapter<Date>;
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
  }

  ngOnDestroy(): void {
    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }
  }
  // ========== Initialization Methods ==========
  initializeComponent(): void {
    this.setDateAdapter();
    this.setInitialDate();
    this.generateCalendar();
    this.weekDays = this.dateAdapter.getDayOfWeekNames('short');
    if (this.mode === 'year') {
      this.showYearSelector();
    }
    this.initLabels();
  }

  initLabels(): void {
    const today = this.dateAdapter.today();
    if (this.customLabels.length) {
      this.periods = this.customLabels;
    } else if (this.isRange) {
      this.generateDefaultPeriods(today);
    }
  }

  generateDefaultPeriods(today: Date): void {
    this.periods = [
      { 
        label: this.lang.lastDay, 
        value: [this.dateAdapter.addDays(today, -1), today] 
      },
      { 
        label: this.lang.lastWeek, 
        value: [this.dateAdapter.addDays(today, -7), today], 
        arrow: true 
      },
      { 
        label: this.lang.lastMonth, 
        value: [this.dateAdapter.addMonths(today, -1), today] 
      },
      { 
        label: this.lang.custom, 
        value: 'custom' 
      }
    ];
  }

  // ========== Date Adapter Methods ==========
  setDateAdapter(): void {
    this.dateAdapter = this.calendarType === 'jalali' ? this.jalali : this.gregorian;
    this.lang = this.dpService.locale;
  }

  // ========== Calendar Generation Methods ==========
  generateCalendar(): void {
    const firstDayOfMonth = this.dateAdapter.startOfMonth(this.currentDate);
    const startDate = this.dateAdapter.startOfWeek(firstDayOfMonth);
    this.days = Array.from({ length: 42 }, (_, i) => this.dateAdapter.addDays(startDate, i));
  }

  // ========== View Mode Management ==========
  setViewMode(): void {
    switch (this.mode) {
      case 'day':
        this.viewMode = 'days';
        break;
      case 'month':
        this.viewMode = 'months';
        break;
      case 'year':
        this.viewMode = 'years';
        break;
    }
  }

  showMonthSelector(): void {
    this.viewMode = 'months';
    this.generateYearList(100);
    this.scrollToSelectedItem(this.dateAdapter.getYear(this.getDate));
    this.cdr.detectChanges();
  }

  showYearSelector(): void {
    this.viewMode = 'years';
    this.generateYearRanges();
    this.generateYearList();
    this.scrollToSelectedItem();
    this.cdr.detectChanges();
  }

  // ========== Date Selection Methods ==========
  selectDate(date: Date): void {
    if (this.isDateDisabled(date)) return;

    if (this.isRange) {
      this.handleRangeSelection(date);
    } else {
      this.handleSingleSelection(date);
    }
    this.currentDate = date;
    this.cdr.detectChanges();
  }

  handleRangeSelection(date: Date): void {
    if (!this.selectedStartDate || 
        (this.selectedStartDate && this.selectedEndDate) || 
        this.dateAdapter.isBefore(date, this.selectedStartDate)) {
      this.selectedStartDate = date;
      this.selectedEndDate = null;
      this.activeInput = 'end';
      this.dpService.activeInput$.next('end');
      this.dateRangeSelected.emit({ start: this.selectedStartDate, end: null });
    } else {
      this.selectedEndDate = date;
      this.dateRangeSelected.emit({ start: this.selectedStartDate, end: this.selectedEndDate });
    }
  }

  handleSingleSelection(date: Date): void {
    this.selectedDate = date;
    this.dateSelected.emit(date);
  }

  selectMonth(month: number, closeAfterSelection: boolean = false): void {
    if (this.isMonthDisabled(month)) return;

    this.currentDate = this.dateAdapter.createDate(
      this.dateAdapter.getYear(this.currentDate), 
      month - 1, 
      1
    );

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

    this.currentDate = this.dateAdapter.createDate(
      year, 
      this.dateAdapter.getMonth(this.currentDate), 
      1
    );

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
      return;
    }

    let id: number;
    if (this.viewMode === 'months') {
      this.currentDate = this.dateAdapter.addYears(this.currentDate, -1);
      id = this.dateAdapter.getYear(this.currentDate);
    }

    if (this.viewMode === 'years') {
      const yearStart = this.yearList[0] - 15;
      this.yearList = Array.from({ length: 15 }, (_, i) => yearStart + i);
      id = yearStart;
    }

    this.cdr.detectChanges();
    this.scrollToSelectedItem(id);
  }

  goNext(): void {
    if (this.viewMode === 'days') {
      this.nextMonth();
      return;
    }

    let id: number;
    if (this.viewMode === 'months') {
      this.currentDate = this.dateAdapter.addYears(this.currentDate, 1);
      id = this.dateAdapter.getYear(this.currentDate);
    }

    if (this.viewMode === 'years') {
      const yearStart = this.yearList[14] + 1;
      this.yearList = Array.from({ length: 15 }, (_, i) => yearStart + i);
      id = yearStart;
    }

    this.cdr.detectChanges();
    this.scrollToSelectedItem(id);
  }

  prevMonth(): void {
    if (this.isPrevMonthDisabled()) return;
    this.currentDate = this.dateAdapter.addMonths(this.currentDate, -1);
    this.generateCalendar();
    this.scrollToSelectedItem(this.dateAdapter.getMonth(this.currentDate) + 1);
  }

  nextMonth(): void {
    if (this.isNextMonthDisabled()) return;
    this.currentDate = this.dateAdapter.addMonths(this.currentDate, 1);
    this.generateCalendar();
    this.scrollToSelectedItem(this.dateAdapter.getMonth(this.currentDate) + 1);
  }

  // ========== State Check Methods ==========
  isSelected(date: Date): boolean {
    if (this.isRange) {
      return this.isRangeStart(date) || this.isRangeEnd(date);
    }
    return this.selectedDate && this.dateAdapter.isSameDay(date, this.selectedDate);
  }

  isRangeStart(date: Date): boolean {
    return this.isRange && 
           this.selectedStartDate && 
           this.dateAdapter.isSameDay(date, this.selectedStartDate);
  }

  isRangeEnd(date: Date): boolean {
    return this.isRange && 
           this.selectedEndDate && 
           this.dateAdapter.isSameDay(date, this.selectedEndDate);
  }

  isInRange(date: Date): boolean {
    return this.isRange && 
           this.selectedStartDate && 
           (this.selectedEndDate || this.tempEndDate) &&
           this.dateAdapter.isAfter(date, this.selectedStartDate) &&
           this.dateAdapter.isBefore(date, this.selectedEndDate || this.tempEndDate);
  }

  isToday(date: Date): boolean {
    return this.dateAdapter.isSameDay(date, this.dateAdapter.today()) && this.showToday;
  }

  isActiveMonth(month: number): boolean {
    return this.dateAdapter.getMonth(this.currentDate) === month - 1;
  }

  isActiveYear(year: number): boolean {
    return year === this.dateAdapter.getYear(this.currentDate);
  }

  isActiveYearRange(startYear: number): boolean {
    return startYear === this.yearList[0];
  }

  // ========== Disabled State Methods ==========
  isDateDisabled(date: Date): boolean {
    return (this.minDate && this.dateAdapter.isBefore(date, this.minDate)) ||
           (this.maxDate && this.dateAdapter.isAfter(date, this.maxDate));
  }

  isMonthDisabled(month: number): boolean {
    const year = this.dateAdapter.getYear(this.currentDate);
    const startOfMonth = this.dateAdapter.createDate(year, month - 1, 1);
    const endOfMonth = this.dateAdapter.endOfMonth(startOfMonth);
    return this.isDateDisabled(startOfMonth) && this.isDateDisabled(endOfMonth);
  }

  isYearDisabled(year: number): boolean {
    if (this.minDate && this.dateAdapter.getYear(this.minDate) > year) return true;
    if (this.maxDate && this.dateAdapter.getYear(this.maxDate) < year) return true;
    return false;
  }

  isYearRangeDisabled(yearRange: YearRange): boolean {
    if (this.minDate && this.dateAdapter.getYear(this.minDate) > yearRange.end) return true;
    if (this.maxDate && this.dateAdapter.getYear(this.maxDate) < yearRange.start) return true;
    return false;
  }

  isPrevMonthDisabled(): boolean {
    if (!this.minDate) return false;

    const minYear = this.dateAdapter.getYear(this.minDate);

    switch (this.viewMode) {
      case 'days':
        const prevMonth = this.dateAdapter.getMonth(this.currentDate) - 1;
        return this.dateAdapter.getMonth(this.minDate) > prevMonth;
      case 'months':
        const prevYear = this.dateAdapter.getYear(this.currentDate) - 1;
        return minYear > prevYear;
      case 'years':
        return minYear > this.yearList[this.yearList.length - 1];
      default:
        return false;
    }
  }

  isNextMonthDisabled(): boolean {
    if (!this.maxDate) return false;

    const maxYear = this.dateAdapter.getYear(this.maxDate);

    switch (this.viewMode) {
      case 'days':
        const nextMonth = this.dateAdapter.getMonth(this.currentDate) + 1;
        return this.dateAdapter.getMonth(this.maxDate) < nextMonth;
      case 'months':
        const nextYear = this.dateAdapter.getYear(this.currentDate) + 1;
        return maxYear < nextYear;
      case 'years':
        return maxYear < this.yearList[0];
      default:
        return false;
    }
  }

  // ========== Event Handlers ==========
  onMouseEnter(date: Date, event: Event): void {
    if (this.isRange && this.selectedStartDate && !this.selectedEndDate) {
      this.tempEndDate = date;
    }
  }

  @HostListener('click')
  onClickInside(): void {
    this.clickInside.emit(true);
  }

  // ========== Utility Methods ==========
  getMonthName(month: number): string {
    return this.dateAdapter.getMonthNames('long')[month - 1];
  }

  getCurrentMonthName(): string {
    return this.dateAdapter.getMonthNames('long')[this.dateAdapter.getMonth(this.currentDate)];
  }

  getCurrentYear(): number {
    return this.dateAdapter.getYear(this.currentDate);
  }

  getWeekDays(): string[] {
    return this.weekDays;
  }

  isSameMonth(date1: Date, date2: Date): boolean {
    return this.dateAdapter.isSameMonth(date1, date2);
  }

  closeDatePicker(): void {
    this.closePicker.emit();
  }

  // ========== Year Management Methods ==========
  generateYearRanges(): void {
    const currentYear = this.dateAdapter.getYear(this.dateAdapter.today());
    const startYear = Math.floor(currentYear / 15) * 15 - 90; // Start 6 ranges before the current year
    this.yearRanges = [];
    
    for (let i = 0; i < 15; i++) {
      const start = startYear + i * 15;
      this.yearRanges.push({ start, end: start + 14 });
    }
  }

  generateYearList(length: number = 15): void {
    const date = this.selectedDate || this.selectedEndDate || this.selectedStartDate || new Date();
    const currentYear = this.dateAdapter.getYear(date);
    
    let start: number;
    if (this.viewMode === 'years') {
      const currentRange = this.yearRanges.find(range => 
        range.start <= currentYear && range.end >= currentYear
      );
      start = currentRange ? currentRange.start : currentYear;
    } else {
      start = this.dateAdapter.getYear(date) - Math.round(length / 2);
    }
    
    this.yearList = Array.from({ length }, (_, i) => start + i);
  }

  selectYearRange(startYear: number): void {
    this.yearList = Array.from({ length: 15 }, (_, i) => startYear + i);
    this.viewMode = 'years';
    this.cdr.detectChanges();
    this.scrollToSelectedItem(startYear);
  }

  // ========== Period Selection Methods ==========
  isActivePeriod(period: CustomLabels): boolean {
    const sameStart = this.dateAdapter.isEqual(
      this.dateAdapter.startOfDay(period.value[0] as Date),
      this.dateAdapter.startOfDay(this.selectedStartDate)
    );
    
    const sameEnd = this.dateAdapter.isEqual(
      this.dateAdapter.startOfDay(period.value[1] as Date),
      this.dateAdapter.startOfDay(this.selectedEndDate)
    );

    
    if (period.value === 'custom') {
      let isActiveOther = this.periods.find(p => p.arrow);
      return !isActiveOther;
    };
    
    period.arrow = sameStart && sameEnd;
    return sameStart && sameEnd;
  }

  selectPeriod(period: CustomLabels): void {
    this.selectedPeriod = period.value;
    
    if (period.value !== 'custom') {
      const [start, end] = period.value as Date[];
      this.dateRangeSelected.emit({ start, end });
    }
  }

  // ========== Scroll Management ==========
  scrollToSelectedItem(id: number | null = null): void {
    if (!this.showSidebar) return;

    if (this.timeoutId != null) {
      clearTimeout(this.timeoutId);
    }

    const itemId = this.determineScrollItemId(id);
    if (!itemId || !this.itemSelector) return;

    this.timeoutId = setTimeout(() => {
      const selectedElement = this.itemSelector.nativeElement.querySelector(`#selector_${itemId}`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  }

  determineScrollItemId(id: number | null): number | null {
    if (id != null) return id;
    if (!this.getDate) return null;

    switch (this.viewMode) {
      case 'days':
        return this.dateAdapter.getMonth(this.getDate) + 1;
      case 'months':
        return this.dateAdapter.getYear(this.getDate);
      case 'years':
        const currentYear = this.dateAdapter.getYear(this.getDate);
        const currentRange = this.yearRanges.find(range => 
          range.start <= currentYear && range.end >= currentYear
        );
        return currentRange?.start || null;
      default:
        return null;
    }
  }

  // ========== State Management ==========
  handleChanges(changes: SimpleChanges): void {
    if (changes['calendarType']) {
      this.setDateAdapter();
    }
    
    if (changes['selectedDate'] || 
        changes['selectedStartDate'] || 
        changes['selectedEndDate'] || 
        changes['mode'] || 
        changes['calendarType']) {
      this.setInitialDate();
      this.generateCalendar();
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
      if (this.activeInput === 'start') {
        return this.selectedStartDate || this.dateAdapter.today();
      }
      return this.selectedEndDate || this.selectedStartDate || this.dateAdapter.today();
    }
    
    return this.selectedDate || this.dateAdapter.today();
  }

  adjustCurrentDateToValidRange(): void {
    let adjustedDate = this.currentDate;
    
    if (this.minDate && this.dateAdapter.isBefore(adjustedDate, this.minDate)) {
      adjustedDate = this.minDate;
    } else if (this.maxDate && this.dateAdapter.isAfter(adjustedDate, this.maxDate)) {
      adjustedDate = this.maxDate;
    }

    if (!this.dateAdapter.isSameDay(this.currentDate, adjustedDate)) {
      this.currentDate = adjustedDate;
      this.generateCalendar();
    }
  }
}