# Angular 14 → 21+ Upgrade Plan for qeydar-datepicker

## Current State Analysis
- **Angular**: 14.2.x → Target: 21+
- **TypeScript**: 4.7.2 → Target: 5.6+
- **Node.js**: 24.x (already modern)
- **RxJS**: 7.5.x → Target: 7.8+
- **Zone.js**: 0.11.4 → Target: 0.14+
- **date-fns**: 4.1.x (compatible with Angular 21)
- **date-fns-jalali**: 4.1.x (check compatibility)
- **Angular CLI**: 14.2.13 → Target: 21+
- **ng-packagr**: 14.2.x → Target: 21+

## Breaking Changes to Address (Angular 15-21)

### 1. TypeScript Configuration
- Target: ES2022 (was ES2020)
- Module: ES2022 (was ES2020)
- Strict mode enhancements
- Remove deprecated compiler options

### 2. Angular Core Changes
- **Standalone components** (already ✅ used throughout)
- **NgModule** deprecation - migrate to standalone APIs where possible
- **ControlValueAccessor** - ensure compatibility
- **destroyRef** + `takeUntilDestroyed()` pattern (replace manual destroy$)
- **Injection tokens** - use `inject()` function
- **HttpClientModule** → `provideHttpClient()` (not used)
- **Router** - if used, update to new APIs

### 3. CDK/Overlay Changes
- `CdkConnectedOverlay` position strategy changes
- `OverlayModule` imports
- Position pair API changes

### 4. Forms Changes
- `FormBuilder` - still works but `NonNullableFormBuilder` preferred
- Validators updates

### 5. Testing Changes
- `TestBed` - `configureTestingModule` deprecated in favor of `TestBed.runInInjectionContext()`
- Karma → Web Test Runner (optional but recommended)
- Jasmine 5.x

### 6. Build System
- `ng-packagr` 21+ for library builds
- `angular.json` builder updates
- `tsconfig.lib.prod.json` - compilationMode: "partial" (keep for library)

### 7. Package Dependencies
- Peer dependencies: Update to `>=21.0.0`
- Dependencies: Update all Angular packages to 21+
- Dev dependencies: Update CLI, build tools, testing tools

---

## Step-by-Step Execution Plan

### Phase 1: Core Configuration Updates
1. Update root `package.json` - all Angular deps to ^21.0.0
2. Update library `package.json` - peer deps to >=21.0.0
3. Update `tsconfig.json` - ES2022 target, strict mode
4. Update `tsconfig.lib.json` and `tsconfig.lib.prod.json`
5. Update `angular.json` - builder versions

### Phase 2: Source Code Updates
6. Update `date-adapter.ts` - modern injection patterns
7. Update `overlay.ts` - CDK overlay API changes
8. Update components for `destroyRef`/`takeUntilDestroyed`
9. Update `date-picker.service.ts` - inject() patterns
10. Update all components for modern Angular patterns

### Phase 3: Testing Infrastructure
11. Update `karma.conf.js` for Angular 21
12. Update test files for new TestBed APIs
13. Update `tsconfig.spec.json`

### Phase 4: Build & Validation
14. Run `npm install` with updated packages
15. Run build for library: `npm run build-package`
16. Run tests: `npm test`
17. Run demo app build: `npm run build`

### Phase 5: Publish Preparation
18. Update version in package.json files
19. Verify library exports
20. Test consumer compatibility

---

## Key Files to Modify

### Configuration Files
- `/package.json` - root
- `/projects/qeydar-datepicker/package.json` - library
- `/tsconfig.json` - root
- `/projects/qeydar-datepicker/tsconfig.lib.json`
- `/projects/qeydar-datepicker/tsconfig.lib.prod.json`
- `/projects/qeydar-datepicker/tsconfig.spec.json`
- `/angular.json`

### Source Files (Library)
- `/projects/qeydar-datepicker/src/date-adapter.ts`
- `/projects/qeydar-datepicker/src/utils/overlay/overlay.ts`
- `/projects/qeydar-datepicker/src/date-picker.service.ts`
- `/projects/qeydar-datepicker/src/date-picker.component.ts`
- `/projects/qeydar-datepicker/src/components/base-date-picker.component.ts`
- `/projects/qeydar-datepicker/src/date-picker-popup/date-picker-popup.component.ts`
- `/projects/qeydar-datepicker/src/time-picker/time-picker.component.ts`
- `/projects/qeydar-datepicker/src/utils/input-mask.directive.ts`
- `/projects/qeydar-datepicker/src/modal/picker-modal.service.ts`
- `/projects/qeydar-datepicker/src/utils/template.directive.ts`

### Test Files
- `/projects/qeydar-datepicker/src/date-picker-popup/date-picker-popup.component.spec.ts`
- `/projects/qeydar-datepicker/karma.conf.js`
- `/projects/qeydar-datepicker/src/test.ts`

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| CDK Overlay API changes | High | Test overlay positioning thoroughly |
| ControlValueAccessor changes | Medium | Verify form integration |
| destroyRef migration | Medium | Replace all manual destroy$ subscriptions |
| Peer dependency version conflicts | High | Test with Angular 21 consumer app |
| date-fns-jalali compatibility | Medium | Verify Jalali calendar still works |
| Library build (ng-packagr) | High | Test build and publish locally |

---

## Success Criteria
- ✅ Library builds without errors
- ✅ All tests pass
- ✅ Demo application runs
- ✅ Components work in Angular 21 consumer app
- ✅ No deprecated API warnings
- ✅ Bundle size reasonable