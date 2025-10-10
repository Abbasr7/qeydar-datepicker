import { Injectable } from '@angular/core';
import {
  format as dateFnsFormat,
  parse as dateFnsParse,
  addDays as dateFnsAddDays,
  addHours as dateFnsAddHours,
  addMinutes as dateFnsAddMinutes,
  getDay,
  getHours as dateFnsGetHours,
  getMinutes as dateFnsGetMinutes,
  getSeconds as dateFnsGetSeconds,
  setHours as dateFnsSetHours,
  setMinutes as dateFnsSetMinutes,
  setSeconds as dateFnsSetSeconds,
  startOfDay as dateFnsStartOfDay,
  startOfWeek as dateFnsStartOfWeek,
  isSameDay,
  isAfter,
  isBefore,
  isEqual,
  max as dateFnsMax,
} from 'date-fns';
import { DateAdapter } from 'projects/qeydar-datepicker/src/date-adapter';

// Helper functions for Hijri conversion
class HijriConverter {
  // Convert Gregorian to Hijri
  static gregorianToHijri(date: Date): {
    year: number;
    month: number;
    day: number;
  } {
    const gYear = date.getFullYear();
    const gMonth = date.getMonth() + 1;
    const gDay = date.getDate();

    let y = gYear;
    let m = gMonth;
    let d = gDay;

    if (m < 3) {
      y--;
      m += 12;
    }

    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const jd =
      Math.floor(365.25 * (y + 4716)) +
      Math.floor(30.6001 * (m + 1)) +
      d +
      b -
      1524;

    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j =
      Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
      Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 =
      l2 -
      Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
      29;

    const hMonth = Math.floor((24 * l3) / 709);
    const hDay = Math.floor(l3 - Math.floor((709 * hMonth) / 24));
    const hYear = 30 * n + j - 30;

    return { year: hYear, month: hMonth, day: hDay };
  }

  // Convert Hijri to Gregorian
  static hijriToGregorian(year: number, month: number, day: number): Date {
    const jd =
      Math.floor((11 * year + 3) / 30) +
      354 * year +
      30 * month -
      Math.floor((month - 1) / 2) +
      day +
      1948440 -
      385;

    const l = jd + 68569;
    const n = Math.floor((4 * l) / 146097);
    const l2 = l - Math.floor((146097 * n + 3) / 4);
    const i = Math.floor((4000 * (l2 + 1)) / 1461001);
    const l3 = l2 - Math.floor((1461 * i) / 4) + 31;
    const j = Math.floor((80 * l3) / 2447);
    const gDay = l3 - Math.floor((2447 * j) / 80);
    const l4 = Math.floor(j / 11);
    const gMonth = j + 2 - 12 * l4;
    const gYear = 100 * (n - 49) + i + l4;

    return new Date(gYear, gMonth - 1, gDay);
  }

  static getHijriMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const long = [
      'محرم',
      'صفر',
      'ربیع الاول',
      'ربیع الثانی',
      'جمادی الاول',
      'جمادی الثانی',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'ذیقعده',
      'ذیحجه',
    ];

    const short = [
      'محرم',
      'صفر',
      'ربیع ۱',
      'ربیع ۲',
      'جمادی ۱',
      'جمادی ۲',
      'رجب',
      'شعبان',
      'رمضان',
      'شوال',
      'ذیقعده',
      'ذیحجه',
    ];

    if (style === 'narrow') return long.map((m) => m.substring(0, 1));
    if (style === 'short') return short;
    return long;
  }
}

@Injectable()
export class HijriDateAdapter implements DateAdapter<Date> {
  today(): Date {
    return new Date();
  }

  parse(value: any, formatString: string): Date | null {
    if (!value) return null;

    try {
      // Try to parse as Hijri date (format: YYYY/MM/DD)
      if (
        typeof value === 'string' &&
        /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(value)
      ) {
        const [year, month, day] = value.split('/').map(Number);
        return HijriConverter.hijriToGregorian(year, month, day);
      }

      // Fallback to date-fns parse
      return dateFnsParse(value, formatString, new Date());
    } catch {
      return null;
    }
  }

  format(date: Date, formatString: string): string {
    const hijri = HijriConverter.gregorianToHijri(date);

    const pad = (num: number, len = 2) => num.toString().padStart(len, '0');

    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const ampm = hours24 < 12 ? 'AM' : 'PM';

    return (
      formatString
        // Year
        .replace(/YYYY|yyyy/g, hijri.year.toString())
        // Month
        .replace(/MM/g, pad(hijri.month))
        .replace(/\bM\b/g, hijri.month.toString())
        // Day
        .replace(/DD|dd/g, pad(hijri.day))
        .replace(/\bD\b/g, hijri.day.toString())
        // Time
        .replace(/HH/g, pad(hours24)) // 24-hour format
        .replace(/hh/g, pad(hours12)) // 12-hour format
        .replace(/mm/g, pad(date.getMinutes()))
        .replace(/ss|SS/g, pad(date.getSeconds()))
        .replace(/\bA\b/g, ampm)
    );
  }

  addDays(date: Date, amount: number): Date {
    return dateFnsAddDays(date, amount);
  }

  addMonths(date: Date, amount: number): Date {
    const hijri = HijriConverter.gregorianToHijri(date);
    let newMonth = hijri.month + amount;
    let newYear = hijri.year;

    while (newMonth > 12) {
      newMonth -= 12;
      newYear++;
    }
    while (newMonth < 1) {
      newMonth += 12;
      newYear--;
    }

    const daysInMonth = this.getDaysInHijriMonth(newYear, newMonth);
    const newDay = Math.min(hijri.day, daysInMonth);

    return HijriConverter.hijriToGregorian(newYear, newMonth, newDay);
  }

  addYears(date: Date, amount: number): Date {
    const hijri = HijriConverter.gregorianToHijri(date);
    return HijriConverter.hijriToGregorian(
      hijri.year + amount,
      hijri.month,
      hijri.day
    );
  }

  addHours(date: Date, amount: number): Date {
    return dateFnsAddHours(date, amount);
  }

  addMinutes(date: Date, amount: number): Date {
    return dateFnsAddMinutes(date, amount);
  }

  getYear(date: Date): number {
    return HijriConverter.gregorianToHijri(date).year;
  }

  getMonth(date: Date): number {
    return HijriConverter.gregorianToHijri(date).month - 1;
  }

  getDate(date: Date): number {
    return HijriConverter.gregorianToHijri(date).day;
  }

  getDayOfWeek(date: Date): number {
    // Saturday = 0 in Islamic calendar
    const dayOfWeek = getDay(date);
    return (dayOfWeek + 1) % 7;
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return HijriConverter.getHijriMonthNames(style);
  }

  getDateNames(): string[] {
    return Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const long = [
      'شنبه',
      'یکشنبه',
      'دوشنبه',
      'سه‌شنبه',
      'چهارشنبه',
      'پنج‌شنبه',
      'جمعه',
    ];
    const short = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

    if (style === 'narrow') return short;
    if (style === 'short') return short;
    return long;
  }

  getFirstDayOfWeek(): number {
    return 0; // Saturday
  }

  getNumDaysInMonth(date: Date): number {
    const hijri = HijriConverter.gregorianToHijri(date);
    return this.getDaysInHijriMonth(hijri.year, hijri.month);
  }

  getDaysInMonth(date: Date): number {
    return this.getNumDaysInMonth(date);
  }

  private getDaysInHijriMonth(year: number, month: number): number {
    // Odd months have 30 days, even months have 29 days
    // Exception: 12th month has 30 days in leap years
    if (month % 2 === 1) return 30;
    if (month === 12 && this.isHijriLeapYear(year)) return 30;
    return 29;
  }

  private isHijriLeapYear(year: number): boolean {
    return (14 + 11 * year) % 30 < 11;
  }

  clone(date: Date): Date {
    return new Date(date.getTime());
  }

  createDate(year: number, month: number, day: number): Date {
    return HijriConverter.hijriToGregorian(year, month, day);
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return isSameDay(date1, date2);
  }

  isSameMonth(date1: Date, date2: Date): boolean {
    const h1 = HijriConverter.gregorianToHijri(date1);
    const h2 = HijriConverter.gregorianToHijri(date2);
    return h1.year === h2.year && h1.month === h2.month;
  }

  isSameYear(date1: Date, date2: Date): boolean {
    const h1 = HijriConverter.gregorianToHijri(date1);
    const h2 = HijriConverter.gregorianToHijri(date2);
    return h1.year === h2.year;
  }

  isAfter(date1: Date, date2: Date): boolean {
    return isAfter(date1, date2);
  }

  isBefore(date1: Date, date2: Date): boolean {
    return isBefore(date1, date2);
  }

  isEqual(date1: Date, date2: Date): boolean {
    return isEqual(date1, date2);
  }

  startOfMonth(date: Date): Date {
    const hijri = HijriConverter.gregorianToHijri(date);
    return HijriConverter.hijriToGregorian(hijri.year, hijri.month, 1);
  }

  endOfMonth(date: Date): Date {
    const hijri = HijriConverter.gregorianToHijri(date);
    const lastDay = this.getDaysInHijriMonth(hijri.year, hijri.month);
    return HijriConverter.hijriToGregorian(hijri.year, hijri.month, lastDay);
  }

  startOfWeek(date: Date): Date {
    return dateFnsStartOfWeek(date, { weekStartsOn: 6 }); // Saturday
  }

  startOfDay(date: Date): Date {
    return dateFnsStartOfDay(date);
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
    return dateFnsMax(dates);
  }

  setYear(date: Date, year: number): Date {
    const hijri = HijriConverter.gregorianToHijri(date);
    return HijriConverter.hijriToGregorian(year, hijri.month, hijri.day);
  }

  getHours(date: Date): number {
    return dateFnsGetHours(date);
  }

  getMinutes(date: Date): number {
    return dateFnsGetMinutes(date);
  }

  getSeconds(date: Date): number {
    return dateFnsGetSeconds(date);
  }

  setHours(date: Date, hours: number): Date {
    return dateFnsSetHours(date, hours);
  }

  setMinutes(date: Date, minutes: number): Date {
    return dateFnsSetMinutes(date, minutes);
  }

  setSeconds(date: Date, seconds: number): Date {
    return dateFnsSetSeconds(date, seconds);
  }
}
