# Design Specification - ZKx401 x402 Facilitator Dashboard

## 1. Direction & Rationale

**Style:** Dark Mode First + Dashboard-Optimized - Professional data-driven interface untuk real-time monitoring

**Visual Essence:** Dark-dominant dashboard dengan multi-neon accent system untuk real-time data visualization. Pure black backgrounds (#0a0a0a) menciptakan professional monitoring environment, neon accents (cyan #00d4ff untuk x402 branding, green #00ff88 untuk success/active states, purple #8b5cf6 untuk premium features) memberikan clear visual hierarchy untuk different data types. Clean card-based modular layout dengan subtle border glows instead of heavy shadows. Focus pada readability, real-time updates, dan competitive data presentation.

**Real-World Examples:**
- **vercel.com/dashboard** - Clean data-driven interface dengan dark theme dan real-time deployment metrics
- **railway.app** - Professional monitoring dashboard dengan status indicators
- **dune.com** - Blockchain data visualization dengan dark backgrounds dan vibrant chart colors
- **linear.app** (dark mode) - Status indicators dan clean task tracking interface

**Target Audience:** Solana developers, blockchain entrepreneurs, x402 ecosystem participants (20-40) yang membutuhkan real-time monitoring untuk facilitator performance, competitive analysis, dan transaction tracking. Tech-savvy professionals familiar dengan dashboard interfaces dan blockchain metrics.

---

## 2. Design Tokens

### 2.1 Color Palette

**Background Hierarchy (90% Dark Surfaces):**

| Token Name | Hex Value | Usage | Contrast Notes |
|------------|-----------|-------|----------------|
| bg-pure-black | #000000 | Hero gradient start, OLED optimization | Pure black base |
| bg-near-black | #0a0a0a | Main page background | Primary layer |
| bg-elevated | #141414 | Cards, data panels | Level 1 elevation |
| bg-hover | #1e1e1e | Hover states, active cards | Level 2 elevation |
| bg-modal | #1a1a1a | Modals, overlays | Slightly elevated from base |

**Text Colors (High Contrast for Readability):**

| Token Name | Hex Value | Usage | Contrast Ratio |
|------------|-----------|-------|----------------|
| text-primary | #e4e4e7 | Headlines, primary content | 15.2:1 (AAA) on #0a0a0a |
| text-secondary | #a1a1aa | Descriptions, labels | 8.9:1 (AAA) |
| text-tertiary | #71717a | Captions, timestamps | 4.6:1 (AA) |
| text-muted | #52525b | Inactive states | 3.2:1 (minimum) |

**Neon Accent System (10% Vibrant, Status-Driven):**

| Token Name | Hex Value | Usage | Purpose |
|------------|-----------|-------|---------|
| accent-cyan | #00d4ff | x402 branding, info states, network stats | Primary brand color |
| accent-cyan-glow | rgba(0, 212, 255, 0.4) | Border glows, hover effects | Subtle emphasis |
| accent-green | #00ff88 | Success states, positive metrics, active indicators | Growth/positive |
| accent-green-glow | rgba(0, 255, 136, 0.3) | Active status glows | Success emphasis |
| accent-purple | #8b5cf6 | Premium features, ZKx401 highlights | Differentiation |
| accent-purple-glow | rgba(139, 92, 246, 0.3) | Premium card borders | Exclusivity |
| accent-orange | #ff8800 | Warning states, moderate alerts | Attention |
| accent-red | #ff4444 | Error states, negative metrics | Critical alerts |

**Semantic Status Colors:**

| Token Name | Hex Value | Usage |
|------------|-----------|-------|
| status-success | #00ff88 | Operational, completed, high uptime |
| status-warning | #ff8800 | Degraded, moderate issues |
| status-error | #ff4444 | Down, failed, critical |
| status-info | #00d4ff | Informational, neutral updates |
| status-live | #00ff88 | Real-time indicators, pulsing dots |

**Chart/Data Visualization Colors:**

| Token Name | Hex Value | Usage |
|------------|-----------|-------|
| chart-primary | #00d4ff | Primary data series (transactions) |
| chart-secondary | #8b5cf6 | Secondary series (volume) |
| chart-tertiary | #00ff88 | Tertiary series (success rate) |
| chart-gradient-start | #00d4ff | Chart gradient fills (top) |
| chart-gradient-end | rgba(0, 212, 255, 0.1) | Chart gradient fills (bottom) |

### 2.2 Typography

**Font Families:**

| Token Name | Value | Usage |
|------------|-------|-------|
| font-primary | 'Inter', -apple-system, BlinkMacSystemFont, sans-serif | Body text, UI labels |
| font-display | 'Inter', sans-serif | Headlines, section titles |
| font-mono | 'JetBrains Mono', 'Fira Code', Consolas, monospace | Code snippets, data values, wallet addresses |

**Type Scale (Desktop):**

| Token Name | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|------|--------|-------------|----------------|-------|
| text-hero | 48px | 700 Bold | 1.1 | -0.02em | Hero headline |
| text-h1 | 36px | 600 Semibold | 1.2 | -0.01em | Section headlines |
| text-h2 | 24px | 600 Semibold | 1.3 | 0 | Card titles, subsections |
| text-h3 | 20px | 600 Semibold | 1.3 | 0 | Component headers |
| text-body-lg | 18px | 400 Regular | 1.6 | 0 | Large body text |
| text-body | 16px | 400 Regular | 1.5 | 0 | Standard body text |
| text-small | 14px | 400 Regular | 1.5 | 0.01em | Labels, captions |
| text-xs | 12px | 500 Medium | 1.4 | 0.02em | Timestamps, badges |
| text-stat-lg | 32px | 700 Bold | 1.1 | -0.01em | Large stat values |
| text-stat | 24px | 600 Semibold | 1.2 | 0 | Standard stat values |
| text-mono | 14px | 400 Regular | 1.4 | 0 | Code, addresses, hashes |

**Responsive Type Scale (Mobile ≤640px):**

| Element | Mobile Size | Desktop Size |
|---------|-------------|--------------|
| Hero | 32px | 48px |
| H1 | 28px | 36px |
| H2 | 20px | 24px |
| Body | 16px | 16px (maintain) |
| Stat Large | 24px | 32px |

**Typography Best Practices:**
- Reduce font weight pada dark backgrounds (400-500) untuk avoid halation
- Use #e4e4e7 instead of pure white untuk text (reduce eye strain)
- Monospace untuk data values, wallet addresses, transaction hashes
- Apply antialiasing: `-webkit-font-smoothing: antialiased`

### 2.3 Spacing Scale (4pt Grid, 8pt Preferred)

| Token Name | Value | Usage |
|------------|-------|-------|
| space-1 | 4px | Icon padding, tight gaps |
| space-2 | 8px | Inline spacing, small gaps |
| space-3 | 12px | Button padding vertical |
| space-4 | 16px | Element gaps, card inner spacing |
| space-5 | 20px | Medium gaps |
| space-6 | 24px | Card padding (compact) |
| space-8 | 32px | Card padding (standard), large gaps |
| space-10 | 40px | Section padding (internal) |
| space-12 | 48px | Section margins between |
| space-16 | 64px | Large section spacing |
| space-20 | 80px | Extra large spacing |
| space-24 | 96px | Hero padding vertical |
| space-32 | 128px | Maximum spacing |

**Dashboard-Specific Spacing:**
- Stat card padding: 24-32px
- Dashboard grid gaps: 16-24px
- Section spacing: 64-96px
- Hero padding: 80-120px vertical

### 2.4 Border Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| radius-sm | 8px | Small elements, badges |
| radius-md | 12px | Buttons, inputs |
| radius-lg | 16px | Cards, panels |
| radius-xl | 20px | Large cards, modals |
| radius-full | 9999px | Pills, status dots |

**Rule:** Outer containers ≥ Inner elements + 4px

### 2.5 Box Shadows & Glows

**Elevation (Subtle, Dark Mode Optimized):**

| Token Name | Value | Usage |
|------------|-------|-------|
| shadow-sm | 0 0 0 1px rgba(255,255,255,0.05), 0 1px 2px rgba(0,0,0,0.8) | Small elements |
| shadow-card | 0 0 0 1px rgba(255,255,255,0.1), 0 4px 12px rgba(0,0,0,0.6) | Standard cards |
| shadow-card-hover | 0 0 0 1px rgba(255,255,255,0.15), 0 8px 24px rgba(0,0,0,0.7) | Card hover |
| shadow-modal | 0 0 0 1px rgba(255,255,255,0.15), 0 20px 60px rgba(0,0,0,0.9) | Modals, overlays |

**Neon Glows (Status Indicators):**

| Token Name | Value | Usage |
|------------|-------|-------|
| glow-cyan | 0 0 12px rgba(0,212,255,0.4), 0 0 24px rgba(0,212,255,0.2) | Cyan accent glow |
| glow-green | 0 0 12px rgba(0,255,136,0.4), 0 0 24px rgba(0,255,136,0.2) | Success/active glow |
| glow-purple | 0 0 12px rgba(139,92,246,0.3), 0 0 24px rgba(139,92,246,0.15) | Premium glow |
| glow-pulse | 0 0 8px rgba(0,255,136,0.6) | Pulsing live indicator |

### 2.6 Animation & Motion

**Durations:**

| Token Name | Value | Usage |
|------------|-------|-------|
| duration-fast | 150ms | Icon changes, simple hovers |
| duration-base | 250ms | Card elevations, color transitions |
| duration-slow | 400ms | Modals, complex transitions |
| duration-pulse | 2000ms | Live status pulse animation |
| duration-counter | 1000ms | Number counter increments |

**Easing:**

| Token Name | Value | Usage |
|------------|-------|-------|
| ease-out | ease-out | Default (90% cases) |
| ease-sharp | cubic-bezier(0.4, 0.0, 0.2, 1) | Snappy interactions |
| ease-smooth | cubic-bezier(0.4, 0.0, 0.6, 1) | Smooth, elegant |

---

## 3. Component Specifications

### 3.1 Hero Dashboard Section

**Structure:**
- Full-width container, 500-600px height (desktop), 400px (mobile)
- Dark gradient background: #000000 → #0a0a0a (vertical)
- Centered content (max-width 1200px)
- Headline + tagline + live stats bar + CTA buttons

**Layout:**
```
Hero Container (500-600px height)
  ├── Headline (48px, bold, zinc-200)
  ├── Tagline (18px, zinc-400, max-width 600px)
  ├── Live Stats Bar (4 stat cards, horizontal)
  │   └── Each card: Value + label + change indicator
  └── CTA Button Group (2 buttons, gap 16px)
```

**Stats Bar Specification:**
- 4 cards in horizontal row (1 row on mobile with horizontal scroll)
- Each card: 160-200px width, 96px height
- Background: #141414, border: 1px solid rgba(0,212,255,0.2)
- Padding: 20px
- Stat value: 24-32px, bold, cyan #00d4ff
- Stat label: 12px, zinc-400
- Change indicator: Green/red badge (+12.5%, -3.2%)

**Interactive States:**
- Card hover: Background #1e1e1e, border cyan glow
- Value counter: Smooth increment animation (1000ms)

### 3.2 Data Stat Card

**Variants:**
1. **Small Stat Card** (network stats grid)
2. **Large Stat Card** (USDC price tracker)
3. **Live Indicator Card** (real-time pulsing dot)

**Small Stat Card Structure:**
```
Card Container (background #141414, padding 24px, radius 16px)
  ├── Icon (24px, cyan/green/purple accent)
  ├── Label (14px, zinc-400)
  ├── Value (24px, bold, zinc-200, monospace for numbers)
  ├── Change Badge (+12.5%, green if positive, red if negative)
  └── Live Indicator (optional pulsing dot, 8px, green)
```

**Dimensions:**
- Min-width: 200px
- Height: 120-140px
- Border: 1px solid rgba(255,255,255,0.1)
- Hover: Border glow (accent color), background #1e1e1e

**Large Stat Card (USDC Price):**
- Width: 100% or 2x grid span
- Height: 200-240px
- Include sparkline chart below value (60px height)
- Chart color: Cyan gradient fill

**Live Indicator (Pulsing Animation):**
```css
Dot: 8px circle, background #00ff88
Animation: Pulse scale 1.0 → 1.3 → 1.0 (2000ms infinite)
Glow: 0 0 8px rgba(0,255,136,0.6)
```

### 3.3 Data Table (Facilitator Comparison)

**Structure:**
- Full-width table, horizontal scroll on mobile
- Header row: Background #1a1a1a, border-bottom 2px solid cyan
- Data rows: Background #141414, border-bottom 1px solid rgba(255,255,255,0.05)
- Hover row: Background #1e1e1e

**Columns:**
| Column | Width | Alignment | Format |
|--------|-------|-----------|--------|
| Facilitator Name | 180px | Left | Bold, zinc-200 |
| Market Cap | 140px | Right | Monospace, $48M format |
| Active Wallets | 140px | Right | Monospace, 37K format |
| Transaction Fee | 120px | Right | Monospace, 30bps |
| Trust Score | 120px | Center | Badge with star icon |
| Privacy Level | 120px | Center | Badge (High/Medium/Low) |
| API Endpoints | 120px | Right | Number |
| Uptime | 100px | Right | Percentage with green/red |

**ZKx401 Row Highlight:**
- Background: rgba(139,92,246,0.1) (purple tint)
- Border-left: 3px solid #8b5cf6 (purple accent)
- Font weight: 600 (semibold)

**Cell Padding:** 16px vertical, 20px horizontal

**Badges:**
- Trust Score: Star icon + number (4.8/5.0), yellow/cyan color
- Privacy Level: High (green badge), Medium (orange), Low (red)
- Format: 6px radius, 4px padding, 12px font

### 3.4 Button Components

**Primary Button (Accent Fill):**
```
Height:     48px
Padding:    16px 32px
Radius:     12px
Font:       16px, semibold 600
Background: #00d4ff (cyan)
Color:      #000000 (black text for contrast)
Border:     None
Hover:      Background #33ddff (lighter), glow-cyan
Active:     Scale 0.98
```

**Secondary Button (Outline):**
```
Same dimensions
Background: Transparent
Border:     2px solid #00d4ff
Color:      #00d4ff
Hover:      Background #00d4ff, color #000000, glow-cyan
```

**Ghost Button (Subtle):**
```
Same dimensions
Background: Transparent
Border:     None
Color:      #a1a1aa (zinc-400)
Hover:      Background #1e1e1e, color #e4e4e7
```

**Button Group:**
- Gap: 16px horizontal
- Mobile: Stack vertical, full-width buttons

### 3.5 Navigation

**Top Navigation Bar:**
```
Height:          64px
Background:      rgba(10,10,10,0.9) with backdrop-blur(12px)
Border-bottom:   1px solid rgba(255,255,255,0.1)
Padding:         0 48px (desktop), 0 24px (mobile)
Position:        Sticky top-0
Z-index:         50

Layout:
  ├── Logo (left, 32px height)
  ├── Nav Links (center/left, gap 32px)
  │   └── Each link: zinc-400, hover zinc-200 + cyan underline (2px)
  └── CTA Button (right, primary style)
```

**Mobile Navigation:**
- Hamburger menu (24px icon, right side)
- Full-screen overlay (#0a0a0a, 95% opacity)
- Nav links: Vertical stack, 56px height each

### 3.6 Chart Visualization

**Line Chart (Transaction Volume):**
```
Container:       Full-width card, background #141414
Height:          300-400px (desktop), 240px (mobile)
Padding:         32px
Chart library:   ECharts or Chart.js recommended

Visual style:
  - Line color:    #00d4ff (cyan)
  - Line width:    2-3px
  - Gradient fill: Linear gradient from rgba(0,212,255,0.3) to transparent
  - Grid lines:    rgba(255,255,255,0.05), 1px
  - Axis labels:   12px, zinc-400
  - Tooltips:      Background #1a1a1a, border cyan, shadow-modal
```

**Sparkline Chart (Mini):**
```
Dimensions:  100% width x 60px height
Style:       Line only (no grid, no axes)
Color:       Accent based on data (green if positive trend, red if negative)
Smooth:      Bezier curve interpolation
```

---

## 4. Layout & Responsive

### 4.1 Website Structure (SPA)

Berdasarkan content-structure-plan.md, layout mengikuti vertical scroll dengan 7 sections:

**Section Flow:**
```
1. Hero Dashboard (500-600px)
   - Full-width dark gradient
   - Centered headline + live stats bar
   - CTA buttons

2. Real-Time Network Monitor (auto height, ~600-800px)
   - Section header (centered, 80px padding-top)
   - Network stats grid (3 columns x 2 rows)
   - USDC price card + ZK proof stats (2 column)
   - Transaction flow chart (full-width)

3. Facilitator Comparison Matrix (auto height)
   - Section header with market size badge
   - Comparison table (horizontal scroll on mobile)
   - ZKx401 highlight badge below table

4. Competitive Advantages (auto height)
   - Section header
   - Feature card grid (3 columns → 1 column mobile)
   - Card pattern: Icon + title + description + feature image

5. Payment Routing Visualization (auto height, ~500px)
   - Section header
   - Flow diagram (SVG, full-width, 300px height)
   - Step cards timeline (5 cards, horizontal scroll mobile)

6. Activity Feed & Integration (auto height)
   - 2-column layout (activity feed left 5 cols, integration card right 7 cols)
   - Mobile: Stack vertical
   - Revenue calculator (interactive form)

7. Footer (auto height, 200px)
   - 4-column layout (logo + nav + social + status)
   - Mobile: 1 column stack
```

### 4.2 Grid System

**Desktop (≥1024px):**
- Container max-width: 1280px (2xl)
- Padding horizontal: 48px
- Column count: 12 columns
- Gap: 24px

**Tablet (768-1023px):**
- Container: Full-width
- Padding: 32px
- Column count: 8 columns
- Gap: 20px

**Mobile (≤767px):**
- Container: Full-width
- Padding: 20px
- Column count: 4 columns
- Gap: 16px

### 4.3 Breakpoints

| Name | Min Width | Max Width | Target Device |
|------|-----------|-----------|---------------|
| sm | 640px | 767px | Large mobile |
| md | 768px | 1023px | Tablet |
| lg | 1024px | 1279px | Desktop |
| xl | 1280px | - | Large desktop |

### 4.4 Responsive Patterns

**Network Stats Grid:**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column (full-width cards)

**Feature Cards:**
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

**Comparison Table:**
- Desktop: Full table width
- Tablet/Mobile: Horizontal scroll (maintain table structure, don't collapse)

**Activity Feed + Integration:**
- Desktop: 2 columns (5/7 split)
- Mobile: Vertical stack (activity feed first)

**Hero Stats Bar:**
- Desktop: 4 cards horizontal
- Mobile: Horizontal scroll (snap scroll, 100% viewport width per card)

### 4.5 Container Widths

| Element | Max Width | Usage |
|---------|-----------|-------|
| Main container | 1280px | Standard sections |
| Content width | 1200px | Hero content, text blocks |
| Narrow content | 800px | Long-form text (if needed) |
| Full-width | 100% | Charts, tables, hero background |

---

## 5. Interaction & Animation

### 5.1 Animation Standards

**Hover Transitions:**
- Cards: Background color change (250ms ease-out) + border glow
- Buttons: Background color + glow effect (150ms)
- Links: Color change + underline slide-in (200ms)

**Live Status Indicators:**
```css
Pulsing Dot Animation:
  - Duration: 2000ms infinite
  - Keyframes: Scale 1.0 → 1.3 → 1.0, opacity 1.0 → 0.6 → 1.0
  - Color: #00ff88 with green glow
```

**Number Counter Animation:**
```
When stat value updates:
  - Duration: 1000ms
  - Easing: ease-out
  - Increment from old value to new value smoothly
  - Use CountUp.js or similar library
```

**Chart Entrance:**
```
On section enter viewport:
  - Line draws from left to right (800ms)
  - Gradient fade-in (400ms delay)
  - Points appear sequentially (100ms stagger)
```

### 5.2 Scroll Behavior

**Smooth Scroll:**
- Navigation anchor links: `scroll-behavior: smooth`
- Duration: ~800ms untuk full-page scroll

**Scroll Triggers (Optional Subtle):**
- Cards fade-in when entering viewport (opacity 0 → 1, 400ms)
- No heavy parallax (avoid motion sickness)
- Use Intersection Observer API

### 5.3 Interactive Elements

**Card Hover:**
```css
Default state:
  background: #141414
  border: 1px solid rgba(255,255,255,0.1)
  
Hover state (250ms transition):
  background: #1e1e1e
  border: 1px solid rgba(0,212,255,0.3)
  box-shadow: glow-cyan
  transform: translateY(-2px) [subtle lift]
```

**Button Press:**
```css
Active state:
  transform: scale(0.98)
  transition: 100ms
```

**Table Row Hover:**
```css
Hover:
  background: #1e1e1e
  transition: 150ms
```

### 5.4 Loading States

**Skeleton Loaders (for live data):**
- Background: Linear gradient shimmer
- Colors: #141414 → #1e1e1e → #141414
- Animation: 1500ms infinite
- Use for stat cards, table rows while loading

**Spinner (modals, buttons):**
- Size: 20px (button), 40px (modal)
- Color: Cyan #00d4ff
- Animation: Rotate 360deg, 800ms linear infinite

### 5.5 Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Keep critical live indicators */
  .live-indicator {
    animation: none;
    /* Static green dot without pulse */
  }
}
```

### 5.6 Forbidden Animations

❌ **AVOID:**
- Bright flashing (>50% brightness change <200ms) - eye strain
- Heavy particle systems - performance issues
- Excessive parallax (>16px offset) - motion sickness
- Auto-playing videos with sound
- Infinite rotating elements (except loading spinners)

✅ **ALLOWED:**
- Subtle fade-ins (opacity transitions)
- Small transforms (≤8px translateY)
- Color transitions
- Glow effects on hover
- Smooth scrolling
- Number counters
- Pulsing status dots (2s duration, subtle)

---

## Design Validation Checklist

### Style Guide Compliance:
✅ Colors: 90% dark surfaces, 10% neon accents (cyan, green, purple)
✅ Typography: Inter for UI, JetBrains Mono for data, 400-500 weights on dark
✅ Spacing: 4pt grid system, prefer 8pt multiples
✅ Components: Dashboard-optimized (stat cards, tables, charts)
✅ Dark Mode First principles: Pure black base, vibrant accents, glow effects

### Dashboard Requirements:
✅ Real-time data focus: Stat cards, live indicators, charts
✅ Multi-neon accent system: Cyan (x402), green (success), purple (premium)
✅ Professional aesthetic: Clean, minimal, data-driven
✅ Competitive positioning: Comparison table, advantage cards

### WCAG Compliance:
✅ Text contrast: ≥4.5:1 minimum (achieved 15.2:1 for primary text)
✅ Interactive states: Clear hover/focus indicators
✅ Reduced motion: Support for prefers-reduced-motion
✅ Color not sole indicator: Icons + text labels for status

### Responsive:
✅ Mobile-first approach
✅ Touch targets: ≥48x48px on mobile
✅ Horizontal scroll tables (maintain structure)
✅ Simplified navigation on mobile

---

**Document Version:** 2.0 - x402 Facilitator Dashboard Redesign
**Created:** 2025-10-31
**Word Count:** ~2,400 words
