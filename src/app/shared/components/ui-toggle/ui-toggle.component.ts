import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector:   'fc-ui-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked"
      (click)="toggle()"
      class="relative inline-flex items-center cursor-pointer focus:outline-none
             focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1 rounded-full"
    >
      <span class="w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0"
            [class.bg-brand-accent]="checked" [class.bg-slate-200]="!checked"></span>
      <span class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
            [class.translate-x-4]="checked"></span>
    </button>
  `,
})
export class UiToggleComponent {
  @Input()  checked  = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  toggle() { this.checkedChange.emit(!this.checked); }
}
