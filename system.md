# FuelProof Admin — System Design Document

> **Version** 1.0 · **Platform** Web (React.js + Tailwind CSS) · **Spring 2026**
> **Design Reference** Minimals.cc · Light Theme · Enterprise SaaS

---

## 1. Purpose

FuelProof Admin is the operator-facing web dashboard for the FuelProof platform. It gives station administrators and platform operators a single, unified surface to monitor live dispensing activity, investigate fraud events, manage employees, analyse transaction data, and respond to customer complaints — all in real time.

Where the mobile app is built for a 10-second interaction at a fuel nozzle, the admin panel is built for extended analytical sessions. It is designed for operators who make decisions with data, not instinct.

---

## 2. Design Reference — Minimals.cc Principles

The entire admin panel inherits its visual language from the Minimals design system. The key characteristics adopted from that reference are:

- **Extreme whitespace discipline** — generous padding everywhere, sections breathe
- **Subtle depth** — cards use very soft shadows, not borders, to separate from background
- **One accent, used sparingly** — colour draws the eye only to what demands attention
- **Data-first layouts** — charts and numbers are the heroes, labels are secondary
- **Consistent radii** — everything rounded at the same value, nothing sharp
- **Muted secondary palette** — supporting colours are desaturated, never competing

---

## 3. Visual Identity

### 3.1 Color System

```
─── Backgrounds ────────────────────────────────────────
Page Background        #F9FAFB   Near white, warm undertone
Surface (Card)         #FFFFFF   Pure white
Surface Raised         #F4F6F8   Slightly lifted (nested cards)
Sidebar Background     #FFFFFF   White sidebar, not dark

─── Brand ──────────────────────────────────────────────
Brand Navy             #1A2744   Primary brand, used in logo + key headings
Accent Teal            #00B4A6   Primary accent (CTAs, active states, live badges)
Accent Teal Light      #E6F7F6   Teal tint for badge backgrounds

─── Text ───────────────────────────────────────────────
Text Primary           #1C2536   Near black, main headings and data
Text Secondary         #637381   Slate, labels, captions, metadata
Text Disabled          #919EAB   Lighter slate, placeholders

─── Semantic ───────────────────────────────────────────
Success                #22C55E   Active / verified / online
Success Background     #F0FDF4   Success badge fill
Warning                #F59E0B   Caution states
Warning Background     #FFFBEB   Warning badge fill
Error                  #EF4444   Fraud / alert / critical
Error Background       #FEF2F2   Error badge fill
Info                   #3B82F6   Informational
Info Background        #EFF6FF   Info badge fill

─── Structure ──────────────────────────────────────────
Border                 #E5E7EB   Dividers, input outlines
Border Focus           #00B4A6   Input focus ring (teal)
Shadow                 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
Shadow Raised          0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)
```

### 3.2 Typography

```
Font Family            Inter (variable font, Google Fonts)

─── Scale ──────────────────────────────────────────────
Page Title             Inter 700   24px   #1C2536   Letter spacing -0.3px
Section Heading        Inter 600   18px   #1C2536   Letter spacing -0.2px
Card Title             Inter 600   14px   #1C2536   Letter spacing 0px
Subheading             Inter 500   13px   #637381
Body                   Inter 400   14px   #1C2536
Body Small             Inter 400   13px   #637381
Caption                Inter 400   12px   #919EAB
Label / Overline       Inter 500   11px   #919EAB   Letter spacing +0.6px, uppercase
KPI Number             Inter 700   32px   #1C2536   Letter spacing -0.5px
KPI Number Large       Inter 800   40px   #1C2536   Letter spacing -0.8px
Table Header           Inter 600   12px   #637381   Letter spacing +0.4px, uppercase
Table Cell             Inter 400   14px   #1C2536
Badge Text             Inter 600   12px   contextual
```

### 3.3 Spacing System

Base unit `4px`. All layout values are strict multiples.

```
4px    xs     Icon gap, tight inline spacing
8px    sm     Between label and input, badge padding
12px   md-sm  Internal card padding (compact tables)
16px   md     Standard internal card padding
20px   md-lg  Section gap within a card
24px   lg     Card padding (default)
32px   xl     Between cards in a grid
40px   2xl    Page section gap
48px   3xl    Major layout gap
```

### 3.4 Component Tokens

```
Border Radius
  Card / Panel       12px
  Button             8px
  Input              8px
  Badge              6px
  Avatar             50%   (circle)
  Chip               99px  (pill)
  Chart container    12px

Transition
  Default            150ms ease-in-out
  Page               200ms ease
  Chart              400ms ease

Icon Set             Lucide Icons (consistent stroke width 1.5px)
Icon Sizes           12px · 16px · 20px · 24px

Sidebar Width        280px (expanded) · 72px (collapsed)
Content Max Width    1400px
Top Bar Height       64px
```

---

## 4. Layout Architecture

### 4.1 Shell Structure

```
┌──────────────────────────────────────────────────────┐
│  Top Bar (64px)   Logo · Search · Notifs · Avatar    │
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │   Page Content Area                       │
│ (280px)  │   max-width 1400px, centered              │
│          │   padding: 32px                           │
│          │                                           │
└──────────┴───────────────────────────────────────────┘
```

### 4.2 Sidebar Navigation

```
FuelProof                           ← Logo + wordmark
─────────────────
OVERVIEW
  Dashboard

MONITORING
  Live Nozzle Monitor
  Fraud Alerts         ← badge with unread count

TRANSACTIONS
  All Transactions
  Reports

OPERATIONS
  Complaints
  Employee Management
  Station Settings

ACCOUNT
  Profile
  Settings
─────────────────
Active item:  teal left border (3px) + teal text + teal bg tint
Hover state:  #F4F6F8 background, no border
Inactive:     #637381 text, no background
```

### 4.3 Top Bar

```
Left    FuelProof logo (collapsed sidebar only) · Page title
Center  Global search  (⌘K shortcut, modal opens)
Right   Notification bell (badge count) · Divider · Avatar dropdown
```

### 4.4 Page Grid

All pages use a 12-column grid with 24px gutters.

```
KPI Row          4 cards × 3 columns each
Chart Row        8 col main chart + 4 col secondary
Table Page       12 col full width
Split Page       7 col content + 5 col detail panel
```

---

## 5. Page Specifications

### 5.1 Dashboard Overview

**Purpose:** Single-glance status of the entire system right now.

**KPI Row — 4 cards:**

| Card | Primary Value | Sub-label | Trend |
|---|---|---|---|
| Active Sessions | Live count | Nozzles currently dispensing | Up/down vs yesterday |
| Total Revenue Today | PKR amount | Transactions since midnight | Sparkline 7d |
| Fraud Alerts | Count | Unresolved this week | Red if > 0 |
| Avg. Dispensed | Litres | Per transaction today | vs last week |

Each KPI card structure:
```
┌─────────────────────────────┐
│  Icon (20px, teal bg tint)  │
│  KPI Number  (32px bold)    │
│  Label       (12px slate)   │
│  ── Trend chip ──           │
└─────────────────────────────┘
```

**Charts Row:**
- Left (8 col): Transaction Volume — area chart, 7-day or 30-day toggle, teal fill with 10% opacity
- Right (4 col): Fraud vs Verified — donut chart, teal + red, minimal legend below

**Live Activity Feed (full width):**
- Real-time scrolling list of dispensing events
- Each row: timestamp · nozzle ID · litres · PKR · status badge
- Fraud events highlighted with left red border on the row

---

### 5.2 Live Nozzle Monitor

**Purpose:** Real-time view of every nozzle currently active.

**Layout:** Responsive card grid, 3 columns on wide viewport

```
┌──────────────────────────────┐
│  Nozzle 01          ● LIVE  │  ← green pulsing dot
│  ─────────────────────────  │
│  24.6 L               teal  │  ← live litre counter
│  PKR 3,690                  │
│  ─────────────────────────  │
│  S1  24.6 L   S2  24.6 L   │  ← sensor readings
│  ✓ Verified                 │  ← green badge
│  Customer: Active Session   │
└──────────────────────────────┘
```

Tampered nozzle state:
```
┌──────────────────────────────┐
│  Nozzle 02       ⚠ TAMPERED │  ← red header accent
│  ─────────────────────────  │
│  31.0 L                     │
│  PKR 4,650                  │
│  ─────────────────────────  │
│  S1  31.0 L   S2  28.4 L   │  ← mismatch visible
│  ✕ Discrepancy: 2.6 L      │  ← red badge
└──────────────────────────────┘
```

Page header includes a filter bar: All · Live · Idle · Flagged

---

### 5.3 Fraud Alerts

**Purpose:** Investigate and resolve flagged transactions.

**Layout:** Full-width table + right slide-in detail panel

**Table columns:**
```
Alert ID · Time · Nozzle · S1 Reading · S2 Reading · Delta · Severity · Status · Actions
```

**Severity badges:**
```
Critical    red pill      Delta > 2L
Warning     amber pill    Delta 0.5L – 2L
Low         grey pill     Delta < 0.5L
```

**Detail panel (slides in on row click, 420px wide):**
- Alert ID and timestamp header
- Sensor 1 vs Sensor 2 comparison bar
- Delta value in large red type
- Session timeline
- Assign to employee dropdown
- Resolution notes textarea
- Mark Resolved / Escalate buttons

---

### 5.4 Transaction Reports

**Purpose:** Exportable transaction history with filters.

**Filter bar (top of page):**
```
Date Range Picker · Station · Nozzle · Status (All/Verified/Flagged) · Search
```

**Table columns:**
```
Txn ID · Date & Time · Nozzle · Customer Session · Litres · PKR · S1 · S2 · Delta · Status
```

**Table behaviour:**
- Sticky header on scroll
- Row hover: #F4F6F8 background
- Fraud rows: subtle left red border (2px)
- Click row: expand inline detail or open side panel
- Pagination: 25 / 50 / 100 rows per page selector

**Export bar (above table):**
- Export PDF · Export Excel · Export CSV
- Buttons are ghost style with icon, not filled

---

### 5.5 Complaint Management

**Purpose:** Track and resolve customer-submitted complaints.

**Layout:** Kanban board — 3 columns

```
Open          In Review         Resolved
──────────    ──────────        ──────────
[Card]        [Card]            [Card]
[Card]        [Card]            [Card]
[Card]                          [Card]
```

Each complaint card:
```
┌──────────────────────────┐
│  #CPL-0041    2h ago     │
│  Under-dispensing claim  │
│  Nozzle 02 · 12 Apr      │
│  ── Assigned: Ali K. ──  │
└──────────────────────────┘
```

Click to open full complaint detail modal: session data, customer note, sensor readings at time of complaint, response field.

---

### 5.6 Employee Management

**Purpose:** Manage attendant accounts and track performance.

**Layout:** Table + right panel

**Table columns:**
```
Name · Employee ID · Assigned Nozzles · Transactions Today · Fraud Incidents · Status
```

**Employee detail panel:**
- Avatar initials + name header
- Performance summary: total transactions, verified %, fraud incidents
- Assigned nozzles list
- Activity timeline (last 7 days)
- Edit / Deactivate actions

---

### 5.7 Station Settings

**Purpose:** Configure dispenser parameters.

**Layout:** Settings page, left nav + right content split

```
Left nav (200px)
  General
  Nozzles
  Pricing
  Alerts
  Integrations

Right content
  Section title
  Setting rows
  Save button (sticky bottom)
```

Setting row structure:
```
Label (600 14px)
Sub-label (400 13px slate)              [Control (input/toggle/select)]
```

---

## 6. Data Visualisation Standards

All charts use `Recharts`. Consistent rules across every chart in the dashboard:

```
Grid lines        #F0F0F0, very subtle, horizontal only
Axis labels       Inter 400 12px #919EAB
Tooltip           White card, 8px radius, shadow-raised, Inter 400 13px
Legend            Below chart, Inter 400 12px, horizontal
Line stroke       2px
Area fill         Brand colour at 10% opacity
Bar radius        4px top corners only
Donut stroke      3px white gap between segments
Animation         400ms ease on mount, disabled on real-time updates
```

**Chart colour order (for multi-series):**
```
1st series    #00B4A6   Teal
2nd series    #1A2744   Navy
3rd series    #F59E0B   Amber
4th series    #3B82F6   Blue
```

---

## 7. Interaction Standards

**Real-time data**
Live nozzle readings update via Socket.io. Number transitions use a 120ms counter animation. The live dot pulses at 1.5s interval. No full re-renders — only the changed value updates.

**Table sorting**
Click column header to sort. Second click reverses. Arrow icon rotates 180deg with 150ms transition.

**Notifications**
Non-blocking toast system, top-right corner. Auto-dismiss 4s. Fraud alerts persist until manually dismissed. Toasts stack vertically with 8px gap.

**Global search**
⌘K opens a command palette modal. Searches across transactions, nozzles, employees, and complaints. Results grouped by type. Keyboard navigable.

**Confirmation dialogs**
Destructive actions (deactivate employee, delete record) require a confirmation modal. Modal title states the exact consequence. Primary action is red. Cancel is always the left button.

**Empty states**
Every table and list has a defined empty state: centered illustration (line art, not colourful), one-line explanation, one CTA if applicable. No blank panels.

---

## 8. Responsive Behaviour

The admin panel is primarily a desktop experience but degrades gracefully.

```
≥ 1280px    Full layout — sidebar expanded, 3-column grids
1024–1279   Sidebar collapsed to icons (72px), 2-column grids
768–1023    Sidebar hidden (hamburger), stacked cards
< 768       Read-only mobile view, no management actions
```

---

## 9. Tech Stack

```
Framework              React.js 18
Styling                Tailwind CSS (JIT)
Component Library      shadcn/ui (base primitives only, fully restyled)
State Management       Zustand
Data Fetching          TanStack Query (React Query)
WebSocket              socket.io-client
Charts                 Recharts
Tables                 TanStack Table
Date Handling          date-fns
Icons                  Lucide React
Routing                React Router v6
Form Handling          React Hook Form + Zod
Notifications          Sonner (toast)
Export                 jsPDF · SheetJS
Linting                ESLint + Prettier (strict, zero warnings policy)
```

**Folder structure:**

```
src/
├── assets/               (logo, illustrations)
├── components/
│   ├── ui/               (shadcn base: button, input, badge, dialog...)
│   └── shared/           (KPICard, DataTable, StatusBadge, PageHeader...)
├── features/
│   ├── dashboard/
│   ├── nozzles/
│   ├── fraud/
│   ├── transactions/
│   ├── complaints/
│   ├── employees/
│   └── settings/
├── hooks/                (useSocket, useRealtime, useExport...)
├── layouts/
│   ├── AppShell.jsx      (sidebar + topbar wrapper)
│   └── PageWrapper.jsx   (max-width, padding, title)
├── lib/                  (api client, socket instance, utils)
├── providers/            (QueryProvider, SocketProvider, AuthProvider)
├── router/
└── store/                (Zustand slices)
```

---

## 10. Quality Standards

| Standard | Requirement |
|---|---|
| Tap / click targets | Minimum 40 × 40px |
| Colour contrast | WCAG AA on all text |
| Table loading | Skeleton rows, never spinner |
| Chart loading | Grey placeholder shape, same dimensions |
| Error boundary | Every feature wrapped, fallback UI defined |
| Console | Zero warnings or errors in production build |
| ESLint | Zero rule violations, no eslint-disable comments |
| Component size | No component file exceeds 200 lines. Split if exceeded |
| Prop drilling | Maximum 2 levels. Use Zustand or context beyond that |
| Magic numbers | All values referenced from constants or Tailwind tokens |

---

## 11. Design Anti-Patterns — Explicitly Prohibited

These patterns are banned across the entire admin panel:

- Dark sidebars or dark headers in a light-theme product
- Gradient buttons or gradient backgrounds anywhere in the UI
- More than one accent colour used simultaneously on a single screen
- Tables without sticky headers on scrollable content
- Modals that open other modals
- Full-page loading spinners — use skeleton states instead
- Coloured backgrounds on KPI cards — white only, the number is the emphasis
- Capitalised labels beyond 11px font size
- Tooltips that appear only on hover with no keyboard equivalent
- Alert banners that auto-dismiss for fraud events

---

*FuelProof Admin · IoT-Based Fuel Dispenser with Verification · SZABIST University Islamabad · Spring 2026*