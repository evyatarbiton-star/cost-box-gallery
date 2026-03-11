# Glow App — Prototype Project

This project uses **Glow DS** (the Glow Design System) to build UI prototypes.
All components and tokens come from the `glow-ds` package — never hardcode colors, spacing, or font values.

## How to Import

```tsx
// Components
import { Button, Checkbox, RadioButton, Toggle } from 'glow-ds/components'

// Tokens (for programmatic access)
import { semanticColors, semanticSpacing, typographyStyles } from 'glow-ds/tokens'

// Usage rules (read before choosing components)
import { buttonUsageRules, selectionControlsUsageRules, typographyUsageRules } from 'glow-ds/tokens'
```

## Running

```bash
npm run dev   # starts Vite on port 5176
```

---

## Available Components

### Button
```tsx
<Button variant="primary" size="lg">Get Started</Button>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'primary' \| 'secondary' \| 'outline' \| 'subtle' \| 'ghost' \| 'destructive'` | `'primary'` | Visual style |
| size | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Height: xs=36, sm=40, md=48, lg=56 |
| pill | `boolean` | `false` | Rounds corners to full pill shape |
| iconOnly | `boolean` | `false` | Square button, no text |
| loading | `boolean` | `false` | Shows spinner, disables interaction |
| fullWidth | `boolean` | `false` | Stretches to fill container |
| iconLeft | `ReactNode` | — | Icon before label |
| iconRight | `ReactNode` | — | Icon after label |

### Checkbox
```tsx
<Checkbox checked={val} onChange={handler} label="Email notifications" />
```

| Prop | Type | Description |
|------|------|-------------|
| checked | `boolean` | Checked state |
| onChange | `(e) => void` | Change handler |
| label | `string` | Text label (always include) |
| disabled | `boolean` | Disabled state |
| indeterminate | `boolean` | Dash icon for "select all" parent |

### RadioButton
```tsx
<RadioButton checked={val} onChange={handler} name="plan" label="Premium" />
```

| Prop | Type | Description |
|------|------|-------------|
| checked | `boolean` | Selected state |
| onChange | `(e) => void` | Change handler |
| name | `string` | Group name (radio buttons with same name are mutually exclusive) |
| label | `string` | Text label (always include) |
| disabled | `boolean` | Disabled state |

### Toggle
```tsx
<Toggle checked={val} onChange={handler} label="Dark mode" size="default" />
```

| Prop | Type | Description |
|------|------|-------------|
| checked | `boolean` | On/off state |
| onChange | `(e) => void` | Change handler |
| label | `string` | Describes the ON state |
| disabled | `boolean` | Disabled state |
| size | `'default' \| 'large'` | Default=44px, Large=52px |

---

## Key Rules — READ BEFORE BUILDING

### 1. Zero Hardcoded Values
Every hex color, pixel size, border-radius, and spacing value must use a DS token.
Use Tailwind classes with DS token names (e.g., `bg-primary`, `text-neutral-text-light`, `p-s`, `gap-m`, `rounded-xs`).

### 2. Fonts
- **Tiempos Headline** (`font-display`) — serif — ONLY for page main titles, hero headlines, and large prices
- **Founders Grotesk** (`font-default`) — sans-serif — for everything else (headings, body, labels, buttons)

```tsx
// Page title — Tiempos Headline
<h1 className="font-display font-medium text-[40px] leading-[48px]">Find a Doctor</h1>

// Section heading — Founders Grotesk
<h2 className="font-default font-normal text-[24px] leading-[28px]">Popular Specialties</h2>

// Body text — Founders Grotesk
<p className="font-default text-[16px] leading-[19px] text-neutral-text-light">Description here</p>
```

### 3. Button Rules
- Maximum ONE primary (orange) button per screen
- Never place primary + secondary side by side (use primary + outline)
- Use secondary (black) for repeated CTAs on cards
- Use outline for cancel, filters, toggles
- Use ghost for navigation links, favorites
- Destructive ONLY in confirmation dialogs

### 4. Selection Controls
- **Checkbox** = multi-select, deferred effect (needs submit button)
- **RadioButton** = single-select from group of 2+, always have default selection
- **Toggle** = instant binary switch, effect applies immediately (NO submit button)
- Toggle label describes the ON state ("Dark mode", not "Disable dark mode")

### 5. Tailwind for Layout
Use Tailwind classes for layout (flex, grid, padding, margin, gaps).
All DS tokens are available as Tailwind classes:

**Colors**: `bg-primary`, `bg-neutral-subtle`, `text-error`, `border-neutral-border-light`
**Spacing**: `p-s` (16px), `p-m` (20px), `gap-xs` (12px), `mt-xl` (32px)
**Radius**: `rounded-xs` (12px), `rounded-full` (999px)
**Shadow**: `shadow-card`, `shadow-lg`
**Font**: `font-display` (Tiempos), `font-default` (Founders Grotesk)

### 6. Semantic Colors First
Always use semantic tokens, not primitive colors:
- `bg-primary` NOT `bg-orange-500`
- `text-neutral-text-light` NOT `text-grey-700`
- `bg-error-subtle` NOT `bg-red-50`

---

## Spacing Scale (Tailwind classes)

| Token | Value | Class example |
|-------|-------|---------------|
| xxxs | 4px | `p-xxxs`, `gap-xxxs` |
| xxs | 8px | `p-xxs`, `gap-xxs` |
| xs | 12px | `p-xs`, `gap-xs` |
| s | 16px | `p-s`, `gap-s` |
| m | 20px | `p-m`, `gap-m` |
| l | 24px | `p-l`, `gap-l` |
| xl | 32px | `p-xl`, `gap-xl` |
| xxl | 40px | `p-xxl`, `gap-xxl` |
| xxxl | 48px | `p-xxxl`, `gap-xxxl` |
| xxxxl | 56px | `p-xxxxl`, `gap-xxxxl` |

---

## Color Reference (Semantic Tokens as Tailwind classes)

### Primary (Orange)
`bg-primary`, `bg-primary-subtle`, `bg-primary-hover`, `text-primary`, `text-primary-dark`, `border-primary`, `border-primary-light`

### Neutral (Black/Grey)
`bg-neutral` (black), `bg-neutral-subtle` (light grey), `bg-neutral-extra-subtle` (near white), `bg-neutral-negative` (white), `text-neutral` (black), `text-neutral-text-light` (grey), `text-neutral-text-dark` (dark grey), `border-neutral-border-light` (light border)

### Accent Yellow
`bg-accent-yellow`, `bg-accent-yellow-subtle`, `text-accent-yellow-text-dark`

### Accent Blue
`bg-accent-blue`, `bg-accent-blue-subtle`, `text-accent-blue-text-dark`

### Success (Green)
`bg-success`, `bg-success-subtle`, `text-success`, `text-success-text-dark`

### Error (Red)
`bg-error`, `bg-error-subtle`, `text-error`, `text-error-text-dark`

---

## Example: Complete Page

```tsx
import { Button, RadioButton, Toggle } from 'glow-ds/components'
import { useState } from 'react'

export function PlanPage() {
  const [plan, setPlan] = useState('basic')
  const [familyPlan, setFamilyPlan] = useState(false)

  return (
    <div className="min-h-screen bg-neutral-negative p-xl">
      {/* Page title — Tiempos Headline */}
      <h1 className="font-display font-medium text-[40px] leading-[48px] mb-xl">
        Choose Your Plan
      </h1>

      {/* Radio group — single select */}
      <div className="flex flex-col gap-s mb-l">
        <RadioButton name="plan" label="Basic — $10/mo" checked={plan === 'basic'} onChange={() => setPlan('basic')} />
        <RadioButton name="plan" label="Premium — $25/mo" checked={plan === 'premium'} onChange={() => setPlan('premium')} />
      </div>

      {/* Toggle — instant effect, no submit */}
      <div className="mb-xl">
        <Toggle checked={familyPlan} onChange={() => setFamilyPlan(!familyPlan)} label="Family Plan" />
      </div>

      {/* Primary button — one per page */}
      <Button variant="primary" size="lg" fullWidth>
        Continue
      </Button>
    </div>
  )
}
```
