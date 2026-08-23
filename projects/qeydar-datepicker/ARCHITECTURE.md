# Qeydar DatePicker - معماری جدید پیشنهادی

## 📋 فهرست مطالب
1. [نمای کلی](#نمای-کلی)
2. [ساختار پروژه](#ساختار-پروژه)
3. [معماری کامپوننت‌ها](#معماری-کامپوننتها)
4. [سرویس‌ها](#سرویسها)
5. [Separation of Concerns](#separation-of-concerns)
6. [Best Practices](#best-practices)

---

## نمای کلی

معماری جدید Qeydar DatePicker بر اساس اصول زیر طراحی شده است:

- **Separation of Concerns**: جداسازی منطق کسب‌وکار، UI و State Management
- **Reusability**: قابلیت استفاده مجدد از کامپوننت‌ها و سرویس‌ها
- **Testability**: قابلیت تست آسان تمام بخش‌های کد
- **Extensibility**: امکان توسعه و اضافه کردن قابلیت‌های جدید
- **Performance**: بهینه‌سازی عملکرد با استفاده از OnPush Strategy
- **Type Safety**: استفاده کامل از TypeScript Types

---

## ساختار پروژه

```
qeydar-datepicker/
├── src/
│   ├── components/                    # کامپوننت‌های اصلی
│   │   ├── base-date-picker.component.ts    # کامپوننت پایه
│   │   ├── date-picker/                     # DatePicker اصلی
│   │   ├── range-picker/                    # Range DatePicker
│   │   └── inline-picker/                   # Inline DatePicker
│   │
│   ├── date-picker-popup/            # کامپوننت‌های Popup
│   │   ├── date-picker-popup.component.ts
│   │   └── components/
│   │       ├── calendar-header/
│   │       ├── calendar-footer/
│   │       ├── calendar-sidebar/
│   │       ├── days-grid/
│   │       ├── months-grid/
│   │       └── years-grid/
│   │
│   ├── time-picker/                  # Time Picker
│   │   └── time-picker.component.ts
│   │
│   ├── services/                     # سرویس‌ها
│   │   ├── date-picker-theme.service.ts     # مدیریت Theme
│   │   ├── date-picker-state.service.ts     # مدیریت State
│   │   ├── date-picker-config.service.ts    # مدیریت Configuration
│   │   └── calendar-utils.service.ts        # ابزارهای Calendar
│   │
│   ├── adapters/                     # Date Adapters
│   │   ├── date-adapter.interface.ts
│   │   ├── jalali-adapter.ts
│   │   ├── gregorian-adapter.ts
│   │   └── custom-adapter.example.ts
│   │
│   ├── strategies/                   # Strategy Pattern
│   │   ├── selection-strategy/
│   │   │   ├── selection-strategy.interface.ts
│   │   │   ├── single-selection.strategy.ts
│   │   │   ├── range-selection.strategy.ts
│   │   │   └── multiple-selection.strategy.ts
│   │   │
│   │   └── validation-strategy/
│   │       ├── validation-strategy.interface.ts
│   │       ├── date-validation.strategy.ts
│   │       └── time-validation.strategy.ts
│   │
│   ├── directives/                   # Directives
│   │   ├── date-mask.directive.ts
│   │   ├── template.directive.ts
│   │   └── theme.directive.ts
│   │
│   ├── pipes/                        # Pipes
│   │   ├── date-format.pipe.ts
│   │   └── jalali-date.pipe.ts
│   │
│   ├── models/                       # Models & Interfaces
│   │   ├── date-picker.models.ts
│   │   ├── theme.models.ts
│   │   └── calendar.models.ts
│   │
│   ├── utils/                        # Utilities
│   │   ├── animation/
│   │   ├── overlay/
│   │   └── helpers/
│   │
│   └── styles/                       # Styles
│       ├── _theme-variables.scss
│       ├── _theme-mixins.scss
│       ├── _base.scss
│       └── themes/
│           ├── light.theme.scss
│           ├── dark.theme.scss
│           └── custom.theme.scss
│
├── public-api.ts
└── qeydar-datepicker.module.ts
```

---

## معماری کامپوننت‌ها

### 1. BaseDatePickerComponent (Abstract)

کامپوننت پایه که تمام منطق مشترک را شامل می‌شود:

```typescript
@Directive()
export abstract class BaseDatePickerComponent {
  // Common Properties
  // Common Methods
  // ControlValueAccessor Implementation
  
  // Abstract methods که باید توسط کلاس‌های فرزند پیاده‌سازی شوند
  protected abstract setupUI(): void;
  protected abstract updateUI(): void;
}
```

**مسئولیت‌ها:**
- مدیریت State اصلی (selectedDate, isOpen, etc.)
- پیاده‌سازی ControlValueAccessor
- مدیریت Form Controls
- Validation منطق
- Date Adapter Management
- Event Handling مشترک

### 2. DatePickerComponent (Concrete)

کامپوننت اصلی که از BaseDatePickerComponent ارث‌بری می‌کند:

```typescript
@Component({
  selector: 'qeydar-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent extends BaseDatePickerComponent {
  protected setupUI(): void {
    // Setup specific UI for single date picker
  }
  
  protected updateUI(): void {
    // Update UI based on state changes
  }
}
```

### 3. RangeDatePickerComponent

کامپوننت مخصوص انتخاب Range:

```typescript
@Component({
  selector: 'qeydar-range-picker',
  standalone: true
})
export class RangeDatePickerComponent extends BaseDatePickerComponent {
  // Range-specific implementation
}
```

### 4. InlineDatePickerComponent

کامپوننت Inline بدون Input:

```typescript
@Component({
  selector: 'qeydar-inline-picker',
  standalone: true
})
export class InlineDatePickerComponent extends BaseDatePickerComponent {
  // Inline-specific implementation
}
```

---

## سرویس‌ها

### 1. DatePickerThemeService

مدیریت Theme System:

```typescript
@Injectable({ providedIn: 'root' })
export class DatePickerThemeService {
  // Theme management
  setTheme(themeName: string): void
  getCurrentTheme(): DatePickerTheme
  addCustomTheme(theme: DatePickerTheme): void
  toggleTheme(): void
  isDarkTheme(): boolean
}
```

**قابلیت‌ها:**
- ✅ Runtime Theme Switching
- ✅ CSS Variables Support
- ✅ Dark/Light Mode
- ✅ Custom Themes
- ✅ System Theme Detection
- ✅ Theme Persistence (LocalStorage)

### 2. DatePickerStateService

مدیریت State با RxJS:

```typescript
@Injectable()
export class DatePickerStateService {
  // State management with BehaviorSubject
  selectedDate$: Observable<Date | null>
  isOpen$: Observable<boolean>
  activeInput$: Observable<RangePartType>
  
  // State methods
  setSelectedDate(date: Date): void
  togglePicker(): void
  setActiveInput(input: RangePartType): void
}
```

### 3. DatePickerConfigService

مدیریت Configuration:

```typescript
@Injectable({ providedIn: 'root' })
export class DatePickerConfigService {
  // Global configuration
  setGlobalConfig(config: DatePickerConfig): void
  getConfig(): DatePickerConfig
  updateConfig(updates: Partial<DatePickerConfig>): void
}
```

### 4. CalendarUtilsService

ابزارهای مشترک Calendar:

```typescript
@Injectable({ providedIn: 'root' })
export class CalendarUtilsService {
  generateCalendar(date: Date, adapter: DateAdapter): CalendarDay[][]
  isDateInRange(date: Date, start: Date, end: Date): boolean
  getWeekDays(adapter: DateAdapter): string[]
  // ... other utility methods
}
```

---

## Separation of Concerns

### Layer 1: Presentation (UI Components)
- **مسئولیت**: نمایش UI و تعامل با کاربر
- **کامپوننت‌ها**: DatePickerComponent, CalendarHeaderComponent, etc.
- **ارتباط**: فقط با Services و State Management

### Layer 2: Business Logic (Services)
- **مسئولیت**: منطق کسب‌وکار، محاسبات، Validation
- **سرویس‌ها**: CalendarUtilsService, ValidationStrategy, etc.
- **ارتباط**: مستقل از UI، قابل تست

### Layer 3: State Management (State Services)
- **مسئولیت**: مدیریت State اپلیکیشن
- **سرویس‌ها**: DatePickerStateService
- **ارتباط**: با RxJS Observables

### Layer 4: Data Access (Adapters)
- **مسئولیت**: تبدیل و مدیریت داده‌ها
- **Adapters**: JalaliDateAdapter, GregorianDateAdapter
- **ارتباط**: Interface-based، قابل جایگزینی

---

## Strategy Pattern Implementation

### Selection Strategy

```typescript
interface SelectionStrategy {
  select(date: Date, currentState: SelectionState): SelectionState;
  isSelected(date: Date, state: SelectionState): boolean;
  canSelect(date: Date, state: SelectionState): boolean;
}

class SingleSelectionStrategy implements SelectionStrategy {
  select(date: Date): SelectionState {
    return { selectedDate: date };
  }
}

class RangeSelectionStrategy implements SelectionStrategy {
  select(date: Date, currentState: SelectionState): SelectionState {
    // Range selection logic
  }
}
```

### Validation Strategy

```typescript
interface ValidationStrategy {
  validate(date: Date, config: ValidationConfig): ValidationResult;
}

class DateValidationStrategy implements ValidationStrategy {
  validate(date: Date, config: ValidationConfig): ValidationResult {
    // Date validation logic (min, max, disabled dates)
  }
}

class TimeValidationStrategy implements ValidationStrategy {
  validate(date: Date, config: ValidationConfig): ValidationResult {
    // Time validation logic
  }
}
```

---

## Best Practices

### 1. Component Design

✅ **DO:**
- استفاده از OnPush Change Detection
- استفاده از Standalone Components
- تقسیم کامپوننت‌های بزرگ به کامپوننت‌های کوچک‌تر
- استفاده از @Input و @Output برای ارتباط
- پیاده‌سازی OnDestroy برای cleanup

❌ **DON'T:**
- استفاده از any type
- منطق کسب‌وکار در Template
- Direct DOM Manipulation
- Memory Leaks (unsubscribe نکردن)

### 2. Service Design

✅ **DO:**
- استفاده از Dependency Injection
- Single Responsibility Principle
- استفاده از RxJS برای Async Operations
- Error Handling مناسب
- Unit Testing

❌ **DON'T:**
- Tight Coupling
- Global State بدون مدیریت
- Side Effects در Pure Functions

### 3. State Management

✅ **DO:**
- استفاده از BehaviorSubject برای State
- Immutable State Updates
- Clear State Flow
- Predictable State Changes

❌ **DON'T:**
- Mutating State Directly
- Shared Mutable State
- Complex State Logic در Components

### 4. Styling

✅ **DO:**
- استفاده از CSS Variables
- Theme System
- BEM Naming Convention
- Responsive Design
- RTL Support

❌ **DON'T:**
- Inline Styles
- !important (مگر ضروری)
- Hard-coded Colors
- Fixed Dimensions

### 5. Testing

✅ **DO:**
- Unit Tests برای Services
- Component Tests
- Integration Tests
- E2E Tests برای User Flows
- Test Coverage > 80%

---

## Dependency Injection Structure

```typescript
// Module Level
@NgModule({
  providers: [
    DatePickerThemeService,
    DatePickerConfigService,
    CalendarUtilsService
  ]
})

// Component Level
@Component({
  providers: [
    DatePickerStateService,  // Component-specific state
    DestroyService           // Cleanup helper
  ]
})

// Custom Adapter Injection
providers: [
  {
    provide: DATE_ADAPTER,
    useClass: CustomDateAdapter
  }
]
```

---

## Performance Optimization

### 1. Change Detection
- استفاده از OnPush Strategy
- Immutable Data Structures
- TrackBy Functions در *ngFor

### 2. Lazy Loading
- Lazy Load کردن Time Picker
- Dynamic Component Loading
- Code Splitting

### 3. Memoization
- Cache کردن محاسبات سنگین
- Pure Pipes
- Memoized Selectors

### 4. Bundle Size
- Tree Shaking
- Standalone Components
- Minimal Dependencies

---

## Accessibility (a11y)

- ✅ Keyboard Navigation
- ✅ ARIA Labels
- ✅ Screen Reader Support
- ✅ Focus Management
- ✅ High Contrast Mode

---

## Internationalization (i18n)

- ✅ Multiple Language Support
- ✅ RTL Support
- ✅ Custom Labels
- ✅ Date Format Localization
- ✅ Calendar Type Support (Jalali, Gregorian)

---

## این معماری مزایای زیر را دارد:

1. **Maintainability**: کد تمیز و قابل نگهداری
2. **Scalability**: قابلیت رشد و توسعه
3. **Testability**: قابلیت تست بالا
4. **Reusability**: قابلیت استفاده مجدد
5. **Performance**: عملکرد بهینه
6. **Developer Experience**: تجربه توسعه‌دهندگی عالی
7. **Type Safety**: امنیت نوع داده
8. **Documentation**: مستندسازی کامل

