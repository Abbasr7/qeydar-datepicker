import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';


@Component({
  selector: 'qeydar-calendar-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styleUrl: './calendar-header.component.scss',
  template: `
    <div class="header">
      <button class="qeydar-calendar-nav-left" (click)="prev.emit()" [disabled]="prevDisabled()" tabindex="-1"></button>
      <span class="month-year">
        @if (mode() != 'year') {
          <span class="month-name" (click)="showMonths.emit()">{{ currentMonthName() }}</span>
        }
        <span class="year" (click)="showYears.emit()">{{ currentYear() }}</span>
      </span>
      <button class="qeydar-calendar-nav-right" (click)="next.emit()" [disabled]="nextDisabled()" tabindex="-1"></button>
    </div>
    `
})
export class CalendarHeaderComponent {
  readonly mode = input<'day' | 'month' | 'year'>('day');
  readonly currentMonthName = input<string>();
  readonly currentYear = input<number>();
  readonly prevDisabled = input(false);
  readonly nextDisabled = input(false);

  readonly prev = output<void>();
  readonly next = output<void>();
  readonly showMonths = output<void>();
  readonly showYears = output<void>();
}


