import { Injectable } from '@angular/core';
import { DateAdapter } from '../../date-adapter';
import { CustomLabels, YearRange } from '../../utils/models';
import { DatepickerMode } from '../../utils/types';

@Injectable({
  providedIn: 'root'
})
export class CalendarUtilsService {
  /**
   * Generate days grid for calendar view
   */
  generateDaysGrid(currentDate: Date, dateAdapter: DateAdapter<Date>): Date[] {
    const firstDayOfMonth = dateAdapter.startOfMonth(currentDate);
    const startDate = dateAdapter.startOfWeek(firstDayOfMonth);
    return Array.from({ length: 42 }, (_, i) => dateAdapter.addDays(startDate, i));
  }

  /**
   * Generate month list (1-12)
   */
  generateMonthList(): number[] {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }

  /**
   * Generate year list around a specific year
   */
  generateYearList(centerYear: number, length: number = 15): number[] {
    const start = centerYear - Math.floor(length / 2);
    return Array.from({ length }, (_, i) => start + i);
  }

  /**
   * Generate year ranges for year selector
   */
  generateYearRanges(length: number = 15, dateAdapter: DateAdapter<Date>, centerDate?: Date): YearRange[] {
    const yearCount = 15;
    // Use provided centerDate if present, otherwise fall back to current date
    const currentYear = dateAdapter.getYear(centerDate || new Date()) ?? new Date().getFullYear();
    // Calculate start so that the currentYear is roughly centered in the overall ranges
    const startYear = currentYear - Math.floor(yearCount / 2) - (yearCount * Math.floor(length / 2));
    const yearRanges: YearRange[] = [];

    for (let i = 0; i < length; i++) {
      const start = startYear + i * yearCount;
      yearRanges.push({ start, end: start + yearCount - 1 });
    }

    return yearRanges;
  }

  /**
   * Get week day names
   */
  getWeekDays(dateAdapter: DateAdapter<Date>): string[] {
    return dateAdapter.getDayOfWeekNames('short');
  }

  /**
   * Get month names
   */
  getMonthNames(dateAdapter: DateAdapter<Date>, format: 'long' | 'short' = 'long'): string[] {
    return dateAdapter.getMonthNames(format);
  }

  /**
   * Get month name by number
   */
  getMonthName(month: number, dateAdapter: DateAdapter<Date>): string {
    return dateAdapter.getMonthNames('long')[month - 1];
  }

  /**
   * Get current month name
   */
  getCurrentMonthName(currentDate: Date, dateAdapter: DateAdapter<Date>): string {
    const month = dateAdapter.getMonth(currentDate);
    return dateAdapter.getMonthNames('long')[month ?? 0];
  }

  /**
   * Get current year
   */
  getCurrentYear(currentDate: Date, dateAdapter: DateAdapter<Date>): number {
    return dateAdapter.getYear(currentDate) ?? new Date().getFullYear();
  }

  /**
   * Navigate to previous month
   */
  navigateToPrevMonth(currentDate: Date, dateAdapter: DateAdapter<Date>): Date {
    return dateAdapter.addMonths(currentDate, -1);
  }

  /**
   * Navigate to next month
   */
  navigateToNextMonth(currentDate: Date, dateAdapter: DateAdapter<Date>): Date {
    return dateAdapter.addMonths(currentDate, 1);
  }

  /**
   * Navigate to previous year
   */
  navigateToPrevYear(currentDate: Date, dateAdapter: DateAdapter<Date>): Date {
    return dateAdapter.addYears(currentDate, -1);
  }

  /**
   * Navigate to next year
   */
  navigateToNextYear(currentDate: Date, dateAdapter: DateAdapter<Date>): Date {
    return dateAdapter.addYears(currentDate, 1);
  }

  /**
   * Navigate to previous year range
   */
  navigateToPrevYearRange(yearList: number[]): number[] {
    const yearStart = yearList[0] - 15;
    return Array.from({ length: 15 }, (_, i) => yearStart + i);
  }

  /**
   * Navigate to next year range
   */
  navigateToNextYearRange(yearList: number[]): number[] {
    const yearStart = yearList[14] + 1;
    return Array.from({ length: 15 }, (_, i) => yearStart + i);
  }

  /**
   * Create date for month selection
   */
  createDateForMonth(year: number, month: number, dateAdapter: DateAdapter<Date>): Date {
    return dateAdapter.createDate(year, month - 1, 1);
  }

  /**
   * Create date for year selection
   */
  createDateForYear(year: number, currentDate: Date, dateAdapter: DateAdapter<Date>): Date {
    return dateAdapter.createDate(
      year, 
      dateAdapter.getMonth(currentDate) ?? 0, 
      1
    );
  }

  /**
   * Set year for existing date
   */
  setYearForDate(date: Date, year: number, dateAdapter: DateAdapter<Date>): Date {
    return dateAdapter.setYear(date, year);
  }

  /**
   * Determine view mode based on datepicker mode
   */
  determineViewMode(mode: DatepickerMode): 'days' | 'months' | 'years' {
    switch (mode) {
      case 'day':
        return 'days';
      case 'month':
        return 'months';
      case 'year':
        return 'years';
      default:
        return 'days';
    }
  }

  /**
   * Generate default periods for range picker
   */
  generateDefaultPeriods(today: Date, lang: any): CustomLabels[] {
    return [
      { 
        label: lang.lastDay, 
        value: [this.addDays(today, -1), today] 
      },
      { 
        label: lang.lastWeek, 
        value: [this.addDays(today, -7), today], 
        arrow: true 
      },
      { 
        label: lang.lastMonth, 
        value: [this.addMonths(today, -1), today] 
      },
      { 
        label: lang.custom, 
        value: 'custom' 
      }
    ];
  }

  /**
   * Helper method to add days (used in generateDefaultPeriods)
   */
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Helper method to add months (used in generateDefaultPeriods)
   */
  private addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Check if two dates are in the same month
   */
  isSameMonth(date1: Date, date2: Date, dateAdapter: DateAdapter<Date>): boolean {
    return dateAdapter.isSameMonth(date1, date2);
  }

  /**
   * Check if date is today
   */
  isToday(date: Date, dateAdapter: DateAdapter<Date>): boolean {
    return dateAdapter.isSameDay(date, dateAdapter.today());
  }

  /**
   * Check if month is active
   */
  isActiveMonth(month: number, currentDate: Date, dateAdapter: DateAdapter<Date>): boolean {
    const currentMonth = dateAdapter.getMonth(currentDate);
    return currentMonth !== null && currentMonth === month - 1;
  }

  /**
   * Check if year is active
   */
  isActiveYear(year: number, currentDate: Date, dateAdapter: DateAdapter<Date>): boolean {
    const currentYear = dateAdapter.getYear(currentDate);
    return currentYear !== null && year === currentYear;
  }

  /**
   * Check if year range is active
   */
  isActiveYearRange(startYear: number, yearList: number[]): boolean {
    return yearList?.includes(startYear);
  }

  /**
   * Get scroll item ID for different view modes
   */
  getScrollItemId(viewMode: 'days' | 'months' | 'years', date: Date, dateAdapter: DateAdapter<Date>, yearRanges?: YearRange[]): number | null {
    if (!date) return null;

    switch (viewMode) {
      case 'days':
        return (dateAdapter.getMonth(date) ?? 0) + 1;
      case 'months':
        return dateAdapter.getYear(date) ?? 0;
      case 'years':
        const currentYear = dateAdapter.getYear(date) ?? 0;
        const currentRange = yearRanges?.find(range => 
          range.start <= currentYear && range.end >= currentYear
        );
        return currentRange?.start || null;
      default:
        return null;
    }
  }
}
