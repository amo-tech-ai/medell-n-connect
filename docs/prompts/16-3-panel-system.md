# 16 - 3-Panel System Architecture

## I Love Medellín - Layout System

---

## 1. CONTEXT & ROLE

Defining the complete 3-panel layout system for I Love Medellín, establishing the architectural foundation for all screens with clear separation of context, work, and intelligence.

Act as an expert **UI/UX systems architect** specializing in **panel-based layouts with AI integration**.

---

## 2. PURPOSE

Establish the consistent 3-panel layout system that ensures a predictable, intuitive user experience across all screens while integrating AI intelligence contextually.

---

## 3. CORE PRINCIPLE

> **Left = Context (Where am I?)**  
> **Main = Work (What am I doing?)**  
> **Right = Intelligence (Help & Thinking)**

---

## 4. PANEL RESPONSIBILITIES

### Left Panel - Context

**Purpose:** Navigation and orientation

**Contains:**
- Main navigation menu
- Current section indicator
- User profile summary
- Quick filters (context-specific)
- Recent items
- App status

**Never Contains:**
- Editing capabilities
- AI execution
- Primary content
- Forms

**Behavior:**
- Fixed position on desktop
- Collapsible on tablet
- Bottom navigation on mobile

---

### Main Panel - Work

**Purpose:** Primary user workspace

**Contains:**
- Primary content
- Lists and grids
- Detail views
- Forms and editors
- Wizards
- Chat conversations

**Principles:**
- Human-first experience
- All user actions here
- AI assists but never replaces
- Scrollable content

**Behavior:**
- Takes remaining width
- Primary scrolling area
- Focus of user attention

---

### Right Panel - Intelligence

**Purpose:** AI-powered assistance and context

**Contains:**
- AI suggestions
- Key details
- Warnings and alerts
- Optimization offers
- Maps (contextual)
- Related items
- Quick actions

**Principles:**
- AI can PROPOSE, never COMMIT
- Human must APPROVE all changes
- Explain "why" for every suggestion
- Preview before apply

**Behavior:**
- Fixed position on desktop
- Drawer on tablet
- Bottom sheet on mobile

---

## 5. WIREFRAME (ASCII)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Logo     🏠 Home  💬 Chat  ✈️ Trips  🔍 Explore  ...                     │
├──────────────┬─────────────────────────────────────────┬───────────────────┤
│              │                                         │                   │
│  LEFT PANEL  │              MAIN PANEL                 │   RIGHT PANEL     │
│    240px     │              (flexible)                 │     320px         │
│              │                                         │                   │
│ ──────────── │  ┌─────────────────────────────────┐   │  AI ACTIONS       │
│ 🏠 Home     │  │                                 │   │  ─────────────    │
│ 💬 Chats    │  │    Primary Content Area         │   │  💡 Suggestion 1  │
│ ✈️ Trips    │  │                                 │   │  💡 Suggestion 2  │
│ 🔍 Explore  │  │    - Lists                      │   │  ⚠️ Warning       │
│ 📅 Events   │  │    - Details                    │   │                   │
│ 🍽️ Food     │  │    - Forms                      │   │  KEY DETAILS      │
│ 🏠 Rentals  │  │    - Wizards                    │   │  ─────────────    │
│ 💾 Saved    │  │    - Chat                       │   │  • Detail 1       │
│ 🤖 AI       │  │                                 │   │  • Detail 2       │
│              │  │                                 │   │  • Detail 3       │
│ ──────────── │  │                                 │   │                   │
│ ➕ Create   │  │                                 │   │  BOOKINGS         │
│ ⚙️ Settings │  │                                 │   │  ─────────────    │
│ 👤 Profile  │  └─────────────────────────────────┘   │  📅 Upcoming...   │
│              │                                         │                   │
└──────────────┴─────────────────────────────────────────┴───────────────────┘
```

---

## 6. RIGHT PANEL SECTIONS

The right panel adapts based on context:

### Common Sections

| Section | Purpose | When Shown |
|---------|---------|------------|
| AI Actions | AI suggestions and actions | Always |
| Key Details | Relevant context info | Detail pages |
| Warnings | Issues and conflicts | When detected |
| Bookings | Active bookings | Booking-related pages |
| Map | Location context | Location pages |
| Similar | Related items | Detail pages |

### Per-Screen Right Panel

| Screen | Right Panel Content |
|--------|---------------------|
| Dashboard | Recommendations, Reminders, Weather |
| Chat | Context per tab (Map, Trips, Bookings) |
| Trips List | Upcoming alerts, Weather |
| Trip Detail | Trip Tools (AI Actions, Itinerary, Bookings) |
| Apartments List | Map, Suggestions, Quick stats |
| Apartment Detail | Neighborhood Score, Value Analysis |
| Cars List | Map, Price comparison |
| Car Detail | Cost breakdown, Insurance |
| Restaurants List | Map, Tonight's picks |
| Restaurant Detail | Fit Score, Availability |
| Events List | Calendar, Events for you |
| Event Detail | Venue map, Before/after suggestions |
| Saved | Based on saves, Collections |
| Explore | Map with pins, Near you |

---

## 7. AI ACTION PATTERNS

### Preview → Apply → Undo

All AI actions follow this pattern:

1. **Suggest:** AI proposes action in right panel
2. **Preview:** User sees what will change
3. **Apply:** User explicitly approves
4. **Undo:** User can reverse action

### Action Types

| Type | Example | Requires Preview |
|------|---------|------------------|
| Navigate | "View restaurant" | No |
| Add | "Add to trip" | Yes |
| Modify | "Optimize route" | Yes |
| Delete | "Remove item" | Yes |
| Book | "Make reservation" | Yes |

---

## 8. RESPONSIVE BEHAVIOR

### Desktop (1200px+)

```
┌──────────────┬────────────────────────────┬──────────────┐
│  Left Panel  │        Main Panel          │ Right Panel  │
│    240px     │         flexible           │    320px     │
│   (fixed)    │        (scrolls)           │   (fixed)    │
└──────────────┴────────────────────────────┴──────────────┘
```

- All 3 panels visible
- Left and right fixed
- Main panel scrolls

### Tablet (768px - 1199px)

```
┌──────────────┬────────────────────────────┐ ┌────────────┐
│  Left Panel  │        Main Panel          │ │   Right    │
│    200px     │         flexible           │ │   Drawer   │
│ (collapsible)│        (scrolls)           │ │ (overlay)  │
└──────────────┴────────────────────────────┘ └────────────┘
```

- Left panel collapsible to icons
- Right panel as slide-in drawer
- Toggle button to open right

### Mobile (< 768px)

```
┌────────────────────────────────────────────┐
│                Main Panel                   │
│              (full screen)                  │
│               (scrolls)                     │
└────────────────────────────────────────────┘
┌────────────────────────────────────────────┐
│  🏠   💬   ✈️   🔍   📅   👤               │
│         Bottom Navigation Bar               │
└────────────────────────────────────────────┘
```

- Main panel full screen
- Left panel as bottom nav bar
- Right panel as bottom sheet (swipe up)

---

## 9. PANEL TRANSITIONS

### Left Panel Collapse

- Animate width from 240px to icon-only
- Icon tooltips on hover
- Persist state in user preferences

### Right Panel Drawer

- Slide in from right
- Overlay with backdrop
- Close on backdrop click
- Close on escape key

### Mobile Bottom Sheet

- Swipe up to reveal
- Swipe down to dismiss
- Stops at 50% and 100%
- Handle indicator at top

---

## 10. COMPONENT STRUCTURE

### Shell Component
- Contains all 3 panels
- Manages responsive behavior
- Handles transitions

### Left Panel Component
- Navigation items
- Collapse logic
- Active state

### Main Panel Component
- Content router
- Scroll container
- Loading states

### Right Panel Component
- Section renderer
- Context-aware content
- Action handlers

---

## 11. STATE MANAGEMENT

### Panel State
- Left collapsed (boolean)
- Right visible (boolean)
- Active nav item (string)

### Context State
- Current page/route
- Selected item (if detail)
- User preferences

### AI State
- Current suggestions
- Pending actions
- Action history (for undo)

---

## 12. ACCESSIBILITY

**Keyboard Navigation:**
- Tab through panels
- Arrow keys in nav
- Escape to close drawers
- Focus management

**Screen Readers:**
- Landmark regions
- Panel labels
- Live regions for AI updates

**Visual:**
- High contrast mode
- Reduced motion option
- Focus indicators

---

## 13. IMPLEMENTATION NOTES

**CSS Grid:**
- Use CSS Grid for panel layout
- Named grid areas
- Responsive with media queries

**Components:**
- Reusable panel wrappers
- Slot-based content
- Context providers

**Performance:**
- Lazy load right panel content
- Virtualize long lists in main
- Debounce AI suggestions

---

## 14. SUCCESS CRITERIA

- All screens follow 3-panel layout
- Panels have clear separation
- Right panel is contextual
- AI actions use Preview → Apply
- Responsive across devices
- Smooth transitions
- Accessible to all users

---

## 15. TESTING & VERIFICATION

### Unit Tests:
- [ ] 3-panel layout renders correctly
- [ ] Panels resize correctly
- [ ] Navigation works in left panel
- [ ] Right panel updates contextually
- [ ] Preview → Apply flow works

### Integration Tests:
- [ ] Layout persists across routes
- [ ] Context updates correctly
- [ ] AI actions work in right panel
- [ ] Responsive breakpoints work
- [ ] Accessibility features work

### Manual Verification:
1. Navigate between pages - layout consistent
2. Test desktop - 3 panels visible
3. Test tablet - 2 panels visible
4. Test mobile - panels collapse correctly
5. Test right panel - context updates
6. Test AI actions - preview works
7. Test accessibility - keyboard navigation works

### Production Readiness:
- [ ] Layout works on all devices
- [ ] No layout shifts
- [ ] Smooth transitions
- [ ] Accessible (WCAG AA)
- [ ] Performance acceptable

---

## 16. REAL-WORLD EXAMPLE

**User Journey: Using 3-Panel Layout**

1. User on Apartments page
2. Left panel: Navigation, saved apartments
3. Main panel: Apartment list with filters
4. Right panel: Map with pins, AI suggestions
5. User clicks apartment
6. Main panel: Apartment detail
7. Right panel: AI fit score, booking suggestions
8. User clicks "Book Now"
9. Main panel: Booking wizard
10. Right panel: Contract review AI

**Result:** Clear separation, contextual help, efficient workflow

---

## 17. OPTIMIZATION NOTES

**Avoid Over-Engineering:**
- Simple 3-panel layout first
- Basic responsive behavior
- Don't need complex animations yet
- Don't need advanced panel management yet

**Production Focus:**
- Consistent layout
- Clear panel separation
- Good responsive behavior
- Accessible design

---

**Previous Prompt:** 15-home-dashboard.md  
**Next Prompt:** 17-user-journey.md
