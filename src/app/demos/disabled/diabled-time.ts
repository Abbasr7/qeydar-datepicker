import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';
import { DemoCodeViewerComponent } from '../code-viewer.component';

@Component({
  selector: 'disabled-times',
  imports: [FormsModule, QeydarDatePickerModule, DemoCodeViewerComponent],
  template: `
    <div class="disabled-time-demo">
      <div class="time-demo-copy"><span class="demo-item-kicker">WORKING HOURS</span><h3>Keep time inside the schedule</h3><p>Allow 09:00–17:00 and pause the picker during the 12:30–13:30 break.</p></div>
      <div class="time-demo-preview"><qeydar-time-picker [(ngModel)]="selectedDate" [disabledTimesFilter]="disabledTimesFilter" [displayFormat]="'HH:mm:ss'"></qeydar-time-picker><span class="time-rule">09:00 — 17:00 <b>·</b> break 12:30 — 13:30</span></div>
      <demo-code-viewer [htmlCode]="htmlCode" [tsCode]="tsCode" htmlFile="disabled-times.component.html" tsFile="disabled-times.component.ts"></demo-code-viewer>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .disabled-time-demo { display: grid; grid-template-columns: minmax(0, 1fr) minmax(220px, .7fr); align-items: center; gap: 24px; color: #172238; }
    .demo-item-kicker { color: #4d68e9; font-size: 9px; font-weight: 800; letter-spacing: .14em; }
    h3 { margin: 7px 0 5px; font-size: 17px; letter-spacing: -.03em; }
    p { max-width: 430px; margin: 0; color: #6b7588; font-size: 12px; line-height: 1.65; }
    .time-demo-preview { display: grid; justify-items: center; gap: 12px; padding: 18px; border-radius: 13px; background: #f7f8fc; }
    .time-rule { color: #7b879a; font-size: 10px; direction: ltr; }
    .time-rule b { margin: 0 5px; color: #4d68e9; }
    demo-code-viewer { grid-column: 1 / -1; }
    @media (max-width: 680px) { .disabled-time-demo { grid-template-columns: 1fr; } }
  `]
})
export class DisabledTimes {
  selectedDate: Date | string = new Date();

  disabledTimesFilter = (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour < 9 || hour >= 17) return true;
    if (hour === 12 && minute >= 30) return true;
    if (hour === 13 && minute < 30) return true;
    return false;
  };

  htmlCode = `<qeydar-time-picker
  [(ngModel)]="selectedDate"
  [disabledTimesFilter]="disabledTimesFilter"
  [displayFormat]="'HH:mm:ss'"
></qeydar-time-picker>`;

  tsCode = `import { Component } from '@angular/core';

@Component({
  selector: 'app-disabled-times',
  templateUrl: './disabled-times.component.html',
})
export class DisabledTimesComponent {
  selectedDate: Date | string = new Date();

  disabledTimesFilter = (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    // Working hours 09:00 – 17:00, lunch break 12:30 – 13:30
    if (hour < 9 || hour >= 17) return true;
    if (hour === 12 && minute >= 30) return true;
    if (hour === 13 && minute < 30) return true;
    return false;
  };
}`;
}
