import { Component, inject } from '@angular/core';
import { FormsModule }        from '@angular/forms';
import { FormBuilderService } from '@core/services';

@Component({
  selector:    'fc-form-meta',
  standalone:  true,
  imports:     [FormsModule],
  templateUrl: './form-meta.component.html',
})
export class FormMetaComponent {
  private builder = inject(FormBuilderService);
  get title()       { return this.builder.config().title; }
  get description() { return this.builder.config().description; }
  get submitLabel() { return this.builder.config().submitLabel; }
  patch(key: 'title'|'description'|'submitLabel', v: string) { this.builder.patchConfig({ [key]: v }); }
}
