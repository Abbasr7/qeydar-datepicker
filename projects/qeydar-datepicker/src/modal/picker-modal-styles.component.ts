import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Registers the library's overlay styles globally when a picker is created.
 * CDK overlays are attached outside the component tree, so emulated
 * encapsulation would prevent these rules from matching them.
 */
@Component({
  selector: 'qeydar-picker-modal-styles',
  template: '',
  styleUrl: './picker-modal.style.css',
  encapsulation: ViewEncapsulation.None,
})
export class PickerModalStylesComponent {}
