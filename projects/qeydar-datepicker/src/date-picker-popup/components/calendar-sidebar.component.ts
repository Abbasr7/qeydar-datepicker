import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, input, output, viewChild } from '@angular/core';


@Component({
  selector: 'qeydar-calendar-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styleUrl: './calendar-sidebar.component.scss',
  template: `
    @if (showSidebar()) {
      @if (isRange()) {
        <div class="period-selector">
          @for (period of periods(); track period) {
            <button
              tabindex="-1"
              [class.active]="isActivePeriod()(period)"
              (click)="selectPeriod.emit(period)"
              >
              {{ period.label }}
              @if (period.arrow) {
                <span class="arrow">→</span>
              }
            </button>
          }
        </div>
      }
      @if (!isRange()) {
        <div class="side-selector" #itemSelector>
          @if (viewMode() == 'days') {
            @for (month of monthListNum(); track month) {
              <button
                tabindex="-1"
                [id]="'selector_'+month"
                [class.active]="isActiveMonth()(month)"
                [disabled]="isMonthDisabled()(month)"
                (click)="selectMonth.emit(month)">
                {{ getMonthName()(month) }}
              </button>
            }
          }
          @if (viewMode() == 'months') {
            @for (year of yearList(); track year) {
              <button
                tabindex="-1"
                [id]="'selector_'+year"
                [class.active]="isActiveYear()(year)"
                [disabled]="isYearDisabled()(year)"
                (click)="selectYear.emit(year)"
                >
                {{ year }}
              </button>
            }
          }
          @if (viewMode() == 'years') {
            @for (yearRange of yearRanges(); track yearRange) {
              <button
                tabindex="-1"
                [id]="'selector_'+yearRange.start"
                [class.active]="isActiveYearRange()(yearRange.start)"
                [disabled]="isYearRangeDisabled()(yearRange)"
                (click)="selectYearRange.emit(yearRange.start)"
                >
                {{ yearRange.start }} - {{ yearRange.end }}
              </button>
            }
          }
        </div>
      }
    }
    `
})
export class CalendarSidebarComponent implements AfterViewInit {
  readonly showSidebar = input(true);
  readonly isRange = input(false);
  readonly viewMode = input<'days' | 'months' | 'years'>('days');
  readonly periods = input<any[]>([]);
  readonly monthListNum = input<number[]>([]);
  readonly yearList = input<number[]>([]);
  readonly yearRanges = input<Array<{
    start: number;
    end: number;
}>>([]);

  readonly isActivePeriod = input.required<(period: any) => boolean>();
  readonly getMonthName = input.required<(month: number) => string>();
  readonly isActiveMonth = input.required<(month: number) => boolean>();
  readonly isMonthDisabled = input.required<(month: number) => boolean>();
  readonly isActiveYear = input.required<(year: number) => boolean>();
  readonly isYearDisabled = input.required<(year: number) => boolean>();
  readonly isActiveYearRange = input.required<(startYear: number) => boolean>();
  readonly isYearRangeDisabled = input.required<(range: {
    start: number;
    end: number;
  }) => boolean>();

  readonly selectPeriod = output<any>();
  readonly selectMonth = output<number>();
  readonly selectYear = output<number>();
  readonly selectYearRange = output<number>();

  readonly itemSelector = viewChild<ElementRef>('itemSelector');

  ngAfterViewInit(): void {}
}


