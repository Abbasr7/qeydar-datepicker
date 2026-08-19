import { Component, OnInit } from '@angular/core';
import { HijriDateAdapter } from '../adapters/hijri.adapter';

@Component({
  selector: 'hijri-demo',
  template: `
    <div class="hijri-demo" dir="ltr">
      <div class="hijri-intro">
        <span class="demo-kicker">DIRECT ADAPTER</span>
        <h3>Hijri date selection</h3>
        <p>Pass <code>HijriDateAdapter</code> directly to the picker for an RTL calendar.</p>
      </div>
      <div class="hijri-preview" dir="rtl">
        <qeydar-date-picker [rtl]="rtl" [dateAdapter]="hijriAdapter" [(ngModel)]="hijriDate" (ngModelChange)="onChangeHijri($event)"></qeydar-date-picker>
        <output aria-live="polite"><span>Selected value</span><strong>{{ hijriDate | json }}</strong></output>
      </div>
      <div class="child-code-disclosure">
        <button type="button" class="child-code-toggle" (click)="showCode = !showCode" [attr.aria-expanded]="showCode" aria-controls="hijri-demo-code">{{ showCode ? 'Hide' : 'Show' }} example code <span aria-hidden="true">↘</span></button>
        <pre id="hijri-demo-code" class="child-code" [hidden]="!showCode"><code>{{ demoCode }}</code></pre>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .hijri-demo { color: #172238; }
    .hijri-intro { max-width: 560px; }
    .demo-kicker { color: #4d68e9; font-size: 9px; font-weight: 800; letter-spacing: .14em; }
    h3 { margin: 7px 0 5px; font-size: 18px; letter-spacing: -.03em; }
    p { margin: 0; color: #6b7588; font-size: 12px; line-height: 1.65; }
    code { padding: 2px 5px; border: 0; border-radius: 4px; background: #eef1ff; color: #344dc7; font-size: 11px; }
    .hijri-preview { display: grid; justify-items: center; gap: 16px; margin-top: 22px; padding: 24px; border-radius: 14px; background: #f7f8fc; }
    output { display: flex; align-items: center; justify-content: space-between; width: min(100%, 390px); gap: 12px; padding: 11px 13px; border-radius: 9px; background: #fff; color: #6b7588; font-size: 11px; }
    output strong { color: #172238; direction: ltr; font-size: 11px; }
    .child-code-disclosure { margin-top: 16px; }
    .child-code-toggle { padding: 0; border: 0; background: transparent; color: #344dc7; font-size: 11px; font-weight: 800; cursor: pointer; }
    .child-code-toggle span { display: inline-block; margin-left: 5px; font-size: 14px; }
    .child-code { max-height: 260px; margin: 12px 0 0; padding: 14px; overflow: auto; border-radius: 10px; background: #19243b; color: #d8e2ff; direction: ltr; font: 11px/1.65 'Courier New', monospace; white-space: pre; }
  `]
})
export class HijriDemoComponent implements OnInit {
  rtl = true;
  hijriDate: Date = new Date();
  hijriAdapter = new HijriDateAdapter();
  showCode = false;

  ngOnInit(): void {}

  onChangeHijri(event: any): void {
    console.log('Hijri event:', event);
  }

  demoCode = `<qeydar-date-picker
  [dateAdapter]="hijriAdapter"
  [rtl]="true"
  [(ngModel)]="hijriDate"
></qeydar-date-picker>

hijriAdapter = new HijriDateAdapter();`;
}
