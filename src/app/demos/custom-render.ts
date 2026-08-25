import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';
import { DemoCodeViewerComponent } from './code-viewer.component';
import {
  GregorianDateAdapter,
  JalaliDateAdapter,
} from 'projects/qeydar-datepicker/src/date-adapter';

@Component({
  selector: 'custom-render',
  imports: [FormsModule, QeydarDatePickerModule, DemoCodeViewerComponent],
  template: `
    <div class="custom-render-demo">
      <div class="custom-demo-grid">
        <article class="custom-demo-item">
          <div class="custom-demo-title">
            <span>01</span>
            <h3>Marked days</h3>
          </div>
          <p>Highlight meeting days and the current selection.</p>
          <div class="custom-demo-preview">
            <span class="preview-label">Gregorian</span>
            <qeydar-date-picker [(ngModel)]="selectedDate">
              <ng-template
                qeydarTemplate="day"
                let-date
                let-dayNumber="dayNumber"
                let-isToday="isToday"
                let-isSelected="isSelected"
              >
                <span
                  [class.meeting]="isMeeting(date)"
                  [class.today-marker]="isToday"
                  [class.selected-marker]="isSelected"
                  >{{ dayNumber }}</span
                >
              </ng-template>
            </qeydar-date-picker>
          </div>
          <div class="custom-demo-preview" dir="rtl">
            <span class="preview-label">Jalali</span>
            <qeydar-date-picker
              [rtl]="true"
              [calendarType]="'jalali'"
              [(ngModel)]="selectedDate"
            >
              <ng-template
                qeydarTemplate="day"
                let-date
                let-dayNumber="dayNumber"
                let-isToday="isToday"
                let-isSelected="isSelected"
              >
                <span
                  [class.meeting]="isMeeting(date)"
                  [class.today-marker]="isToday"
                  [class.selected-marker]="isSelected"
                  >{{ dayNumber }}</span
                >
              </ng-template>
            </qeydar-date-picker>
          </div>
        </article>

        <article class="custom-demo-item">
          <div class="custom-demo-title">
            <span>02</span>
            <h3>Custom month cells</h3>
          </div>
          <p>Use the month context to add your own active state.</p>
          <div class="custom-demo-preview">
            <qeydar-date-picker [(ngModel)]="selectedDate" [mode]="'month'">
              <ng-template
                qeydarTemplate="month"
                let-name="name"
                let-isSelected="isSelected"
              >
                <div
                  class="month-cell"
                  [class.month-cell--selected]="isSelected"
                >
                  {{ name }} @if(isSelected) {<small>active</small>}
                </div>
              </ng-template>
            </qeydar-date-picker>
          </div>
        </article>

        <article class="custom-demo-item">
          <div class="custom-demo-title">
            <span>03</span>
            <h3>Custom year cells</h3>
          </div>
          <p>Style years with a rule that reflects your product.</p>
          <div class="custom-demo-preview">
            <qeydar-date-picker [(ngModel)]="selectedDate" [mode]="'year'">
              <ng-template
                qeydarTemplate="year"
                let-year
                let-isSelected="isSelected"
              >
                <div
                  class="year-cell"
                  [class.year-cell--marked]="year % 2 === 0"
                  [class.year-cell--selected]="isSelected"
                >
                  {{ year }}
                </div>
              </ng-template>
            </qeydar-date-picker>
          </div>
        </article>
      </div>

      <demo-code-viewer
        [htmlCode]="htmlCode"
        [tsCode]="tsCode"
        [scssCode]="scssCode"
        htmlFile="custom-render.component.html"
        tsFile="custom-render.component.ts"
        scssFile="custom-render.component.scss"
      ></demo-code-viewer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .custom-render-demo {
        color: #172238;
      }
      .custom-demo-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 14px;
      }
      .custom-demo-item {
        min-width: 0;
        padding: 15px;
        border: 1px solid #e3e8f1;
        border-radius: 14px;
        background: #fff;
      }
      .custom-demo-title {
        display: flex;
        align-items: center;
        gap: 9px;
      }
      .custom-demo-title > span {
        color: #4d68e9;
        font-size: 10px;
        font-weight: 800;
      }
      h3 {
        margin: 0;
        font-size: 13px;
        letter-spacing: -0.02em;
      }
      p {
        min-height: 36px;
        margin: 7px 0 14px;
        color: #6b7588;
        font-size: 11px;
        line-height: 1.55;
      }
      .custom-demo-preview {
        display: grid;
        justify-items: center;
        gap: 7px;
        padding: 12px 8px;
        border-radius: 10px;
        background: #f7f8fc;
      }
      .custom-demo-preview + .custom-demo-preview {
        margin-top: 10px;
      }
      .preview-label {
        align-self: flex-start;
        color: #8490a5;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .meeting {
        position: relative;
        color: #4468ef;
      }
      .meeting::after {
        position: absolute;
        right: 50%;
        bottom: -3px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #ef6e9b;
        content: '';
        transform: translateX(50%);
      }
      .today-marker {
        text-decoration: underline;
        text-decoration-color: #ef6e9b;
        text-underline-offset: 3px;
      }
      .selected-marker {
        font-weight: 800;
      }
      .month-cell,
      .year-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 30px;
        width: 100%;
        border-radius: 8px;
        font-size: 11px;
      }
      .month-cell small {
        margin-left: 4px;
        color: #4d68e9;
        font-size: 8px;
      }
      .month-cell--selected,
      .year-cell--selected {
        background: #4d68e9;
        color: #fff;
      }
      .year-cell--marked:not(.year-cell--selected) {
        border-bottom: 1px dashed #ef6e9b;
      }
      @media (max-width: 800px) {
        .custom-demo-grid {
          grid-template-columns: 1fr;
        }
        p {
          min-height: 0;
        }
      }
    `,
  ],
})
export class CustomRender {
  selectedDate: Date | string = new Date();

  constructor(
    private jalali: JalaliDateAdapter,
    private gregorian: GregorianDateAdapter,
  ) {}

  isMeeting(date: Date): boolean {
    const day = this.jalali.getDate(date);
    return day === 14 || day === 16 || day === 18;
  }

  htmlCode = `<qeydar-date-picker [(ngModel)]="selectedDate">
  <ng-template
    qeydarTemplate="day"
    let-date
    let-dayNumber="dayNumber"
    let-isToday="isToday"
    let-isSelected="isSelected"
  >
    <span
      [class.meeting]="isMeeting(date)"
      [class.today-marker]="isToday"
      [class.selected-marker]="isSelected"
    >{{ dayNumber }}</span>
  </ng-template>
</qeydar-date-picker>

<qeydar-date-picker [rtl]="true" [calendarType]="'jalali'" [(ngModel)]="selectedDate">
  <ng-template
    qeydarTemplate="day"
    let-date
    let-dayNumber="dayNumber"
    let-isToday="isToday"
    let-isSelected="isSelected"
  >
    <span
      [class.meeting]="isMeeting(date)"
      [class.today-marker]="isToday"
      [class.selected-marker]="isSelected"
    >{{ dayNumber }}</span>
  </ng-template>
</qeydar-date-picker>

<qeydar-date-picker [(ngModel)]="selectedDate" [mode]="'month'">
  <ng-template qeydarTemplate="month" let-name="name" let-isSelected="isSelected">
    <div class="month-cell" [class.month-cell--selected]="isSelected">
      {{ name }} @if (isSelected) {<small>active</small>}
    </div>
  </ng-template>
</qeydar-date-picker>

<qeydar-date-picker [(ngModel)]="selectedDate" [mode]="'year'">
  <ng-template qeydarTemplate="year" let-year let-isSelected="isSelected">
    <div
      class="year-cell"
      [class.year-cell--marked]="year % 2 === 0"
      [class.year-cell--selected]="isSelected"
    >{{ year }}</div>
  </ng-template>
</qeydar-date-picker>`;

  tsCode = `import { Component } from '@angular/core';
import { GregorianDateAdapter, JalaliDateAdapter } from '@qeydar/datepicker';

@Component({
  selector: 'app-custom-render',
  templateUrl: './custom-render.component.html',
})
export class CustomRenderComponent {
  selectedDate: Date | string = new Date();

  constructor(
    private jalali: JalaliDateAdapter,
    private gregorian: GregorianDateAdapter
  ) {}

  isMeeting(date: Date): boolean {
    const day = this.jalali.getDate(date);
    return day === 14 || day === 16 || day === 18;
  }
}`;

  scssCode = `.meeting {
  position: relative;
  color: #4468ef;
}

.meeting::after {
  position: absolute;
  right: 50%;
  bottom: -3px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #ef6e9b;
  content: '';
  transform: translateX(50%);
}

.today-marker {
  text-decoration: underline;
  text-decoration-color: #ef6e9b;
  text-underline-offset: 3px;
}

.selected-marker {
  font-weight: 800;
}

.month-cell,
.year-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  width: 100%;
  border-radius: 8px;
  font-size: 11px;
}

.month-cell small {
  margin-left: 4px;
  color: #4d68e9;
  font-size: 8px;
}

.month-cell--selected,
.year-cell--selected {
  background: #4d68e9;
  color: #fff;
}

.year-cell--marked:not(.year-cell--selected) {
  border-bottom: 1px dashed #ef6e9b;
}`;
}
