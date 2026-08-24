import { ChangeDetectionStrategy, Component, TemplateRef, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'qeydar-years-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  styleUrl: './years-grid.component.scss',
  template: `
    @if (viewMode() === 'years' || mode() == 'year') {
      <div class="years">
        @for (year of yearList(); track year) {
          <button
            tabindex="-1"
            [class.selected]="isActiveYear()(year)"
            [class.in-range]="isYearInRange()(year)"
            [class.range-start]="isYearRangeStart()(year)"
            [class.range-end]="isYearRangeEnd()(year)"
            [disabled]="isYearDisabled()(year)"
            (click)="selectYear.emit(year)"
            (mouseenter)="mouseEnter.emit(year)"
            (mouseleave)="mouseLeave.emit()"
            >
            @if (yearTemplate(); as tpl) {
              <ng-container *ngTemplateOutlet="$any(tpl); context: { $implicit: year, year: year, isSelected: isActiveYear()(year), isInRange: isYearInRange()(year), isDisabled: isYearDisabled()(year) }"></ng-container>
            } @else {
              {{ year }}
            }
          </button>
        }
      </div>
    }
    `
})
export class YearsGridComponent {
  readonly viewMode = input<'days' | 'months' | 'years'>('days');
  readonly mode = input<'day' | 'month' | 'year'>('day');
  readonly yearList = input<number[]>([]);
  readonly yearTemplate = input<TemplateRef<any> | null>(null);

  readonly isActiveYear = input.required<(year: number) => boolean>();
  readonly isYearInRange = input.required<(year: number) => boolean>();
  readonly isYearRangeStart = input.required<(year: number) => boolean>();
  readonly isYearRangeEnd = input.required<(year: number) => boolean>();
  readonly isYearDisabled = input.required<(year: number) => boolean>();

  readonly selectYear = output<number>();
  readonly mouseEnter = output<number>();
  readonly mouseLeave = output<void>();
}


