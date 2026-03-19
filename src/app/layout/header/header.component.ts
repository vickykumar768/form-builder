import { Component, Output, EventEmitter, inject, computed } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormBuilderService } from '@core/services';

@Component({
  selector:    'fc-header',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Output() previewOpen = new EventEmitter<void>();
  private builder = inject(FormBuilderService);
  readonly count  = computed(() => this.builder.fieldCount());

  clear() { if (confirm('Clear all fields?')) this.builder.clearFields(); }
}
