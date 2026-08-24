import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';
import { DemoCodeViewerComponent } from './code-viewer.component';
import { GregorianDateAdapter, JalaliDateAdapter } from "projects/qeydar-datepicker/src/date-adapter";

/**
 * Material Design style date picker built purely with the custom template feature.
 *
 * The reference image shows a Material date picker with:
 *  - A colored header strip ("Thu, Jun 9")
 *  - A weekday row (S M T W T F S)
 *  - A grid of day cells where the selected day is a filled circle
 *
 * The custom template feature lets us fully restyle the day / month / year
 * cells. The header strip itself is rendered by the library's
 * <qeydar-calendar-header> component, which is NOT template-customizable yet —
 * that is one of the shortcomings we will document.
 */
@Component({
    selector: 'material-render',
    imports: [FormsModule, QeydarDatePickerModule, DemoCodeViewerComponent],
    template: `
        <div class="material-demo">
            <qeydar-date-picker
                [(ngModel)]="selectedDate"
                [calendarType]="'gregorian'"
                [showSidebar]="false"
                [format]="'EEE, MMM d'"
                cssClass="material-picker"
            >
                <!-- Day cells: Material style circular cells -->
                <ng-template
                    qeydarTemplate="day"
                    let-date
                    let-dayNumber="dayNumber"
                    let-isToday="isToday"
                    let-isSelected="isSelected"
                    let-isCurrentMonth="isCurrentMonth"
                >
                    <span
                        class="mat-day"
                        [class.mat-day--selected]="isSelected"
                        [class.mat-day--today]="isToday"
                        [class.mat-day--muted]="!isCurrentMonth"
                    >
                        {{ dayNumber }}
                    </span>
                </ng-template>

                <!-- Month cells: Material style -->
                <ng-template
                    qeydarTemplate="month"
                    let-month
                    let-name="name"
                    let-isSelected="isSelected"
                >
                    <span class="mat-month" [class.mat-month--selected]="isSelected">
                        {{ name }}
                    </span>
                </ng-template>

                <!-- Year cells: Material style -->
                <ng-template
                    qeydarTemplate="year"
                    let-year
                    let-isSelected="isSelected"
                >
                    <span class="mat-year" [class.mat-year--selected]="isSelected">
                        {{ year }}
                    </span>
                </ng-template>
            </qeydar-date-picker>
        </div>
        <demo-code-viewer
            [htmlCode]="htmlCode"
            [tsCode]="tsCode"
            [scssCode]="scssCode"
            htmlFile="material-render.component.html"
            tsFile="material-render.component.ts"
            scssFile="material-render.component.scss"
        ></demo-code-viewer>
    `,
    styles: [`
        .material-demo {
            display: inline-block;
        }

        /* ---- Day cells ---- */
        .mat-day {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            font-size: 13px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.87);
            transition: background-color 150ms ease, color 150ms ease;
        }
        .mat-day--muted {
            color: rgba(0, 0, 0, 0.38);
        }
        .mat-day--today {
            border: 1px solid #3f51b5;
            color: #3f51b5;
        }
        .mat-day--selected {
            background-color: #3f51b5;
            color: #fff;
        }
        .mat-day--selected.mat-day--today {
            border-color: #3f51b5;
        }

        /* ---- Month cells ---- */
        .mat-month {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 36px;
            border-radius: 18px;
            font-size: 13px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.87);
        }
        .mat-month--selected {
            background-color: #3f51b5;
            color: #fff;
        }

        /* ---- Year cells ---- */
        .mat-year {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 36px;
            border-radius: 18px;
            font-size: 13px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.87);
        }
        .mat-year--selected {
            background-color: #3f51b5;
            color: #fff;
        }
    `]
})
export class MaterialRender {
    selectedDate: Date | string = new Date();

    constructor(
        private jalali: JalaliDateAdapter,
        private gregorian: GregorianDateAdapter
    ) {}

    htmlCode = `<qeydar-date-picker
  [(ngModel)]="selectedDate"
  [calendarType]="'gregorian'"
  [showSidebar]="false"
  [format]="'EEE, MMM d'"
  cssClass="material-picker"
>
  <ng-template
    qeydarTemplate="day"
    let-date
    let-dayNumber="dayNumber"
    let-isToday="isToday"
    let-isSelected="isSelected"
    let-isCurrentMonth="isCurrentMonth"
  >
    <span
      class="mat-day"
      [class.mat-day--selected]="isSelected"
      [class.mat-day--today]="isToday"
      [class.mat-day--muted]="!isCurrentMonth"
    >{{ dayNumber }}</span>
  </ng-template>

  <ng-template qeydarTemplate="month" let-month let-name="name" let-isSelected="isSelected">
    <span class="mat-month" [class.mat-month--selected]="isSelected">{{ name }}</span>
  </ng-template>

  <ng-template qeydarTemplate="year" let-year let-isSelected="isSelected">
    <span class="mat-year" [class.mat-year--selected]="isSelected">{{ year }}</span>
  </ng-template>
</qeydar-date-picker>`;

    tsCode = `import { Component } from '@angular/core';

@Component({
  selector: 'app-material-render',
  templateUrl: './material-render.component.html',
})
export class MaterialRenderComponent {
  selectedDate: Date | string = new Date();
}`;

    scssCode = `// Add these styles to your global stylesheet so they reach the popup content
.mat-day {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  transition: background-color 150ms ease, color 150ms ease;
}

.mat-day--muted {
  color: rgba(0, 0, 0, 0.38);
}

.mat-day--today {
  border: 1px solid #3f51b5;
  color: #3f51b5;
}

.mat-day--selected {
  background-color: #3f51b5;
  color: #fff;
}

.mat-day--selected.mat-day--today {
  border-color: #3f51b5;
}

.mat-month,
.mat-year {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 36px;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}

.mat-month--selected,
.mat-year--selected {
  background-color: #3f51b5;
  color: #fff;
}`;
}
