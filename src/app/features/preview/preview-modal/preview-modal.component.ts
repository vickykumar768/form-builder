import { Component, Output, EventEmitter, inject, signal, computed } from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormBuilderService }        from '@core/services';
import { FormRendererComponent }     from '../components/form-renderer/form-renderer.component';
import { QrViewerComponent }         from '../components/qr-viewer/qr-viewer.component';
import { SubmissionSummaryComponent } from '../components/submission-summary/submission-summary.component';

type ActiveTab = 'form' | 'qr';

@Component({
  selector:    'fc-preview-modal',
  standalone:  true,
  imports:     [CommonModule, FormRendererComponent, QrViewerComponent, SubmissionSummaryComponent],
  templateUrl: './preview-modal.component.html',
})
export class PreviewModalComponent {
  @Output() closed = new EventEmitter<void>();

  private builder    = inject(FormBuilderService);
  readonly tab       = signal<ActiveTab>('form');
  readonly submission = computed(() => this.builder.lastSubmission());
  readonly formTitle  = computed(() => this.builder.config().title);

  setTab(t: ActiveTab) { this.tab.set(t); }
  close()              { this.closed.emit(); }

  onSubmitted()  { this.setTab('qr'); }
  onFillAgain()  { this.builder.clearSubmission(); this.setTab('form'); }
  onOverlay(e: MouseEvent) { if (e.target === e.currentTarget) this.close(); }
}
