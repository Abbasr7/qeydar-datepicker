import { Component } from '@angular/core';

@Component({
  selector: 'disabled-times',
  template: `
    <div class="disabled-time-demo">
      <div class="time-demo-copy"><span class="demo-item-kicker">WORKING HOURS</span><h3>Keep time inside the schedule</h3><p>Allow 09:00–17:00 and pause the picker during the 12:30–13:30 break.</p></div>
      <div class="time-demo-preview"><qeydar-time-picker [(ngModel)]="selectedDate" [disabledTimesFilter]="disabledTimesFilter" [displayFormat]="'HH:mm:ss'"></qeydar-time-picker><span class="time-rule">09:00 — 17:00 <b>·</b> break 12:30 — 13:30</span></div>
      <div class="child-code-disclosure"><button type="button" class="child-code-toggle" (click)="showCode = !showCode" [attr.aria-expanded]="showCode" aria-controls="disabled-times-code">{{ showCode ? 'Hide' : 'Show' }} example code <span aria-hidden="true">↘</span></button><pre id="disabled-times-code" class="child-code" [hidden]="!showCode"><code>{{ demoCode }}</code></pre></div>
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
    .child-code-disclosure { grid-column: span 2; }
    .child-code-toggle { padding: 0; border: 0; background: transparent; color: #344dc7; font-size: 11px; font-weight: 800; cursor: pointer; }
    .child-code-toggle span { display: inline-block; margin-left: 5px; font-size: 14px; }
    .child-code { max-height: 260px; margin: 12px 0 0; padding: 14px; overflow: auto; border-radius: 10px; background: #19243b; color: #d8e2ff; direction: ltr; font: 11px/1.65 'Courier New', monospace; white-space: pre; }
    @media (max-width: 680px) { .disabled-time-demo { grid-template-columns: 1fr; } .child-code-disclosure { grid-column: span 1; } }
  `]
})
export class DisabledTimes {
  selectedDate: Date | string = new Date();
  showCode = false;

  disabledTimesFilter = (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour < 9 || hour >= 17) return true;
    if (hour === 12 && minute >= 30) return true;
    if (hour === 13 && minute < 30) return true;
    return false;
  };

  demoCode = `<qeydar-time-picker
  [(ngModel)]="selectedDate"
  [disabledTimesFilter]="disabledTimesFilter"
  [displayFormat]="'HH:mm:ss'"
></qeydar-time-picker>

const disabledTimesFilter = (date: Date) => {
  const hour = date.getHours();
  return hour < 9 || hour >= 17;
};`;
}
