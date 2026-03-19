import { Injectable } from '@angular/core';
import { FormSubmission } from '../models';

declare const QRCode: any;

@Injectable({ providedIn: 'root' })
export class QrService {

  /** Encode submission into a readable string for the QR payload */
  buildPayload(sub: FormSubmission): string {
    const lines = [
      `FORM: ${sub.formTitle}`,
      `DATE: ${sub.submittedAt.toLocaleString()}`,
      `ID:   ${sub.formId}`,
      '---',
      ...Object.entries(sub.data).map(([k, v]) => `${k}: ${v}`),
    ];
    return lines.join('\n');
  }

  /** Render QR into container element. Returns true on success. */
  render(container: HTMLElement, payload: string, size = 240): boolean {
    container.innerHTML = '';
    if (typeof QRCode === 'undefined') {
      console.error('[QrService] QRCode library not available');
      return false;
    }
    try {
      new QRCode(container, {
        text:         payload,
        width:        size,
        height:       size,
        colorDark:    '#0f172a',
        colorLight:   '#ffffff',
        correctLevel: QRCode.CorrectLevel.Q,
      });
      return true;
    } catch (e) {
      console.error('[QrService] render failed', e);
      return false;
    }
  }

  /** Download the rendered QR image */
  download(container: HTMLElement, filename = 'qr-code.png'): void {
    const img = container.querySelector('img') as HTMLImageElement | null;
    if (!img) return;
    const a = document.createElement('a');
    a.href = img.src;
    a.download = filename;
    a.click();
  }
}
