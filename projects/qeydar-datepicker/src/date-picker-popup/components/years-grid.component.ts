import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'qeydar-years-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor, NgTemplateOutlet],
  styleUrls: ['./years-grid.component.scss'],
  template: `
    <div *ngIf="viewMode === 'years' || mode == 'year'" class="years">
      <button
        *ngFor="let year of yearList"
        tabindex="-1"
        [class.selected]="isActiveYear(year)"
        [class.in-range]="isYearInRange(year)"
        [class.range-start]="isYearRangeStart(year)"
        [class.range-end]="isYearRangeEnd(year)"
        [disabled]="isYearDisabled(year)"
        (click)="selectYear.emit(year)"
        (mouseenter)="mouseEnter.emit(year)"
        (mouseleave)="mouseLeave.emit()"
      >
        <ng-container *ngIf="yearTemplate; else yearDefTemplate">
          <ng-container *ngTemplateOutlet="$any(yearTemplate); context: { $implicit: year }"></ng-container>
        </ng-container>
        <ng-template #yearDefTemplate>
          {{ year }}
        </ng-template>
      </button>
    </div>
  `
})
export class YearsGridComponent {
  @Input() viewMode: 'days' | 'months' | 'years' = 'days';
  @Input() mode: 'day' | 'month' | 'year' = 'day';
  @Input() yearList: number[] = [];
  @Input() yearTemplate: TemplateRef<any> | null = null;

  @Input() isActiveYear: (year: number) => boolean;
  @Input() isYearInRange: (year: number) => boolean;
  @Input() isYearRangeStart: (year: number) => boolean;
  @Input() isYearRangeEnd: (year: number) => boolean;
  @Input() isYearDisabled: (year: number) => boolean;

  @Output() selectYear = new EventEmitter<number>();
  @Output() mouseEnter = new EventEmitter<number>();
  @Output() mouseLeave = new EventEmitter<void>();
}


