import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { FieldColor }       from '@core/models';

const CLS: Record<FieldColor, string> = {
  indigo:  'bg-indigo-100  text-indigo-700',
  violet:  'bg-violet-100  text-violet-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  amber:   'bg-amber-100   text-amber-700',
  rose:    'bg-rose-100    text-rose-700',
  sky:     'bg-sky-100     text-sky-700',
  slate:   'bg-slate-100   text-slate-600',
};

@Component({
  selector:   'fc-ui-badge',
  standalone: true,
  imports:    [CommonModule],
  template:   `<span class="fc-badge" [ngClass]="cls">{{ text }}</span>`,
})
export class UiBadgeComponent {
  @Input() text = '';
  @Input() color: FieldColor = 'slate';
  get cls() { return CLS[this.color]; }
}
