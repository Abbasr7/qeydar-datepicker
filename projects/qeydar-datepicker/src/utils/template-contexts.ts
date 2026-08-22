import { TemplateRef } from '@angular/core';
import { DatepickerMode } from './types';

/** Names accepted by the projected custom-template directive. */
export type DatePickerTemplateType =
  | 'day'
  | 'month'
  | 'year'
  | 'toolbar'
  | 'header'
  | 'footer'
  | 'body';

/** Context supplied to a custom day-cell template. */
export interface DayTemplateContext {
  $implicit: Date;
  day: Date;
  date: Date;
  dayNumber: number;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isCurrentMonth: boolean;
}

/** Context supplied to a custom month-cell template. */
export interface MonthTemplateContext {
  $implicit: number;
  month: number;
  name: string;
  isSelected: boolean;
  isInRange: boolean;
  isDisabled: boolean;
}

/** Context supplied to a custom year-cell template. */
export interface YearTemplateContext {
  $implicit: number;
  year: number;
  isSelected: boolean;
  isInRange: boolean;
  isDisabled: boolean;
}

/** Context supplied to a toolbar rendered above the calendar header. */
export interface ToolbarTemplateContext {
  currentDate: Date;
  mode: DatepickerMode;
  isRange: boolean;
  selectQuickDate: (date: Date) => void;
  selectQuickRange: (start: Date, end: Date) => void;
  close: () => void;
}

/** Context supplied when replacing the built-in calendar header. */
export interface HeaderTemplateContext {
  currentDate: Date;
  currentMonthName: string;
  currentYear: number;
  viewMode: 'days' | 'months' | 'years';
  mode: DatepickerMode;
  prevDisabled: boolean;
  nextDisabled: boolean;
  prev: () => void;
  next: () => void;
  showMonths: () => void;
  showYears: () => void;
}

/** Context supplied when replacing the built-in calendar footer. */
export interface FooterTemplateContext {
  selectedDate: Date | null;
  selectedStartDate: Date | null;
  selectedEndDate: Date | null;
  isRange: boolean;
  showTimePicker: boolean;
  confirm: () => void;
  cancel: () => void;
  today: () => void;
}

/** Context supplied when replacing all default day/month/year grids. */
export interface BodyTemplateContext {
  viewMode: 'days' | 'months' | 'years';
  currentDate: Date;
  days: Date[];
  monthListNum: number[];
  yearList: number[];
  weekDays: string[];
  selection: {
    isSelected(date: Date): boolean;
    isInRange(date: Date): boolean;
    isRangeStart(date: Date): boolean;
    isRangeEnd(date: Date): boolean;
    isToday(date: Date): boolean;
  };
  validation: {
    isDateDisabled(date: Date): boolean;
    isMonthDisabled(month: number): boolean;
    isYearDisabled(year: number): boolean;
  };
  actions: {
    selectDay(date: Date, closeAfterSelection?: boolean): void;
    selectMonth(month: number): void;
    selectYear(year: number): void;
    goPrev(): void;
    goNext(): void;
  };
  utils: {
    generateYearList(length: number): number[]
  }
}

/** Internal typed map used to resolve projected templates by slot name. */
export type DatePickerTemplateMap = Partial<{
  [K in DatePickerTemplateType]: TemplateRef<unknown>;
}>;
