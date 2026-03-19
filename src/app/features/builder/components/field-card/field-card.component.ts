import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormField, FieldType } from '@core/models';
import { FormBuilderService } from '@core/services';
import { UiIconComponent }    from '@shared/components/ui-icon';
import { UiBadgeComponent }   from '@shared/components/ui-badge';

@Component({
  selector:    'fc-field-card',
  standalone:  true,
  imports:     [CommonModule, UiBadgeComponent],
  templateUrl: './field-card.component.html',
  host:        { '[attr.draggable]': '"true"', class: 'block' },
})
export class FieldCardComponent {
  @Input() field!:    FormField;
  @Input() index!:    number;
  @Input() total!:    number;
  @Input() selected = false;

  @Output() selected$    = new EventEmitter<string>();
  @Output() remove$      = new EventEmitter<string>();
  @Output() duplicate$   = new EventEmitter<string>();
  @Output() moveUp$      = new EventEmitter<number>();
  @Output() moveDown$    = new EventEmitter<number>();
  @Output() dragStart$   = new EventEmitter<{ event: DragEvent; index: number }>();
  @Output() dragOver$    = new EventEmitter<{ event: DragEvent; index: number }>();
  @Output() drop$        = new EventEmitter<{ event: DragEvent; index: number }>();

  private builder = inject(FormBuilderService);

  get color()     { return (this.builder as any).FIELD_COLOR_MAP?.[this.field.type] ?? 'gray'; }
  get isFirst()   { return this.index === 0; }
  get isLast()    { return this.index === this.total - 1; }
  get optionPreview(): string[] { return ((this.field as any).options ?? []).slice(0, 3); }
  get extraCount(): number { return Math.max(0, ((this.field as any).options?.length ?? 0) - 3); }

  onCardClick(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('button')) this.selected$.emit(this.field.id);
  }
  onDragStart(e: DragEvent) {
    e.dataTransfer!.setData('dragIndex', String(this.index));
    e.dataTransfer!.effectAllowed = 'move';
    this.dragStart$.emit({ event: e, index: this.index });
  }
  onDragOver(e: DragEvent) { e.preventDefault(); e.stopPropagation(); this.dragOver$.emit({ event: e, index: this.index }); }
  onDrop(e: DragEvent)     { e.stopPropagation(); this.drop$.emit({ event: e, index: this.index }); }
}
