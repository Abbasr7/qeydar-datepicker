import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'qeydar-calendar-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf],
  styleUrls: ['./calendar-sidebar.component.scss'],
  template: `
    <ng-container *ngIf="showSidebar">
      <div *ngIf="isRange" class="period-selector">
        <button
          *ngFor="let period of periods"
          tabindex="-1"
          [class.active]="isActivePeriod(period)"
          (click)="selectPeriod.emit(period)"
        >
          {{ period.label }}
          <span *ngIf="period.arrow" class="arrow">→</span>
        </button>
      </div>
      <div *ngIf="!isRange" class="side-selector" #itemSelector>
        <ng-container *ngIf="viewMode == 'days'">
          <button 
            *ngFor="let month of monthListNum"
            tabindex="-1"
            [id]="'selector_'+month"
            [class.active]="isActiveMonth(month)"
            [disabled]="isMonthDisabled(month)"
            (click)="selectMonth.emit(month)">
            {{ getMonthName(month) }}
          </button>
        </ng-container>
        <ng-container *ngIf="viewMode == 'months'">
          <button
            *ngFor="let year of yearList" 
            tabindex="-1"
            [id]="'selector_'+year"
            [class.active]="isActiveYear(year)"
            [disabled]="isYearDisabled(year)"
            (click)="selectYear.emit(year)"
          >
            {{ year }}
          </button>
        </ng-container>
        <ng-container *ngIf="viewMode == 'years'">
          <button
            tabindex="-1"
            *ngFor="let yearRange of yearRanges" 
            [id]="'selector_'+yearRange.start"
            [class.active]="isActiveYearRange(yearRange.start)"
            [disabled]="isYearRangeDisabled(yearRange)"
            (click)="selectYearRange.emit(yearRange.start)"
          >
            {{ yearRange.start }} - {{ yearRange.end }}
          </button>
        </ng-container>
      </div>
    </ng-container>
  `
})
export class CalendarSidebarComponent implements AfterViewInit {
  @Input() showSidebar = true;
  @Input() isRange = false;
  @Input() viewMode: 'days' | 'months' | 'years' = 'days';
  @Input() periods: any[] = [];
  @Input() monthListNum: number[] = [];
  @Input() yearList: number[] = [];
  @Input() yearRanges: Array<{ start: number; end: number }> = [];

  @Input() isActivePeriod: (period: any) => boolean;
  @Input() getMonthName: (month: number) => string;
  @Input() isActiveMonth: (month: number) => boolean;
  @Input() isMonthDisabled: (month: number) => boolean;
  @Input() isActiveYear: (year: number) => boolean;
  @Input() isYearDisabled: (year: number) => boolean;
  @Input() isActiveYearRange: (startYear: number) => boolean;
  @Input() isYearRangeDisabled: (range: { start: number; end: number }) => boolean;

  @Output() selectPeriod = new EventEmitter<any>();
  @Output() selectMonth = new EventEmitter<number>();
  @Output() selectYear = new EventEmitter<number>();
  @Output() selectYearRange = new EventEmitter<number>();

  @ViewChild('itemSelector') itemSelector: ElementRef;

  ngAfterViewInit(): void {}
}


