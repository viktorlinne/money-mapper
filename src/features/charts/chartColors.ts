// Canonical hex values for Chart.js datasets, derived from the design token system.
// CSS variables can't be used in Canvas-based charts, so these must stay in sync
// with the tokens in index.css / DESIGN.md.
export const CHART_COLORS = {
  positive: "#059669",  // emerald-600  — income, positive balances
  negative: "#e11d48",  // rose-600     — expenses, negative amounts
  accent: "#0062ff",    // vibrant-blue — balance line, primary series
  violet: "#7c3aed",    // violet-700   — secondary series
  teal: "#0d9488",      // teal-600     — tertiary series
  amber: "#d97706",     // amber-600    — budget baselines, quaternary series
  structure: "#dde1ef", // blue-tinted  — grid lines, dividers
  muted: "#6b6f8a",     // blue-ink     — secondary labels
} as const;
