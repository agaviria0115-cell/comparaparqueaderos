# UI System — Comparaparqueaderos

This document defines the global UI rules.
All pages and components must follow this system.
No page-specific styling exceptions are allowed.

---

## 1. Typography

- H1: Page title (ONE per page)
- H2: Section titles
- H3: Card titles
- p: Body text
- small: Metadata (dates, counts, notes)

Rules:
- No custom font sizes per page
- No inline styles
- Spacing handled via utilities only

---

## 2. Buttons

There are only three button types:

1. Primary — main CTA
2. Secondary — supporting actions
3. Link — navigation-style actions

Rules:
- Same padding everywhere
- Same border radius everywhere
- Buttons must be <button> or <a>
- No div buttons

---

## 3. Cards

All cards share the same structure:

- Title
- Key value (price / stat)
- Feature list
- CTA link

Rules:
- Cards are not fully clickable by default
- CTA must be a real link
- No hover-only content

---

## 4. Spacing System

Allowed spacing scale only:
- 2
- 4
- 6
- 10

Rules:
- No arbitrary margins
- No pixel values
- No inline spacing

---

## 5. Colors

Only use:
- Text
- Muted text
- Primary accent
- Border
- Background

Rules:
- No gradients
- No color-only meaning
- Must remain readable without color

---

## 6. Layout

All pages follow:
1. Page header
2. Main content
3. Supporting sections
4. Footer

Rules:
- Single max-width for content
- No page-specific widths

---

## 7. SEO & Accessibility

- One H1 per page
- All navigation uses <a>
- Content visible without JS
- No modal-only content
