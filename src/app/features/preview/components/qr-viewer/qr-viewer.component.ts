import {
  Component, Input, OnChanges, SimpleChanges,
  ViewChild, ElementRef, AfterViewInit, inject,
} from '@angular/core';
import { CommonModule }   from '@angular/common';
import { QrService }      from '@core/services';
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

  rendered   = false;
  error      = false;
  viewerUrl  = '';

  ngAfterViewInit(): void {
    if (this.submission) this.doRender();
  }

  ngOnChanges(c: SimpleChanges): void {
    if (c['submission'] && this.submission && this.qrBox?.nativeElement) this.doRender();
  }

  private doRender(): void {
    this.viewerUrl = this.qrSvc.buildViewerUrl(this.submission!);
    const ok       = this.qrSvc.render(this.qrBox.nativeElement, this.submission!);
    this.rendered  = ok;
    this.error     = !ok;
  }

  openViewer(): void {
    if (this.viewerUrl) window.open(this.viewerUrl, '_blank');
  }

  download(): void {
    if (!this.qrBox) return;
    const name = (this.submission?.formTitle ?? 'form')
      .toLowerCase().replace(/\s+/g, '-') + '-qr.png';
    this.qrSvc.download(this.qrBox.nativeElement, name);
  }
}
