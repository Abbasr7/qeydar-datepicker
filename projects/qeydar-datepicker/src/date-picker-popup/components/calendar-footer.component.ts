import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';


@Component({
  selector: 'qeydar-calendar-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  styleUrl: './calendar-footer.component.scss',
  template: `
    @if (footerDescription() || showTimePicker() || showToday()) {
      <div class="date-picker-footer">
        @if (footerDescription()) {
          <div class="footer-description" [innerHtml]="footerDescription()">
          </div>
        }
        <div class="footer-actions">
          @if (showTimePicker()) {
            <button class="footer-button ok" (click)="okClick.emit()">{{ okLabel() }}</button>
          }
          @if (showToday()) {
            <button class="footer-button" (click)="todayClick.emit()">{{ todayLabel() }}</button>
          }
        </div>
      </div>
    }
    `
})
export class CalendarFooterComponent {
  readonly footerDescription = input('');
  readonly showTimePicker = input(false);
  readonly showToday = input(false);
  readonly okLabel = input('OK');
  readonly todayLabel = input('Today');

  readonly todayClick = output<void>();
  readonly okClick = output<void>();
}
