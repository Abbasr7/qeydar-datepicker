/**
 * Custom DatePicker Example
 * این فایل نمونه‌ای از نحوه استفاده از BaseDatePickerComponent برای ایجاد یک DatePicker سفارشی است
 */

import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { BaseDatePickerComponent } from '../base-date-picker.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QeydarDatePickerService } from '../../date-picker.service';
import { slideAlertMotion } from '../../utils/animation/slide';

/**
 * مثال 1: Custom DatePicker با UI سفارشی
 */
@Component({
  selector: 'custom-date-picker-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QeydarDatePickerService],
  animations: [slideAlertMotion],
  template: `
    <div class="custom-datepicker">
      <div class="custom-input-wrapper">
        <input
          #input
          type="text"
          [formControl]="dateInputControl"
          [placeholder]="getPlaceholder()"
          (click)="toggle()"
          (focus)="onFocus.emit($event)"
          (blur)="onBlur.emit($event)"
          class="custom-input"
        />
        <button 
          type="button" 
          class="custom-icon-btn" 
          (click)="toggle()"
          [disabled]="disabled">
          📅
        </button>
      </div>
      
      <div 
        *ngIf="isOpen" 
        class="custom-dropdown"
        [@slideAlertMotion]>
        <div class="custom-calendar">
          <div class="custom-header">
            <button (click)="previousMonth()">◀</button>
            <span>{{ currentMonth }}</span>
            <button (click)="nextMonth()">▶</button>
          </div>
          
          <div class="custom-body">
            <!-- Calendar grid would go here -->
            <p>Custom Calendar UI</p>
          </div>
          
          <div class="custom-footer">
            <button (click)="selectToday()">امروز</button>
            <button (click)="close()">بستن</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-datepicker {
      position: relative;
      font-family: 'Vazir', sans-serif;
    }
    
    .custom-input-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--qeydar-background-color);
      border: 2px solid var(--qeydar-border-color);
      border-radius: var(--qeydar-border-radius);
      padding: 4px;
      transition: var(--qeydar-transition);
    }
    
    .custom-input-wrapper:focus-within {
      border-color: var(--qeydar-primary-color);
      box-shadow: var(--qeydar-shadow-focus);
    }
    
    .custom-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 8px;
      background: transparent;
      color: var(--qeydar-text-color);
      font-size: var(--qeydar-font-size);
    }
    
    .custom-icon-btn {
      background: var(--qeydar-primary-color);
      border: none;
      border-radius: var(--qeydar-border-radius-small);
      padding: 8px 12px;
      cursor: pointer;
      font-size: 18px;
      transition: var(--qeydar-transition-fast);
    }
    
    .custom-icon-btn:hover:not(:disabled) {
      background: var(--qeydar-primary-hover);
      transform: scale(1.05);
    }
    
    .custom-icon-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .custom-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      z-index: var(--qeydar-z-index-dropdown);
      background: var(--qeydar-background-color);
      border: 1px solid var(--qeydar-border-color);
      border-radius: var(--qeydar-border-radius);
      box-shadow: var(--qeydar-shadow);
      padding: 16px;
      min-width: 300px;
    }
    
    .custom-calendar {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .custom-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      background: var(--qeydar-background-color-light);
      border-radius: var(--qeydar-border-radius-small);
    }
    
    .custom-header button {
      background: var(--qeydar-primary-color);
      color: white;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      cursor: pointer;
      transition: var(--qeydar-transition-fast);
    }
    
    .custom-header button:hover {
      background: var(--qeydar-primary-hover);
      transform: scale(1.1);
    }
    
    .custom-body {
      padding: 16px;
      text-align: center;
      color: var(--qeydar-text-color);
    }
    
    .custom-footer {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    
    .custom-footer button {
      flex: 1;
      padding: 8px 16px;
      border: 1px solid var(--qeydar-border-color);
      border-radius: var(--qeydar-border-radius-small);
      background: var(--qeydar-background-color);
      color: var(--qeydar-text-color);
      cursor: pointer;
      transition: var(--qeydar-transition-fast);
    }
    
    .custom-footer button:hover {
      background: var(--qeydar-primary-color);
      color: white;
      border-color: var(--qeydar-primary-color);
    }
  `]
})
export class CustomDatePickerExample extends BaseDatePickerComponent {
  @ViewChild('input') inputElement: ElementRef<HTMLInputElement>;
  
  currentMonth = 'فروردین 1403';
  
  protected setupUI(): void {
    // Setup custom UI
    console.log('Custom DatePicker UI setup');
  }
  
  protected updateUI(): void {
    // Update custom UI based on state
    if (this.selectedDate) {
      this.currentMonth = this.currentDateAdapter.format(this.selectedDate, 'MMMM yyyy');
    }
    this.cdref.markForCheck();
  }

  get dateInputControl(): FormControl {
    return this.form.get('dateInput') as FormControl;
  }
  
  previousMonth(): void {
    if (this.selectedDate) {
      this.selectedDate = this.currentDateAdapter.addMonths(this.selectedDate, -1);
      this.updateUI();
    }
  }
  
  nextMonth(): void {
    if (this.selectedDate) {
      this.selectedDate = this.currentDateAdapter.addMonths(this.selectedDate, 1);
      this.updateUI();
    }
  }
  
  selectToday(): void {
    const today = this.currentDateAdapter.today();
    this.onDateSelected(today);
  }
}

/**
 * مثال 2: Minimal DatePicker
 */
@Component({
  selector: 'minimal-date-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QeydarDatePickerService],
  template: `
    <div class="minimal-picker">
      <input
        type="text"
        [formControl]="dateInputControl"
        [placeholder]="getPlaceholder()"
        (click)="toggle()"
        class="minimal-input"
      />
      
      <div *ngIf="isOpen" class="minimal-popup">
        <p>تاریخ انتخاب شده: {{ selectedDate | date:'yyyy/MM/dd' }}</p>
        <button (click)="selectToday()">امروز</button>
        <button (click)="close()">بستن</button>
      </div>
    </div>
  `,
  styles: [`
    .minimal-picker {
      position: relative;
    }
    
    .minimal-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .minimal-popup {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 16px;
      margin-top: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 1000;
    }
    
    .minimal-popup button {
      margin: 4px;
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class MinimalDatePicker extends BaseDatePickerComponent {
  protected setupUI(): void {
    // Minimal setup
  }
  
  protected updateUI(): void {
    this.cdref.markForCheck();
  }

  get dateInputControl(): FormControl {
    return this.form.get('dateInput') as FormControl;
  }
  
  selectToday(): void {
    const today = this.currentDateAdapter.today();
    this.onDateSelected(today);
  }
}

/**
 * مثال 3: Advanced DatePicker با قابلیت‌های پیشرفته
 */
@Component({
  selector: 'advanced-date-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QeydarDatePickerService],
  template: `
    <div class="advanced-picker" [class.rtl]="rtl">
      <div class="picker-header">
        <h3>{{ title }}</h3>
        <button (click)="toggleTheme()">🌓</button>
      </div>
      
      <div class="picker-body">
        <input
          type="text"
          [formControl]="dateInputControl"
          [placeholder]="getPlaceholder()"
          (click)="toggle()"
          class="advanced-input"
        />
        
        <div *ngIf="isOpen" class="advanced-dropdown">
          <!-- Advanced calendar UI -->
          <div class="quick-select">
            <button (click)="selectToday()">امروز</button>
            <button (click)="selectYesterday()">دیروز</button>
            <button (click)="selectTomorrow()">فردا</button>
          </div>
          
          <div class="date-info" *ngIf="selectedDate">
            <p>تاریخ انتخابی:</p>
            <p class="selected-date">
              {{ currentDateAdapter.format(selectedDate, format) }}
            </p>
          </div>
          
          <div class="actions">
            <button (click)="clear()">پاک کردن</button>
            <button (click)="close()">بستن</button>
          </div>
        </div>
      </div>
      
      <div class="picker-footer" *ngIf="footerDescription">
        <small>{{ footerDescription }}</small>
      </div>
    </div>
  `,
  styles: [`
    .advanced-picker {
      font-family: 'Vazir', sans-serif;
      background: var(--qeydar-background-color);
      border: 1px solid var(--qeydar-border-color);
      border-radius: var(--qeydar-border-radius);
      padding: 16px;
      box-shadow: var(--qeydar-shadow);
    }
    
    .advanced-picker.rtl {
      direction: rtl;
    }
    
    .picker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--qeydar-border-color);
    }
    
    .picker-header h3 {
      margin: 0;
      color: var(--qeydar-text-color);
      font-size: var(--qeydar-font-size-large);
    }
    
    .picker-header button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      transition: var(--qeydar-transition-fast);
    }
    
    .picker-header button:hover {
      transform: scale(1.2);
    }
    
    .picker-body {
      position: relative;
    }
    
    .advanced-input {
      width: 100%;
      padding: 12px;
      border: 2px solid var(--qeydar-border-color);
      border-radius: var(--qeydar-border-radius);
      font-size: var(--qeydar-font-size);
      color: var(--qeydar-text-color);
      background: var(--qeydar-background-color);
      transition: var(--qeydar-transition);
    }
    
    .advanced-input:focus {
      outline: none;
      border-color: var(--qeydar-primary-color);
      box-shadow: var(--qeydar-shadow-focus);
    }
    
    .advanced-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: var(--qeydar-background-color);
      border: 1px solid var(--qeydar-border-color);
      border-radius: var(--qeydar-border-radius);
      box-shadow: var(--qeydar-shadow-hover);
      padding: 16px;
      z-index: var(--qeydar-z-index-dropdown);
    }
    
    .quick-select {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .quick-select button {
      flex: 1;
      padding: 8px;
      border: 1px solid var(--qeydar-border-color);
      border-radius: var(--qeydar-border-radius-small);
      background: var(--qeydar-background-color-light);
      color: var(--qeydar-text-color);
      cursor: pointer;
      transition: var(--qeydar-transition-fast);
    }
    
    .quick-select button:hover {
      background: var(--qeydar-primary-color);
      color: white;
      border-color: var(--qeydar-primary-color);
      transform: translateY(-2px);
    }
    
    .date-info {
      background: var(--qeydar-background-color-active);
      border-radius: var(--qeydar-border-radius-small);
      padding: 12px;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .date-info p {
      margin: 4px 0;
      color: var(--qeydar-text-color);
    }
    
    .selected-date {
      font-size: var(--qeydar-font-size-large);
      font-weight: bold;
      color: var(--qeydar-primary-color);
    }
    
    .actions {
      display: flex;
      gap: 8px;
    }
    
    .actions button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: var(--qeydar-border-radius-small);
      cursor: pointer;
      font-weight: 500;
      transition: var(--qeydar-transition-fast);
    }
    
    .actions button:first-child {
      background: var(--qeydar-error-color);
      color: white;
    }
    
    .actions button:first-child:hover {
      opacity: 0.9;
      transform: scale(1.02);
    }
    
    .actions button:last-child {
      background: var(--qeydar-primary-color);
      color: white;
    }
    
    .actions button:last-child:hover {
      background: var(--qeydar-primary-hover);
      transform: scale(1.02);
    }
    
    .picker-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--qeydar-border-color);
      text-align: center;
    }
    
    .picker-footer small {
      color: var(--qeydar-text-color-secondary);
      font-size: var(--qeydar-font-size-small);
    }
  `]
})
export class AdvancedDatePicker extends BaseDatePickerComponent {
  title = 'انتخاب تاریخ';
  
  protected setupUI(): void {
    console.log('Advanced DatePicker setup');
  }
  
  protected updateUI(): void {
    this.cdref.markForCheck();
  }

  get dateInputControl(): FormControl {
    return this.form.get('dateInput') as FormControl;
  }
  
  selectToday(): void {
    const today = this.currentDateAdapter.today();
    this.onDateSelected(today);
  }
  
  selectYesterday(): void {
    const yesterday = this.currentDateAdapter.addDays(
      this.currentDateAdapter.today(),
      -1
    );
    this.onDateSelected(yesterday);
  }
  
  selectTomorrow(): void {
    const tomorrow = this.currentDateAdapter.addDays(
      this.currentDateAdapter.today(),
      1
    );
    this.onDateSelected(tomorrow);
  }
  
  clear(): void {
    this.selectedDate = null;
    this.form.get('dateInput')?.setValue('');
    this.onChange(null);
    this.updateUI();
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

