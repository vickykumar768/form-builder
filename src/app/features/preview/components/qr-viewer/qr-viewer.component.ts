import {
  Component, Input, OnChanges, SimpleChanges,
  ViewChild, ElementRef, AfterViewInit, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrService }    from '@core/services';
import { FormSubmission } from '@core/models';

@Component({
  selector:    'fc-qr-viewer',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './qr-viewer.component.html',
})
export class QrViewerComponent implements OnChanges, AfterViewInit {
  @Input() submission: FormSubmission | null = null;

  @ViewChild('qrBox', { static: false })
  qrBox!: ElementRef<HTMLDivElement>;

  private qrSvc = inject(QrService);
  rendered  = false;
  error     = false;
  charCount = 0;

  ngAfterViewInit() { if (this.submission) this.render(); }

  ngOnChanges(c: SimpleChanges) {
    if (c['submission'] && this.submission && this.qrBox?.nativeElement) this.render();
  }

  private render() {
    const payload     = this.qrSvc.buildPayload(this.submission!);
    this.charCount    = payload.length;
    const ok          = this.qrSvc.render(this.qrBox.nativeElement, payload, 230);
    this.rendered     = ok;
    this.error        = !ok;
  }

  download() {
    if (!this.qrBox) return;
    const name = (this.submission?.formTitle ?? 'form')
      .toLowerCase().replace(/\s+/g, '-') + '-qr.png';
    this.qrSvc.download(this.qrBox.nativeElement, name);
  }
}
