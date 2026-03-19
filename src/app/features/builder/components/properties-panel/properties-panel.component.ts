import { Component, inject, computed } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { FormBuilderService } from '@core/services';
import { UiToggleComponent }  from '@shared/components/ui-toggle';
import { FormField }          from '@core/models';

@Component({
  selector:    'fc-properties-panel',
  standalone:  true,
  imports:     [CommonModule, FormsModule, UiToggleComponent],
  templateUrl: './properties-panel.component.html',
})
export class PropertiesPanelComponent {
  private builder = inject(FormBuilderService);

  readonly field      = computed(() => this.builder.selectedField());
  readonly fieldCount = computed(() => this.builder.fieldCount());

  // Typed getters
  get label()       { return (this.field() as any)?.label        ?? ''; }
  get placeholder() { return (this.field() as any)?.placeholder  ?? ''; }
  get required()    { return (this.field() as any)?.required      ?? false; }
  get helpText()    { return (this.field() as any)?.helpText      ?? ''; }
  get options()     { return (this.field() as any)?.options       ?? []; }
  get level()       { return (this.field() as any)?.level         ?? 'h2'; }
  get rows()        { return (this.field() as any)?.rows          ?? 3; }
  get min()         { return (this.field() as any)?.min; }
  get max()         { return (this.field() as any)?.max; }
  get text()        { return (this.field() as any)?.text          ?? ''; }

  get showPlaceholder() {
    const t = this.field()?.type;
    return t && !['heading','divider','paragraph','select','radio','checkbox','date','time'].includes(t);
  }
  get showRequired()  { return this.field() && !this.builder.isLayout(this.field()!.type); }
  get showHelpText()  { return this.field() && !this.builder.isLayout(this.field()!.type); }
  get showOptions()   { return this.field() && this.builder.hasOptions(this.field()!.type); }
  get showMinMax()    { return this.field()?.type === 'number'; }
  get showLevel()     { return this.field()?.type === 'heading'; }
  get showRows()      { return this.field()?.type === 'textarea'; }
  get showParagraph() { return this.field()?.type === 'paragraph'; }

  patch(key: string, value: any) {
    const f = this.field();
    if (f) this.builder.patchField(f.id, { [key]: value } as Partial<FormField>);
  }
  addOption()              { const f = this.field(); if (f) this.builder.addOption(f.id); }
  updateOption(i: number, v: string) { const f = this.field(); if (f) this.builder.updateOption(f.id, i, v); }
  removeOption(i: number)  { const f = this.field(); if (f) this.builder.removeOption(f.id, i); }
  deleteField()            { const f = this.field(); if (f) this.builder.removeField(f.id); }
}
