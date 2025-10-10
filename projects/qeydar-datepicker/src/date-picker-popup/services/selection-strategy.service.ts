import { Injectable } from '@angular/core';
import { DateAdapter } from '../../date-adapter';
import { CustomLabels, DateRange } from '../../utils/models';

@Injectable({
  providedIn: 'root',
})
export class SelectionStrategyService {
  /**
   * Check if a date is selected (for single selection)
   */
  isSelected(
    date: Date,
    selectedDate: Date | null,
    dateAdapter: DateAdapter<Date>
  ): boolean {
    return selectedDate && dateAdapter.isSameDay(date, selectedDate);
  }

  /**
   * Check if a date is the start of a range
   */
  isRangeStart(
    date: Date,
    selectedStartDate: Date | null,
    dateAdapter: DateAdapter<Date>
  ): boolean {
    return selectedStartDate && dateAdapter.isSameDay(date, selectedStartDate);
  }

  /**
   * Check if a date is the end of a range
   */
  isRangeEnd(
    date: Date,
    selectedEndDate: Date | null,
    dateAdapter: DateAdapter<Date>
  ): boolean {
    return selectedEndDate && dateAdapter.isSameDay(date, selectedEndDate);
  }

  /**
   * Check if a date is in range (between start and end)
   */
  isInRange(
    date: Date,
    selectedStartDate: Date | null,
    selectedEndDate: Date | null,
    tempEndDate: Date | null,
    dateAdapter: DateAdapter<Date>
  ): boolean {
    if (!selectedStartDate || (!selectedEndDate && !tempEndDate)) {
      return false;
    }

    const endDate = selectedEndDate || tempEndDate;
    return (
      dateAdapter.isAfter(date, selectedStartDate) &&
      dateAdapter.isBefore(date, endDate)
    );
  }

  /**
   * Check if a date is selected (for range selection)
   */
  isRangeSelected(
    date: Date,
    selectedStartDate: Date | null,
    selectedEndDate: Date | null,
    dateAdapter: DateAdapter<Date>
  ): boolean {
    return (
      this.isRangeStart(date, selectedStartDate, dateAdapter) ||
      this.isRangeEnd(date, selectedEndDate, dateAdapter)
    );
  }

  /**
   * Handle single date selection
   */
  handleSingleSelection(
    date: Date,
    selectedDate: Date | null,
    showTimePicker: boolean,
    existingTime?: Date
  ): { selectedDate: Date; shouldEmit: boolean } {
    let finalDate = date;

    if (showTimePicker && existingTime) {
      finalDate = this.applyTimeToDate(date, existingTime);
    }

    return {
      selectedDate: finalDate,
      shouldEmit: !showTimePicker,
    };
  }

  /**
   * Handle range date selection
   */
  handleRangeSelection(
    date: Date,
    selectedStartDate: Date | null,
    selectedEndDate: Date | null,
    showTimePicker: boolean,
    existingTime?: Date
  ): {
    selectedStartDate: Date | null;
    selectedEndDate: Date | null;
    shouldEmit: boolean;
    activeInput: 'start' | 'end';
  } {
    let finalDate = date;

    if (showTimePicker && existingTime) {
      finalDate = this.applyTimeToDate(date, existingTime);
    }

    // If no start date or both dates are selected or new date is before start date
    if (
      !selectedStartDate ||
      (selectedStartDate && selectedEndDate) ||
      this.isDateBefore(date, selectedStartDate)
    ) {
      return {
        selectedStartDate: finalDate,
        selectedEndDate: null,
        shouldEmit: true,
        activeInput: 'end',
      };
    } else {
      return {
        selectedStartDate,
        selectedEndDate: finalDate,
        shouldEmit: true,
        activeInput: 'end',
      };
    }
  }

  /**
   * Check if a period is active (for sidebar periods)
   */
  isActivePeriod(
    period: CustomLabels,
    selectedStartDate: Date | null,
    selectedEndDate: Date | null,
    dateAdapter: DateAdapter<Date>,
    allPeriods: CustomLabels[]
  ): boolean {
    if (!selectedStartDate || !selectedEndDate) return false;

    if (period.value === 'custom') {
      const otherPeriods = allPeriods.filter((p) => p.value !== 'custom');
      const hasActiveOther = otherPeriods.some((p) =>
        this.isPeriodMatch(p, selectedStartDate, selectedEndDate, dateAdapter)
      );
      return !hasActiveOther;
    }

    return this.isPeriodMatch(
      period,
      selectedStartDate,
      selectedEndDate,
      dateAdapter
    );
  }

  /**
   * Check if a period is matched (for sidebar periods)
   */
  isPeriodMatch(
    period: CustomLabels,
    selectedStartDate: Date,
    selectedEndDate: Date,
    dateAdapter: DateAdapter<Date>
  ): boolean {
    const [start, end] = period.value as Date[];

    const sameStart = dateAdapter.isEqual(
      dateAdapter.startOfDay(start),
      dateAdapter.startOfDay(selectedStartDate)
    );

    const sameEnd = dateAdapter.isEqual(
      dateAdapter.startOfDay(end),
      dateAdapter.startOfDay(selectedEndDate)
    );

    return sameStart && sameEnd;
  }

  /**
   * Handle period selection
   */
  selectPeriod(period: CustomLabels): {
    selectedPeriod: any;
    dateRange?: DateRange;
    isCustom: boolean;
  } {
    if (period.value === 'custom') {
      return {
        selectedPeriod: 'custom',
        isCustom: true,
      };
    }

    const [start, end] = period.value as Date[];
    return {
      selectedPeriod: period.value,
      dateRange: { start, end },
      isCustom: false,
    };
  }

  /**
   * Apply time to a date
   */
  applyTimeToDate(date: Date, timeDate: Date): Date {
    const result = new Date(date);
    result.setHours(timeDate.getHours());
    result.setMinutes(timeDate.getMinutes());
    result.setSeconds(timeDate.getSeconds());
    return result;
  }

  /**
   * Check if first date is before second date
   */
  private isDateBefore(date1: Date, date2: Date): boolean {
    return date1 < date2;
  }

  /**
   * Create date range object
   */
  createDateRange(start: Date | null, end: Date | null): DateRange | null {
    if (!start) return null;
    return { start, end };
  }

  /**
   * Check if range selection is complete
   */
  isRangeComplete(
    selectedStartDate: Date | null,
    selectedEndDate: Date | null
  ): boolean {
    return !!(selectedStartDate && selectedEndDate);
  }

  /**
   * Get the active date for range selection
   */
  getActiveDateForRange(
    activeInput: 'start' | 'end' | '',
    selectedStartDate: Date | null,
    selectedEndDate: Date | null
  ): Date | null {
    if (activeInput === 'start') {
      return selectedStartDate;
    } else if (activeInput === 'end') {
      return selectedEndDate;
    }
    return null;
  }

  /**
   * Update time for range selection
   */
  updateRangeTime(
    timeDate: Date,
    activeInput: 'start' | 'end' | '',
    selectedStartDate: Date | null,
    selectedEndDate: Date | null
  ): {
    selectedStartDate: Date | null;
    selectedEndDate: Date | null;
    shouldEmit: boolean;
  } {
    if (activeInput === 'start' && selectedStartDate) {
      const updatedDate = this.applyTimeToDate(selectedStartDate, timeDate);
      return {
        selectedStartDate: updatedDate,
        selectedEndDate,
        shouldEmit: true,
      };
    } else if (activeInput === 'end' && selectedEndDate) {
      const updatedDate = this.applyTimeToDate(selectedEndDate, timeDate);
      return {
        selectedStartDate,
        selectedEndDate: updatedDate,
        shouldEmit: true,
      };
    }

    return {
      selectedStartDate,
      selectedEndDate,
      shouldEmit: false,
    };
  }

  /**
   * Update time for single selection
   */
  updateSingleTime(
    timeDate: Date,
    selectedDate: Date | null
  ): { selectedDate: Date; shouldEmit: boolean } {
    if (!selectedDate) {
      return {
        selectedDate: new Date(),
        shouldEmit: false,
      };
    }

    const updatedDate = this.applyTimeToDate(selectedDate, timeDate);
    return {
      selectedDate: updatedDate,
      shouldEmit: false,
    };
  }

  /**
   * Handle mouse enter for range selection preview
   */
  handleMouseEnter(
    date: Date,
    selectedStartDate: Date | null,
    selectedEndDate: Date | null
  ): Date | null {
    if (selectedStartDate && !selectedEndDate) {
      return date; // This will be used as tempEndDate
    }
    return null;
  }

  /**
   * Check if date is today
   */
  isToday(
    date: Date,
    dateAdapter: DateAdapter<Date>,
    showToday: boolean
  ): boolean {
    return showToday && dateAdapter.isSameDay(date, dateAdapter.today());
  }
}
