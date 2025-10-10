import { Component, OnInit } from '@angular/core';
import { HijriDateAdapter } from '../adapters/hijri.adapter';

@Component({
  selector: 'hijri-demo',
  template: `
    <div dir="ltr">
      <h2>Hijri Calendar Example</h2>
      <p>
        Example of using <code>HijriDateAdapter</code> directly with Qeydar
        DatePicker.
      </p>
    </div>
    <div dir="rtl">
      <qeydar-date-picker
        [rtl]="rtl"
        [dateAdapter]="hijriAdapter"
        [(ngModel)]="hijriDate"
        (ngModelChange)="onChangeHijri($event)"
      >
      </qeydar-date-picker>
      <br />
      <code>Result: {{ hijriDate | json }}</code>
    </div>
    <button class="toggle-btn" (click)="toggleCode(code)">show code</button>
    <div id="code" class="code" #code>
      <code>
        {{ demoCode }}
      </code>
    </div>
  `,
})
export class HijriDemoComponent implements OnInit {
  rtl = true;
  hijriDate: Date = new Date();
  hijriAdapter = new HijriDateAdapter();
  demoCode: string;

  ngOnInit(): void {
      this.updateHijriCode();
  }

  onChangeHijri(event: any) {
    console.log('Hijri event:', event);
  }

  toggleCode(elm: HTMLDivElement) {
    let display = elm.style.display;
    if (display != 'block') {
      elm.style.display = 'block';
    } else {
      elm.style.display = 'none';
    }
  }

  // مثال کد برای تقویم هجری با اداپتور مستقیم
  updateHijriCode() {
    this.demoCode = `
      @Component({
        selector: 'app-root',
        template: '
          <qeydar-date-picker
            [dateAdapter]="hijriAdapter"
            [(ngModel)]="hijriDate"
            (ngModelChange)="onChangeHijri($event)"
          ></qeydar-date-picker>
          <code>Result:  {{ hijriDate | json }}</code>
        ',
        styleUrls: ['./app.component.scss'],
      })
      export class AppComponent {
        hijriDate: Date | string = new Date();
        hijriAdapter = new HijriDateAdapter();

        onChangeHijri(event: Date | string) {
          console.log('Hijri event:', event);
        }
      }
    `;
  }
}
