# FormCraft — Angular Drag & Drop Form Builder

A production-grade **Angular 17** application for building forms visually with drag-and-drop, then generating QR codes from submissions.

---

## Quick Start

```bash
npm install
npm start          # → http://localhost:4200
npm run build:prod # production build
```

---

## Tech Stack

| Concern        | Technology                        |
|----------------|-----------------------------------|
| Framework      | Angular 17 (Standalone Components)|
| State          | Angular Signals                   |
| Styling        | Tailwind CSS 3 + SCSS             |
| Forms          | Angular Reactive Forms            |
| QR Generation  | qrcodejs (CDN via index.html)     |
| Drag & Drop    | Native HTML5 DnD API              |

---

## Project Structure

```
formcraft/
├── angular.json                        # CLI workspace config
├── tailwind.config.js                  # Tailwind theme + content paths
├── postcss.config.js                   # PostCSS pipeline
├── tsconfig.json                       # TypeScript + path aliases
├── tsconfig.app.json
│
└── src/
    ├── index.html                      # Entry HTML (loads QR CDN script)
    ├── main.ts                         # Bootstrap
    ├── styles.scss                     # Global styles + Tailwind directives
    │
    ├── environments/
    │   ├── environment.ts              # Dev config
    │   └── environment.prod.ts        # Prod config
    │
    └── app/
        ├── app.component.ts           # Root shell (<router-outlet>)
        ├── app.config.ts              # Angular providers
        ├── app.routes.ts              # Lazy-loaded routes
        │
        ├── core/                      # Domain: models, services, constants
        │   ├── models/
        │   │   ├── form-field.model.ts  # All TS interfaces & union types
        │   │   └── index.ts
        │   ├── services/
        │   │   ├── form-builder.service.ts  # Signals-based form state
        │   │   ├── qr.service.ts            # QR encode + render + download
        │   │   └── index.ts
        │   └── constants/
        │       ├── palette.constants.ts     # Field palette config + color map
        │       └── index.ts
        │
        ├── shared/                    # Reusable UI atoms
        │   ├── components/
        │   │   ├── ui-icon/           # SVG icon per field type
        │   │   ├── ui-badge/          # Colored type pill
        │   │   └── ui-toggle/         # Accessible boolean switch
        │   ├── pipes/
        │   │   └── safe-html.pipe.ts  # XSS-safe string escaping
        │   └── index.ts
        │
        ├── layout/
        │   └── header/                # Top navigation bar
        │
        └── features/
            ├── builder/               # Form-builder feature
            │   ├── builder-page/      # Page component (wires all panels)
            │   └── components/
            │       ├── field-palette/ # Left sidebar — draggable field types
            │       ├── field-card/    # Individual card on the canvas
            │       ├── canvas/        # Drop zone + card list
            │       ├── form-meta/     # Editable title / description / submit label
            │       └── properties-panel/ # Right sidebar — selected field editor
            │
            └── preview/               # Preview + submission feature
                ├── preview-modal/     # Modal shell with tab switching
                └── components/
                    ├── form-renderer/ # Live reactive form
                    ├── qr-viewer/     # QR code render + download
                    └── submission-summary/ # Key-value table of submitted data
```

---

## Architecture

### Signals-based State (`FormBuilderService`)
Central store using Angular 17 Signals — no NgRx needed.  
`signal<FormConfig>` holds everything; `computed` derives field lists and selected state.

### Discriminated Union Types
`FormField` is a TypeScript discriminated union so every field variant is strictly typed at compile time.

### Standalone Components + Lazy Routes
`loadComponent()` in `app.routes.ts` keeps the initial bundle lean.

### Path Aliases
`tsconfig.json` maps `@core/*`, `@shared/*`, `@features/*`, `@layout/*` so imports stay clean regardless of nesting depth.

---

## Adding a New Field Type

1. Add the type to `FieldType` in `core/models/form-field.model.ts`
2. Add its interface and include it in the `FormField` union
3. Add defaults in the `makeField()` factory in `form-builder.service.ts`
4. Add a `PaletteItem` entry in `core/constants/palette.constants.ts`
5. Add an icon case in `shared/components/ui-icon/ui-icon.component.html`
6. Add a preview case in `features/builder/components/field-card/field-card.component.html`
7. Add a live-form case in `features/preview/components/form-renderer/form-renderer.component.html`

---

## License
MIT
