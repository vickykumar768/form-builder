// ─── Field Type Enum ──────────────────────────────────────────────────────────

export type FieldType =
  | 'text' | 'textarea' | 'email' | 'number' | 'tel' | 'url'
  | 'select' | 'radio' | 'checkbox'
  | 'date' | 'time'
  | 'heading' | 'paragraph' | 'divider';

export type FieldCategory = 'input' | 'choice' | 'datetime' | 'layout';

// ─── Color Token ──────────────────────────────────────────────────────────────

export type FieldColor = 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose' | 'sky' | 'slate';

// ─── Palette Item (sidebar entry) ────────────────────────────────────────────

export interface PaletteItem {
  type:        FieldType;
  label:       string;
  description: string;
  category:    FieldCategory;
  color:       FieldColor;
}

// ─── Base ─────────────────────────────────────────────────────────────────────

export interface BaseField {
  id:    string;
  type:  FieldType;
  label: string;
}

// ─── Concrete Field Configs ───────────────────────────────────────────────────

export interface TextField extends BaseField {
  type:        'text' | 'email' | 'tel' | 'url' | 'date' | 'time';
  placeholder: string;
  required:    boolean;
  helpText:    string;
}

export interface TextareaField extends BaseField {
  type:        'textarea';
  placeholder: string;
  required:    boolean;
  helpText:    string;
  rows:        number;
}

export interface NumberField extends BaseField {
  type:        'number';
  placeholder: string;
  required:    boolean;
  helpText:    string;
  min:         number | null;
  max:         number | null;
}

export interface SelectField extends BaseField {
  type:     'select';
  required: boolean;
  options:  string[];
  helpText: string;
}

export interface ChoiceField extends BaseField {
  type:     'radio' | 'checkbox';
  required: boolean;
  options:  string[];
  helpText: string;
}

export interface HeadingField extends BaseField {
  type:  'heading';
  level: 'h1' | 'h2' | 'h3';
}

export interface ParagraphField extends BaseField {
  type: 'paragraph';
  text: string;
}

export interface DividerField extends BaseField {
  type: 'divider';
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type FormField =
  | TextField | TextareaField | NumberField
  | SelectField | ChoiceField
  | HeadingField | ParagraphField | DividerField;

// ─── Form Model ───────────────────────────────────────────────────────────────

export interface FormConfig {
  id:          string;
  title:       string;
  description: string;
  submitLabel: string;
  fields:      FormField[];
  createdAt:   Date;
}

// ─── Submission ───────────────────────────────────────────────────────────────

export interface FormSubmission {
  formId:      string;
  formTitle:   string;
  submittedAt: Date;
  data:        Record<string, string>;
}
