import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';
import { DemoCodeViewerComponent } from './code-viewer.component';
import { HijriDateAdapter } from '../adapters/hijri.adapter';

@Component({
  selector: 'hijri-demo',
  imports: [FormsModule, QeydarDatePickerModule, DemoCodeViewerComponent, JsonPipe],
  template: `
    <div class="hijri-demo" dir="ltr">
      <div class="hijri-intro">
        <span class="demo-kicker">DIRECT ADAPTER</span>
        <h3>Hijri date selection</h3>
        <p>
          Pass <code>HijriDateAdapter</code> directly to the picker for an RTL
          calendar.
        </p>
      </div>
      <div class="hijri-preview" dir="rtl">
        <qeydar-date-picker
          [rtl]="rtl"
          [dateAdapter]="hijriAdapter"
          [(ngModel)]="hijriDate"
          (ngModelChange)="onChangeHijri($event)"
        ></qeydar-date-picker>
        <output aria-live="polite"
          ><span>Selected value</span
          ><strong>{{ hijriDate | json }}</strong></output
        >
      </div>
      <demo-code-viewer
        [htmlCode]="htmlCode"
        [tsCode]="tsCode"
        htmlFile="hijri-example.component.html"
        tsFile="hijri-example.component.ts"
      ></demo-code-viewer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .hijri-demo {
        color: #172238;
      }
      .hijri-intro {
        max-width: 560px;
      }
      .demo-kicker {
        color: #4d68e9;
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.14em;
      }
      h3 {
        margin: 7px 0 5px;
        font-size: 18px;
        letter-spacing: -0.03em;
      }
      p {
        margin: 0;
        color: #6b7588;
        font-size: 12px;
        line-height: 1.65;
      }
      code {
        padding: 2px 5px;
        border: 0;
        border-radius: 4px;
        background: #eef1ff;
        color: #344dc7;
        font-size: 11px;
      }
      .hijri-preview {
        display: grid;
        justify-items: center;
        gap: 16px;
        margin-top: 22px;
        padding: 24px;
        border-radius: 14px;
        background: #f7f8fc;
      }
      output {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: min(100%, 390px);
        gap: 12px;
        padding: 11px 13px;
        border-radius: 9px;
        background: #fff;
        color: #6b7588;
        font-size: 11px;
      }
      output strong {
        color: #172238;
        direction: ltr;
        font-size: 11px;
      }
    `,
  ],
})
export class HijriDemoComponent implements OnInit {
  rtl = true;
  hijriDate: Date = new Date();
  hijriAdapter = new HijriDateAdapter();

  ngOnInit(): void {}

  onChangeHijri(event: any): void {
    console.log('Hijri event:', event);
  }

  htmlCode = `<qeydar-date-picker
  [dateAdapter]="hijriAdapter"
  [rtl]="rtl"
  [(ngModel)]="hijriDate"
  (ngModelChange)="onChangeHijri($event)"
></qeydar-date-picker>`;

  tsCode = `import { Component } from '@angular/core';
import { HijriDateAdapter } from './hijri.adapter';

@Component({
  selector: 'app-hijri-example',
  templateUrl: './hijri-example.component.html',
})
export class HijriExampleComponent {
  rtl = true;
  hijriDate: Date = new Date();
  hijriAdapter = new HijriDateAdapter();

  onChangeHijri(event: any): void {
    console.log('Hijri event:', event);
  }
}`;
}
