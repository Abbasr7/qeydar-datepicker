import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'qeydar-calendar-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf],
  styleUrls: ['./calendar-footer.component.scss'],
  template: `
    <div class="date-picker-footer" *ngIf="footerDescription || showTimePicker || showToday">
      <div class="footer-description" *ngIf="footerDescription" [innerHtml]="footerDescription">
      </div>
      <div class="footer-actions">
        <button *ngIf="showTimePicker" class="footer-button ok" (click)="okClick.emit()">{{ okLabel }}</button>
        <button *ngIf="showToday" class="footer-button" (click)="todayClick.emit()">{{ todayLabel }}</button>
      </div>
    </div>
  `
})
export class CalendarFooterComponent {
  @Input() footerDescription = '';
  @Input() showTimePicker = false;
  @Input() showToday = false;
  @Input() okLabel = 'OK';
  @Input() todayLabel = 'Today';

  @Output() todayClick = new EventEmitter<void>();
  @Output() okClick = new EventEmitter<void>();
}


