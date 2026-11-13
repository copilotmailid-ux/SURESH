---
name: Warm Precision Hospitality
colors:
  surface: '#fff8f4'
  surface-dim: '#e3d8ce'
  surface-bright: '#fff8f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fdf2e7'
  surface-container: '#f7ece2'
  surface-container-high: '#f2e6dc'
  surface-container-highest: '#ece1d7'
  on-surface: '#201b15'
  on-surface-variant: '#504441'
  inverse-surface: '#352f29'
  inverse-on-surface: '#faefe5'
  outline: '#827470'
  outline-variant: '#d4c3be'
  surface-tint: '#78574c'
  primary: '#321911'
  on-primary: '#ffffff'
  primary-container: '#4a2e25'
  on-primary-container: '#bd9588'
  inverse-primary: '#e8bdb0'
  secondary: '#625e57'
  on-secondary: '#ffffff'
  secondary-container: '#e8e2d9'
  on-secondary-container: '#68645d'
  tertiary: '#321a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#502c00'
  on-tertiary-container: '#d98c35'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd0'
  primary-fixed-dim: '#e8bdb0'
  on-primary-fixed: '#2d150d'
  on-primary-fixed-variant: '#5e3f36'
  secondary-fixed: '#e8e2d9'
  secondary-fixed-dim: '#ccc6bd'
  on-secondary-fixed: '#1e1b16'
  on-secondary-fixed-variant: '#4a4640'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#ffb86f'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#693c00'
  background: '#fff8f4'
  on-background: '#201b15'
  surface-variant: '#ece1d7'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
  tabular-stat:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered specifically for fast-paced, high-stress hospitality environments spanning handheld devices on the cafe floor to wall-mounted Kitchen Display Systems (KDS) and high-density tablet dashboards for store managers.

### Personality & Values
- **Warm Authority:** Grounds the artisanal elegance of coffee culture through deep roast and cream hues, paired with the operational rigor expected of mission-critical Point of Sale (POS) and inventory workflows.
- **Cognitive Clarity:** Reduces visual fatigue during long split shifts. High-contrast indicators and dedicated visual lanes guarantee legible status parsing from arms-length or across kitchen prep stations.
- **Physical Responsiveness:** Translates tactile hospitality into instant digital affordances with generous interactive touch targets, rapid-state color feedback, and dense informational tables.

### Design Movement
**Refined Contemporary Hospitality (Warm Minimalist Utility):** Blends the structured typography and border control of Modernist Swiss design with warm, organic hospitality tones. Elevation relies on subtle warm-tinted ambient glows rather than cold industrial drops, framing interactions cleanly without visual noise.

## Colors

The palette balances warm organic cafe tones with functional operational feedback loops. Every state token guarantees a minimum 4.5:1 contrast ratio against light backdrop containers.

### Core Roles
- **Primary (`#4A2E25`):** Deep roasted chocolate. Used for dominant operational surfaces, primary action buttons, key header texts, and high-priority order identifiers.
- **Secondary (`#FFF8EF`):** Steamed warm cream. Applied to selected navigation indicators, active table card highlights, and contrasting containers against primary backgrounds.
- **Tertiary / Accent (`#E99A42`):** Vibrant caramelized orange. Highlights action items requiring intervention, pending status flags, checkout CTAs, and active notifications.
- **Neutral (`#736B63`):** Warm roasted taupe. Used for secondary metadata, tabular column dividers, and secondary body labels.

### Canvas & Surfaces
- **Canvas Base:** `#FDFBF7` (Alabaster Linen).
- **Surface Cards:** `#FFFFFF` (Pure White).
- **Surface Muted:** `#F5EFE6` (Warm Oat, for disabled states and nested container backgrounds).
- **Border Subtle:** `#E8DEC8` with 60% opacity for delicate, tactile separation.

### Status Semantic System
- **Available (Success/Fresh):** `#10B981` (Emerald). Signals empty tables, in-stock inventory, and ready registers.
- **In Progress / Seated:** `#3B82F6` (Slate Blue). Highlights occupied tables and active waiter tabs.
- **Preparing (Kitchen Active):** `#F59E0B` (Amber). Denotes active cooking timers and line prep bottlenecks.
- **Ready to Serve:** `#E99A42` (Warm Orange). Denotes plated meals waiting for runner dispatch.
- **Billing / Action Required (Urgent):** `#EF4444` (Crimson Red). Applied to unsettled bills, delayed tickets, and void approvals.

## Typography

Inter serves as the primary typographic engine, leveraging its neutral geometry, large x-height, and precise tabular figure controls (`tnum`, `cv05`) essential for currency tallies (₹ INR) and operational ticket countdown timers.

### Metric & Operational Rules
- **Tabular Numerics:** Enable OpenType tabular figures (`font-variant-numeric: tabular-nums`) across all prices, quantity counter inputs, split-ticket percentages, and live kitchen timestamps. This prevents layout jitter during dynamic timer ticks.
- **Hierarchy in High Rush:** Currency values must always render with bold weight (`700`) paired with distinct label descriptions underneath.
- **Legibility at Distance:** Kitchen Display screens require a minimum base text size of `headline-sm` (18px) for standard order line items to remain readable at a distance of 1.5 meters.

## Layout & Spacing

The layout is built upon an adaptable 8pt coordinate grid tailored to high-frequency tap interactions across smartphones, handheld POS terminals, and landscape tablet docks.

### Screen Adaptations
- **Mobile (Handheld Waiter Terminal, < 600px):**
  - Single-column continuous feed with fixed bottom action sheet for fast cart access.
  - Outer margins set to `margin` (1rem / 16px).
  - Minimum touch target height of 48px across all table buttons and line item counters.
- **Tablet (Kitchen Display & Cashier POS, 600px - 1024px):**
  - 12-column adaptive fluid grid.
  - Cashier view uses a 7:5 split (7 columns for catalog browsing/table floor plan, 5 columns for persistent bill summary and split payments).
  - KDS layout switches to a multi-column kanban layout with horizontal scroll and a persistent `1.5rem` gutter.
- **Desktop / Admin Hub (> 1024px):**
  - Fixed-width collapsible primary navigation bar with a responsive 12-column master data view.
  - Outer margin expands to `margin-desktop` (2rem / 32px).

## Elevation & Depth

Visual hierarchy uses warm, low-contrast shadows paired with delicate border enclosures to avoid cold grey cast shadows.

### Ambient Shadow Hierarchy
- **Level 0 (Flat / Canvas):** Applied to root page containers (`#FDFBF7`). No shadow. Delimited by 1px solid `#E8DEC8` with 40% opacity.
- **Level 1 (Resting Cards & Table Tiles):** Pure white surfaces resting over linen.
  - Shadow: `0 2px 6px -1px rgba(74, 46, 37, 0.05), 0 1px 3px 0 rgba(74, 46, 37, 0.03)`
  - Border: 1px solid `#E8DEC8` with 60% opacity.
- **Level 2 (Active Cards & Kitchen Alert Tickets):** Elevated state when dragging tables or prioritizing KDS orders.
  - Shadow: `0 8px 18px -4px rgba(74, 46, 37, 0.08), 0 4px 8px -2px rgba(74, 46, 37, 0.04)`
  - Border: 1px solid `#E99A42` (when highlighted) or `#E8DEC8`.
- **Level 3 (Modals, Payment Sheets & Slide-over Drawers):** High-priority operational modals.
  - Shadow: `0 20px 30px -8px rgba(74, 46, 37, 0.16), 0 10px 14px -4px rgba(74, 46, 37, 0.06)`
  - Backdrop Blur: `backdrop-filter: blur(4px)` with background `rgba(74, 46, 37, 0.3)`.

## Shapes

The design system incorporates a balanced, friendly geometric radius (Value `2`: Base 8px / 0.5rem), softening high-density POS views while retaining structural discipline.

### Geometric Rules
- **Base Elements (Buttons, Inputs, Table Cells):** 8px (`0.5rem`).
- **Cards & Modals (`rounded-lg`):** 16px (`1rem`).
- **Drawer Panels & Display Sheets (`rounded-xl`):** 24px (`1.5rem`).
- **Status Badges & Quick Counter Pills:** Completely rounded pills (`9999px`) to distinguish actionable metadata from square input regions.

## Components

### Buttons
- **Primary:** Background `#4A2E25`, Text `#FFFFFF`, font weight `600`. Height 48px (Mobile/Tablet POS), 40px (Desktop Admin). Pressed state transitions to `#36211B`.
- **Secondary:** Background `#FFF8EF`, Text `#4A2E25`, border 1px solid `#E8DEC8`. Hover transitions to `#F5EFE6`.
- **Accent (Payment/Fire Order):** Background `#E99A42`, Text `#FFFFFF`. Provides an immediate eye anchor for key transaction milestones.
- **Destructive (Void/Cancel Ticket):** Background `#FEE2E2`, Text `#EF4444`, border 1px solid `#FCA5A5`.

### Table Status Badges
Rendered as pill shapes with uppercase micro-labels (`label-sm`), featuring high-contrast light backgrounds and solid status dot indicators:
- **Available:** Background `#ECFDF5`, text `#065F46`, dot indicator `#10B981`.
- **In Progress (Seated):** Background `#EFF6FF`, text `#1E40AF`, dot indicator `#3B82F6`.
- **Preparing (Kitchen):** Background `#FEF3C7`, text `#92400E`, dot indicator `#F59E0B`. Includes pulsating animation if cooking time exceeds threshold.
- **Ready to Serve:** Background `#FFF7ED`, text `#9A3412`, dot indicator `#E99A42`.
- **Billing:** Background `#FEF2F2`, text `#991B1B`, dot indicator `#EF4444`.

### Cards & Table Floorplan Nodes
- Base background `#FFFFFF` with Level 1 elevation.
- Includes a top accent stripe (3px) matching the table's active state color.
- Contains table number, server initials, elapsed seat time (in tabular numerals), and real-time total in ₹ INR.

### Input Fields & Steppers
- Height 48px with inner horizontal padding of `space-md` (1rem).
- Border: 1px solid `#E8DEC8`, background `#FFFFFF`. Active focus changes border to `#4A2E25` with a 2px `#FFF8EF` outer ring.
- Numeric steppers for item count (+ / -) feature minimum touch areas of 44x44px with a centered tabular numeral.

### Kitchen Display Tickets (KDS Cards)
- Header indicates order type (Dine-in / Takeaway / Delivery) with a dynamic elapsed duration counter.
- Items feature completed-strikeout toggle states on individual ingredient modifiers.
- Urgent overdue tickets (>15 mins) pulse with a subtle crimson border.

### Currency Displays
- All prices use the official symbol `₹` alongside tabular numbers with comma grouping (e.g., `₹1,450.00`). Decimals scale down to `12px` font size when screen space is constrained.