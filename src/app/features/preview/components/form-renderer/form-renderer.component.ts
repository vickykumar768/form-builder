import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormBuilderService } from '@core/services';

@Component({
  selector:    'fc-form-renderer',
  standalone:  true,
  imports:     [CommonModule, ReactiveFormsModule],
  templateUrl: './form-renderer.component.html',
})
export class FormRendererComponent implements OnInit {
  @Output() submitted = new EventEmitter<Record<string, string>>();

  private builder = inject(FormBuilderService);
  private fb      = inject(FormBuilder);

  readonly config = this.builder.config;
  readonly fields = this.builder.fields;
  form!: FormGroup;

  ngOnInit() { this.buildForm(); }

  private buildForm() {
    const group: Record<string, any> = {};
    for (const f of this.fields()) {
      if (f.type === 'heading' || f.type === 'divider' || f.type === 'paragraph') continue;
      const v = (f as any).required ? [Validators.required] : [];
      if (f.type === 'checkbox') {
        group[f.id] = this.fb.control([], v);
      } else {
        group[f.id] = this.fb.control('', v);
      }
    }
    this.form = this.fb.group(group);
  }

  ctrl(id: string) { return this.form.get(id); }
  invalid(id: string) { const c = this.ctrl(id); return c?.invalid && c.touched; }

  onCheckbox(id: string, val: string, e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    const ctrl    = this.ctrl(id);
    if (!ctrl) return;
    const arr: string[] = Array.isArray(ctrl.value) ? [...ctrl.value] : [];
    ctrl.setValue(checked ? [...arr, val] : arr.filter(x => x !== val));
    ctrl.markAsTouched();
  }
  isChecked(id: string, val: string): boolean {
    const v = this.ctrl(id)?.value;
    return Array.isArray(v) && v.includes(val);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const data: Record<string, string> = {};
    for (const f of this.fields()) {
      if (f.type === 'heading' || f.type === 'divider' || f.type === 'paragraph') continue;
      const raw = this.ctrl(f.id)?.value;
      data[f.label || f.id] = Array.isArray(raw) ? raw.join(', ') || '—' : (raw || '—');
    }
    this.builder.saveSubmission(data);
    this.submitted.emit(data);
  }
}
