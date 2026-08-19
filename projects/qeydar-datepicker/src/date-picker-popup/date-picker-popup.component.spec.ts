import { Component, QueryList, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DatePickerPopupComponent } from './date-picker-popup.component';
import { CustomTemplate } from '../utils/template.directive';
import { GregorianDateAdapter } from '../date-adapter';
import { QeydarDatePickerService, DestroyService } from '../date-picker.service';
import { CalendarUtilsService } from './services/calendar-utils.service';
import { SelectionStrategyService } from './services/selection-strategy.service';
import { ValidationStrategyService } from './services/validation-strategy.service';

@Component({
  standalone: true,
  imports: [DatePickerPopupComponent, CustomTemplate, FormsModule],
  template: `
    <qeydar-date-picker-popup
      [dateAdapter]="adapter"
      [showSidebar]="false"
      (dateSelected)="selected = $event"
    ></qeydar-date-picker-popup>

    <ng-template qeydarTemplate="day" let-dayNumber="dayNumber">
      <span class="legacy-day">{{ dayNumber }}</span>
    </ng-template>
    <ng-template qeydarTemplate="body" let-context>
      <button class="body-day" (click)="context.actions.selectDay(context.days[0])">Body</button>
    </ng-template>
    <ng-template qeydarTemplate="header" let-context>
      <button class="custom-header" (click)="context.next()">Header</button>
    </ng-template>
    <ng-template qeydarTemplate="footer" let-context>
      <button class="custom-footer" (click)="context.cancel()">Footer</button>
    </ng-template>
  `
})
class PopupHostComponent {
  adapter = new GregorianDateAdapter();
  @ViewChildren(CustomTemplate) templateDirectives!: QueryList<CustomTemplate>;
  selected: Date | null = null;
}

describe('DatePickerPopupComponent slots', () => {
  let fixture: ComponentFixture<PopupHostComponent>;
  let popup: DatePickerPopupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupHostComponent],
      providers: [
        QeydarDatePickerService,
        DestroyService,
        GregorianDateAdapter,
        CalendarUtilsService,
        SelectionStrategyService,
        ValidationStrategyService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupHostComponent);
    fixture.detectChanges();
    popup = fixture.debugElement.children[0].componentInstance;
  });

  it('keeps the default grids when no full-body slot is supplied', () => {
    expect(popup.bodyTemplate).toBeNull();
    expect(popup.headerTemplate).toBeNull();
    expect(popup.footerTemplate).toBeNull();
    expect(fixture.nativeElement.querySelector('qeydar-days-grid')).toBeTruthy();
  });

  it('replaces the body, header, and footer with projected templates', () => {
    const templates = fixture.componentInstance.templateDirectives;
    expect(templates.length).toBe(4);
    popup.bodyTemplate = templates.find(template => template.getType() === 'body')!.template;
    popup.headerTemplate = templates.find(template => template.getType() === 'header')!.template;
    popup.footerTemplate = templates.find(template => template.getType() === 'footer')!.template;
    popup.cdr.markForCheck();
    expect(popup.bodyTemplate).toBeTruthy();
    expect(popup.headerTemplate).toBeTruthy();
    expect(popup.footerTemplate).toBeTruthy();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.body-day')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.custom-header')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.custom-footer')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('qeydar-days-grid')).toBeNull();
    expect(fixture.nativeElement.querySelector('qeydar-months-grid')).toBeNull();
    expect(fixture.nativeElement.querySelector('qeydar-years-grid')).toBeNull();
  });

  it('exposes body actions backed by popup state', () => {
    const context = popup.bodyContext;
    expect(context.days.length).toBe(42);
    expect(context.validation.isDateDisabled(context.days[0])).toBeFalse();
    context.actions.selectDay(context.days[0]);
    fixture.detectChanges();
    expect(fixture.componentInstance.selected?.getHours()).toBe(context.days[0].getHours());
    expect(fixture.componentInstance.selected?.getMinutes()).toBe(context.days[0].getMinutes());
    expect(fixture.componentInstance.selected?.getDate()).toBe(context.days[0].getDate());
  });
});
