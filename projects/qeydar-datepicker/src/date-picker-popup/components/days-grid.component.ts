import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
@Component({
  selector: 'qeydar-days-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor, NgTemplateOutlet],
  styleUrls: ['./days-grid.component.scss'],
  template: `
    <div *ngIf="viewMode === 'days'">
      <div *ngIf="viewMode === 'days'" class="weekdays">
        <span *ngFor="let day of weekDays">{{ day }}</span>
      </div>
      <div *ngIf="viewMode === 'days'" class="days">
        <button
          *ngFor="let day of days"
          tabindex="-1"
          [class.different-month]="!isSameMonth(day, currentDate)"
          [class.selected]="isSelected(day)"
          [class.in-range]="isInRange(day)"
          [class.range-start]="isRangeStart(day)"
          [class.range-end]="isRangeEnd(day)"
          [class.today]="isToday(day)"
          [class.disabled]="isDateDisabled(day)"
          [disabled]="isDateDisabled(day)"
          (click)="selectDay.emit(day)"
          (mouseenter)="mouseEnter.emit(day)"
        >
          <ng-container *ngIf="dayTemplate; else dayDefTemplate">
            <ng-container *ngTemplateOutlet="$any(dayTemplate); context: getDayTemplateContext(day)"></ng-container>
          </ng-container>
          <ng-template #dayDefTemplate>
            {{ getDayNumber(day) }}
          </ng-template>
        </button>
      </div>
    </div>
  `
})
export class DaysGridComponent {
  @Input() viewMode: 'days' | 'months' | 'years' = 'days';
  @Input() days: Date[] = [];
  @Input() weekDays: string[] = [];
  @Input() currentDate: Date;
  @Input() dayTemplate: TemplateRef<any> | null = null;

  @Input() isSameMonth: (d1: Date, d2: Date) => boolean;
  @Input() isSelected: (d: Date) => boolean;
  @Input() isInRange: (d: Date) => boolean;
  @Input() isRangeStart: (d: Date) => boolean;
  @Input() isRangeEnd: (d: Date) => boolean;
  @Input() isToday: (d: Date) => boolean;
  @Input() isDateDisabled: (d: Date) => boolean;
  @Input() getDayNumber: (d: Date) => number;

  getDayTemplateContext(day: Date): object {
    return {
      $implicit: day,
      day,
      date: day,
      dayNumber: this.getDayNumber(day),
      isSelected: this.isSelected(day),
      isInRange: this.isInRange(day),
      isRangeStart: this.isRangeStart(day),
      isRangeEnd: this.isRangeEnd(day),
      isToday: this.isToday(day),
      isDisabled: this.isDateDisabled(day),
      isCurrentMonth: this.isSameMonth(day, this.currentDate)
    };
  }

  @Output() selectDay = new EventEmitter<Date>();
  @Output() mouseEnter = new EventEmitter<Date>();
}


