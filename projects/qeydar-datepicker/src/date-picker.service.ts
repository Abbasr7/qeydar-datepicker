import { Injectable, OnDestroy, inject, DestroyRef } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { lang_En, lang_Fa, Lang_Locale } from "./utils/models";

export interface ValidTimeResult {
  isValid: boolean;
  normalizedTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class QeydarDatePickerService {
  private readonly destroyRef = inject(DestroyRef);
  activeInput$ = new BehaviorSubject<string>('');
  locale: Lang_Locale;

  constructor(
    public locale_fa: lang_Fa,
    public locale_en: lang_En
  ) {}

  getActiveInputValue(): string {
    return this.activeInput$.getValue();
  }
}

@Injectable({
  providedIn: 'root'
})
export class DestroyService extends Subject<void> implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    super();
    this.destroyRef.onDestroy(() => {
      this.next();
      this.complete();
    });
  }

  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}