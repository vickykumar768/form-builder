import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormBuilderService }        from '@core/services';
import { HeaderComponent }           from '@layout/header/header.component';
import { FieldPaletteComponent }     from '../components/field-palette/field-palette.component';
import { CanvasComponent }           from '../components/canvas/canvas.component';
import { PropertiesPanelComponent }  from '../components/properties-panel/properties-panel.component';
import { PreviewModalComponent }     from '../../preview/preview-modal/preview-modal.component';

@Component({
  selector:    'fc-builder-page',
  standalone:  true,
  imports: [
    CommonModule,
    HeaderComponent,
    FieldPaletteComponent,
    CanvasComponent,
    PropertiesPanelComponent,
    PreviewModalComponent,
  ],
  template: `
    <div class="flex flex-col h-screen overflow-hidden">
      <fc-header (previewOpen)="openPreview()" />
      <div class="flex flex-1 overflow-hidden">
        <fc-field-palette />
        <fc-canvas />
        <fc-properties-panel />
      </div>
    </div>

    @if (previewOpen()) {
      <fc-preview-modal (closed)="closePreview()" />
    }
  `,
})
export class BuilderPageComponent implements OnInit {
  private builder   = inject(FormBuilderService);
  readonly previewOpen = signal(false);

  ngOnInit() { this.builder.seedDemo(); }
  openPreview()  { this.previewOpen.set(true); }
  closePreview() { this.previewOpen.set(false); }
}
