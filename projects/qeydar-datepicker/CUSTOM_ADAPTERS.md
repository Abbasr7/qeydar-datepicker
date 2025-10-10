# Custom Date Adapters

This document explains how to create and use custom date adapters with the Qeydar DatePicker component.

## Overview

The Qeydar DatePicker now supports custom date adapters through dependency injection, allowing you to implement any calendar system while maintaining full compatibility with the existing API.

## Architecture

### Core Components

1. **`DATE_ADAPTER` InjectionToken**: Provides a way to inject custom date adapters
2. **`provideDateAdapter()` Factory**: Creates providers for default adapters
3. **`@Input() dateAdapter`**: Allows direct injection of custom adapters
4. **Fallback Logic**: Maintains backward compatibility with `calendarType`

### Adapter Selection Priority

1. **Custom Adapter via @Input**: `[dateAdapter]="myCustomAdapter"`
2. **Injected Adapter**: Provided via `DATE_ADAPTER` token
3. **Calendar Type Fallback**: Uses `calendarType` property (jalali/gregorian)

## Creating a Custom Adapter

### Example: Hijri Calendar Adapter

```typescript
import { Injectable } from '@angular/core';
import { DateAdapter } from './date-adapter';

@Injectable()
export class HijriDateAdapter implements DateAdapter<Date> {
  today(): Date {
    return new Date();
  }

  parse(value: any, formatString: string): Date | null {
    // Implement Hijri date parsing logic
    if (typeof value === 'string') {
      // Parse Hijri date string
      return this.parseHijriDate(value, formatString);
    }
    return null;
  }

  format(date: Date, formatString: string): string {
    // Convert Gregorian date to Hijri and format
    const hijriDate = this.gregorianToHijri(date);
    return this.formatHijriDate(hijriDate, formatString);
  }

  addDays(date: Date, amount: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
  }

  addMonths(date: Date, amount: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + amount);
    return result;
  }

  addYears(date: Date, amount: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + amount);
    return result;
  }

  addHours(date: Date, amount: number): Date {
    const result = new Date(date);
    result.setHours(result.getHours() + amount);
    return result;
  }

  getYear(date: Date): number | null {
    const hijriDate = this.gregorianToHijri(date);
    return hijriDate.year;
  }

  getMonth(date: Date): number | null {
    const hijriDate = this.gregorianToHijri(date);
    return hijriDate.month - 1; // 0-indexed
  }

  getDate(date: Date): number | null {
    const hijriDate = this.gregorianToHijri(date);
    return hijriDate.day;
  }

  getDayOfWeek(date: Date): number {
    return date.getDay();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const hijriMonths = [
      'محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی',
      'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی القعده', 'ذی الحجه'
    ];

    switch (style) {
      case 'long':
        return hijriMonths;
      case 'short':
        return hijriMonths.map(month => month.substring(0, 3));
      case 'narrow':
        return hijriMonths.map(month => month.substring(0, 1));
      default:
        return hijriMonths;
    }
  }

  getDateNames(): string[] {
    return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const hijriDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    switch (style) {
      case 'long':
        return hijriDays;
      case 'short':
        return hijriDays.map(day => day.substring(0, 3));
      case 'narrow':
        return hijriDays.map(day => day.substring(0, 1));
      default:
        return hijriDays;
    }
  }

  getFirstDayOfWeek(): number {
    return 0; // Sunday
  }

  getNumDaysInMonth(date: Date): number {
    const hijriDate = this.gregorianToHijri(date);
    return this.getHijriDaysInMonth(hijriDate.year, hijriDate.month);
  }

  clone(date: Date): Date {
    return new Date(date.getTime());
  }

  createDate(year: number, month: number, date: number): Date {
    const hijriDate = { year, month: month + 1, day: date };
    return this.hijriToGregorian(hijriDate);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    const hijri1 = this.gregorianToHijri(date1);
    const hijri2 = this.gregorianToHijri(date2);
    return hijri1.year === hijri2.year && 
           hijri1.month === hijri2.month && 
           hijri1.day === hijri2.day;
  }

  isSameMonth(date1: Date, date2: Date): boolean {
    const hijri1 = this.gregorianToHijri(date1);
    const hijri2 = this.gregorianToHijri(date2);
    return hijri1.year === hijri2.year && hijri1.month === hijri2.month;
  }

  isSameYear(date1: Date, date2: Date): boolean {
    const hijri1 = this.gregorianToHijri(date1);
    const hijri2 = this.gregorianToHijri(date2);
    return hijri1.year === hijri2.year;
  }

  isAfter(date1: Date, date2: Date): boolean {
    return date1.getTime() > date2.getTime();
  }

  isBefore(date1: Date, date2: Date): boolean {
    return date1.getTime() < date2.getTime();
  }

  isEqual(date1: Date, date2: Date): boolean {
    return date1.getTime() === date2.getTime();
  }

  startOfMonth(date: Date): Date {
    const hijriDate = this.gregorianToHijri(date);
    return this.hijriToGregorian({ year: hijriDate.year, month: hijriDate.month, day: 1 });
  }

  endOfMonth(date: Date): Date {
    const hijriDate = this.gregorianToHijri(date);
    const daysInMonth = this.getHijriDaysInMonth(hijriDate.year, hijriDate.month);
    return this.hijriToGregorian({ year: hijriDate.year, month: hijriDate.month, day: daysInMonth });
  }

  startOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const result = new Date(date);
    result.setDate(result.getDate() - dayOfWeek);
    return result;
  }

  isValidFormat(dateString: string, formatString: string): boolean {
    try {
      const parsed = this.parse(dateString, formatString);
      return parsed !== null;
    } catch {
      return false;
    }
  }

  max(dates: Date[]): Date {
    return new Date(Math.max(...dates.map(d => d.getTime())));
  }

  setYear(date: Date, year: number): Date {
    const hijriDate = this.gregorianToHijri(date);
    hijriDate.year = year;
    return this.hijriToGregorian(hijriDate);
  }

  startOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  getHours(date: Date): number | null {
    return date.getHours();
  }

  getMinutes(date: Date): number | null {
    return date.getMinutes();
  }

  getSeconds(date: Date): number | null {
    return date.getSeconds();
  }

  setHours(date: Date, hours: number): Date {
    const result = new Date(date);
    result.setHours(hours);
    return result;
  }

  setMinutes(date: Date, minutes: number): Date {
    const result = new Date(date);
    result.setMinutes(minutes);
    return result;
  }

  setSeconds(date: Date, seconds: number): Date {
    const result = new Date(date);
    result.setSeconds(seconds);
    return result;
  }

  getDaysInMonth(date: Date): number {
    return this.getNumDaysInMonth(date);
  }

  addMinutes(date: Date, amount: number): Date {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + amount);
    return result;
  }

  // Helper methods for Hijri conversion
  private gregorianToHijri(date: Date): { year: number; month: number; day: number } {
    // Implement Gregorian to Hijri conversion
    // This is a simplified example - you would need a proper Hijri conversion library
    const year = date.getFullYear() - 622;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return { year, month, day };
  }

  private hijriToGregorian(hijriDate: { year: number; month: number; day: number }): Date {
    // Implement Hijri to Gregorian conversion
    // This is a simplified example - you would need a proper Hijri conversion library
    const year = hijriDate.year + 622;
    const month = hijriDate.month - 1;
    const day = hijriDate.day;
    return new Date(year, month, day);
  }

  private parseHijriDate(dateString: string, format: string): Date | null {
    // Implement Hijri date parsing
    // This is a simplified example
    return new Date(); // Replace with actual parsing logic
  }

  private formatHijriDate(hijriDate: { year: number; month: number; day: number }, format: string): string {
    // Implement Hijri date formatting
    return `${hijriDate.year}/${hijriDate.month}/${hijriDate.day}`;
  }

  private getHijriDaysInMonth(year: number, month: number): number {
    // Implement Hijri month length calculation
    // This is a simplified example
    return 30; // Replace with actual calculation
  }
}
```

## Usage Examples

### Method 1: Direct Injection via @Input

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { HijriDateAdapter } from './hijri-date-adapter';

@Component({
  selector: 'app-root',
  template: `
    <qeydar-date-picker 
      [dateAdapter]="hijriAdapter"
      [format]="'yyyy/MM/dd'"
      [(ngModel)]="selectedDate">
    </qeydar-date-picker>
  `
})
export class AppComponent {
  hijriAdapter = new HijriDateAdapter();
  selectedDate: Date | null = null;
}
```

### Method 2: Provider-based Injection

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { HijriDateAdapter } from './hijri-date-adapter';
import { DATE_ADAPTER } from 'qeydar-datepicker';

@NgModule({
  providers: [
    { provide: DATE_ADAPTER, useClass: HijriDateAdapter }
  ]
})
export class AppModule {}
```

### Method 3: Factory Provider

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { HijriDateAdapter } from './hijri-date-adapter';
import { DATE_ADAPTER } from 'qeydar-datepicker';

@NgModule({
  providers: [
    {
      provide: DATE_ADAPTER,
      useFactory: () => new HijriDateAdapter()
    }
  ]
})
export class AppModule {}
```

### Method 4: Conditional Adapter Selection

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { HijriDateAdapter } from './hijri-date-adapter';
import { JalaliDateAdapter } from 'qeydar-datepicker';

@Component({
  selector: 'app-root',
  template: `
    <qeydar-date-picker 
      [dateAdapter]="getDateAdapter()"
      [format]="'yyyy/MM/dd'"
      [(ngModel)]="selectedDate">
    </qeydar-date-picker>
  `
})
export class AppComponent {
  selectedDate: Date | null = null;
  calendarType: 'hijri' | 'jalali' | 'gregorian' = 'hijri';

  getDateAdapter() {
    switch (this.calendarType) {
      case 'hijri':
        return new HijriDateAdapter();
      case 'jalali':
        return new JalaliDateAdapter();
      default:
        return null; // Use default gregorian
    }
  }
}
```

## Advanced Configuration

### Custom Adapter with Dependencies

```typescript
@Injectable()
export class LocalizedHijriAdapter implements DateAdapter<Date> {
  constructor(
    private localeService: LocaleService,
    private translationService: TranslationService
  ) {}

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const locale = this.localeService.getCurrentLocale();
    return this.translationService.getMonthNames(locale, style);
  }

  // ... implement other methods
}
```

### Adapter with Custom Configuration

```typescript
@Injectable()
export class ConfigurableHijriAdapter implements DateAdapter<Date> {
  constructor(
    @Inject('HIJRI_CONFIG') private config: HijriConfig
  ) {}

  getFirstDayOfWeek(): number {
    return this.config.firstDayOfWeek;
  }

  // ... implement other methods
}
```

## Migration Guide

### From calendarType to Custom Adapters

**Before:**
```typescript
<qeydar-date-picker 
  [calendarType]="'jalali'"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

**After (Method 1 - Direct):**
```typescript
<qeydar-date-picker 
  [dateAdapter]="jalaliAdapter"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

**After (Method 2 - Provider):**
```typescript
// In module providers
{ provide: DATE_ADAPTER, useClass: JalaliDateAdapter }

<qeydar-date-picker 
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

## Best Practices

1. **Always implement all required methods** of the `DateAdapter<Date>` interface
2. **Handle edge cases** like leap years, month boundaries, and invalid dates
3. **Provide meaningful error messages** for invalid date formats
4. **Test thoroughly** with different date ranges and formats
5. **Consider performance** for date conversion operations
6. **Document your adapter** with examples and usage notes

## Troubleshooting

### Common Issues

1. **Adapter not being used**: Check that the adapter is properly provided or injected
2. **Date parsing errors**: Ensure your `parse` method handles all expected formats
3. **Formatting issues**: Verify that your `format` method produces consistent output
4. **Month/year navigation**: Test that `addMonths` and `addYears` work correctly

### Debug Tips

```typescript
// Add logging to your adapter
parse(value: any, formatString: string): Date | null {
  console.log('Parsing:', value, 'with format:', formatString);
  const result = this.parseHijriDate(value, formatString);
  console.log('Parsed result:', result);
  return result;
}
```

## Conclusion

Custom date adapters provide a powerful way to extend the Qeydar DatePicker with any calendar system while maintaining full compatibility with the existing API. The implementation is flexible and supports both simple direct injection and complex provider-based configurations.
