# Wall Calendar — Interactive Component
## Frontend Engineering Challenge Submission

Stack:     React / Next.js · CSS Variables · localStorage


Fonts:     Playfair Display · DM Mono · Lora Italic


Theme:     Dark / Light · Month-adaptive accents


Storage:   localStorage (no backend required)

Demo:      localhost:5173 / Vercel deployment

────────────────────────────────────────────────────────────

## 1. PROJECT OVERVIEW
────────────────────────────────────────────────────────────

This project is a polished, fully interactive wall calendar
component built in React/Next.js as a response to the
Frontend Engineering Challenge. It translates a physical
wall calendar into a deeply functional, responsive, and
visually grounded web interface — going well beyond the
baseline requirements to incorporate production-quality
interactions, adaptive theming, and a Notion-style block
editing system for notes.

The central design decision was to replace the static hero
image with a dynamic quote carousel anchored over a
full-bleed monthly photograph. This serves the same visual
anchoring function as a hero image but adds temporal and
emotional dimensionality — each quote is curated to pair
with the month's mood, and each month has its own distinct
photograph.

────────────────────────────────────────────────────────────

## 2. DESIGN PHILOSOPHY
────────────────────────────────────────────────────────────

Paper-meets-glass aesthetic
The UI occupies a deliberate middle ground between the
physicality of a wall calendar and the translucency of
modern glass UI. The binding, nail, paper grain texture,
and page corner fold are all present as actual CSS
constructs — not illustrations — so they cast real shadows
and respond to theme changes. The glassmorphism panels use
three distinct blur/opacity depths to simulate foreground,
midground, and background surfaces.

Typography as architecture
Three fonts are used with strict role separation:
  – Playfair Display: display headings, month name, notes
    heading. Serif authority.
  – Lora Italic: quote body text only. Humanist, literary
    register.
  – DM Mono: all UI chrome — dates, labels, buttons,
    weekdays, metadata. Machine-legible precision.

No font is used outside its assigned role. This creates a
visual hierarchy that communicates which layer of the
interface you're reading without needing explicit color
coding.

Color with purpose
The palette is deliberately non-generic:
  – Terracotta #C5401E: human warmth, today marker, quote
    accent, range start. Used sparingly.
  – Deep teal #2A6B6E: range selection, active states,
    date-note context. Calm and directional.
  – Paper #F5F0E8 / Charcoal #1A1714: paper-book opposites
    that don't fight. Not white and black.

On each month change, a monthThemes object shifts the
accent color to harmonize with the month's photograph —
January's snow image shifts accents to ice blue, July's
landscape to amber, October to deep rust.

────────────────────────────────────────────────────────────

## 3. FEATURES — COMPLETE LIST
────────────────────────────────────────────────────────────

### 3.1  CORE REQUIREMENTS

Wall Calendar Aesthetic
  – Wire binding rendered with individual CSS coil elements,
    each with a front and back loop for 3D depth
  – Brass nail at top center with radial gradient and inset
    highlight — casts a drop shadow
  – Paper grain texture overlay using SVG feTurbulence at
    3% opacity — invisible at a glance, physical on close
    inspection
  – Page corner fold (CSS triangle) in the bottom-right,
    matching the wall background color
  – Full-bleed monthly photograph in the hero section —
    12 unique images, one per month
  – Quote carousel overlaid on the image — italic serif
    text, large terracotta quotation mark, author
    attribution

Day Range Selector
  – Two-click range selection: first click sets start
    (terracotta circle), second click sets end (teal circle)
  – In-range days highlighted with a transparent teal band
    — border-top and border-bottom create a "tube of light"
    effect
  – Range duration pill displayed below the grid:
    "Apr 9 → Apr 16 · 8 days"
  – Clear selection button appears when a range is active
  – Visual distinction between start and end anchors —
    different accent colors, not just shape

Integrated Notes
  – Notion-style block editor with three block types:
    heading, text paragraph, and to-do
  – Enter creates a new block below; Backspace on empty
    block deletes it
  – Slash command menu: typing / on an empty block shows
    /h, /todo, /text pills — Tab to convert
  – To-do blocks have checkboxes that toggle strikethrough
  – Drag handle (⠿) appears on hover for reordering
  – Context switching: clicking a date shifts the notes
    panel header to "APR 9" and all writes go to that
    date's note store
  – Clicking "Attach to range" stamps the selected range
    as a heading block at the top of the notes
  – Orange dot indicator on any date cell that has notes
    attached

Fully Responsive Design
  – Desktop: side-by-side notes + calendar grid,
    full-bleed quote section above
  – Mobile (<640px): single column — quote section →
    notes (collapsible) → calendar grid
  – Day cells use aspect-ratio: 1 and font-size:
    clamp(11px, 2.5vw, 15px) for fluid scaling
  – Touch-friendly tap targets — minimum 44px per cell
  – Wire binding reflows to match container width at all
    breakpoints

### 3.2  CREATIVE / STANDOUT FEATURES

Page-flip animation — clockwise / anticlockwise
  Navigating forward rotates the calendar body clockwise
  (rotateY: 0° → 90° → swap content → -90° → 0°).
  Navigating backward rotates anticlockwise. The binding
  stays fixed; only the body below it rotates.
  perspective: 1200px on the parent creates genuine 3D
  depth. The glassmorphism backdrop-filter animates with
  the flip — the blurred background sweeps as the page
  turns.

Month-aware adaptive theming
  Each of the 12 months has a distinct full-bleed
  photograph and a corresponding CSS variable override for
  the accent color, range color, and quote tint. The
  transition between months uses a 0.6s ease on :root CSS
  variables so the entire UI smoothly shifts mood as the
  month changes.

Quote carousel with wipe animation
  8 curated quotes rotate every 3 seconds. The transition
  uses a clip-path wipe — polygon(0 100%...) to
  polygon(0 0...) — so each new quote rises from the
  bottom like a theater curtain. Dot navigation is
  present; clicking any dot jumps directly and resets the
  auto-rotation timer. Each quote has a mood tag
  (· contemplative · / · motivating ·) in small monospace
  below the author.

Holiday markers
  A hardcoded object of public holidays by date shows a
  small accent dot below the date number and a tooltip on
  hover with the holiday name. Covers Indian national
  holidays and major international observances.

Note count badge states
  Date cells show three states via the indicator dot:
  empty circle = has active to-dos, filled orange dot =
  has notes or completed to-dos, no dot = empty.

Year strip navigation
  A thin horizontal strip below the binding shows all 12
  months as two-letter abbreviations. The current month is
  underlined. Clicking any month navigates directly with
  the correct rotation direction calculated automatically
  — clockwise if the target is later in the year,
  anticlockwise if earlier.

────────────────────────────────────────────────────────────

### 4. EXTRA FEATURES
 - weather
 - notes
 - to do list
 - range calculator
 - monthly img changes
 - month strip
 - light/ dark mode toggle
 - wall ui

### 5. TECHNICAL ARCHITECTURE
────────────────────────────────────────────────────────────

Component structure
  – WallCalendar: root component, holds all state
  – QuoteSection: carousel logic, animation, monthly image
  – CalendarGrid: date rendering, range selection, markers
  – NotesPanel: block editor, slash commands, context
  – YearStrip: 12-month navigation, rotation direction
  – ThemeProvider: CSS variable injection, color shifts

State schema
{
  viewMonth, viewYear,
  rangeStart, rangeEnd,
  activeDate,
  notes: {
    global: [...blocks],
    byDate: { "2026-04-14": [...blocks] }
  },
  quoteIndex,
  theme
}

localStorage
  Key: "wallcal_state" — single JSON blob.
  Block objects: { id, type, content, done, createdAt }

Performance
  – backdrop-filter applied only to panels over the photo
  – @supports check with opaque dark fallback
  – Mobile reduces blur from 24px to 12px
  – Adjacent month images preloaded on mount
  – Animations use only transform and opacity

────────────────────────────────────────────────────────────

### 6. RUNNING LOCALLY
────────────────────────────────────────────────────────────

Prerequisites: Node.js ≥ 18, npm ≥ 9

  git clone https://github.com/Lalitya31/TUF_frontend
  cd Frontend
  npm install
  npm run dev

Open http://localhost:5173. No environment variables,
no API keys, no database setup required.

Production build:
  npm run build
  npm run preview

Deploy to Vercel:
  npx vercel --prod

────────────────────────────────────────────────────────────

### 7. CREATIVE CHOICES — DEFENDED
────────────────────────────────────────────────────────────

**Why quotes over a static hero image**
A static mountain photograph in January communicates one
thing once. A rotating quote carousel over that photograph
communicates something different every three seconds —
it makes the calendar feel alive and cared for. The image
provides atmosphere; the quote provides intention.
Together they answer the requirement for "a dedicated space
that serves as the visual anchor" more richly than a
single photograph ever could.

**Why page-flip over slide transition**
Calendars are physical objects you flip, not digital
carousels you swipe. The clockwise/anticlockwise rotation
encodes directionality in a way a horizontal slide cannot.
It also makes the glassmorphism panels earn their visual
weight — you see the frosted glass catching light as the
page turns, which is a moment no other calendar component
produces.

**Why Notion-style blocks over a textarea**
A textarea is where notes go to be forgotten. Block-
structured notes with typed content are where notes get
acted on. The slash command interface is familiar to any
knowledge worker. Attaching blocks to a specific date
range makes the notes spatially meaningful — they belong
to a span of time, not just a document.

**Why month-adaptive color theming**
The single biggest signal of genuine product thinking in
a frontend submission is when the UI feels designed for
the user's context, not just the brief's context. A
calendar in January using the same accent color as July
doesn't respect the emotional reality of those months.
Adaptive theming costs almost nothing to implement and
communicates everything about the designer's attention
to experience.

────────────────────────────────────────────────────────────

### 8. VIDEO WALKTHROUGH — SHOT LIST
────────────────────────────────────────────────────────────

1. Desktop view at full width — show the full calendar
   with the monthly image, wire binding, and quote
   carousel running
2. Navigate forward two months — show clockwise page-flip
   animation twice, note image and accent color changing
3. Navigate back one month — show anticlockwise rotation
4. Select a date range — click start, click end, show
   teal band and duration pill
5. Add a note — type a heading block, a to-do item,
   check it off, use slash command to add another type
6. Attach note to range — click Attach, show range
   heading appearing in notes
7. Click a specific date — show notes panel switching
   context, type a date-specific note
8. Toggle dark/light theme — show warm cream and deep
   charcoal modes
9. Resize to mobile width — show stacked layout,
   demonstrate selection and notes on touch screen

────────────────────────────────────────────────────────────

"Small steps daily create big change." — the calendar
