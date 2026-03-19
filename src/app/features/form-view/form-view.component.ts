import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule }        from '@angular/common';
import { ActivatedRoute }      from '@angular/router';
import { QrService, QrPayload } from '@core/services';

interface ViewField {
  label: string;
  value: string;
  isEmpty: boolean;
}

@Component({
  selector:    'fc-form-view',
  standalone:  true,
  imports:     [CommonModule],
  templateUrl: './form-view.component.html',
})
export class FormViewComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private qrSvc  = inject(QrService);

  readonly state   = signal<'loading' | 'success' | 'error'>('loading');
  readonly payload = signal<QrPayload | null>(null);

  readonly formTitle   = computed(() => this.payload()?.t   ?? 'Form Submission');
  readonly submittedAt = computed(() => {
    const d = this.payload()?.d;
    if (!d) return '';
    return new Date(d).toLocaleString(undefined, {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  });
  readonly formId = computed(() => this.payload()?.id ?? '');
  readonly fields = computed<ViewField[]>(() => {
    const r = this.payload()?.r ?? {};
    return Object.entries(r).map(([label, value]) => ({
      label,
      value: value || '—',
      isEmpty: !value || value === '—',
    }));
  });
  readonly fieldCount   = computed(() => this.fields().length);
  readonly filledCount  = computed(() => this.fields().filter(f => !f.isEmpty).length);

  ngOnInit(): void {
    const encoded = this.route.snapshot.paramMap.get('data');
    if (!encoded) { this.state.set('error'); return; }

    const decoded = this.qrSvc.decodePayload(encoded);
    if (!decoded) { this.state.set('error'); return; }

    this.payload.set(decoded);
    this.state.set('success');
  }

  goBack(): void {
    window.history.back();
  }

  print(): void {
    window.print();
  }
}
