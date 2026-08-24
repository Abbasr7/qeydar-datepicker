import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';
import { DemoCodeViewerComponent } from './code-viewer.component';

interface DateRangeValue {
  start: Date;
  end: Date;
}

@Component({
  selector: 'quick-demo',
  imports: [FormsModule, QeydarDatePickerModule, DemoCodeViewerComponent],
  template: `
    <div class="slot-demo quick-demo">
      <div class="slot-demo-head">
        <div>
          <span class="slot-demo-kicker">Toolbar + footer slot</span>
          <h3>Shortcuts for real life</h3>
          <p>
            Give frequent choices a place above the calendar and keep
            confirmation actions close at hand.
          </p>
        </div>
        <span class="slot-demo-tag">01</span>
      </div>

      <div class="quick-preview">
        <qeydar-date-picker
          class="slot-demo-picker"
          cssClass="slot-demo-popup"
          [calendarType]="'gregorian'"
          [format]="'MMM d, yyyy'"
          [valueFormat]="'date'"
          [isRange]="true"
          [showSidebar]="false"
          [(ngModel)]="quickRange"
        >
          <ng-template qeydarTemplate="toolbar" let-context>
            <div class="quick-toolbar">
              <button
                type="button"
                class="quick-choice active"
                (click)="context.selectQuickDate(today)"
              >Today</button>
              <button
                type="button"
                class="quick-choice"
                (click)="context.selectQuickDate(tomorrow)"
              >Tomorrow</button>
              <button
                type="button"
                class="quick-choice"
                (click)="context.selectQuickRange(nextWeek.start, nextWeek.end)"
              >Next week</button>
            </div>
          </ng-template>
          <ng-template qeydarTemplate="footer" let-context>
            <div class="quick-footer">
              <div class="note-line">
                <span class="note-glyph">◆</span
                ><span>Don't forget to do something...</span>
              </div>
              <div class="footer-actions">
                <button
                  type="button"
                  class="secondary-action"
                  (click)="context.cancel()"
                >Cancel</button>
                <button
                  type="button"
                  class="primary-action"
                  (click)="context.confirm()"
                >Enter</button>
              </div>
            </div>
          </ng-template>
        </qeydar-date-picker>
      </div>

      <div class="selection-readout">
        <span>Selected range</span>
        <strong>{{ formatRange(quickRange) }}</strong>
      </div>

      <demo-code-viewer
        [htmlCode]="htmlCode"
        [tsCode]="tsCode"
        [scssCode]="scssCode"
        htmlFile="quick-demo.component.html"
        tsFile="quick-demo.component.ts"
        scssFile="quick-demo.component.scss"
      ></demo-code-viewer>
    </div>
  `,
  styles: [`
    .quick-preview {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      margin-top: 18px;
      padding: 22px 12px 14px;
      border-radius: 12px;
      background: linear-gradient(160deg, #f4f5f9, #fbfbfd);
    }

    .quick-preview qeydar-date-picker {
      max-width: 340px;
    }

    .quick-toolbar {
      display: flex;
      gap: 6px;
      margin: 0 0 12px;
    }

    .quick-choice,
    .secondary-action,
    .primary-action {
      border: 0;
      font: inherit;
      cursor: pointer;
    }

    .quick-choice {
      flex: 1;
      padding: 9px 5px;
      border: 1px solid transparent;
      border-radius: 9px;
      background: #f5f6f9;
      color: #667084;
      font-size: 11px;
      transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
    }

    .quick-choice.active,
    .quick-choice:hover {
      border-color: #cbd6fc;
      background: #f4f6ff;
      color: #3f5fd1;
    }

    .quick-footer {
      padding: 12px 14px 14px;
      border-top: 1px solid #edf0f5;
    }

    .note-line {
      display: flex;
      align-items: center;
      gap: 7px;
      color: #747d8e;
      font-size: 10px;
    }

    .note-glyph {
      color: #626b7a;
      font-size: 12px;
      transform: rotate(45deg);
    }

    .footer-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .secondary-action,
    .primary-action {
      flex: 1;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
    }

    .secondary-action {
      border: 1px solid #e2e5eb;
      background: #fff;
      color: #6b7484;
    }

    .primary-action {
      background: linear-gradient(135deg, #5779f7, #3f61db);
      color: #fff;
      box-shadow: 0 5px 10px rgba(68, 104, 239, 0.22);
    }
  `]
})
export class QuickDemoComponent {
  today = new Date();
  tomorrow = this.addDays(this.today, 1);
  nextWeek: DateRangeValue = {
    start: this.addDays(this.today, 7),
    end: this.addDays(this.today, 13)
  };
  quickRange: DateRangeValue = {
    start: this.today,
    end: this.today
  };

  formatRange(range: DateRangeValue): string {
    if (!range) {
      return 'Choose a range';
    }
    const format = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    return `${format.format(range.start)} – ${format.format(range.end)}`;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  htmlCode = `<!-- toolbar: rendered above the calendar -->
<qeydar-date-picker
  class="slot-demo-picker"
  cssClass="slot-demo-popup"
  [calendarType]="'gregorian'"
  [format]="'MMM d, yyyy'"
  [valueFormat]="'date'"
  [isRange]="true"
  [showSidebar]="false"
  [(ngModel)]="quickRange"
>
  <ng-template qeydarTemplate="toolbar" let-context>
    <div class="quick-toolbar">
      <button type="button" class="quick-choice active" (click)="context.selectQuickDate(today)">Today</button>
      <button type="button" class="quick-choice" (click)="context.selectQuickDate(tomorrow)">Tomorrow</button>
      <button type="button" class="quick-choice" (click)="context.selectQuickRange(nextWeek.start, nextWeek.end)">Next week</button>
    </div>
  </ng-template>

  <!-- footer: rendered below the calendar -->
  <ng-template qeydarTemplate="footer" let-context>
    <div class="quick-footer">
      <div class="note-line"><span class="note-glyph">◆</span><span>Don't forget to do something...</span></div>
      <div class="footer-actions">
        <button type="button" class="secondary-action" (click)="context.cancel()">Cancel</button>
        <button type="button" class="primary-action" (click)="context.confirm()">Enter</button>
      </div>
    </div>
  </ng-template>
</qeydar-date-picker>`;

  tsCode = `import { Component } from '@angular/core';

interface DateRangeValue {
  start: Date;
  end: Date;
}

@Component({
  selector: 'app-quick-demo',
  templateUrl: './quick-demo.component.html',
})
export class QuickDemoComponent {
  today = new Date();
  tomorrow = this.addDays(this.today, 1);
  nextWeek: DateRangeValue = {
    start: this.addDays(this.today, 7),
    end: this.addDays(this.today, 13)
  };
  quickRange: DateRangeValue = { start: this.today, end: this.today };

  formatRange(range: DateRangeValue): string {
    if (!range) return 'Choose a range';
    const format = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    return \`\${format.format(range.start)} – \${format.format(range.end)}\`;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}`;

  scssCode = `// Popup chrome (the popup renders inside the CDK overlay):
// .slot-demo-popup { max-width: 340px; ... } — see global styles in this demo repo.

.quick-preview {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 22px 12px 14px;
  border-radius: 12px;
  background: linear-gradient(160deg, #f4f5f9, #fbfbfd);
}

.quick-toolbar {
  display: flex;
  gap: 6px;
  margin: 0 0 12px;
}

.quick-choice,
.secondary-action,
.primary-action {
  border: 0;
  font: inherit;
  cursor: pointer;
}

.quick-choice {
  flex: 1;
  padding: 9px 5px;
  border: 1px solid transparent;
  border-radius: 9px;
  background: #f5f6f9;
  color: #667084;
  font-size: 11px;
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease;
}

.quick-choice.active,
.quick-choice:hover {
  border-color: #cbd6fc;
  background: #f4f6ff;
  color: #3f5fd1;
}

.quick-footer {
  padding: 12px 14px 14px;
  border-top: 1px solid #edf0f5;
}

.note-line {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #747d8e;
  font-size: 10px;
}

.note-glyph {
  color: #626b7a;
  font-size: 12px;
  transform: rotate(45deg);
}

.footer-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.secondary-action,
.primary-action {
  flex: 1;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.secondary-action {
  border: 1px solid #e2e5eb;
  background: #fff;
  color: #6b7484;
}

.primary-action {
  background: linear-gradient(135deg, #5779f7, #3f61db);
  color: #fff;
  box-shadow: 0 5px 10px rgba(68, 104, 239, 0.22);
}`;
}