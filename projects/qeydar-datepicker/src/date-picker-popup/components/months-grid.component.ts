import { ChangeDetectionStrategy, Component, TemplateRef, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'qeydar-months-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  styleUrl: './months-grid.component.scss',
  template: `
    @if (viewMode() === 'months') {
      <div class="months">
        @for (month of monthListNum(); track month) {
          <button
            tabindex="-1"
            [class.selected]="isActiveMonthNumber()(month)"
            [class.in-range]="isMonthInRange()(month)"
            [class.range-start]="isMonthRangeStart()(month)"
            [class.range-end]="isMonthRangeEnd()(month)"
            [disabled]="isMonthDisabled()(month)"
            (click)="selectMonth.emit(month)"
            (mouseenter)="mouseEnter.emit(month)"
            (mouseleave)="mouseLeave.emit()"
            >
            @if (monthTemplate(); as tpl) {
              <ng-container *ngTemplateOutlet="$any(tpl); context: { $implicit: month, month: month, name: getMonthName()(month), isSelected: isActiveMonthNumber()(month), isInRange: isMonthInRange()(month), isDisabled: isMonthDisabled()(month) }"></ng-container>
            } @else {
              {{ getMonthName()(month) }}
            }
          </button>
        }
      </div>
    }
    `
})
export class MonthsGridComponent {
  readonly viewMode = input<'days' | 'months' | 'years'>('days');
  readonly monthListNum = input<number[]>([]);
  readonly monthTemplate = input<TemplateRef<any> | null>(null);

  readonly isActiveMonthNumber = input.required<(month: number) => boolean>();
  readonly isMonthInRange = input.required<(month: number) => boolean>();
  readonly isMonthRangeStart = input.required<(month: number) => boolean>();
  readonly isMonthRangeEnd = input.required<(month: number) => boolean>();
  readonly isMonthDisabled = input.required<(month: number) => boolean>();
  readonly getMonthName = input.required<(month: number) => string>();

  readonly selectMonth = output<number>();
  readonly mouseEnter = output<number>();
  readonly mouseLeave = output<void>();
}


