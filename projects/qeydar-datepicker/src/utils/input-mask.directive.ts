import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[qeydar-dateMask]',
  host: {
    '(input)': 'onInput($event)',
    '(keydown)': 'onKeyDown($event)'
  }
})
export class DateMaskDirective {
  el = inject(ElementRef);

  readonly dateFormat = input<string>('yyyy/MM/dd', { alias: "qeydar-dateMask" });
  readonly disableInputMask = input(false);

  delimiters: string[] = [];
  parts: string[] = [];
  lastValue: string = '';

  ngOnInit() {
    this.parseFormat();
  }

  parseFormat() {
    if (this.disableInputMask())
      return;

    this.parts = [];
    this.delimiters = [];
    let currentPart = '';
    
    for (let i = 0; i < this.dateFormat().length; i++) {
      const char = this.dateFormat()[i];
      
      if (this.isFormatChar(char)) {
        currentPart += char;
      } else {
        if (currentPart) {
          this.parts.push(currentPart);
          currentPart = '';
        }
        this.delimiters.push(char);
      }
    }
    
    if (currentPart) {
      this.parts.push(currentPart);
    }
  }

  isFormatChar(char: string): boolean {
    return /[yMdHhmsa]/i.test(char);
  }

  onInput(event: Event) {
    if (this.disableInputMask())
      return;

    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    let value = input.value.replace(/[^0-9APMapm\s:/\-\.]/g, '');
    
    // Allow backspace/delete
    if (value.length < this.lastValue.length) {
      this.lastValue = value;
      return;
    }

    let formattedParts: string[] = [];
    let currentValue = value;
    let shouldAddDelimiter = false;
    let totalLength = 0;
    let newCursorPosition = cursorPosition;

    for (let i = 0; i < this.parts.length; i++) {
      const part = this.extractPart(currentValue, this.parts[i]);
      if (!part && part !== '0') break;

      const expectedLength = this.getPartLength(this.parts[i]);
      let formattedPart = part;

      if (formattedPart.length >= expectedLength) {
        formattedPart = this.validatePart(formattedPart.slice(0, expectedLength), this.parts[i]);
        shouldAddDelimiter = true;
      }

      formattedParts.push(formattedPart);
      totalLength += formattedPart.length;

      if (shouldAddDelimiter && i < this.parts.length - 1) {
        formattedParts.push(this.delimiters[i] || '');
        totalLength += 1;
        shouldAddDelimiter = false;

        if (cursorPosition === totalLength - 1) {
          newCursorPosition = totalLength;
        }
      }

      currentValue = this.removeProcessedPart(currentValue, part);
    }

    const formattedValue = formattedParts.join('');
    input.value = formattedValue;

    // Set cursor position
    newCursorPosition = Math.min(newCursorPosition, totalLength);
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    this.lastValue = formattedValue;
  }

  extractPart(value: string, format: string): string {
    if (!value) return '';

    if (format[0].toLowerCase() === 'a') {
      // Handle AM/PM
      const match = value.match(/^[AaPp][Mm]?/);
      return match ? match[0].toUpperCase() : '';
    }

    // Handle numeric parts
    const match = value.match(/^\d+/);
    return match ? match[0] : '';
  }

  removeProcessedPart(value: string, part: string): string {
    if (!part) return value;
    
    // Remove part and following delimiter if exists
    const remainingValue = value.slice(part.length);
    return remainingValue.replace(/^[:/\s-]/, '');
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.disableInputMask())
      return;

    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    
    // Allow control keys
    if (event.key === 'Backspace' || event.key === 'Delete' || 
        event.key === 'ArrowLeft' || event.key === 'ArrowRight' || 
        event.key === 'Tab' || event.ctrlKey) {
      return;
    }

    const currentPartIndex = this.getCurrentPartIndex(input.value, cursorPosition);
    if (currentPartIndex === -1) return;

    const currentFormat = this.parts[currentPartIndex];
    const isTimeDelimiter = event.key === ':' && cursorPosition > 0 && 
                           (this.parts[currentPartIndex - 1]?.includes('H') || 
                            this.parts[currentPartIndex - 1]?.includes('h'));

    // Allow time delimiter after hours
    if (isTimeDelimiter) {
      if (this.delimiters[currentPartIndex - 1] === ':') {
        const parts = input.value.split(/[:/\s-]/);
        const currentPart = this.validatePart(parts[currentPartIndex - 1], this.parts[currentPartIndex - 1]);
        parts[currentPartIndex - 1] = currentPart;
        
        const newValue = parts.slice(0, currentPartIndex).join(this.delimiters[currentPartIndex - 1]) + ':';
        input.value = newValue + parts.slice(currentPartIndex).join(this.delimiters[currentPartIndex]);
        
        input.setSelectionRange(newValue.length, newValue.length);
        event.preventDefault();
      }
      return;
    }

    // Handle AM/PM input
    if (currentFormat[0].toLowerCase() === 'a') {
      if (!/^[AaPpMm]$/.test(event.key)) {
        event.preventDefault();
      }
      return;
    }

    // Allow only digits for other parts
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  validatePart(value: string, format: string): string {
    if (value === '') return '';
    
    const type = format[0].toLowerCase();
    if (type === 'a') {
      const upperValue = value.toUpperCase();
      if (value.length === 1) {
        return upperValue === 'A' || upperValue === 'P' ? upperValue : '';
      }
      return ['AM', 'PM'].includes(upperValue) ? upperValue : upperValue[0];
    }

    const numValue = parseInt(value, 10);
    switch (type) {
      case 'h': // 12-hour format
        if (format[0] == 'H')
          return Math.min(Math.max(numValue, 0), 23).toString().padStart(2, '0');

        return Math.min(Math.max(numValue, 1), 12).toString().padStart(2, '0');
      
      case 'm': // month or minute
        if (format === 'MM') {
          return Math.min(Math.max(numValue, 1), 12).toString().padStart(2, '0');
        }
        return Math.min(Math.max(numValue, 0), 59).toString().padStart(2, '0');
      
      case 's': // seconds
        return Math.min(Math.max(numValue, 0), 59).toString().padStart(2, '0');
      
      case 'd': // day
        return Math.min(Math.max(numValue, 1), 31).toString().padStart(2, '0');
      
      case 'y': // year
        if (format.length === 2) return value.padStart(2, '0');
        return value.padStart(4, '0');
      
      default:
        return value;
    }
  }

  getPartLength(format: string): number {
    const type = format[0].toLowerCase();
    switch (type) {
      case 'y': return format.length === 2 ? 2 : 4;
      case 'a': return format.length === 1 ? 1 : 2;
      default: return 2;
    }
  }

  getCurrentPartIndex(value: string, cursorPosition: number): number {
    const parts = value.split(/[:/\s-]/);
    let currentIndex = 0;
    let totalLength = 0;

    for (let i = 0; i < parts.length; i++) {
      totalLength += parts[i].length;
      if (cursorPosition <= totalLength + i) {
        return i;
      }
      totalLength += 1; // Add delimiter length
    }

    return parts.length - 1;
  }
}