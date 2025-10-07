import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'qeydar-calendar-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
  styleUrls: ['./calendar-header.component.scss'],
  template: `
    <div class="header">
      <button class="qeydar-calendar-nav-left" (click)="prev.emit()" [disabled]="prevDisabled" tabindex="-1"></button>
      <span class="month-year">
        <span *ngIf="mode != 'year'" class="month-name" (click)="showMonths.emit()">{{ currentMonthName }}</span>
        <span class="year" (click)="showYears.emit()">{{ currentYear }}</span>
      </span>
      <button class="qeydar-calendar-nav-right" (click)="next.emit()" [disabled]="nextDisabled" tabindex="-1"></button>
    </div>
  `
})
export class CalendarHeaderComponent {
  @Input() mode: 'day' | 'month' | 'year' = 'day';
  @Input() currentMonthName: string;
  @Input() currentYear: number;
  @Input() prevDisabled = false;
  @Input() nextDisabled = false;

  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() showMonths = new EventEmitter<void>();
  @Output() showYears = new EventEmitter<void>();
}


