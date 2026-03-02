# ArthaPath Design System Documentation

## Overview

Comprehensive design system for ArthaPath Nepal with light and dark mode support, typography scale, spacing utilities, and semantic colors.

---

## Color Tokens

### Primary Colors

| Token | Light | Dark |
|-------|-------|------|
| `--color-primary` | #000000 (Black) | #FFFFFF (White) |
| `--color-primary-dark` | #1A1A1A | #E6E6E6 |
| `--color-primary-light` | #333333 | #CCCCCC |

### Secondary Colors

| Token | Light | Dark |
|-------|-------|------|
| `--color-secondary` | #666666 | #999999 |
| `--color-secondary-light` | #999999 | #666666 |
| `--color-secondary-lighter` | #CCCCCC | #444444 |

### Background Colors

| Token | Light | Dark |
|-------|-------|------|
| `--color-background` | #FFFFFF | #0F0F0F |
| `--color-background-secondary` | #F5F5F5 | #1A1A1A |
| `--color-background-tertiary` | #EFEFEF | #242424 |

### Text Colors

| Token | Light | Dark |
|-------|-------|------|
| `--color-text-primary` | #000000 | #FFFFFF |
| `--color-text-secondary` | #666666 | #999999 |
| `--color-text-tertiary` | #999999 | #666666 |
| `--color-text-inverse` | #FFFFFF | #000000 |

### Border Colors

| Token | Light | Dark |
|-------|-------|------|
| `--color-border` | #E0E0E0 | #2D2D2D |
| `--color-border-light` | #F0F0F0 | #1A1A1A |
| `--color-border-dark` | #CCCCCC | #3D3D3D |

### Semantic Colors

| Token | Color | Light Background | Dark Background |
|-------|-------|------------------|-----------------|
| `--color-success` | #10B981 (Green) | - | - |
| `--color-warning` | #F59E0B (Amber) | #FEF3C7 | #78350F |
| `--color-error` | #EF4444 (Red) | #FEE2E2 | #7F1D1D |
| `--color-info` | #3B82F6 (Blue) | #DBEAFE | #1E3A8A |

### Risk Profile Colors

| Token | Color | Use Case |
|-------|-------|----------|
| `--color-risk-conservative` | #10B981 (Green) | Conservative portfolio |
| `--color-risk-balanced` | #3B82F6 (Blue) | Balanced portfolio |
| `--color-risk-aggressive` | #EF4444 (Red) | Aggressive portfolio |

---

## Typography Scale

### Heading Sizes

#### H1 (Page Title)
```css
--text-h1-size: 32px;
--text-h1-weight: 700 (Bold);
--text-h1-line-height: 1.25;
--text-h1-letter-spacing: -0.02em;
```

**Usage:** Page main title, hero section heading

#### H2 (Section Heading)
```css
--text-h2-size: 28px;
--text-h2-weight: 700 (Bold);
--text-h2-line-height: 1.3;
--text-h2-letter-spacing: -0.01em;
```

**Usage:** Major section headers

#### H3 (Subsection Heading)
```css
--text-h3-size: 24px;
--text-h3-weight: 600 (Semi-bold);
--text-h3-line-height: 1.35;
--text-h3-letter-spacing: 0;
```

**Usage:** Subsection headers, card titles

#### H4 (Minor Heading)
```css
--text-h4-size: 20px;
--text-h4-weight: 600 (Semi-bold);
--text-h4-line-height: 1.4;
--text-h4-letter-spacing: 0;
```

**Usage:** Small section headers, component titles

### Body Text

#### Body (Regular)
```css
--text-body-size: 16px;
--text-body-weight: 400 (Normal);
--text-body-line-height: 1.5;
--text-body-letter-spacing: 0;
```

**Usage:** Primary body text, paragraphs

#### Body Small
```css
--text-body-sm-size: 14px;
--text-body-sm-weight: 400 (Normal);
--text-body-sm-line-height: 1.43;
--text-body-sm-letter-spacing: 0;
```

**Usage:** Secondary text, descriptions

#### Label
```css
--text-label-size: 14px;
--text-label-weight: 500 (Medium);
--text-label-line-height: 1.43;
--text-label-letter-spacing: 0.02em;
```

**Usage:** Form labels, button text

#### Caption
```css
--text-caption-size: 12px;
--text-caption-weight: 400 (Normal);
--text-caption-line-height: 1.33;
--text-caption-letter-spacing: 0.01em;
```

**Usage:** Metadata, timestamps, help text

---

## Spacing Scale

Based on 4px base unit for consistent rhythm.

| Variable | Value | Use Case |
|----------|-------|----------|
| `--spacing-xs` | 4px | Minimal spacing, micro interactions |
| `--spacing-sm` | 8px | Small gaps between elements |
| `--spacing-md` | 12px | Standard component spacing |
| `--spacing-base` | 16px | Default page padding, form gaps |
| `--spacing-lg` | 24px | Card padding, section spacing |
| `--spacing-xl` | 32px | Large section spacing |
| `--spacing-2xl` | 48px | Major section breaks |
| `--spacing-3xl` | 64px | Page-level sections |

### Component Spacing Presets

| Variable | Default | Usage |
|----------|---------|-------|
| `--padding-page` | 16px | Page horizontal padding |
| `--padding-card` | 24px | Card internal padding |
| `--padding-input` | 12px | Form input padding |
| `--padding-button` | 12px 16px | Button internal spacing |
| `--gap-component` | 12px | Gap within components |
| `--gap-section` | 24px | Gap between sections |
| `--gap-page` | 32px | Gap between page sections |

---

## Border & Radius

### Border Radius

| Variable | Value | Use Case |
|----------|-------|----------|
| `--border-radius-sm` | 4px | Slight rounded corners |
| `--border-radius-md` | 8px | Standard button/input radius |
| `--border-radius-lg` | 12px | Card and modal radius |
| `--border-radius-xl` | 16px | Large component radius |
| `--border-radius-full` | 9999px | Fully rounded (pills) |

### Border Width

| Variable | Value |
|----------|-------|
| `--border-width-thin` | 1px |
| `--border-width-base` | 1px |
| `--border-width-thick` | 2px |

---

## Shadows

### Shadow Elevation System

| Variable | Value | Use Case |
|----------|-------|----------|
| `--shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| `--shadow-md` | 0 4px 6px rgba(0,0,0,0.1) | Standard shadow |
| `--shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | Medium elevation |
| `--shadow-xl` | 0 20px 25px rgba(0,0,0,0.1) | Large elevation |

**Note:** In dark mode, shadow opacity is increased for better visibility.

---

## Transitions & Animations

| Variable | Value | Use Case |
|----------|-------|----------|
| `--transition-fast` | 150ms ease-out | Quick micro-interactions |
| `--transition-base` | 200ms ease-out | Standard transitions |
| `--transition-slow` | 300ms ease-out | Deliberate animations |

---

## Z-Index Scale

| Variable | Value | Purpose |
|----------|-------|---------|
| `--z-dropdown` | 1000 | Dropdown menus |
| `--z-modal` | 1050 | Modal dialogs |
| `--z-tooltip` | 1100 | Tooltips |
| `--z-notification` | 1200 | Toast notifications |

---

## CSS Classes

### Typography Classes

```html
<!-- Headings -->
<h1 class="h1">Main Title</h1>
<h2 class="h2">Section Title</h2>
<h3 class="h3">Subsection</h3>
<h4 class="h4">Minor Title</h4>

<!-- Body Text -->
<p class="body">Regular paragraph</p>
<p class="body-sm">Smaller text</p>
<label class="label">Form Label</label>
<p class="caption">Small caption text</p>
```

### Spacing Classes

```html
<!-- Margin -->
<div class="m-base">Margin all sides</div>
<div class="mx-lg">Horizontal margin</div>
<div class="my-md">Vertical margin</div>
<div class="mt-base">Margin top</div>
<div class="mb-lg">Margin bottom</div>

<!-- Padding -->
<div class="p-lg">Padding all sides</div>
<div class="px-base">Horizontal padding</div>
<div class="py-md">Vertical padding</div>

<!-- Gap -->
<div class="flex gap-md">Flex gap</div>
<div class="grid grid-md">Grid gap</div>
```

### Grid Classes

```html
<!-- Grid Layout -->
<div class="grid grid-cols-2 grid-md">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- Responsive -->
<div class="grid grid-cols-4 grid-md">
  <!-- Becomes 1 column on mobile, 4 on desktop -->
</div>
```

### Color Classes

```html
<!-- Text Color -->
<p class="text-primary">Primary text</p>
<p class="text-secondary">Secondary text</p>
<p class="text-success">Success message</p>
<p class="text-error">Error message</p>
<p class="text-warning">Warning message</p>

<!-- Background Color -->
<div class="bg-primary">Primary background</div>
<div class="bg-secondary">Secondary background</div>

<!-- Border Color -->
<div class="border border-primary">Primary border</div>
```

### Component Classes

```html
<!-- Rounded Corners -->
<div class="rounded-md">Standard radius</div>
<div class="rounded-lg">Large radius</div>
<div class="rounded-full">Fully rounded</div>

<!-- Shadows -->
<div class="shadow-md">Standard shadow</div>
<div class="shadow-lg">Large shadow</div>
```

---

## Theme Toggle

### Implementation

The design system includes automatic theme switching with localStorage persistence.

**Automatic Detection:**
- Respects system preference (prefers-color-scheme media query)
- Falls back to light mode if no preference

**Manual Toggle:**
Use the `ThemeToggle` component in any layout:

```tsx
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

### Theme Management

Use the `useTheme` hook to access and manage theme:

```tsx
import { useTheme } from '@/components/theme-toggle';

export function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
    </>
  );
}
```

### Theme Utilities

Direct theme management in utilities:

```ts
import { getTheme, setTheme, toggleTheme } from '@/lib/theme';

// Get current theme
const current = getTheme(); // 'light' | 'dark' | 'system'

// Set theme
setTheme('dark');

// Toggle between light and dark
toggleTheme();
```

---

## Color Reference Chart

### Light Mode Palette
```
Primary:          #000000 (Black)
Secondary:        #666666 (Gray)
Background:       #FFFFFF (White)
Text:             #000000 (Black)
Border:           #E0E0E0 (Light Gray)
Success:          #10B981 (Green)
Warning:          #F59E0B (Amber)
Error:            #EF4444 (Red)
Info:             #3B82F6 (Blue)
```

### Dark Mode Palette
```
Primary:          #FFFFFF (White)
Secondary:        #999999 (Light Gray)
Background:       #0F0F0F (Very Dark)
Text:             #FFFFFF (White)
Border:           #2D2D2D (Dark Gray)
Success:          #10B981 (Green) [unchanged]
Warning:          #F59E0B (Amber) [unchanged]
Error:            #EF4444 (Red) [unchanged]
Info:             #3B82F6 (Blue) [unchanged]
```

---

## Usage Examples

### Card Component

```tsx
<div className="rounded-lg bg-secondary p-lg shadow-md">
  <h3 className="h3 mb-md">Card Title</h3>
  <p className="body text-secondary">Card content goes here</p>
</div>
```

### Button

```tsx
<button className="rounded-md bg-primary px-base py-md text-white">
  <span className="label">Click Me</span>
</button>
```

### Form Input

```tsx
<div className="flex flex-col gap-md">
  <label className="label">Email Address</label>
  <input
    type="email"
    className="rounded-md border border-primary px-base py-md"
    placeholder="Enter your email"
  />
</div>
```

### Grid Layout

```tsx
<div className="grid grid-cols-3 grid-lg p-base">
  <div className="rounded-lg bg-secondary p-lg">Item 1</div>
  <div className="rounded-lg bg-secondary p-lg">Item 2</div>
  <div className="rounded-lg bg-secondary p-lg">Item 3</div>
</div>
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `app/globals.css` | All CSS variables, utility classes, base styles |
| `src/lib/theme.ts` | Theme management utilities and hooks |
| `src/components/theme-toggle.tsx` | Theme toggle button and useTheme hook |

---

## Accessibility

- ✅ WCAG AA contrast ratios maintained
- ✅ High contrast in both light and dark modes
- ✅ Semantic HTML used throughout
- ✅ Focus states visible on all interactive elements
- ✅ Respects prefers-reduced-motion if needed

---

## Browser Support

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

---

## Next Steps

1. ✅ Design system tokens created
2. ✅ Typography scale implemented
3. ✅ Spacing utilities added
4. ✅ Theme toggle functionality
5. → Phase 1.6: Create reusable UI components using these tokens
