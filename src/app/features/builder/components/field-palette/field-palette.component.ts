import { Component, inject } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { PALETTE_ITEMS }      from '@core/constants';
import { FormBuilderService } from '@core/services';
import { FieldType, PaletteItem, FieldCategory } from '@core/models';
import { UiIconComponent }    from '@shared/components/ui-icon';

interface Group { key: FieldCategory; label: string; items: PaletteItem[]; }

@Component({
  selector:    'fc-field-palette',
  standalone:  true,
  imports:     [CommonModule, UiIconComponent],
  templateUrl: './field-palette.component.html',
})
export class FieldPaletteComponent {
  private builder = inject(FormBuilderService);

  readonly groups: Group[] = [
    { key: 'input',    label: 'Input Fields', items: PALETTE_ITEMS.filter(i => i.category === 'input') },
    { key: 'choice',   label: 'Choice',       items: PALETTE_ITEMS.filter(i => i.category === 'choice') },
    { key: 'datetime', label: 'Date & Time',  items: PALETTE_ITEMS.filter(i => i.category === 'datetime') },
    { key: 'layout',   label: 'Layout',       items: PALETTE_ITEMS.filter(i => i.category === 'layout') },
  ];

  onDragStart(e: DragEvent, type: FieldType): void {
    e.dataTransfer!.setData('fieldType', type);
    e.dataTransfer!.effectAllowed = 'copy';
  }

  onClick(type: FieldType): void {
    this.builder.addField(type);
  }
}
