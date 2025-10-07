import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'qeydar-months-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgFor, NgTemplateOutlet],
  styleUrls: ['./months-grid.component.scss'],
  template: `
    <div *ngIf="viewMode === 'months'" class="months">
      <button
        *ngFor="let month of monthListNum"
        tabindex="-1"
        [class.selected]="isActiveMonthNumber(month)"
        [disabled]="isMonthDisabled(month)"
        (click)="selectMonth.emit(month)"
      >
        <ng-container *ngIf="monthTemplate; else monthDefTemplate">
          <ng-container *ngTemplateOutlet="$any(monthTemplate); context: { $implicit: month }"></ng-container>
        </ng-container>
        <ng-template #monthDefTemplate>
          {{ getMonthName(month) }}
        </ng-template>
      </button>
    </div>
  `
})
export class MonthsGridComponent {
  @Input() viewMode: 'days' | 'months' | 'years' = 'days';
  @Input() monthListNum: number[] = [];
  @Input() monthTemplate: TemplateRef<any> | null = null;

  @Input() isActiveMonthNumber: (month: number) => boolean;
  @Input() isMonthDisabled: (month: number) => boolean;
  @Input() getMonthName: (month: number) => string;

  @Output() selectMonth = new EventEmitter<number>();
}


