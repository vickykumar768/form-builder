import { Injectable } from '@angular/core';
import { FormSubmission } from '../models';

declare const QRCode: any;

// ─── Payload shape stored in the QR URL ──────────────────────────────────────
export interface QrPayload {
  t:  string;              // formTitle
  d:  string;              // submittedAt ISO string
  id: string;              // formId
  r:  Record<string, string>; // field label → value
}

@Injectable({ providedIn: 'root' })
export class QrService {

  /**
   * Serialize a submission into a compact base64url JSON string.
   * Safe for use as a URL path segment (no +/= chars).
   */
  encodePayload(sub: FormSubmission): string {
    const payload: QrPayload = {
      t:  sub.formTitle,
      d:  sub.submittedAt.toISOString(),
      id: sub.formId,
      r:  sub.data,
    };
    const json   = JSON.stringify(payload);
    const b64    = btoa(unescape(encodeURIComponent(json)));
    // Make URL-safe: replace +→-, /→_, strip =
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * Decode a base64url string back into a QrPayload. Returns null on failure.
   */
  decodePayload(encoded: string): QrPayload | null {
    try {
      // Restore standard base64 chars
      const b64  = encoded.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(escape(atob(b64)));
      return JSON.parse(json) as QrPayload;
    } catch {
      return null;
    }
  }

  /**
   * Build the full viewer URL that will be encoded into the QR code.
   * e.g. http://localhost:4200/view/eyJ0IjoiTXkgRm9ybSI...
   */
  buildViewerUrl(sub: FormSubmission): string {
    const encoded = this.encodePayload(sub);
    const origin  = window.location.origin;
    return `${origin}/view/${encoded}`;
  }

  /**
   * Render a QR code into a container element.
   * Encodes the full viewer URL so scanning opens the data viewer page.
   * Returns true on success.
   */
  render(container: HTMLElement, sub: FormSubmission, size = 240): boolean {
    container.innerHTML = '';
    if (typeof QRCode === 'undefined') {
      console.error('[QrService] QRCode library not loaded');
      return false;
    }
    try {
      const url = this.buildViewerUrl(sub);
      new QRCode(container, {
        text:         url,
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

  /** Download the rendered QR image as PNG. */
  download(container: HTMLElement, filename = 'qr-code.png'): void {
    const img = container.querySelector('img') as HTMLImageElement | null;
    if (!img) return;
    const a      = document.createElement('a');
    a.href       = img.src;
    a.download   = filename;
    a.click();
  }
}
