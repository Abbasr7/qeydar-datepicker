import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QeydarDatePickerModule } from 'projects/qeydar-datepicker/src/qeydar-datepicker.module';
import { DisabledDates } from './demos/disabled/diabled-date';
import { DisabledTimes } from './demos/disabled/diabled-time';
import { CustomRender } from './demos/custom-render';
import { HijriDemoComponent } from './demos/hijri-demo.component';
import { BidiModule } from "@angular/cdk/bidi";

@NgModule({
  declarations: [
    AppComponent,
    DisabledDates,
    DisabledTimes,
    CustomRender,
    HijriDemoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    QeydarDatePickerModule,
    BidiModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
