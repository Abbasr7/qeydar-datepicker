import { NgModule } from '@angular/core';
import { DatePickerComponent } from './date-picker.component';
import { DatePickerPopupComponent } from './date-picker-popup/date-picker-popup.component';
import { DateMaskDirective } from './utils/input-mask.directive';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NzConnectedOverlayDirective } from './public-api';
import { TimePickerComponent } from './time-picker/time-picker.component';

@NgModule({
  imports: [
    DatePickerComponent,
    DatePickerPopupComponent,
    DateMaskDirective,
    NzConnectedOverlayDirective,
    TimePickerComponent
  ],
  exports: [
    DatePickerComponent,
    TimePickerComponent,
    DatePickerPopupComponent,
    DateMaskDirective,
    NzConnectedOverlayDirective,
  ],
  providers: [provideAnimations()],
})
export class QeydarDatePickerModule { }
