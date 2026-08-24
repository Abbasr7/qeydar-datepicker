import { Injectable } from "@angular/core";

export interface CustomLabels {
    label: string,
    value: Array<Date> | 'custom',
    arrow?: boolean
}

export interface YearRange {
    start: number,
    end: number
}

export interface DateRange {
    start: Date | string,
    end: Date | string | null
}

export interface RangeInputLabels {
    start: string,
    end: string,
}

export interface Lang_Locale {
    today: string;
    lastDay: string;
    lastWeek: string;
    lastMonth: string;
    custom: string;
    previousMonth: string;
    nextMonth: string;
    previousYear: string;
    nextYear: string;
    selectTime: string;
    selectDate: string;
    selectMonth: string;
    selectYear: string;
    selectDateRange: string;
    startDate: string;
    endDate: string;
    pm: string;
    am: string;
    ok: string;
    cancel: string;
    now: string;
}

@Injectable({
    providedIn: 'root'
})
export class lang_Fa implements Lang_Locale{
    today:string = "امروز";
    lastDay:string = "آخرین روز";
    lastWeek:string = "آخرین هفته";
    lastMonth:string = "آخرین ماه";
    custom:string = "دلخواه";
    previousMonth:string = "ماه قبل";
    nextMonth:string = "ماه بعد";
    previousYear:string = "سال قبل";
    nextYear:string = "سال بعد";
    selectTime:string = "انتخاب زمان";
    selectDate:string = "انتخاب تاریخ";
    selectMonth:string = "انتخاب ماه";
    selectYear:string = "انتخاب سال";
    selectDateRange:string = "انتخاب محدوده تاریخ";
    startDate:string = "از تاریخ";
    endDate:string = "تا تاریخ";
    pm: string = "ب.ظ";
    am: string = "ق.ظ";
    ok: string = "تایید";
    cancel: string = "لغو";
    now: string = "اکنون";
}

@Injectable({
    providedIn: 'root'
})
export class lang_En implements Lang_Locale{
    today:string = "Today"
    lastDay:string = "Last Day";
    lastWeek:string = "Last Week";
    lastMonth:string = "Last Month";
    custom:string = "Custom";
    previousMonth:string = "Previous Month";
    nextMonth:string = "Next Month";
    previousYear:string = "Previous Year";
    nextYear:string = "Next Year";
    selectTime:string = "Select time";
    selectDate:string = "Select date";
    selectMonth:string = "Select month";
    selectYear:string = "Select year";
    selectDateRange:string = "Select date range";
    startDate:string = "Start date";
    endDate:string = "End date";
    pm: string = "PM";
    am: string = "AM";
    ok: string = "Ok";
    cancel: string = "Cancel";
    now: string = "Now";
}