import { PaletteItem, FieldType, FieldColor } from '../models';

export const PALETTE_ITEMS: PaletteItem[] = [
  // Input
  { type: 'text',      label: 'Text',      description: 'Single-line input',  category: 'input',    color: 'indigo'  },
  { type: 'textarea',  label: 'Textarea',  description: 'Multi-line text',     category: 'input',    color: 'indigo'  },
  { type: 'email',     label: 'Email',     description: 'Email address',       category: 'input',    color: 'violet'  },
  { type: 'number',    label: 'Number',    description: 'Numeric value',       category: 'input',    color: 'emerald' },
  { type: 'tel',       label: 'Phone',     description: 'Telephone number',    category: 'input',    color: 'emerald' },
  { type: 'url',       label: 'URL',       description: 'Web address',         category: 'input',    color: 'sky'     },
  // Choice
  { type: 'select',    label: 'Dropdown',  description: 'Select one option',   category: 'choice',   color: 'amber'   },
  { type: 'radio',     label: 'Radio',     description: 'Pick one choice',     category: 'choice',   color: 'amber'   },
  { type: 'checkbox',  label: 'Checkbox',  description: 'Multiple choices',    category: 'choice',   color: 'rose'    },
  // Date & Time
  { type: 'date',      label: 'Date',      description: 'Date picker',         category: 'datetime', color: 'sky'     },
  { type: 'time',      label: 'Time',      description: 'Time picker',         category: 'datetime', color: 'sky'     },
  // Layout
  { type: 'heading',   label: 'Heading',   description: 'Section title',       category: 'layout',   color: 'slate'   },
  { type: 'paragraph', label: 'Paragraph', description: 'Static text block',   category: 'layout',   color: 'slate'   },
  { type: 'divider',   label: 'Divider',   description: 'Horizontal separator', category: 'layout',  color: 'slate'   },
];

export const FIELD_COLOR_MAP: Record<FieldType, FieldColor> = {
  text: 'indigo', textarea: 'indigo', email: 'violet', number: 'emerald', tel: 'emerald', url: 'sky',
  select: 'amber', radio: 'amber', checkbox: 'rose',
  date: 'sky', time: 'sky',
  heading: 'slate', paragraph: 'slate', divider: 'slate',
};

export const LAYOUT_FIELDS: FieldType[] = ['heading', 'paragraph', 'divider'];
export const CHOICE_FIELDS:  FieldType[] = ['select', 'radio', 'checkbox'];
