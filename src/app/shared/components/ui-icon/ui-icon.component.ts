import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { FieldType, FieldColor } from '@core/models';

const BG: Record<FieldColor, string> = {
  indigo:  'bg-indigo-100',
  violet:  'bg-violet-100',
  emerald: 'bg-emerald-100',
  amber:   'bg-amber-100',
  rose:    'bg-rose-100',
  sky:     'bg-sky-100',
  slate:   'bg-slate-100',
};

@Component({
  selector:    'fc-ui-icon',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './ui-icon.component.html',
})
export class UiIconComponent {
  @Input() type!: FieldType;
  @Input() color: FieldColor = 'slate';
  @Input() size = 32;
  get bg()    { return BG[this.color]; }
  get style() { return `width:${this.size}px;height:${this.size}px`; }
}
