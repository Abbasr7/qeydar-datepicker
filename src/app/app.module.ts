import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisabledDates } from './demos/disabled/diabled-date';
import { DisabledTimes } from './demos/disabled/diabled-time';
import { CustomRender } from './demos/custom-render';
import { MaterialRender } from './demos/material-render';
import { SlotDemosComponent } from './demos/slot-demos.component';
import { HijriDemoComponent } from './demos/hijri-demo.component';
import { DemoCodeViewerComponent } from './demos/code-viewer.component';
import { BidiModule } from "@angular/cdk/bidi";
// import { QeydarDatePickerModule } from '@qeydar/datepicker';
import { AdvancedDatePicker, CustomDatePickerExample, MinimalDatePicker } from 'projects/qeydar-datepicker/src/components/examples/custom-date-picker.example';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';

@NgModule({
  declarations: [
    AppComponent,
    DisabledDates,
    DisabledTimes,
    CustomRender,
    MaterialRender,
    SlotDemosComponent,
    HijriDemoComponent,
    DemoCodeViewerComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    QeydarDatePickerModule,
    BidiModule,
    CustomDatePickerExample,
    MinimalDatePicker,
    AdvancedDatePicker,
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
