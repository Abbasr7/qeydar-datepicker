import { Component } from '@angular/core';

@Component({
  selector: 'hero-demo',
  template: `
    <div class="slot-demo hero-demo">
      <div class="slot-demo-head">
        <div>
          <span class="slot-demo-kicker">Header + day cell + footer</span>
          <h3>A header with a point of view</h3>
          <p>
            Replace the compact chrome with a strong date summary while the
            calendar body stays familiar.
          </p>
        </div>
        <span class="slot-demo-tag">02</span>
      </div>

      <div class="hero-preview">
        <qeydar-date-picker
          class="slot-demo-picker"
          cssClass="slot-demo-popup"
          [calendarType]="'gregorian'"
          [format]="'EEE, MMM d'"
          [valueFormat]="'date'"
          [showSidebar]="false"
          [(ngModel)]="heroDate"
        >
          <ng-template qeydarTemplate="header" let-context>
            <div class="hero-header">
              <span class="hero-kicker">SELECT DATE</span>
              <div class="hero-date-row">
                <strong>{{ formatHeroDate(context.currentDate) }}</strong>
                <button
                  type="button"
                  class="edit-date"
                  aria-label="Show month selector"
                  (click)="context.showMonths()"
                >↗</button>
              </div>
            </div>
          </ng-template>
          <ng-template
            qeydarTemplate="day"
            let-dayNumber="dayNumber"
            let-isSelected="isSelected"
            let-isToday="isToday"
            let-isCurrentMonth="isCurrentMonth"
          >
            <span
              class="hero-day"
              [class.selected-day]="isSelected"
              [class.today-day]="isToday"
              [class.muted-day]="!isCurrentMonth"
            >{{ dayNumber }}</span>
          </ng-template>
          <ng-template qeydarTemplate="footer" let-context>
            <div class="hero-footer">
              <button
                type="button"
                class="hero-footer-action"
                (click)="context.cancel()"
              >Cancel</button>
              <button
                type="button"
                class="hero-footer-action confirm"
                (click)="context.confirm()"
              >OK</button>
            </div>
          </ng-template>
        </qeydar-date-picker>
      </div>

      <div class="selection-readout">
        <span>Selected date</span>
        <strong>{{ formatHeroDate(heroDate) }}</strong>
      </div>

      <demo-code-viewer
        [htmlCode]="htmlCode"
        [tsCode]="tsCode"
        [scssCode]="scssCode"
        htmlFile="hero-demo.component.html"
        tsFile="hero-demo.component.ts"
        scssFile="hero-demo.component.scss"
      ></demo-code-viewer>
    </div>
  `,
  styles: [`
    .hero-preview {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      margin-top: 18px;
      padding: 26px 12px 14px;
      border-radius: 12px;
      background: linear-gradient(135deg, #d8e8f8, #edf5fc);
    }

    .hero-preview qeydar-date-picker {
      max-width: 340px;
    }

    .hero-header {
      margin: -12px -12px 12px;
      padding: 20px 18px 17px;
      background: linear-gradient(145deg, #9bb8d4, #a9c6e0);
      color: #fff;
    }

    .hero-kicker {
      display: block;
      color: rgba(255, 255, 255, 0.8);
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .hero-date-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-top: 25px;
    }

    .hero-date-row strong {
      font-size: 24px;
      letter-spacing: -0.05em;
    }

    .edit-date {
      width: 25px;
      height: 25px;
      border: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      color: #fff;
      font-size: 15px;
      cursor: pointer;
      transform: rotate(-45deg);
    }

    .hero-day {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      color: #263448;
      font-size: 11px;
    }

    .hero-day.selected-day {
      background: #8faec9;
      color: #fff;
    }

    .hero-day.today-day {
      border: 1px solid #8faec9;
    }

    .hero-day.muted-day {
      color: #a9b2bf;
    }

    .hero-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 0 4px 3px;
    }

    .hero-footer-action {
      padding: 6px 9px;
      border: 0;
      background: transparent;
      color: #9aa4b3;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
    }

    .hero-footer-action.confirm {
      color: #7592ac;
    }
  `]
})
export class HeroDemoComponent {
  today = new Date();
  heroDate = this.today;

  formatHeroDate(date: Date | null): string {
    if (!date) {
      return 'Choose a date';
    }
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  htmlCode = `<!-- header: a strong date summary replaces the built-in header -->
<qeydar-date-picker
  class="slot-demo-picker"
  cssClass="slot-demo-popup"
  [calendarType]="'gregorian'"
  [format]="'EEE, MMM d'"
  [valueFormat]="'date'"
  [showSidebar]="false"
  [(ngModel)]="heroDate"
>
  <ng-template qeydarTemplate="header" let-context>
    <div class="hero-header">
      <span class="hero-kicker">SELECT DATE</span>
      <div class="hero-date-row">
        <strong>{{ formatHeroDate(context.currentDate) }}</strong>
        <button type="button" class="edit-date" aria-label="Show month selector" (click)="context.showMonths()">↗</button>
      </div>
    </div>
  </ng-template>

  <!-- day: the body keeps the built-in calendar, only the cells are restyled -->
  <ng-template qeydarTemplate="day" let-dayNumber="dayNumber" let-isSelected="isSelected" let-isToday="isToday" let-isCurrentMonth="isCurrentMonth">
    <span
      class="hero-day"
      [class.selected-day]="isSelected"
      [class.today-day]="isToday"
      [class.muted-day]="!isCurrentMonth"
    >{{ dayNumber }}</span>
  </ng-template>

  <ng-template qeydarTemplate="footer" let-context>
    <div class="hero-footer">
      <button type="button" class="hero-footer-action" (click)="context.cancel()">Cancel</button>
      <button type="button" class="hero-footer-action confirm" (click)="context.confirm()">OK</button>
    </div>
  </ng-template>
</qeydar-date-picker>`;

  tsCode = `import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-demo',
  templateUrl: './hero-demo.component.html',
})
export class HeroDemoComponent {
  heroDate: Date = new Date();

  formatHeroDate(date: Date | null): string {
    if (!date) return 'Choose a date';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
}`;

  scssCode = `// Popup chrome (the popup renders inside the CDK overlay):
// .slot-demo-popup { max-width: 340px; ... } — see global styles in this demo repo.

.hero-preview {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 26px 12px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #d8e8f8, #edf5fc);
}

.hero-header {
  margin: -12px -12px 12px;
  padding: 20px 18px 17px;
  background: linear-gradient(145deg, #9bb8d4, #a9c6e0);
  color: #fff;
}

.hero-kicker {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 25px;
}

.hero-date-row strong {
  font-size: 24px;
  letter-spacing: -0.05em;
}

.edit-date {
  width: 25px;
  height: 25px;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  transform: rotate(-45deg);
}

.hero-day {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #263448;
  font-size: 11px;
}

.hero-day.selected-day {
  background: #8faec9;
  color: #fff;
}

.hero-day.today-day {
  border: 1px solid #8faec9;
}

.hero-day.muted-day {
  color: #a9b2bf;
}

.hero-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 4px 3px;
}

.hero-footer-action {
  padding: 6px 9px;
  border: 0;
  background: transparent;
  color: #9aa4b3;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}

.hero-footer-action.confirm {
  color: #7592ac;
}`;
}