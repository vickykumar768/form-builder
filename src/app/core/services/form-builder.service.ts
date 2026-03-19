import { Injectable, signal, computed } from '@angular/core';
import {
  FormField, FormConfig, FormSubmission, FieldType,
} from '../models';
import { FIELD_COLOR_MAP, LAYOUT_FIELDS, CHOICE_FIELDS } from '../constants';

// ─── Default field factory ────────────────────────────────────────────────────

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function makeField(type: FieldType): FormField {
  const base = { id: uid(), type, label: '' };
  switch (type) {
    case 'text':      return { ...base, type, label: 'Text Field',      placeholder: 'Enter text…',       required: false, helpText: '' };
    case 'textarea':  return { ...base, type, label: 'Message',         placeholder: 'Write here…',       required: false, helpText: '', rows: 3 };
    case 'email':     return { ...base, type, label: 'Email Address',   placeholder: 'you@example.com',   required: true,  helpText: '' };
    case 'number':    return { ...base, type, label: 'Number',          placeholder: '0',                 required: false, helpText: '', min: null, max: null };
    case 'tel':       return { ...base, type, label: 'Phone Number',    placeholder: '+1 555 000 0000',   required: false, helpText: '' };
    case 'url':       return { ...base, type, label: 'Website',         placeholder: 'https://',          required: false, helpText: '' };
    case 'date':      return { ...base, type, label: 'Date',            placeholder: '',                  required: false, helpText: '' };
    case 'time':      return { ...base, type, label: 'Time',            placeholder: '',                  required: false, helpText: '' };
    case 'select':    return { ...base, type, label: 'Choose Option',   required: false, options: ['Option 1', 'Option 2', 'Option 3'], helpText: '' };
    case 'radio':     return { ...base, type, label: 'Pick One',        required: false, options: ['Option A', 'Option B', 'Option C'], helpText: '' };
    case 'checkbox':  return { ...base, type, label: 'Select All That Apply', required: false, options: ['Choice 1', 'Choice 2'], helpText: '' };
    case 'heading':   return { ...base, type, label: 'Section Heading', level: 'h2' };
    case 'paragraph': return { ...base, type, label: '', text: 'Add your text here.' };
    case 'divider':   return { ...base, type, label: '' };
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class FormBuilderService {

  // ── State signals ──────────────────────────────────────────────────────────
  readonly config = signal<FormConfig>({
    id:          uid(),
    title:       'Untitled Form',
    description: 'Fill out this form and get a scannable QR code.',
    submitLabel: 'Submit Form',
    fields:      [],
    createdAt:   new Date(),
  });

  readonly selectedId    = signal<string | null>(null);
  readonly lastSubmission = signal<FormSubmission | null>(null);

  // ── Computed ───────────────────────────────────────────────────────────────
  readonly fields        = computed(() => this.config().fields);
  readonly fieldCount    = computed(() => this.fields().length);
  readonly selectedField = computed(() => this.fields().find(f => f.id === this.selectedId()) ?? null);

  // ── Config meta ───────────────────────────────────────────────────────────
  patchConfig(patch: Partial<Pick<FormConfig, 'title' | 'description' | 'submitLabel'>>): void {
    this.config.update(c => ({ ...c, ...patch }));
  }

  // ── Field CRUD ─────────────────────────────────────────────────────────────
  addField(type: FieldType, atIndex?: number): string {
    const field = makeField(type);
    this.config.update(c => {
      const fields = [...c.fields];
      atIndex !== undefined ? fields.splice(atIndex, 0, field) : fields.push(field);
      return { ...c, fields };
    });
    this.selectedId.set(field.id);
    return field.id;
  }

  patchField(id: string, patch: Partial<FormField>): void {
    this.config.update(c => ({
      ...c,
      fields: c.fields.map(f => f.id === id ? ({ ...f, ...patch } as FormField) : f),
    }));
  }

  removeField(id: string): void {
    this.config.update(c => ({ ...c, fields: c.fields.filter(f => f.id !== id) }));
    if (this.selectedId() === id) this.selectedId.set(null);
  }

  duplicateField(id: string): void {
    const src   = this.fields().find(f => f.id === id);
    if (!src) return;
    const idx   = this.fields().indexOf(src);
    const clone = { ...JSON.parse(JSON.stringify(src)), id: uid() } as FormField;
    this.config.update(c => {
      const fields = [...c.fields];
      fields.splice(idx + 1, 0, clone);
      return { ...c, fields };
    });
    this.selectedId.set(clone.id);
  }

  moveField(from: number, to: number): void {
    if (from === to) return;
    this.config.update(c => {
      const fields = [...c.fields];
      const [moved] = fields.splice(from, 1);
      fields.splice(to, 0, moved);
      return { ...c, fields };
    });
  }

  clearFields(): void {
    this.config.update(c => ({ ...c, fields: [] }));
    this.selectedId.set(null);
  }

  selectField(id: string | null): void {
    this.selectedId.set(id);
  }

  // ── Options helpers ────────────────────────────────────────────────────────
  addOption(fieldId: string): void {
    const f = this.fields().find(x => x.id === fieldId) as any;
    if (!f?.options) return;
    this.patchField(fieldId, { options: [...f.options, `Option ${f.options.length + 1}`] } as any);
  }

  updateOption(fieldId: string, i: number, value: string): void {
    const f = this.fields().find(x => x.id === fieldId) as any;
    if (!f?.options) return;
    const options = [...f.options];
    options[i] = value;
    this.patchField(fieldId, { options } as any);
  }

  removeOption(fieldId: string, i: number): void {
    const f = this.fields().find(x => x.id === fieldId) as any;
    if (!f?.options || f.options.length <= 1) return;
    const options = [...f.options];
    options.splice(i, 1);
    this.patchField(fieldId, { options } as any);
  }

  // ── Submission ─────────────────────────────────────────────────────────────
  saveSubmission(data: Record<string, string>): void {
    this.lastSubmission.set({
      formId:      this.config().id,
      formTitle:   this.config().title,
      submittedAt: new Date(),
      data,
    });
  }

  clearSubmission(): void {
    this.lastSubmission.set(null);
  }

  // ── Utilities ──────────────────────────────────────────────────────────────
  getColor(type: FieldType)    { return FIELD_COLOR_MAP[type]; }
  isLayout(type: FieldType)    { return LAYOUT_FIELDS.includes(type); }
  hasOptions(type: FieldType)  { return CHOICE_FIELDS.includes(type); }

  seedDemo(): void {
    this.clearFields();
    this.patchConfig({ title: 'Contact Us', description: 'We\'d love to hear from you.', submitLabel: 'Send Message' });
    [
      { type: 'heading' as FieldType, patch: { label: 'Your Details', level: 'h2' } },
      { type: 'text'    as FieldType, patch: { label: 'Full Name', placeholder: 'Jane Doe' } },
      { type: 'email'   as FieldType, patch: { label: 'Email' } },
      { type: 'tel'     as FieldType, patch: { label: 'Phone' } },
      { type: 'divider' as FieldType, patch: {} },
      { type: 'textarea'as FieldType, patch: { label: 'Message', rows: 4 } },
    ].forEach(({ type, patch }) => {
      const id = this.addField(type);
      if (Object.keys(patch).length) this.patchField(id, patch as any);
    });
    this.selectedId.set(null);
  }
}
