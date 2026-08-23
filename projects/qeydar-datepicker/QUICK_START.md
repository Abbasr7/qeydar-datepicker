# Qeydar DatePicker - Quick Start Guide

## 🚀 شروع سریع

این راهنما به شما کمک می‌کند تا در کمترین زمان با Qeydar DatePicker شروع به کار کنید.

---

## 📦 نصب

```bash
npm install @qeydar/datepicker
# یا
yarn add @qeydar/datepicker
```

---

## 🎯 استفاده پایه

### 1. Import Module

```typescript
// app.module.ts
import { QeydarDatePickerModule } from '@qeydar/datepicker';

@NgModule({
  imports: [
    QeydarDatePickerModule
  ]
})
export class AppModule { }
```

### 2. استفاده در Template

```html
<!-- تقویم شمسی (جلالی) -->
<qeydar-date-picker
  [calendarType]="'jalali'"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>

<!-- تقویم میلادی -->
<qeydar-date-picker
  [calendarType]="'gregorian'"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

### 3. استفاده در Component

```typescript
export class AppComponent {
  selectedDate: string;
  
  onDateChange(date: string) {
    console.log('تاریخ انتخاب شده:', date);
  }
}
```

---

## 🎨 استفاده از Theme System (جدید)

### 1. Import Theme Service

```typescript
import { DatePickerThemeService } from '@qeydar/datepicker';

export class AppComponent {
  constructor(private themeService: DatePickerThemeService) {
    // تنظیم Theme پیش‌فرض
    this.themeService.setTheme('light');
  }
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
```

### 2. اضافه کردن Styles

```scss
// styles.scss
@import '@qeydar/datepicker/styles/theme-variables';
```

### 3. استفاده در Template

```html
<button (click)="toggleTheme()">تغییر تم</button>

<qeydar-date-picker
  [calendarType]="'jalali'"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

---

## 📅 Range DatePicker

```html
<qeydar-date-picker
  [isRange]="true"
  [calendarType]="'jalali'"
  [(ngModel)]="dateRange">
</qeydar-date-picker>
```

```typescript
export class AppComponent {
  dateRange: { start: string, end: string };
}
```

---

## ⏰ DatePicker با Time

```html
<qeydar-date-picker
  [calendarType]="'jalali'"
  [format]="'yyyy/MM/dd HH:mm'"
  [(ngModel)]="selectedDateTime">
</qeydar-date-picker>
```

---

## 🎭 Inline DatePicker

```html
<qeydar-date-picker
  [isInline]="true"
  [calendarType]="'jalali'"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

---

## 🔧 تنظیمات پیشرفته

### محدود کردن تاریخ

```html
<qeydar-date-picker
  [minDate]="minDate"
  [maxDate]="maxDate"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

```typescript
export class AppComponent {
  minDate = '1400/01/01';
  maxDate = '1403/12/29';
  selectedDate: string;
}
```

### غیرفعال کردن تاریخ‌های خاص

```html
<qeydar-date-picker
  [disabledDates]="disabledDates"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

```typescript
export class AppComponent {
  disabledDates = ['1403/01/01', '1403/01/02'];
  selectedDate: string;
}
```

### غیرفعال کردن با Filter

```html
<qeydar-date-picker
  [disabledDatesFilter]="isWeekend"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

```typescript
export class AppComponent {
  selectedDate: string;
  
  isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 5 || day === 6; // جمعه و شنبه
  }
}
```

---

## 🎨 سفارشی‌سازی UI

### استفاده از Custom Labels

```html
<qeydar-date-picker
  [customLabels]="customLabels"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

```typescript
export class AppComponent {
  customLabels = [
    { label: 'امروز', value: [new Date()] },
    { label: 'دیروز', value: [this.getYesterday()] },
    { label: 'هفته گذشته', value: 'custom' }
  ];
  
  getYesterday(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }
}
```

---

## 🌍 RTL Support

```html
<qeydar-date-picker
  [rtl]="true"
  [calendarType]="'jalali'"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

---

## 📱 Reactive Forms

```typescript
import { FormBuilder, FormGroup } from '@angular/forms';

export class AppComponent {
  form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      date: ['']
    });
  }
}
```

```html
<form [formGroup]="form">
  <qeydar-date-picker
    formControlName="date"
    [calendarType]="'jalali'">
  </qeydar-date-picker>
</form>
```

---

## 🎯 Events

```html
<qeydar-date-picker
  [(ngModel)]="selectedDate"
  (onChangeValue)="onDateChange($event)"
  (onFocus)="onFocus($event)"
  (onBlur)="onBlur($event)"
  (onOpenChange)="onOpenChange($event)">
</qeydar-date-picker>
```

```typescript
export class AppComponent {
  selectedDate: string;
  
  onDateChange(date: string) {
    console.log('تاریخ تغییر کرد:', date);
  }
  
  onFocus(event: any) {
    console.log('Focus شد');
  }
  
  onBlur(event: any) {
    console.log('Blur شد');
  }
  
  onOpenChange(isOpen: boolean) {
    console.log('وضعیت باز/بسته:', isOpen);
  }
}
```

---

## 🔨 ایجاد DatePicker سفارشی (جدید)

```typescript
import { Component } from '@angular/core';
import { BaseDatePickerComponent } from '@qeydar/datepicker';

@Component({
  selector: 'my-custom-datepicker',
  template: `
    <div class="custom-picker">
      <input
        type="text"
        [formControl]="form.get('dateInput')"
        [placeholder]="getPlaceholder()"
        (click)="toggle()"
      />
      <div *ngIf="isOpen" class="dropdown">
        <!-- Custom UI -->
      </div>
    </div>
  `
})
export class MyCustomDatePicker extends BaseDatePickerComponent {
  protected setupUI(): void {
    // Setup custom UI
  }
  
  protected updateUI(): void {
    this.cdref.markForCheck();
  }
}
```

---

## 📚 مثال‌های کامل

### مثال 1: DatePicker ساده

```typescript
@Component({
  selector: 'app-simple-example',
  template: `
    <h3>انتخاب تاریخ</h3>
    <qeydar-date-picker
      [calendarType]="'jalali'"
      [(ngModel)]="date">
    </qeydar-date-picker>
    <p>تاریخ انتخابی: {{ date }}</p>
  `
})
export class SimpleExampleComponent {
  date: string;
}
```

### مثال 2: Range DatePicker

```typescript
@Component({
  selector: 'app-range-example',
  template: `
    <h3>انتخاب بازه تاریخ</h3>
    <qeydar-date-picker
      [isRange]="true"
      [calendarType]="'jalali'"
      [(ngModel)]="dateRange">
    </qeydar-date-picker>
    <p>از: {{ dateRange?.start }}</p>
    <p>تا: {{ dateRange?.end }}</p>
  `
})
export class RangeExampleComponent {
  dateRange: { start: string, end: string };
}
```

### مثال 3: DatePicker با Theme

```typescript
@Component({
  selector: 'app-themed-example',
  template: `
    <h3>DatePicker با تم</h3>
    <button (click)="toggleTheme()">
      تم فعلی: {{ currentTheme }}
    </button>
    <qeydar-date-picker
      [calendarType]="'jalali'"
      [(ngModel)]="date">
    </qeydar-date-picker>
  `
})
export class ThemedExampleComponent {
  date: string;
  currentTheme = 'light';
  
  constructor(private themeService: DatePickerThemeService) {}
  
  toggleTheme() {
    this.currentTheme = this.themeService.toggleTheme();
  }
}
```

---

## 🎨 Themes موجود

```typescript
// Light Theme (پیش‌فرض)
themeService.setTheme('light');

// Dark Theme
themeService.setTheme('dark');

// Blue Theme
themeService.setTheme('blue');

// Custom Theme
themeService.addTheme({
  name: 'custom',
  displayName: 'تم سفارشی',
  variables: {
    '--qeydar-primary-color': '#ff6b6b',
    '--qeydar-background-color': '#f8f9fa',
    // ... سایر متغیرها
  }
});
themeService.setTheme('custom');
```

---

## 🔧 تنظیمات پیشنهادی

### برای پروژه‌های فارسی:

```html
<qeydar-date-picker
  [calendarType]="'jalali'"
  [rtl]="true"
  [format]="'yyyy/MM/dd'"
  [(ngModel)]="date">
</qeydar-date-picker>
```

### برای پروژه‌های انگلیسی:

```html
<qeydar-date-picker
  [calendarType]="'gregorian'"
  [rtl]="false"
  [format]="'yyyy-MM-dd'"
  [(ngModel)]="date">
</qeydar-date-picker>
```

---

## 📖 مستندات بیشتر

- [Architecture Guide](./ARCHITECTURE.md)
- [Migration Plan](./MIGRATION_PLAN.md)
- [Base Component Guide](./BASE_COMPONENT_GUIDE.md)
- [Theme Guide](./styles/_theme-variables.scss)
- [Examples](./src/components/examples/)

---

## 💡 نکات مهم

1. **Calendar Type**: برای تقویم شمسی از `'jalali'` و برای میلادی از `'gregorian'` استفاده کنید
2. **RTL**: برای زبان فارسی `[rtl]="true"` را فعال کنید
3. **Format**: فرمت تاریخ را مطابق نیاز خود تنظیم کنید
4. **Theme**: از Theme Service برای تغییر ظاهر استفاده کنید
5. **Validation**: از `minDate`, `maxDate` و `disabledDates` برای اعتبارسنجی استفاده کنید

---

## 🆘 مشکلات رایج

### مشکل: DatePicker نمایش داده نمی‌شود

**راه‌حل:**
```typescript
// اطمینان حاصل کنید که Module را Import کرده‌اید
import { QeydarDatePickerModule } from '@qeydar/datepicker';
```

### مشکل: Theme کار نمی‌کند

**راه‌حل:**
```scss
// Styles را Import کنید
@import '@qeydar/datepicker/styles/theme-variables';
```

### مشکل: تاریخ به درستی نمایش داده نمی‌شود

**راه‌حل:**
```html
<!-- Calendar Type را مشخص کنید -->
<qeydar-date-picker [calendarType]="'jalali'">
```

---

## 📞 پشتیبانی

- [GitHub Issues](https://github.com/qeydar/datepicker/issues)
- [Discussions](https://github.com/qeydar/datepicker/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/qeydar-datepicker)

---

**موفق باشید!** 🎉

