# 🎨 UI/UX Design System

## DevScope — Design Philosophy & Guidelines

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Design Principles](#design-principles)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Component Library](#component-library)
- [Responsive Design](#responsive-design)
- [Animation & Motion](#animation--motion)
- [Iconography](#iconography)
- [Accessibility](#accessibility)
- [User Experience Patterns](#user-experience-patterns)
- [Dark/Light Mode](#darklight-mode)

---

## Design Philosophy

DevScope's design follows a **data-first, distraction-free** philosophy. The interface exists to surface developer insights quickly and clearly — every visual element serves the data. We draw inspiration from modern developer tools (Vercel Dashboard, Linear, Raycast) that combine dark-themed sophistication with information-dense layouts.

### Core Design Tenets

1. **Clarity over decoration** — Every pixel serves the user's goal. No ornamental elements.
2. **Data speaks** — Charts, scores, and metrics are the heroes. UI chrome is minimal.
3. **Progressive disclosure** — Show the most important data first, details on demand.
4. **Consistent rhythm** — Predictable spacing, sizing, and interaction patterns reduce cognitive load.
5. **Inclusive by default** — Accessibility is not an afterthought; it's built into every component.

---

## Design Principles

### 1. Information Hierarchy
```
Level 1: Overall Score & Profile Name     → Largest, boldest
Level 2: Dimension Scores & Section Titles → Medium, semi-bold
Level 3: Chart Data & Card Content        → Regular weight, readable size
Level 4: Metadata & Timestamps            → Small, muted color
```

### 2. Visual Weight Distribution
- **Top of page**: Search bar (primary action) + profile header (primary context)
- **Middle of page**: Score overview (key metrics) + tabbed content (detail exploration)
- **Bottom of page**: Natural language summary + metadata

### 3. Emotional Design
- **Scores 90-100**: Green (#10b981) — celebration, achievement
- **Scores 60-89**: Blue (#3b82f6) — positive, professional
- **Scores 40-59**: Yellow (#f59e0b) — attention, room for growth
- **Scores 0-39**: Red (#ef4444) — concern, needs improvement
- **Neutral states**: Gray palette — loading, empty, disabled

---

## Color System

DevScope uses **HSL-based CSS custom properties** for full theme flexibility. Colors are defined without the `hsl()` wrapper to enable opacity modification via Tailwind's `bg-primary/50` syntax.

### Light Mode Palette

| Token | HSL Value | Hex (approx) | Usage |
|-------|-----------|---------------|-------|
| `--background` | `0 0% 100%` | `#FFFFFF` | Page background |
| `--foreground` | `240 10% 3.9%` | `#09090B` | Primary text |
| `--card` | `0 0% 100%` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `240 10% 3.9%` | `#09090B` | Card text |
| `--popover` | `0 0% 100%` | `#FFFFFF` | Popover/dropdown backgrounds |
| `--popover-foreground` | `240 10% 3.9%` | `#09090B` | Popover text |
| `--primary` | `240 5.9% 10%` | `#18181B` | Primary buttons, links |
| `--primary-foreground` | `0 0% 98%` | `#FAFAFA` | Text on primary elements |
| `--secondary` | `240 4.8% 95.9%` | `#F4F4F5` | Secondary backgrounds |
| `--secondary-foreground` | `240 5.9% 10%` | `#18181B` | Secondary text |
| `--muted` | `240 4.8% 95.9%` | `#F4F4F5` | Muted backgrounds, borders |
| `--muted-foreground` | `240 3.8% 46.1%` | `#71717A` | Muted text, captions |
| `--accent` | `240 4.8% 95.9%` | `#F4F4F5` | Hover states, highlights |
| `--accent-foreground` | `240 5.9% 10%` | `#18181B` | Accent text |
| `--destructive` | `0 84.2% 60.2%` | `#EF4444` | Error states, delete actions |
| `--destructive-foreground` | `0 0% 98%` | `#FAFAFA` | Text on destructive elements |
| `--border` | `240 5.9% 90%` | `#E4E4E7` | Borders, dividers |
| `--input` | `240 5.9% 90%` | `#E4E4E7` | Input borders |
| `--ring` | `240 5.9% 10%` | `#18181B` | Focus rings |
| `--radius` | `0.5rem` | — | Default border radius |

### Dark Mode Palette

| Token | HSL Value | Hex (approx) | Usage |
|-------|-----------|---------------|-------|
| `--background` | `240 10% 3.9%` | `#09090B` | Page background |
| `--foreground` | `0 0% 98%` | `#FAFAFA` | Primary text |
| `--card` | `240 10% 3.9%` | `#09090B` | Card backgrounds |
| `--card-foreground` | `0 0% 98%` | `#FAFAFA` | Card text |
| `--popover` | `240 10% 3.9%` | `#09090B` | Popover backgrounds |
| `--popover-foreground` | `0 0% 98%` | `#FAFAFA` | Popover text |
| `--primary` | `0 0% 98%` | `#FAFAFA` | Primary elements |
| `--primary-foreground` | `240 5.9% 10%` | `#18181B` | Text on primary |
| `--secondary` | `240 3.7% 15.9%` | `#27272A` | Secondary backgrounds |
| `--secondary-foreground` | `0 0% 98%` | `#FAFAFA` | Secondary text |
| `--muted` | `240 3.7% 15.9%` | `#27272A` | Muted backgrounds |
| `--muted-foreground` | `240 5% 64.9%` | `#A1A1AA` | Muted text |
| `--accent` | `240 3.7% 15.9%` | `#27272A` | Hover states |
| `--accent-foreground` | `0 0% 98%` | `#FAFAFA` | Accent text |
| `--destructive` | `0 62.8% 30.6%` | `#7F1D1D` | Error states (dark variant) |
| `--destructive-foreground` | `0 0% 98%` | `#FAFAFA` | Text on destructive |
| `--border` | `240 3.7% 15.9%` | `#27272A` | Borders |
| `--input` | `240 3.7% 15.9%` | `#27272A` | Input borders |
| `--ring` | `240 4.9% 83.9%` | `#D4D4D8` | Focus rings |

### Semantic Colors

| Purpose | Light Mode | Dark Mode | Token |
|---------|-----------|-----------|-------|
| Success | `#10B981` (green-500) | `#34D399` (green-400) | `--success` |
| Warning | `#F59E0B` (amber-500) | `#FBBF24` (amber-400) | `--warning` |
| Error | `#EF4444` (red-500) | `#F87171` (red-400) | `--error` |
| Info | `#3B82F6` (blue-500) | `#60A5FA` (blue-400) | `--info` |

### Chart Colors (Language Palette)

Language-specific colors are sourced from GitHub's official `linguist` palette. Key languages:

| Language | Color | Hex |
|----------|-------|-----|
| JavaScript | 🟡 | `#f1e05a` |
| TypeScript | 🔵 | `#3178c6` |
| Python | 🔵 | `#3572A5` |
| Java | 🟠 | `#b07219` |
| Go | 🔵 | `#00ADD8` |
| Rust | 🟠 | `#dea584` |
| Ruby | 🔴 | `#701516` |
| C++ | 🔴 | `#f34b7d` |
| PHP | 🟣 | `#4F5D95` |
| Swift | 🟠 | `#F05138` |

---

## Typography

### Font Family

**Primary Font:** [Inter](https://rsms.me/inter/)

Inter is a variable font designed for computer screens with a focus on high legibility at small sizes. It provides excellent rendering across all platforms and browsers.

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
             'Helvetica Neue', Arial, sans-serif;
```

### Font Loading Strategy

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
```

Using `display=swap` to prevent FOIT (Flash of Invisible Text).

### Type Scale

| Level | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `h1` | 36px / 2.25rem | 800 (ExtraBold) | 1.2 | -0.02em | Page titles, hero text |
| `h2` | 30px / 1.875rem | 700 (Bold) | 1.25 | -0.01em | Section headers |
| `h3` | 24px / 1.5rem | 600 (SemiBold) | 1.3 | -0.01em | Card titles, subsections |
| `h4` | 20px / 1.25rem | 600 (SemiBold) | 1.35 | 0 | Widget headers |
| `body` | 16px / 1rem | 400 (Regular) | 1.6 | 0 | Body text, descriptions |
| `body-sm` | 14px / 0.875rem | 400 (Regular) | 1.5 | 0 | Secondary text, captions |
| `caption` | 12px / 0.75rem | 500 (Medium) | 1.4 | 0.01em | Labels, timestamps |
| `overline` | 11px / 0.6875rem | 600 (SemiBold) | 1.4 | 0.05em | Category labels (uppercase) |
| `code` | 14px / 0.875rem | 400 (Regular) | 1.5 | 0 | Monospace, code snippets |

### Monospace Font (Code)

```css
font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
```

Used in: search input, usernames, code snippets, API endpoint displays.

### Responsive Type Scaling

```css
/* Mobile (<640px): base size 14px */
html { font-size: 14px; }

/* Tablet (640-1024px): base size 15px */
@media (min-width: 640px) { html { font-size: 15px; } }

/* Desktop (>1024px): base size 16px */
@media (min-width: 1024px) { html { font-size: 16px; } }
```

---

## Spacing & Layout

### Spacing Scale (4px base)

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0 | Reset |
| `space-0.5` | 2px | Hairline gaps |
| `space-1` | 4px | Tight inline elements |
| `space-2` | 8px | Icon-to-text gaps |
| `space-3` | 12px | Between related elements |
| `space-4` | 16px | Standard component padding |
| `space-5` | 20px | Card padding |
| `space-6` | 24px | Section padding |
| `space-8` | 32px | Between sections |
| `space-10` | 40px | Large section gaps |
| `space-12` | 48px | Page section dividers |
| `space-16` | 64px | Hero sections |

### Layout Grid

```
Container Max Widths:
  sm:  640px
  md:  768px
  lg:  1024px
  xl:  1280px
  2xl: 1400px  (custom max for dashboard)
```

### Card Design

```
┌────────────────────────────────┐
│  padding: 24px (space-6)       │
│                                │
│  ┌──── Card Title ──────────┐  │
│  │  font: h4 (20px, 600)    │  │
│  └──────────────────────────┘  │
│  gap: 16px (space-4)           │
│  ┌──── Card Content ────────┐  │
│  │  Charts, data, etc.      │  │
│  └──────────────────────────┘  │
│                                │
│  border: 1px solid var(--border)│
│  border-radius: var(--radius)  │
│  background: var(--card)       │
│  shadow: 0 1px 3px rgba(0,0,0,0.1) │
└────────────────────────────────┘
```

---

## Component Library

### Framework: ShadCN UI + Custom Components

DevScope uses **ShadCN UI** as the base component library, customized with DevScope's design tokens and extended with analytics-specific components.

### Core Components (ShadCN UI)

| Component | Variant(s) | Usage |
|-----------|-----------|-------|
| `Button` | `default`, `secondary`, `outline`, `ghost`, `destructive`, `link` | All interactive buttons |
| `Input` | `default` | Search bar, form fields |
| `Card` | `default` | Analytics cards, repo cards, score cards |
| `Badge` | `default`, `secondary`, `outline`, `destructive` | Score labels, skill tags, status |
| `Tabs` | `default` | Dashboard section switching |
| `Avatar` | Sizes: `sm`, `md`, `lg`, `xl` | GitHub profile avatars |
| `Skeleton` | `line`, `circle`, `card` | Loading states |
| `Toast` | `default`, `success`, `error`, `warning` | Notifications |
| `Dialog` | `default` | Confirmations (delete history) |
| `DropdownMenu` | `default` | User menu, actions |
| `Tooltip` | `default` | Chart data points, info icons |
| `Separator` | `horizontal`, `vertical` | Section dividers |

### Custom Components

| Component | Description |
|-----------|-------------|
| `ScoreGauge` | Animated radial gauge displaying a 0-100 score with color coding |
| `ScoreCard` | Card with score gauge, label, and description |
| `LanguageBar` | Horizontal stacked bar showing language percentages |
| `RepoCard` | Repository card with name, description, language, stats, health badge |
| `SkillTag` | Colored tag showing skill name and category |
| `TrendChart` | Preconfigured Recharts line chart for contribution trends |
| `SearchBar` | Combined input + button with loading state and validation |
| `HistoryItem` | Search history list item with avatar, username, score, timestamp |
| `EmptyState` | Illustration + message for empty data states |
| `ErrorState` | Error illustration + message + retry button |
| `ThemeToggle` | Animated sun/moon icon toggle button |

### Component Behavior Standards

| Behavior | Rule |
|----------|------|
| Hover | All interactive elements have visible hover state (opacity, background, or scale change) |
| Focus | Visible focus ring (`ring-2 ring-ring ring-offset-2`) on all focusable elements |
| Active | Scale down slightly (0.98) on click for buttons |
| Disabled | Reduced opacity (0.5) + `cursor-not-allowed` + no hover effects |
| Loading | Skeleton shimmer or spinner, never blank space |
| Transitions | All state changes use 150-200ms ease transitions |

---

## Responsive Design

### Breakpoint System (Tailwind CSS)

| Prefix | Min Width | Target |
|--------|-----------|--------|
| `sm` | 640px | Large phones (landscape) |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Laptops / desktops |
| `2xl` | 1536px | Large desktops |

### Mobile-First Strategy

All styles are mobile-first. Desktop styles are additive:

```css
/* Mobile default */
.dashboard-grid {
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 16px;
}

/* Tablet and up */
@screen md {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    padding: 24px;
  }
}

/* Desktop and up */
@screen xl {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Layout Adaptations

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| Page container | `px-4` | `px-6` | `px-8 max-w-7xl mx-auto` |
| Score cards | 2-col grid | 3-col grid | 5-col inline |
| Charts | Full width, stacked | 2-col grid | 2-col grid |
| Profile header | Stacked (centered) | Horizontal | Horizontal |
| Search bar | Full width below nav | Inline in nav | Inline in nav, wider |
| Sidebar | Hidden (drawer) | Hidden (drawer) | Visible, 280px fixed |
| Navigation | Bottom bar | Top header | Top header |

---

## Animation & Motion

### Motion Library: Framer Motion

All non-CSS animations use **Framer Motion** for declarative, physics-based motion.

### Animation Principles

1. **Purposeful** — Motion guides attention, confirms actions, and provides spatial context
2. **Quick** — Most transitions complete in 200-400ms. Never exceed 600ms.
3. **Natural** — Use easing curves that feel physically natural, never linear
4. **Non-blocking** — Animations never prevent user interaction
5. **Reducible** — Respect `prefers-reduced-motion` media query

### Standard Animations

#### Page Transitions
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1], // cubic-bezier
};
```

#### Card Entry (Staggered)
```typescript
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};
```

#### Score Counter Animation
```typescript
// Animated number counting from 0 to target score
const scoreAnimation = {
  from: 0,
  to: score,
  duration: 1.2,
  ease: [0.16, 1, 0.3, 1], // expo-out
};
```

#### Hover Effects
```typescript
const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
};
```

#### Loading Skeleton Pulse
```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
.skeleton {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  background: hsl(var(--muted));
  border-radius: var(--radius);
}
```

### Reduced Motion

```typescript
// Global motion config
const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Applied to all Framer Motion components
<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```

When `prefers-reduced-motion: reduce` is active:
- Page transitions → instant (0ms)
- Card stagger → removed, all appear simultaneously
- Score counter → instant final value
- Hover effects → opacity-only changes (no scale)
- Chart animations → disabled

### Easing Functions

| Name | Curve | Usage |
|------|-------|-------|
| `easeOut` | `[0, 0, 0.2, 1]` | Elements entering the viewport |
| `easeIn` | `[0.4, 0, 1, 1]` | Elements leaving the viewport |
| `easeInOut` | `[0.4, 0, 0.2, 1]` | State transitions (expand/collapse) |
| `spring` | `{ damping: 15, stiffness: 300 }` | Interactive elements (toggles, switches) |

---

## Iconography

### Icon Library: Lucide React

[Lucide](https://lucide.dev/) is a fork of Feather Icons with 1,000+ consistent, customizable icons.

### Icon Usage

| Context | Size | Stroke Width |
|---------|------|-------------|
| Inline with body text | 16px | 2 |
| Buttons | 18px | 2 |
| Card headers | 20px | 1.75 |
| Section headers | 24px | 1.5 |
| Empty state illustrations | 48-64px | 1 |

### Standard Icons

| Action | Icon Name | Usage |
|--------|-----------|-------|
| Search | `Search` | Search bar |
| Dark mode | `Moon` | Theme toggle (dark) |
| Light mode | `Sun` | Theme toggle (light) |
| User | `User` | Profile, avatar fallback |
| Star | `Star` | GitHub stars |
| Git Fork | `GitFork` | Forks count |
| Code | `Code` | Languages section |
| Activity | `Activity` | Activity score |
| Users | `Users` | Followers / engagement |
| Target | `Target` | Consistency score |
| Award | `Award` | Quality score |
| Trash | `Trash2` | Delete history |
| Log out | `LogOut` | Logout action |
| External link | `ExternalLink` | GitHub profile links |
| Clock | `Clock` | Timestamps, history |
| Alert | `AlertCircle` | Error states |
| Check | `CheckCircle2` | Success states |
| Loading | `Loader2` | Spinner (animated rotate) |

---

## Accessibility

### WCAG 2.1 Compliance Target: **Level AA**

### Color Contrast

| Element | Minimum Ratio | Achieved |
|---------|--------------|----------|
| Body text on background | 4.5:1 | ✅ 15.4:1 (dark), 18.1:1 (light) |
| Large text on background | 3:1 | ✅ Exceeds requirement |
| Interactive elements | 3:1 | ✅ Focus rings, borders |
| Non-text elements (charts) | 3:1 | ✅ All chart colors tested |
| Disabled elements | No requirement | 2.5:1 (intentionally reduced) |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus to next focusable element |
| `Shift+Tab` | Move focus to previous focusable element |
| `Enter` | Activate focused button/link |
| `Space` | Toggle focused checkbox/switch |
| `Escape` | Close modal/popover/dropdown |
| `Arrow keys` | Navigate within tabs, menus, radio groups |
| `/` | Focus search bar (global shortcut) |

### ARIA Implementation

```html
<!-- Search Bar -->
<form role="search" aria-label="Search GitHub developers">
  <input
    type="search"
    aria-label="GitHub username"
    aria-describedby="search-hint"
    aria-invalid={hasError}
    aria-errormessage="search-error"
  />
  <span id="search-hint" class="sr-only">
    Enter a GitHub username to analyze their profile
  </span>
</form>

<!-- Score Cards -->
<div role="group" aria-label="Developer Scores">
  <div role="meter" aria-valuenow={76} aria-valuemin={0} aria-valuemax={100} aria-label="Overall Score">
    76/100
  </div>
</div>

<!-- Chart Alternative -->
<figure aria-label="Language Distribution">
  <div role="img" aria-label="Pie chart showing language usage percentages">
    {/* Recharts PieChart */}
  </div>
  <details>
    <summary>View as table</summary>
    <table aria-label="Language usage data">
      {/* Accessible data table */}
    </table>
  </details>
</figure>
```

### Screen Reader Announcements

| Event | Announcement |
|-------|-------------|
| Search submitted | "Searching for GitHub user [username]" |
| Results loaded | "Analytics loaded for [name]. Overall score: [score] out of 100" |
| Error occurred | "Error: [error message]" |
| Theme toggled | "Switched to [dark/light] mode" |
| History item deleted | "Search history entry for [username] deleted" |

### Focus Management

- After search submission: focus moves to the results area
- After modal close: focus returns to the trigger element
- After tab switch: focus moves to the tab panel content
- Skip-to-content link: visible on first Tab press, skips navigation

---

## User Experience Patterns

### Loading States

| State | Duration | UI Treatment |
|-------|----------|--------------|
| Instant (< 100ms) | No indicator | Direct response |
| Fast (100ms - 1s) | Skeleton loader | Shimmer placeholders matching content shape |
| Medium (1s - 5s) | Progress indicator | Skeleton + "Analyzing profile..." text |
| Slow (5s - 10s) | Detailed progress | Step indicators: "Fetching repos... Computing scores..." |

### Empty States

| Context | Message | Action |
|---------|---------|--------|
| No search performed | "Search for a GitHub developer to see their analytics" | Focus search bar |
| No search history | "Your search history will appear here" | Suggest a search |
| No repos found | "This user has no public repositories" | Show profile-only data |
| No languages detected | "No language data available for this user" | — |

### Error Recovery

| Error Type | Recovery Action |
|-----------|----------------|
| Network error | "Retry" button + offline indicator |
| 404 User not found | Suggest checking spelling, show similar usernames |
| 429 Rate limited | Show countdown timer + "Try in X minutes" |
| 500 Server error | "Retry" button + "Report issue" link |
| Auth expired | Silent refresh → retry, or redirect to login |

### Micro-interactions

1. **Search submit**: Input border transitions to primary color, button shows spinner
2. **Score reveal**: Numbers count up from 0 with easing, gauge fills clockwise
3. **Tab switch**: Content fades out → new content fades in (200ms total)
4. **Theme toggle**: Icon rotates 180° as it morphs from sun to moon
5. **History delete**: Item slides out to the left with opacity fade (300ms)
6. **Card hover**: Subtle elevation increase (shadow) + 2% scale

---

## Dark/Light Mode

### Implementation Architecture

```
User Preference → localStorage → next-themes Provider → HTML class → CSS Variables → Components
```

### Theme Provider Configuration

```typescript
// app/layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Chart Theme Adaptation

Charts must adapt their text colors, grid lines, and tooltips to the active theme:

```typescript
const chartTheme = {
  light: {
    text: '#09090B',
    grid: '#E4E4E7',
    tooltipBg: '#FFFFFF',
    tooltipBorder: '#E4E4E7',
  },
  dark: {
    text: '#FAFAFA',
    grid: '#27272A',
    tooltipBg: '#09090B',
    tooltipBorder: '#27272A',
  },
};
```

### Images & Media

- Use `mix-blend-mode: difference` or themed variants for any non-photo images
- SVG illustrations should use `currentColor` for theme-aware rendering
- Avoid images with hard-coded backgrounds that clash with either theme

---

*This design system is maintained as a living document. All component additions must follow these guidelines to ensure visual and interaction consistency across DevScope.*
