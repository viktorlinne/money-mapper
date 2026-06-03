---
name: MoneyMapper
description: Personal finance dashboard. Precise, minimal, honest. Vibrant Pulse direction.
colors:
  accent: "#0062ff"
  accent-deep: "#0051d4"
  accent-focus-ring: "#bfdbfe"
  canvas: "oklch(0.975 0.012 280)"
  surface: "#ffffff"
  surface-low: "oklch(0.987 0.007 280)"
  ink: "oklch(0.12 0.02 264)"
  ink-secondary: "oklch(0.42 0.04 264)"
  ink-muted: "oklch(0.55 0.03 264)"
  ink-label: "oklch(0.35 0.04 264)"
  border: "oklch(0.895 0.016 268)"
  positive: "#059669"
  negative: "#e11d48"
  negative-bg: "#fff1f2"
  negative-border: "#fecdd3"
  negative-text: "#be123c"
  chart-blue: "#0062ff"
  chart-violet: "#7c3aed"
  chart-teal: "#0d9488"
  chart-amber: "#d97706"
typography:
  fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif"
  display:
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  title:
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "20px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
    textColor: "{colors.surface}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    padding: "4px 8px"
  button-ghost-hover:
    backgroundColor: "{colors.negative-bg}"
    textColor: "{colors.negative}"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

# Design System: MoneyMapper

## 1. Overview

**Creative North Star: "Vibrant Precision"**

MoneyMapper is a tool for one person who knows their data. The interface must stay out of the way while making numbers immediately readable. The Vibrant Pulse direction adds typographic character and a bolder primary color without compromising the analytical core. Nothing celebrates, nothing encourages, nothing softens. It is a focused instrument with a distinct visual identity.

This system rejects four failure modes by name: the consumer-finance softness of Mint and YNAB (pastel palettes, rounded-everything, hand-holding copy); the inflated hype of Robinhood (green gradients, gamified tracking, portfolio value as scoreboard); the generic SaaS dashboard template (cool-gray background, white cards with gray borders, indigo accent on everything, assembled rather than designed); and banking-app sterility (corporate, institutional, zero craft).

The Vibrant Pulse integration: Montserrat replaces the system font, giving financial figures crisp geometric character. The #0062ff blue displaces the generic SaaS indigo. The blue-violet canvas (#faf8ff family) reads as distinctly tool-native rather than warm-neutral AI default. A tighter radius system (8px/12px) sharpens the interface. Violet and teal join the chart palette as supporting series colors only.

**Key Characteristics:**
- Montserrat throughout; geometry that serves numbers, not personality
- Structural borders define containers; shadows only on floating elements
- Semantic color for financial meaning only (green = income, red = expense, never decorative)
- One action accent (Vibrant Blue) on less than 10% of any screen
- 8px radius for interactive controls; 12px for cards and containers
- Data density is a feature, not a problem to manage

## 2. Colors: The Vibrant Pulse Palette

Restrained strategy. One action accent, two semantic colors for financial meaning, neutral blues for every surface and text role. Color carries meaning; it is never decorative.

### Primary
- **Vibrant Blue** (`#0062ff`): The single action color. Primary buttons, active form borders, focus rings, header wordmark accent. Appears on no more than 10% of any screen. More saturated and distinctive than generic indigo; its scarcity is its authority.
- **Deep Blue** (`#0051d4`): Hover state for Vibrant Blue elements only.
- **Blue Mist** (`#bfdbfe`): Focus ring shadow. Not a background color; only used layered under a focused element's border.

### Neutral
- **Pulse Canvas** (`oklch(0.975 0.012 280)`): Page background. Blue-violet tinted near-white that is clearly in the cool/blue family, not the warm-neutral AI default. The workbench has a signature.
- **Elevated White** (`#ffffff`): Card and container backgrounds. Pure white stands out against the tinted canvas.
- **Inset Surface** (`oklch(0.987 0.007 280)`): Transaction rows and secondary panels nested within cards. One step below white; the same hue as canvas at near-full lightness.
- **Deep Ink** (`oklch(0.12 0.02 264)`): Headings, primary data, transaction titles. Near-black with a very subtle blue cast that harmonizes with the canvas.
- **Ink Secondary** (`oklch(0.42 0.04 264)`): Body text and descriptions.
- **Ink Muted** (`oklch(0.55 0.03 264)`): Helper text, timestamps, metadata, chart axis labels.
- **Ink Label** (`oklch(0.35 0.04 264)`): Form field labels. Slightly darker than Ink Muted to distinguish labels from helper text.
- **Structure Line** (`oklch(0.895 0.016 268)`): Card borders and input strokes. Blue-tinted to match the canvas's hue, not a neutral gray.

### Semantic
- **Signal Green** (`#059669`): Income amounts and positive balances. No other use.
- **Deficit Red** (`#e11d48`): Expense amounts, error states, destructive action hover. No other use.
- **Alert Tint** (`#fff1f2`): Background for error banners and containers.
- **Alert Border** (`#fecdd3`): Border for error banners.
- **Alert Text** (`#be123c`): Error message copy.

### Chart Series Palette
These are used only in Chart.js datasets, never in UI chrome. Colors are chosen to complement the Vibrant Blue at comparable saturation.

- **Blue** (`#0062ff`): Primary series, balance line.
- **Violet** (`#7c3aed`): Secondary series. Harmonizes with the blue-violet canvas hue.
- **Teal** (`#0d9488`): Tertiary series.
- **Amber** (`#d97706`): Quaternary series, budget baselines.
- **Signal Green** (`#059669`): Income datasets.
- **Deficit Red** (`#e11d48`): Expense datasets.

### Named Rules

**The One Voice Rule.** Vibrant Blue appears on a maximum of 10% of any screen. Reserved for the primary CTA, active input borders, and focus rings. Never on decorative elements, section headings, background fills, or multiple chart series.

**The Semantic Pledge.** Signal Green means income. Deficit Red means expense or error. These two colors are never repurposed for generic success/warning states unrelated to financial values.

**The Hue Harmony Rule.** Neutral surfaces (canvas, surface-low, structure borders) share the blue-violet hue family of the accent. This is what makes the palette feel like a system rather than assembled parts. Do not introduce warm-tinted surfaces without reconsidering the full palette.

## 3. Typography: Montserrat

**Font:** Montserrat — loaded via Google Fonts, weights 400/500/600/700.

**Character:** Geometric sans-serif. Montserrat's clean letterforms render financial figures with precision; number characters are distinct and unambiguous at small sizes. The typeface has personality without imposing it. Hierarchy is built through scale and weight contrast within the single family.

### Hierarchy

- **Display** (700, 1.875rem/30px, -0.02em letter-spacing, line-height 1.2): Page title. One instance per dashboard view.
- **Headline** (700, 1.5rem/24px, line-height 1.3): Primary financial figures in stat cards (balance, income, expenses). The number is the headline.
- **Title** (600, 1.25rem/20px, line-height 1.4): Section headings and card anchors. Weight 600 contrasts below Display without competing with Headline figures.
- **Body** (400/500, 1rem/16px, line-height 1.5): Transaction titles (500), form input values (400), prose descriptions. Max line length 65ch for prose blocks.
- **Label** (500, 0.875rem/14px, line-height 1.4): Form labels, helper text, metadata, category tags, chart axis labels.

### Named Rules

**The Number Priority Rule.** Financial amounts always render at 700 weight minimum. Never display a key figure at regular weight. `tabular-nums` is always applied to currency figures to prevent layout shift.

**The One Scale Rule.** Five steps, nothing outside them. No ad-hoc font sizes.

## 4. Elevation: Flat with Structural Borders

This system is flat-by-default. Depth is communicated through background color steps and structural borders, not shadows. Three visible layers:

1. **Pulse Canvas** (`oklch(0.975 0.012 280)`): the page field
2. **Elevated White** (`#ffffff`): cards, forms, and containers
3. **Inset Surface** (`oklch(0.987 0.007 280)`): content nested within cards (transaction rows, option groups)

### Shadow Vocabulary

- **Float** (`0 4px 16px rgba(0, 0, 0, 0.10)`): Floating elements only. Dropdowns, tooltips, popovers. Never on containers at rest.

### Named Rules

**The Flat-By-Default Rule.** No surface carries a shadow at rest. An element earns a shadow when it needs to visually detach from the page (dropdown, tooltip, modal). Nothing else.

## 5. Components

### Buttons

Character: compact, precise. 8px radius reads more tool-like than the previous 12px; less consumer, more instrument.

- **Shape:** 8px radius. Deliberate tightening from the BRAND.md ROUND_EIGHT standard.
- **Primary:** Vibrant Blue background (`#0062ff`), white text, 10px/16px padding. White text on #0062ff has 4.9:1 contrast (AA large text). Full-width inside forms where it is the only CTA.
- **Hover:** Deep Blue (`#0051d4`). 150ms ease-out transition.
- **Focus:** 2px Vibrant Blue outline + 3px Blue Mist ring.
- **Ghost/Danger:** Transparent, Ink Muted text, 4px/8px padding. On hover: Alert Tint background, Deficit Red text.
- **Disabled:** opacity 0.4, pointer-events none.

### Inputs / Fields

Character: clearly bounded, 8px radius aligns with buttons — everything interactive shares the same corner vocabulary.

- **Style:** Elevated White background, Structure Line stroke (1px), 8px radius.
- **Label:** Ink Label color, 500 weight, 14px. Always above the field. Never inside as a disappearing placeholder.
- **Placeholder:** `oklch(0.72 0.02 264)` — hints without demanding attention.
- **Focus:** Border shifts to Vibrant Blue, 3px Blue Mist shadow ring. 150ms transition.
- **Error:** Border shifts to Deficit Red, Alert Tint background.

### Cards / Containers

Character: structural containers. 12px radius is crisper than the previous 16px; still approachable but more precise.

- **Corner Style:** 12px radius. Consistent across all primary containers.
- **Background:** Elevated White (`#ffffff`).
- **Shadow Strategy:** None at rest.
- **Border:** 1px Structure Line (`oklch(0.895 0.016 268)`).
- **Internal Padding:** 20px.
- **Nested content:** Inset Surface background for rows and groups inside a card. Never a second white card inside a card.

### Transaction Row (Signature Component)

- **Container:** Inset Surface, 8px radius, 16px padding.
- **Left column:** Title at Body/500/Deep Ink above; category, date, type at Label/Ink Muted below.
- **Right column:** Amount at Body/600, Signal Green or Deficit Red. Ghost/Danger delete button to the right.

### Dashboard Stat Card (Signature Component)

- **Structure:** Three stacked lines: label (Label/500/Ink Muted), value (Headline/700/Deep Ink), helper (Label/400/Ink Muted).
- **Value** always renders visually larger than any surrounding heading. The metric is the anchor.
- **Animation:** Framer-motion entrance (opacity 0→1, y 10→0, 300ms ease-out). Reduced-motion: instant render.

### Navigation

Top bar. MoneyMapper wordmark in Montserrat 700. No sidebar unless the information architecture requires persistent secondary navigation.

## 6. Do's and Don'ts

### Do:
- **Do** use Signal Green and Deficit Red exclusively for financial values. These colors carry meaning; their consistency is the system.
- **Do** use Vibrant Blue on a maximum of one prominent interactive element per viewport.
- **Do** keep form labels as persistent text above the field (Ink Label, 500 weight, 14px).
- **Do** use 8px radius for all interactive controls (inputs, buttons, chips) and 12px for containers (cards, panels).
- **Do** add a `prefers-reduced-motion` fallback for every animation.
- **Do** render financial figures at 700 weight with `tabular-nums`.
- **Do** keep the canvas and surface-low colors in the same blue-violet hue family as the accent.

### Don't:
- **Don't** replace the Vibrant Blue with indigo or any other accent without updating the full hue-harmony chain (canvas tint, border tint, ring color all derive from the accent hue).
- **Don't** introduce warm-tinted (cream, sand, beige) backgrounds. The canvas is specifically blue-violet to distinguish MoneyMapper from the warm-neutral AI default.
- **Don't** use gradient text on financial figures.
- **Don't** use `border-left` wider than 1px as a colored stripe.
- **Don't** apply shadows to surfaces at rest.
- **Don't** use Vibrant Blue on headings, section dividers, or chart series colors.
- **Don't** add a second accent color without verifying Signal Green or Deficit Red cannot carry the semantic role.
- **Don't** use Mint/YNAB pastel fills or celebratory microcopy.
- **Don't** use Robinhood-style gradient fills on positive amounts.
