import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormBuilderService } from '@core/services';
import { FieldCardComponent } from '../field-card/field-card.component';
import { FormMetaComponent }  from '../form-meta/form-meta.component';
import { FieldType }          from '@core/models';

@Component({
  selector:    'fc-canvas',
  standalone:  true,
  imports:     [CommonModule, FieldCardComponent, FormMetaComponent],
  templateUrl: './canvas.component.html',
})
export class CanvasComponent {
  private builder     = inject(FormBuilderService);
  readonly fields     = computed(() => this.builder.fields());
  readonly selectedId = computed(() => this.builder.selectedId());
  readonly dragOver   = signal(false);
  private dragFrom    = signal<number | null>(null);
  readonly dropTarget = signal<{ index: number; above: boolean } | null>(null);

  // Palette → canvas drop
  onZoneDragOver(e: DragEvent)  { e.preventDefault(); this.dragOver.set(true); }
  onZoneDragLeave(e: DragEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
      this.dragOver.set(false);
  }
  onZoneDrop(e: DragEvent) {
    e.preventDefault(); this.dragOver.set(false); this.dropTarget.set(null);
    const ft = e.dataTransfer?.getData('fieldType') as FieldType | undefined;
    if (ft) this.builder.addField(ft);
  }

  // Card drag events
  onCardDragStart(payload: { event: DragEvent; index: number }) { this.dragFrom.set(payload.index); }
  onCardDragOver(payload: { event: DragEvent; index: number }) {
    payload.event.preventDefault();
    const el   = (payload.event.currentTarget as HTMLElement).closest('.fc-card-wrap') as HTMLElement;
    const rect = el?.getBoundingClientRect();
    const above = rect ? payload.event.clientY < rect.top + rect.height / 2 : true;
    this.dropTarget.set({ index: payload.index, above });
  }
  onCardDrop(payload: { event: DragEvent; index: number }) {
    const from = this.dragFrom();
    if (from !== null && from !== payload.index) {
      const dt = this.dropTarget();
      const to = dt ? (dt.above ? payload.index : payload.index) : payload.index;
      this.builder.moveField(from, to);
    }
    this.dragFrom.set(null); this.dropTarget.set(null);
  }
  onDragEnd() { this.dragFrom.set(null); this.dropTarget.set(null); }

  isAbove(i: number)  { const dt = this.dropTarget(); return dt?.index === i && dt.above; }
  isBelow(i: number)  { const dt = this.dropTarget(); return dt?.index === i && !dt.above; }
  isDragging(i: number) { return this.dragFrom() === i; }

  select(id: string)    { this.builder.selectField(id); }
  remove(id: string)    { this.builder.removeField(id); }
  dup(id: string)       { this.builder.duplicateField(id); }
  up(i: number)         { this.builder.moveField(i, i - 1); }
  down(i: number)       { this.builder.moveField(i, i + 1); }
}
