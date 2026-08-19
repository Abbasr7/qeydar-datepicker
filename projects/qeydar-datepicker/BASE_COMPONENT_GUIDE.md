# راهنمای استفاده از BaseDatePickerComponent

## 📖 مقدمه

`BaseDatePickerComponent` یک کامپوننت پایه (Abstract) است که تمام منطق مشترک DatePicker ها را شامل می‌شود. با استفاده از این کامپوننت می‌توانید به راحتی DatePicker های سفارشی با UI و رفتار دلخواه ایجاد کنید.

---

## 🎯 چرا از BaseDatePickerComponent استفاده کنیم؟

### مزایا:
- ✅ **کاهش تکرار کد**: منطق مشترک یکبار نوشته می‌شود
- ✅ **قابلیت سفارشی‌سازی بالا**: UI و رفتار را به دلخواه تغییر دهید
- ✅ **Type Safety**: استفاده کامل از TypeScript
- ✅ **Testability**: قابلیت تست آسان
- ✅ **Consistency**: رفتار یکسان در تمام DatePicker ها
- ✅ **Maintenance**: نگهداری آسان‌تر کد

---

## 🏗️ ساختار BaseDatePickerComponent

### Properties (خصوصیات)

```typescript
// Input Properties
@Input() rtl: boolean
@Input() mode: DatepickerMode
@Input() isRange: boolean
@Input() calendarType: CalendarType
@Input() format: string
@Input() disabled: boolean
@Input() readOnly: boolean
@Input() minDate: Date | string | null
@Input() maxDate: Date | string | null
// ... و سایر Input ها

// Output Properties
@Output() onFocus: EventEmitter<any>
@Output() onBlur: EventEmitter<any>
@Output() onChangeValue: EventEmitter<any>
@Output() onOpenChange: EventEmitter<boolean>

// Public Properties
public isOpen: boolean
public selectedDate: Date | null
public selectedStartDate: Date | null
public selectedEndDate: Date | null
public form: FormGroup
public currentDateAdapter: DateAdapter<Date>
```

### Methods (متدها)

#### Abstract Methods (باید پیاده‌سازی شوند)
```typescript
protected abstract setupUI(): void
protected abstract updateUI(): void
```

#### Public Methods
```typescript
public open(): void
public close(): void
public toggle(): void
public onDateSelected(date: Date): void
public onDateRangeSelected(dateRange: DateRange): void
public getPlaceholder(inputType?: string): string
public applyConfig(config: Partial<BaseDatePickerConfig>): void
public getConfig(): BaseDatePickerConfig
```

#### Protected Methods
```typescript
protected setDateAdapter(): void
protected setupFormControls(): void
protected handleRangeInputChange(value: string, inputType?: RangePartType): void
protected handleSingleInputChange(value: string): void
protected emitValueIfChanged(): void
protected clampDate(date: Date): Date
protected isDateDisabled(date: Date): boolean
protected isTimeDisabled(date: Date): boolean
// ... و سایر متدهای Protected
```

---

## 🚀 نحوه استفاده

### مثال 1: ساده‌ترین DatePicker سفارشی

```typescript
import { Component } from '@angular/core';
import { BaseDatePickerComponent } from '@qeydar/datepicker';

@Component({
  selector: 'my-simple-datepicker',
  template: `
    <div class="simple-picker">
      <input
        type="text"
        [formControl]="form.get('dateInput')"
        [placeholder]="getPlaceholder()"
        (click)="toggle()"
      />
      <div *ngIf="isOpen">
        <p>تاریخ: {{ selectedDate | date }}</p>
        <button (click)="close()">بستن</button>
      </div>
    </div>
  `
})
export class MySimpleDatePicker extends BaseDatePickerComponent {
  protected setupUI(): void {
    // کدهای راه‌اندازی UI
  }
  
  protected updateUI(): void {
    // بروزرسانی UI
    this.cdref.markForCheck();
  }
}
```

### مثال 2: DatePicker با Theme Support

```typescript
import { Component } from '@angular/core';
import { BaseDatePickerComponent } from '@qeydar/datepicker';

@Component({
  selector: 'themed-datepicker',
  template: `
    <div class="themed-picker">
      <div class="header">
        <h3>انتخاب تاریخ</h3>
        <button (click)="toggleTheme()">تغییر تم</button>
      </div>
      
      <input
        type="text"
        [formControl]="form.get('dateInput')"
        (click)="toggle()"
      />
      
      <div *ngIf="isOpen" class="dropdown">
        <!-- Calendar UI -->
      </div>
    </div>
  `,
  styles: [`
    .themed-picker {
      background: var(--qeydar-background-color);
      color: var(--qeydar-text-color);
      border: 1px solid var(--qeydar-border-color);
      border-radius: var(--qeydar-border-radius);
      padding: 16px;
    }
  `]
})
export class ThemedDatePicker extends BaseDatePickerComponent {
  protected setupUI(): void {
    // Setup
  }
  
  protected updateUI(): void {
    this.cdref.markForCheck();
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
```

### مثال 3: Range DatePicker سفارشی

```typescript
import { Component } from '@angular/core';
import { BaseDatePickerComponent } from '@qeydar/datepicker';

@Component({
  selector: 'custom-range-picker',
  template: `
    <div class="range-picker">
      <div class="inputs">
        <input
          type="text"
          [formControl]="form.get('startDateInput')"
          placeholder="از تاریخ"
          (click)="activeInput = 'start'; open()"
        />
        <span>→</span>
        <input
          type="text"
          [formControl]="form.get('endDateInput')"
          placeholder="تا تاریخ"
          (click)="activeInput = 'end'; open()"
        />
      </div>
      
      <div *ngIf="isOpen" class="calendar">
        <!-- Range Calendar UI -->
        <div class="selected-range" *ngIf="selectedStartDate && selectedEndDate">
          <p>از: {{ currentDateAdapter.format(selectedStartDate, format) }}</p>
          <p>تا: {{ currentDateAdapter.format(selectedEndDate, format) }}</p>
        </div>
      </div>
    </div>
  `
})
export class CustomRangePicker extends BaseDatePickerComponent {
  protected setupUI(): void {
    this.isRange = true;
  }
  
  protected updateUI(): void {
    this.cdref.markForCheck();
  }
}
```

### مثال 4: DatePicker با Validation سفارشی

```typescript
import { Component } from '@angular/core';
import { BaseDatePickerComponent } from '@qeydar/datepicker';

@Component({
  selector: 'validated-datepicker',
  template: `
    <div class="validated-picker">
      <input
        type="text"
        [formControl]="form.get('dateInput')"
        [class.invalid]="isInvalid"
        (click)="toggle()"
      />
      
      <div class="error" *ngIf="isInvalid">
        {{ errorMessage }}
      </div>
      
      <div *ngIf="isOpen" class="calendar">
        <!-- Calendar with disabled dates -->
      </div>
    </div>
  `
})
export class ValidatedDatePicker extends BaseDatePickerComponent {
  isInvalid = false;
  errorMessage = '';
  
  protected setupUI(): void {
    // Setup validation
    this.form.get('dateInput')?.valueChanges.subscribe(value => {
      this.validateInput(value);
    });
  }
  
  protected updateUI(): void {
    this.cdref.markForCheck();
  }
  
  private validateInput(value: string): void {
    const date = this.currentDateAdapter.parse(value, this.format);
    
    if (!date) {
      this.isInvalid = true;
      this.errorMessage = 'فرمت تاریخ نامعتبر است';
      return;
    }
    
    if (this.isDateDisabled(date)) {
      this.isInvalid = true;
      this.errorMessage = 'این تاریخ غیرفعال است';
      return;
    }
    
    this.isInvalid = false;
    this.errorMessage = '';
  }
}
```

---

## 🔧 Lifecycle و Hooks

### Constructor
```typescript
constructor(
  protected fb: FormBuilder,
  protected elementRef: ElementRef,
  protected cdref: ChangeDetectorRef,
  protected dpService: QeydarDatePickerService,
  protected themeService: DatePickerThemeService,
  protected jalali: JalaliDateAdapter,
  protected gregorian: GregorianDateAdapter,
  @Optional() @Inject(DATE_ADAPTER) protected injectedDateAdapter: DateAdapter<Date>
) {
  super(fb, elementRef, cdref, dpService, themeService, jalali, gregorian, injectedDateAdapter);
}
```

### ngOnInit
```typescript
ngOnInit(): void {
  // BaseDatePickerComponent automatically calls:
  // - this.initialize()
  // - this.setDateAdapter()
  // - this.setupFormControls()
  // - this.setupUI() // Your implementation
}
```

### ngOnDestroy
```typescript
ngOnDestroy(): void {
  // BaseDatePickerComponent automatically:
  // - Unsubscribes from all observables
  // - Cleans up resources
}
```

---

## 📝 Best Practices

### 1. همیشه updateUI را فراخوانی کنید

```typescript
// ✅ Good
selectDate(date: Date): void {
  this.selectedDate = date;
  this.updateUI(); // بروزرسانی UI
}

// ❌ Bad
selectDate(date: Date): void {
  this.selectedDate = date;
  // UI بروزرسانی نمی‌شود!
}
```

### 2. از ChangeDetectorRef استفاده کنید

```typescript
protected updateUI(): void {
  // انجام تغییرات
  this.cdref.markForCheck(); // اعلام تغییر به Angular
}
```

### 3. از متدهای Protected استفاده کنید

```typescript
// ✅ Good
selectToday(): void {
  const today = this.currentDateAdapter.today();
  this.onDateSelected(today); // استفاده از متد موجود
}

// ❌ Bad
selectToday(): void {
  this.selectedDate = new Date();
  this.onChange(this.selectedDate);
  // منطق تکراری و احتمال خطا
}
```

### 4. Validation را به درستی پیاده‌سازی کنید

```typescript
protected setupUI(): void {
  // تنظیم Validation
  this.disabledDatesFilter = (date: Date) => {
    // منطق Validation
    return this.isWeekend(date);
  };
}

private isWeekend(date: Date): boolean {
  const day = this.currentDateAdapter.getDayOfWeek(date);
  return day === 5 || day === 6; // جمعه و شنبه
}
```

### 5. از Theme System استفاده کنید

```typescript
// در Template
<div class="my-picker">
  <style>
    .my-picker {
      background: var(--qeydar-background-color);
      color: var(--qeydar-text-color);
      border: 1px solid var(--qeydar-border-color);
    }
  </style>
</div>

// در Component
toggleTheme(): void {
  this.themeService.toggleTheme();
}
```

---

## 🎨 Styling Guidelines

### استفاده از CSS Variables

```scss
.my-datepicker {
  // Colors
  background-color: var(--qeydar-background-color);
  color: var(--qeydar-text-color);
  border-color: var(--qeydar-border-color);
  
  // Spacing
  padding: var(--qeydar-padding);
  margin: var(--qeydar-margin);
  
  // Typography
  font-size: var(--qeydar-font-size);
  line-height: var(--qeydar-line-height);
  
  // Effects
  border-radius: var(--qeydar-border-radius);
  box-shadow: var(--qeydar-shadow);
  transition: var(--qeydar-transition);
}
```

### استفاده از Mixins

```scss
@import '@qeydar/datepicker/styles/theme-mixins';

.my-input {
  @include themed-input;
}

.my-button {
  @include themed-button('primary');
}

.my-dropdown {
  @include themed-dropdown;
}
```

---

## 🧪 Testing

### Unit Test Example

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyCustomDatePicker } from './my-custom-datepicker.component';

describe('MyCustomDatePicker', () => {
  let component: MyCustomDatePicker;
  let fixture: ComponentFixture<MyCustomDatePicker>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCustomDatePicker]
    }).compileComponents();
    
    fixture = TestBed.createComponent(MyCustomDatePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should open picker on toggle', () => {
    expect(component.isOpen).toBe(false);
    component.toggle();
    expect(component.isOpen).toBe(true);
  });
  
  it('should select date', () => {
    const testDate = new Date(2024, 0, 1);
    component.onDateSelected(testDate);
    expect(component.selectedDate).toEqual(testDate);
  });
  
  it('should emit value change', (done) => {
    const testDate = new Date(2024, 0, 1);
    component.onChangeValue.subscribe(value => {
      expect(value).toBeDefined();
      done();
    });
    component.onDateSelected(testDate);
  });
});
```

---

## 🔍 Troubleshooting

### مشکل: UI بروزرسانی نمی‌شود

**راه‌حل:**
```typescript
protected updateUI(): void {
  // اضافه کردن این خط
  this.cdref.markForCheck();
}
```

### مشکل: DateAdapter کار نمی‌کند

**راه‌حل:**
```typescript
protected setupUI(): void {
  // اطمینان از فراخوانی setDateAdapter
  this.setDateAdapter();
}
```

### مشکل: Form Control بروزرسانی نمی‌شود

**راه‌حل:**
```typescript
// استفاده از متد updateFormValue
this.updateFormValue('dateInput', this.selectedDate);
```

---

## 📚 منابع اضافی

- [Architecture Guide](./ARCHITECTURE.md)
- [Migration Plan](./MIGRATION_PLAN.md)
- [Theme Guide](./THEME_GUIDE.md)
- [Examples](./src/components/examples/)
- [API Documentation](./API.md)

---

## 💡 نکات پیشرفته

### 1. Custom Date Adapter

```typescript
import { DateAdapter } from '@qeydar/datepicker';

class MyCustomAdapter implements DateAdapter<Date> {
  // پیاده‌سازی متدهای DateAdapter
}

// استفاده
@Component({
  providers: [
    { provide: DATE_ADAPTER, useClass: MyCustomAdapter }
  ]
})
export class MyDatePicker extends BaseDatePickerComponent {
  // ...
}
```

### 2. Custom Validation Strategy

```typescript
protected setupUI(): void {
  this.disabledDatesFilter = (date: Date) => {
    // Validation سفارشی
    return this.myCustomValidation(date);
  };
  
  this.disabledTimesFilter = (date: Date) => {
    // Time Validation سفارشی
    return this.myCustomTimeValidation(date);
  };
}
```

### 3. Dynamic Configuration

```typescript
updateConfiguration(config: Partial<BaseDatePickerConfig>): void {
  this.applyConfig(config);
  this.updateUI();
}

// استفاده
this.updateConfiguration({
  calendarType: 'jalali',
  format: 'yyyy/MM/dd',
  rtl: true
});
```

---

## ✅ Checklist برای ایجاد DatePicker سفارشی

- [ ] Extend کردن از BaseDatePickerComponent
- [ ] پیاده‌سازی setupUI()
- [ ] پیاده‌سازی updateUI()
- [ ] استفاده از CSS Variables
- [ ] فراخوانی cdref.markForCheck()
- [ ] تست Unit Tests
- [ ] مستندسازی کامپوننت
- [ ] بررسی Accessibility
- [ ] تست در مرورگرهای مختلف
- [ ] بررسی Performance

---

**موفق باشید!** 🎉

