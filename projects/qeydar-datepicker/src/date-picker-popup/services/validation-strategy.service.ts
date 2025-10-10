import { Injectable } from '@angular/core';
import { DateAdapter } from '../../date-adapter';
import { YearRange } from '../../utils/models';

@Injectable({
  providedIn: 'root',
})
export class ValidationStrategyService {
  /**
   * Check if a date is disabled based on various criteria
   */
  isDateDisabled(
    date: Date,
    dateAdapter: DateAdapter<Date>,
    minDate?: Date | null,
    maxDate?: Date | null,
    disabledDates?: Array<Date | string>,
    disabledDatesFilter?: (date: Date) => boolean,
    dateFormat?: string
  ): boolean {
    // Check min/max date constraints
    if (
      (minDate && dateAdapter.isBefore(date, minDate)) ||
      (maxDate && dateAdapter.isAfter(date, maxDate))
    ) {
      return true;
    }

    // Check if date is in disabled dates array
    const parsedDisabledDates = this.parseDisabledDates(
      disabledDates || [],
      dateAdapter,
      dateFormat
    );
    const isDisabledDate = parsedDisabledDates.some((disabledDate) =>
      dateAdapter.isSameDay(date, disabledDate)
    );

    // Check custom filter function if provided
    const isFilterDisabled = disabledDatesFilter
      ? disabledDatesFilter(date)
      : false;

    return isDisabledDate || isFilterDisabled;
  }

  /**
   * Check if a month is disabled (all days in month are disabled)
   */
  isMonthDisabled(
    month: number,
    year: number,
    dateAdapter: DateAdapter<Date>,
    minDate?: Date | null,
    maxDate?: Date | null,
    disabledDates?: Array<Date | string>,
    disabledDatesFilter?: (date: Date) => boolean,
    dateFormat?: string
  ): boolean {
    const startOfMonth = dateAdapter.createDate(year, month - 1, 1);

    // Check if all days in month are disabled
    const daysInMonth = dateAdapter.getDaysInMonth(startOfMonth);
    let allDaysDisabled = true;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = dateAdapter.createDate(year, month - 1, day);
      if (
        !this.isDateDisabled(
          date,
          dateAdapter,
          minDate,
          maxDate,
          disabledDates,
          disabledDatesFilter,
          dateFormat
        )
      ) {
        allDaysDisabled = false;
        break;
      }
    }

    return allDaysDisabled;
  }

  /**
   * Check if a year is disabled (all months in year are disabled)
   */
  isYearDisabled(
    year: number,
    dateAdapter: DateAdapter<Date>,
    minDate?: Date | null,
    maxDate?: Date | null,
    disabledDates?: Array<Date | string>,
    disabledDatesFilter?: (date: Date) => boolean,
    dateFormat?: string
  ): boolean {
    // Check year boundaries
    if (minDate && dateAdapter.getYear(minDate) > year) return true;
    if (maxDate && dateAdapter.getYear(maxDate) < year) return true;

    // Check if all months in year are disabled
    const firstOfMonth = dateAdapter.createDate(year, 0, 1);
    let day = 1;

    for (
      let date = firstOfMonth;
      date.getFullYear() == firstOfMonth.getFullYear();
      date = dateAdapter.addDays(firstOfMonth, day++)
    ) {
      if (
        !this.isDateDisabled(
          date,
          dateAdapter,
          minDate,
          maxDate,
          disabledDates,
          disabledDatesFilter,
          dateFormat
        )
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if a year range is disabled
   */
  isYearRangeDisabled(
    yearRange: YearRange,
    dateAdapter: DateAdapter<Date>,
    minDate?: Date | null,
    maxDate?: Date | null,
    disabledDates?: Array<Date | string>,
    disabledDatesFilter?: (date: Date) => boolean,
    dateFormat?: string
  ): boolean {
    if (minDate && dateAdapter.getYear(minDate) > yearRange.end) return true;
    if (maxDate && dateAdapter.getYear(maxDate) < yearRange.start) return true;

    // Check if all years in range are disabled
    for (let year = yearRange.start; year <= yearRange.end; year++) {
      if (
        !this.isYearDisabled(
          year,
          dateAdapter,
          minDate,
          maxDate,
          disabledDates,
          disabledDatesFilter,
          dateFormat
        )
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if previous navigation is disabled
   */
  isPrevNavigationDisabled(
    currentDate: Date,
    viewMode: 'days' | 'months' | 'years',
    dateAdapter: DateAdapter<Date>,
    minDate?: Date | null,
    yearList?: number[]
  ): boolean {
    if (!minDate) return false;

    const minYear = dateAdapter.getYear(minDate);
    const minMonth = dateAdapter.getMonth(minDate);
    const currentYear = dateAdapter.getYear(currentDate);
    const currentMonth = dateAdapter.getMonth(currentDate);

    switch (viewMode) {
      case 'days':
        const prevMonthUnnorm = currentMonth - 1;
        const prevMonthYear = currentYear + Math.floor(prevMonthUnnorm / 12);
        // نرمال‌سازی برای مقادیر منفی
        const prevMonthIndex = (prevMonthUnnorm + 12) % 12;

        if (minYear > prevMonthYear) return true;
        if (minYear === prevMonthYear && minMonth > prevMonthIndex) return true;
        return false;

      case 'months':
        const prevYear = currentYear - 1;
        return minYear > prevYear;

      case 'years':
        if (!yearList || yearList.length === 0) return false;
        const minDisplayedYear = Math.min(...yearList);
        const prevLastYear = minDisplayedYear - 1;
        return minYear > prevLastYear;

      default:
        return false;
    }
  }

  /**
   * Check if next navigation is disabled
   */
  isNextNavigationDisabled(
    currentDate: Date,
    viewMode: 'days' | 'months' | 'years',
    dateAdapter: DateAdapter<Date>,
    maxDate?: Date | null,
    yearList?: number[]
  ): boolean {
    if (!maxDate) return false;

    const maxYear = dateAdapter.getYear(maxDate);
    const maxMonth = dateAdapter.getMonth(maxDate);
    const currentYear = dateAdapter.getYear(currentDate);
    const currentMonth = dateAdapter.getMonth(currentDate);

    switch (viewMode) {
      case 'days':
        const nextMonthUnnorm = currentMonth + 1;
        const nextMonthYear = currentYear + Math.floor(nextMonthUnnorm / 12);
        const nextMonthIndex = nextMonthUnnorm % 12;

        // اگر maxDate قبل از شروع ماه بعدی باشد، navigation غیرفعال است
        if (maxYear < nextMonthYear) return true;
        if (maxYear === nextMonthYear && maxMonth < nextMonthIndex) return true;
        return false;

      case 'months':
        const nextYear = currentYear + 1;
        return maxYear < nextYear;
      case 'years':
        if (!yearList || yearList.length === 0) return false;
        const maxDisplayedYear = Math.max(...yearList);
        const nextFirstYear = maxDisplayedYear + 1;
        return maxYear < nextFirstYear;
      default:
        return false;
    }
  }

  /**
   * Parse disabled dates from various formats
   */
  parseDisabledDates(
    disabledDates: Array<Date | string>,
    dateAdapter: DateAdapter<Date>,
    dateFormat?: string
  ): Date[] {
    return disabledDates
      .map((date) => {
        if (date instanceof Date) {
          return dateAdapter.startOfDay(date);
        }
        const parsedDate = dateAdapter.parse(date, dateFormat);
        return parsedDate || null;
      })
      .filter((date) => date !== null) as Date[];
  }

  /**
   * Adjust current date to valid range
   */
  adjustDateToValidRange(
    currentDate: Date,
    dateAdapter: DateAdapter<Date>,
    minDate?: Date | null,
    maxDate?: Date | null
  ): Date {
    let adjustedDate = currentDate;

    if (minDate && dateAdapter.isBefore(adjustedDate, minDate)) {
      adjustedDate = minDate;
    } else if (maxDate && dateAdapter.isAfter(adjustedDate, maxDate)) {
      adjustedDate = maxDate;
    }

    return adjustedDate;
  }

  /**
   * Check if date is within valid range
   */
  isDateInValidRange(
    date: Date,
    dateAdapter: DateAdapter<Date>,
    minDate?: Date | null,
    maxDate?: Date | null
  ): boolean {
    if (minDate && dateAdapter.isBefore(date, minDate)) return false;
    if (maxDate && dateAdapter.isAfter(date, maxDate)) return false;
    return true;
  }

  /**
   * Validate date range
   */
  validateDateRange(
    startDate: Date,
    endDate: Date,
    dateAdapter: DateAdapter<Date>,
    minDate?: Date | null,
    maxDate?: Date | null
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if start date is valid
    if (!this.isDateInValidRange(startDate, dateAdapter, minDate, maxDate)) {
      errors.push('Start date is outside valid range');
    }

    // Check if end date is valid
    if (!this.isDateInValidRange(endDate, dateAdapter, minDate, maxDate)) {
      errors.push('End date is outside valid range');
    }

    // Check if start date is before end date
    if (dateAdapter.isAfter(startDate, endDate)) {
      errors.push('Start date must be before end date');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
