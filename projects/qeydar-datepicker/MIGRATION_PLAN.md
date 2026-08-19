# Qeydar DatePicker - Migration Plan

## 📋 نقشه راه مهاجرت (Migration Roadmap)

این سند یک برنامه مرحله به مرحله برای مهاجرت از ساختار فعلی به معماری جدید را ارائه می‌دهد، با حفظ **Backward Compatibility** کامل.

---

## 🎯 اهداف اصلی

1. ✅ حفظ Backward Compatibility کامل
2. ✅ مهاجرت تدریجی و بدون اختلال
3. ✅ امکان استفاده همزمان از نسخه قدیم و جدید
4. ✅ مستندسازی کامل تغییرات
5. ✅ تست کامل در هر مرحله

---

## 📅 Timeline و Phases

### Phase 1: Foundation (هفته 1-2)
- ایجاد ساختار جدید
- پیاده‌سازی Base Components
- ایجاد Services جدید
- تست Unit Tests

### Phase 2: Feature Parity (هفته 3-4)
- پیاده‌سازی تمام قابلیت‌های موجود
- Migration Helpers
- Deprecation Warnings
- تست Integration Tests

### Phase 3: Migration Support (هفته 5-6)
- ابزارهای کمکی برای مهاجرت
- مستندات مهاجرت
- مثال‌های کاربردی
- تست E2E Tests

### Phase 4: Stabilization (هفته 7-8)
- رفع باگ‌ها
- بهینه‌سازی Performance
- بروزرسانی مستندات
- Release Candidate

---

## 🔄 مراحل مهاجرت (Step by Step)

### مرحله 1: نصب و راه‌اندازی اولیه

#### 1.1. بروزرسانی Package

```bash
npm install @qeydar/datepicker@next
# یا
yarn add @qeydar/datepicker@next
```

#### 1.2. Import Module جدید (اختیاری)

```typescript
// app.module.ts
import { QeydarDatePickerModule } from '@qeydar/datepicker';
// یا برای استفاده از کامپوننت‌های Standalone
import { DatePickerComponent } from '@qeydar/datepicker';

@NgModule({
  imports: [
    QeydarDatePickerModule,  // نسخه قدیم همچنان کار می‌کند
    // یا
    DatePickerComponent      // نسخه جدید Standalone
  ]
})
```

---

### مرحله 2: استفاده از Theme Service (اختیاری)

#### 2.1. تنظیم Theme در App

```typescript
// app.component.ts
import { DatePickerThemeService } from '@qeydar/datepicker';

export class AppComponent implements OnInit {
  constructor(private themeService: DatePickerThemeService) {}
  
  ngOnInit() {
    // تنظیم Theme پیش‌فرض
    this.themeService.setTheme('light');
    
    // یا استفاده از System Theme
    // Theme Service به صورت خودکار System Theme را تشخیص می‌دهد
  }
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
```

#### 2.2. اضافه کردن Theme Styles

```scss
// styles.scss
@import '@qeydar/datepicker/styles/theme-variables';
@import '@qeydar/datepicker/styles/theme-mixins';
```

---

### مرحله 3: مهاجرت کامپوننت‌ها

#### 3.1. استفاده از کامپوننت قدیم (بدون تغییر)

```typescript
// کد قدیم - همچنان کار می‌کند
<qeydar-date-picker
  [calendarType]="'jalali'"
  [format]="'yyyy/MM/dd'"
  [(ngModel)]="selectedDate">
</qeydar-date-picker>
```

#### 3.2. مهاجرت به کامپوننت جدید (تدریجی)

```typescript
// نسخه جدید - با قابلیت‌های بیشتر
<qeydar-date-picker
  [calendarType]="'jalali'"
  [format]="'yyyy/MM/dd'"
  [(ngModel)]="selectedDate"
  [theme]="currentTheme">        <!-- قابلیت جدید -->
</qeydar-date-picker>
```

---

### مرحله 4: استفاده از Base Component (برای توسعه‌دهندگان)

#### 4.1. ایجاد Custom DatePicker

```typescript
import { Component } from '@angular/core';
import { BaseDatePickerComponent } from '@qeydar/datepicker';

@Component({
  selector: 'my-custom-datepicker',
  template: `
    <!-- Custom Template -->
  `
})
export class MyCustomDatePickerComponent extends BaseDatePickerComponent {
  protected setupUI(): void {
    // Custom UI setup
  }
  
  protected updateUI(): void {
    // Custom UI update
  }
}
```

---

## 🔧 Migration Helpers

### 1. Compatibility Layer

برای حفظ سازگاری کامل، یک لایه سازگاری ایجاد شده است:

```typescript
// compatibility.service.ts
@Injectable({ providedIn: 'root' })
export class DatePickerCompatibilityService {
  /**
   * تبدیل Config قدیم به جدید
   */
  migrateConfig(oldConfig: any): DatePickerConfig {
    return {
      // Map old properties to new ones
      ...oldConfig
    };
  }
  
  /**
   * تبدیل Event قدیم به جدید
   */
  migrateEvent(oldEvent: any): DatePickerEvent {
    return {
      // Map old event structure to new one
      ...oldEvent
    };
  }
}
```

### 2. Deprecation Warnings

```typescript
// در کامپوننت قدیم
@Component({
  selector: 'qeydar-date-picker-old'
})
export class OldDatePickerComponent {
  constructor() {
    if (environment.production === false) {
      console.warn(
        'DEPRECATION WARNING: This component will be deprecated in v3.0. ' +
        'Please migrate to the new DatePickerComponent. ' +
        'See migration guide: https://github.com/qeydar/datepicker/MIGRATION.md'
      );
    }
  }
}
```

---

## 📊 Breaking Changes (در نسخه‌های آینده)

### نسخه 2.x (فعلی)
- ✅ همه API های قدیم کار می‌کنند
- ✅ Deprecation Warnings برای API های قدیمی
- ✅ API های جدید در کنار قدیمی‌ها

### نسخه 3.0 (آینده)
- ⚠️ برخی API های قدیمی Deprecated می‌شوند
- ✅ Migration Guide کامل
- ✅ Codemods برای مهاجرت خودکار

### نسخه 4.0 (آینده دور)
- ❌ حذف API های Deprecated
- ✅ فقط API های جدید

---

## 🧪 استراتژی تست

### 1. Unit Tests

```typescript
describe('DatePickerComponent', () => {
  it('should maintain backward compatibility', () => {
    // Test old API
  });
  
  it('should support new features', () => {
    // Test new API
  });
});
```

### 2. Integration Tests

```typescript
describe('Migration Compatibility', () => {
  it('should work with old configuration', () => {
    // Test with old config
  });
  
  it('should work with new configuration', () => {
    // Test with new config
  });
});
```

### 3. E2E Tests

```typescript
describe('User Migration Flow', () => {
  it('should allow gradual migration', () => {
    // Test mixed usage of old and new components
  });
});
```

---

## 📝 Checklist مهاجرت

### برای کاربران کتابخانه:

- [ ] بروزرسانی به آخرین نسخه
- [ ] بررسی Deprecation Warnings در Console
- [ ] مطالعه Migration Guide
- [ ] تست کامل اپلیکیشن
- [ ] مهاجرت تدریجی کامپوننت‌ها
- [ ] استفاده از Theme Service (اختیاری)
- [ ] بروزرسانی Unit Tests

### برای توسعه‌دهندگان کتابخانه:

- [ ] پیاده‌سازی Base Components
- [ ] ایجاد Services جدید
- [ ] نوشتن Unit Tests
- [ ] نوشتن Integration Tests
- [ ] بروزرسانی Documentation
- [ ] ایجاد Migration Examples
- [ ] Release Beta Version
- [ ] جمع‌آوری Feedback

---

## 🔍 مثال‌های مهاجرت

### مثال 1: Simple DatePicker

#### قبل از مهاجرت:
```typescript
@Component({
  template: `
    <qeydar-date-picker
      [calendarType]="'jalali'"
      [(ngModel)]="date">
    </qeydar-date-picker>
  `
})
export class MyComponent {
  date: string;
}
```

#### بعد از مهاجرت:
```typescript
@Component({
  template: `
    <qeydar-date-picker
      [calendarType]="'jalali'"
      [(ngModel)]="date"
      [theme]="'light'">        <!-- قابلیت جدید -->
    </qeydar-date-picker>
  `
})
export class MyComponent {
  date: string;
}
```

### مثال 2: Range DatePicker

#### قبل از مهاجرت:
```typescript
@Component({
  template: `
    <qeydar-date-picker
      [isRange]="true"
      [(ngModel)]="dateRange">
    </qeydar-date-picker>
  `
})
export class MyComponent {
  dateRange: { start: string, end: string };
}
```

#### بعد از مهاجرت (با استفاده از کامپوننت جدید):
```typescript
@Component({
  template: `
    <qeydar-range-picker          <!-- کامپوننت مخصوص Range -->
      [(ngModel)]="dateRange">
    </qeydar-range-picker>
  `
})
export class MyComponent {
  dateRange: { start: string, end: string };
}
```

### مثال 3: Custom DatePicker

#### قبل از مهاجرت:
```typescript
@Component({
  selector: 'my-datepicker',
  template: `
    <qeydar-date-picker
      [customLabels]="labels"
      [dateAdapter]="customAdapter">
    </qeydar-date-picker>
  `
})
export class MyDatePickerComponent {
  customAdapter = new MyCustomAdapter();
  labels = [...];
}
```

#### بعد از مهاجرت (با استفاده از Base Component):
```typescript
@Component({
  selector: 'my-datepicker',
  template: `<!-- Custom Template -->`
})
export class MyDatePickerComponent extends BaseDatePickerComponent {
  constructor(
    fb: FormBuilder,
    elementRef: ElementRef,
    cdref: ChangeDetectorRef,
    dpService: QeydarDatePickerService,
    themeService: DatePickerThemeService,
    jalali: JalaliDateAdapter,
    gregorian: GregorianDateAdapter,
    @Optional() @Inject(DATE_ADAPTER) injectedAdapter: DateAdapter<Date>
  ) {
    super(fb, elementRef, cdref, dpService, themeService, jalali, gregorian, injectedAdapter);
  }
  
  protected setupUI(): void {
    // Custom setup
  }
  
  protected updateUI(): void {
    // Custom update
  }
}
```

---

## 🚀 Quick Start برای مهاجرت

### گام 1: نصب
```bash
npm install @qeydar/datepicker@latest
```

### گام 2: Import
```typescript
import { QeydarDatePickerModule } from '@qeydar/datepicker';
```

### گام 3: استفاده (بدون تغییر کد)
```typescript
// کد شما همان‌طور که هست کار می‌کند!
<qeydar-date-picker [(ngModel)]="date"></qeydar-date-picker>
```

### گام 4: استفاده از قابلیت‌های جدید (اختیاری)
```typescript
// Theme Service
constructor(private themeService: DatePickerThemeService) {
  this.themeService.setTheme('dark');
}
```

---

## 📚 منابع اضافی

- [Architecture Guide](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Theme Guide](./THEME_GUIDE.md)
- [Custom Adapters](./CUSTOM_ADAPTERS.md)
- [Examples](./examples/)

---

## 💡 نکات مهم

1. **تعجیل نکنید**: مهاجرت را به صورت تدریجی انجام دهید
2. **تست کنید**: هر تغییر را به طور کامل تست کنید
3. **مستندات را بخوانید**: قبل از شروع، مستندات را مطالعه کنید
4. **از Deprecation Warnings استفاده کنید**: آن‌ها راهنمای خوبی برای مهاجرت هستند
5. **سوال بپرسید**: در صورت مشکل، در GitHub Issues سوال بپرسید

---

## 🆘 پشتیبانی

در صورت بروز مشکل در مهاجرت:

1. [GitHub Issues](https://github.com/qeydar/datepicker/issues)
2. [Discussions](https://github.com/qeydar/datepicker/discussions)
3. [Stack Overflow](https://stackoverflow.com/questions/tagged/qeydar-datepicker)

---

## 📊 وضعیت مهاجرت

| Feature | Status | Version |
|---------|--------|---------|
| Base Component | ✅ Ready | 2.0 |
| Theme Service | ✅ Ready | 2.0 |
| Range Picker Component | 🚧 In Progress | 2.1 |
| Inline Picker Component | 📋 Planned | 2.2 |
| Migration Tools | 📋 Planned | 2.3 |
| Codemods | 📋 Planned | 3.0 |

---

## ✅ نتیجه‌گیری

این Migration Plan به شما امکان می‌دهد:

1. ✅ بدون نگرانی از کد فعلی استفاده کنید
2. ✅ به تدریج به معماری جدید مهاجرت کنید
3. ✅ از قابلیت‌های جدید بهره‌مند شوید
4. ✅ کد خود را برای آینده آماده کنید

**مهاجرت موفق!** 🎉

