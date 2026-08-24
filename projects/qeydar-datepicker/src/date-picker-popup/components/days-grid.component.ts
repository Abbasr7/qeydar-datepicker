import { ChangeDetectionStrategy, Component, TemplateRef, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
@Component({
  selector: 'qeydar-days-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  styleUrl: './days-grid.component.scss',
  template: `
    @if (viewMode() === 'days') {
      <div>
        <div class="weekdays">
          @for (day of weekDays(); track day) {
            <span>{{ day }}</span>
          }
        </div>
        <div class="days">
            @for (day of days(); track day) {
              <button
                tabindex="-1"
                [class.different-month]="!isSameMonth()(day, currentDate())"
                [class.selected]="isSelected()(day)"
                [class.in-range]="isInRange()(day)"
                [class.range-start]="isRangeStart()(day)"
                [class.range-end]="isRangeEnd()(day)"
                [class.today]="isToday()(day)"
                [class.disabled]="isDateDisabled()(day)"
                [disabled]="isDateDisabled()(day)"
                (click)="selectDay.emit(day)"
                (mouseenter)="mouseEnter.emit(day)"
                >
                @if (dayTemplate(); as tpl) {
                  <ng-container *ngTemplateOutlet="$any(tpl); context: getDayTemplateContext(day)"></ng-container>
                } @else {
                  {{ getDayNumber()(day) }}
                }
              </button>
            }
        </div>
      </div>
    }
    `
})
export class DaysGridComponent {
  readonly viewMode = input<'days' | 'months' | 'years'>('days');
  readonly days = input<Date[]>([]);
  readonly weekDays = input<string[]>([]);
  readonly currentDate = input.required<Date>();
  readonly dayTemplate = input<TemplateRef<any> | null>(null);

  readonly isSameMonth = input.required<(d1: Date, d2: Date) => boolean>();
  readonly isSelected = input.required<(d: Date) => boolean>();
  readonly isInRange = input.required<(d: Date) => boolean>();
  readonly isRangeStart = input.required<(d: Date) => boolean>();
  readonly isRangeEnd = input.required<(d: Date) => boolean>();
  readonly isToday = input.required<(d: Date) => boolean>();
  readonly isDateDisabled = input.required<(d: Date) => boolean>();
  readonly getDayNumber = input.required<(d: Date) => number>();

  getDayTemplateContext(day: Date): object {
    return {
      $implicit: day,
      day,
      date: day,
      dayNumber: this.getDayNumber()(day),
      isSelected: this.isSelected()(day),
      isInRange: this.isInRange()(day),
      isRangeStart: this.isRangeStart()(day),
      isRangeEnd: this.isRangeEnd()(day),
      isToday: this.isToday()(day),
      isDisabled: this.isDateDisabled()(day),
      isCurrentMonth: this.isSameMonth()(day, this.currentDate())
    };
  }

  readonly selectDay = output<Date>();
  readonly mouseEnter = output<Date>();
}


