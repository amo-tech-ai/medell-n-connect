#!/usr/bin/env node
/**
 * One-shot: prepend YAML frontmatter to tasks/screens/*-wire-*.md
 * and fix wireframes: paths in *-scr-*.md
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = join(import.meta.dirname, "../tasks/screens");

const WIRE_META = {
  "001-wire-home-chat.md": {
    title: "Home / Concierge Chat",
    persona: "Camila, Tourist",
    path: "/",
    priority: "P0",
    screens: ["001-scr-home-chat-chrome.md"],
    screen_ids: ["SCREEN-001"],
    build_status: "Done",
  },
  "002-wire-rental-search.md": {
    title: "Rental Search (in-thread)",
    persona: "Camila",
    path: "/",
    priority: "P0",
    screens: ["004-scr-workflow-progress-strip.md", "005-scr-rental-card-polish.md", "008-scr-schedule-viewing-modal.md"],
    screen_ids: ["SCREEN-004", "SCREEN-005", "SCREEN-008"],
    build_status: "Done",
  },
  "003-wire-event-discovery.md": {
    title: "Event Discovery (in-thread)",
    persona: "Tourist, Andrés",
    path: "/",
    priority: "P0",
    screens: ["006-scr-event-card-polish.md"],
    screen_ids: ["SCREEN-006"],
    build_status: "Done",
  },
  "004-wire-venue-detail.md": {
    title: "Venue / Listing Detail (sheet)",
    persona: "All",
    path: "overlay",
    priority: "P1",
    screens: ["007-scr-venue-detail-sheet.md"],
    screen_ids: ["SCREEN-007"],
    build_status: "Done",
  },
  "005-wire-itinerary-planner.md": {
    title: "Itinerary Tab",
    persona: "Camila",
    path: "right tab / trips",
    priority: "P1",
    screens: ["013-scr-itinerary-panel.md"],
    screen_ids: ["SCREEN-013"],
    build_status: "Done",
  },
  "006-wire-booking-checkout.md": {
    title: "Booking Checkout (modal)",
    persona: "Andrés, Camila",
    path: "modal",
    priority: "P0",
    screens: ["008-scr-schedule-viewing-modal.md", "009-scr-booking-checkout-modal.md"],
    screen_ids: ["SCREEN-008", "SCREEN-009"],
    build_status: "Done",
  },
  "007-wire-saved-collections.md": {
    title: "Saved Collections",
    persona: "Camila",
    path: "/saved",
    priority: "P1",
    screens: ["011-scr-saved-collections-page.md"],
    screen_ids: ["SCREEN-011"],
    build_status: "Done",
  },
  "008-wire-map-exploration.md": {
    title: "Map Exploration Panel",
    persona: "Tourist",
    path: "right panel",
    priority: "P1",
    screens: ["010-scr-map-exploration-panel.md"],
    screen_ids: ["SCREEN-010"],
    build_status: "Not Started",
  },
  "009-wire-contest-discovery.md": {
    title: "Contest Discovery",
    persona: "Tourist",
    path: "/contests",
    priority: "P2",
    screens: [],
    screen_ids: [],
    build_status: "Frozen",
    phase: "Phase 2+",
  },
  "010-wire-nightlife-explorer.md": {
    title: "Nightlife Explorer",
    persona: "Tourist",
    path: "/nightlife",
    priority: "P2",
    screens: [],
    screen_ids: [],
    build_status: "Frozen",
    phase: "Phase 2+",
  },
  "011-wire-creator-dashboard.md": {
    title: "Creator Dashboard",
    persona: "Creator",
    path: "/creator",
    priority: "P2",
    screens: [],
    screen_ids: [],
    build_status: "Frozen",
    phase: "Phase 2+",
  },
  "013-wire-mindtrip-patterns.md": {
    title: "Mindtrip Observed Patterns",
    persona: "—",
    path: "reference",
    priority: "—",
    screens: [],
    screen_ids: [],
    build_status: "Reference",
    reference_only: true,
  },
  "014-wire-chat-chrome.md": {
    title: "Chat Chrome (nav, filters, workflow)",
    persona: "Camila",
    path: "/",
    priority: "P0",
    screens: [
      "001-scr-home-chat-chrome.md",
      "002-scr-chat-nav-rail.md",
      "003-scr-chat-query-bar.md",
      "004-scr-workflow-progress-strip.md",
      "018-scr-mobile-responsive-shell.md",
    ],
    screen_ids: ["SCREEN-001", "SCREEN-002", "SCREEN-003", "SCREEN-004", "SCREEN-018"],
    build_status: "Mixed",
  },
  "015-wire-rentals-browse.md": {
    title: "Rentals Browse (catalog)",
    persona: "Camila",
    path: "/rentals",
    priority: "P1",
    screens: [],
    screen_ids: [],
    build_status: "Frozen",
    phase: "Phase 2+",
  },
  "016-wire-explore-unified.md": {
    title: "Explore Unified",
    persona: "Tourist",
    path: "/explore",
    priority: "P2",
    screens: [],
    screen_ids: [],
    build_status: "Frozen",
    phase: "Phase 2+",
  },
  "017-wire-trips-dashboard.md": {
    title: "Trips Dashboard",
    persona: "Camila",
    path: "/trips",
    priority: "P1",
    screens: ["012-scr-trips-dashboard.md"],
    screen_ids: ["SCREEN-012"],
    build_status: "Done",
  },
  "018-wire-trip-workspace.md": {
    title: "Trip Workspace (full tabs)",
    persona: "Camila",
    path: "/trips/:id",
    priority: "P1",
    screens: ["013-scr-itinerary-panel.md"],
    screen_ids: ["SCREEN-013"],
    build_status: "Done",
  },
  "019-wire-event-detail-page.md": {
    title: "Event Detail Page",
    persona: "Andrés",
    path: "/events/:slug",
    priority: "P0",
    screens: ["014-scr-event-detail-page.md"],
    screen_ids: ["SCREEN-014"],
    build_status: "Done",
  },
  "020-wire-my-tickets-qr.md": {
    title: "My Tickets + QR",
    persona: "Andrés",
    path: "/me/tickets",
    priority: "P1",
    screens: ["015-scr-my-tickets-qr.md"],
    screen_ids: ["SCREEN-015"],
    build_status: "Done",
  },
  "021-wire-bookings-inbox.md": {
    title: "Bookings Inbox",
    persona: "Camila",
    path: "/bookings",
    priority: "P1",
    screens: [],
    screen_ids: [],
    build_status: "Frozen",
    phase: "Phase 5+",
  },
  "022-wire-host-event-wizard.md": {
    title: "Host Event Wizard",
    persona: "Roberto",
    path: "/host/event/new",
    priority: "P0",
    screens: ["016-scr-host-event-wizard.md"],
    screen_ids: ["SCREEN-016"],
    build_status: "Done",
  },
  "023-wire-onboarding-wizard.md": {
    title: "Onboarding Wizard",
    persona: "New user",
    path: "/onboarding",
    priority: "P2",
    screens: [],
    screen_ids: [],
    build_status: "Deferred",
    phase: "Phase 2+",
  },
  "024-wire-auth-login-signup.md": {
    title: "Login / Signup",
    persona: "All",
    path: "/login",
    priority: "P0",
    screens: ["017-scr-login-signup-polish.md"],
    screen_ids: ["SCREEN-017"],
    build_status: "Not Started",
  },
  "025-wire-notifications.md": {
    title: "Notifications",
    persona: "Camila",
    path: "/notifications",
    priority: "P2",
    screens: [],
    screen_ids: [],
    build_status: "Deferred",
    phase: "Phase 2+",
  },
  "026-wire-cafe-listings-map-booking.md": {
    title: "Cafe Listings + Map + Booking",
    persona: "Tourist, Camila",
    path: "/ (café mode)",
    priority: "P1",
    screens: ["026-scr-cafe-listings-map-booking.md"],
    screen_ids: ["SCREEN-021"],
    build_status: "In Progress",
  },
};

function yamlList(arr) {
  if (!arr.length) return "  []";
  return arr.map((x) => `  - ${x}`).join("\n");
}

function frontmatter(name, meta) {
  const num = name.slice(0, 3);
  const lines = [
    "---",
    "type: wireframe",
    `id: WIRE-${num}`,
    `number: "${num}"`,
    `title: ${meta.title}`,
    `persona: ${meta.persona}`,
    `path: ${meta.path}`,
    `priority: ${meta.priority}`,
    `build_status: ${meta.build_status}`,
    "screens:",
    yamlList(meta.screens),
    "screen_ids:",
    yamlList(meta.screen_ids),
    "skill:",
    "  - mde-wireframe",
  ];
  if (meta.phase) lines.push(`phase: ${meta.phase}`);
  if (meta.reference_only) lines.push("reference_only: true");
  lines.push("---", "");
  return lines.join("\n");
}

for (const name of Object.keys(WIRE_META)) {
  const path = join(DIR, name);
  let body = readFileSync(path, "utf8");
  if (body.startsWith("---")) {
    const end = body.indexOf("---", 3);
    if (end !== -1) body = body.slice(end + 3).replace(/^\n/, "");
  }
  // strip duplicate H1 title line if it matches old pattern
  body = body.replace(/^# Wireframe:.*\n\n/, "");
  const meta = WIRE_META[name];
  writeFileSync(path, frontmatter(name, meta) + `# Wireframe: ${meta.title}\n\n` + body);
  console.log("wire:", name);
}

// Fix scr wireframes paths
const SCR_WIRE = {
  "001-scr-home-chat-chrome.md": ["001-wire-home-chat.md", "014-wire-chat-chrome.md"],
  "002-scr-chat-nav-rail.md": ["014-wire-chat-chrome.md"],
  "003-scr-chat-query-bar.md": ["014-wire-chat-chrome.md"],
  "004-scr-workflow-progress-strip.md": ["014-wire-chat-chrome.md", "002-wire-rental-search.md"],
  "005-scr-rental-card-polish.md": ["002-wire-rental-search.md"],
  "006-scr-event-card-polish.md": ["003-wire-event-discovery.md"],
  "007-scr-venue-detail-sheet.md": ["004-wire-venue-detail.md"],
  "008-scr-schedule-viewing-modal.md": ["006-wire-booking-checkout.md", "002-wire-rental-search.md"],
  "009-scr-booking-checkout-modal.md": ["006-wire-booking-checkout.md"],
  "010-scr-map-exploration-panel.md": ["008-wire-map-exploration.md"],
  "011-scr-saved-collections-page.md": ["007-wire-saved-collections.md"],
  "012-scr-trips-dashboard.md": ["017-wire-trips-dashboard.md"],
  "013-scr-itinerary-panel.md": ["005-wire-itinerary-planner.md", "018-wire-trip-workspace.md"],
  "014-scr-event-detail-page.md": ["019-wire-event-detail-page.md"],
  "015-scr-my-tickets-qr.md": ["020-wire-my-tickets-qr.md"],
  "016-scr-host-event-wizard.md": ["022-wire-host-event-wizard.md"],
  "017-scr-login-signup-polish.md": ["024-wire-auth-login-signup.md"],
  "018-scr-mobile-responsive-shell.md": ["014-wire-chat-chrome.md"],
  "019-scr-loading-error-empty-states.md": ["001-wire-home-chat.md"],
  "020-scr-accessibility-pass.md": ["014-wire-chat-chrome.md"],
};

for (const [scr, wires] of Object.entries(SCR_WIRE)) {
  const path = join(DIR, scr);
  let text = readFileSync(path, "utf8");
  const wireYaml = "wireframes:\n" + wires.map((w) => `  - ${w}`).join("\n");
  if (/wireframes:\n(?:  - .+\n)+/.test(text)) {
    text = text.replace(/wireframes:\n(?:  - .+\n)+/, wireYaml + "\n");
  } else {
    text = text.replace(/^---\n([\s\S]*?)---\n/m, (m, fm) => {
      if (fm.includes("wireframes:")) return m;
      return `---\n${fm}wireframe: ${wires[0]}\n${wireYaml}\n---\n`;
    });
  }
  // fix body markdown links
  text = text.replace(/\]\(\.\.\/\.\.\/screens\/wireframes\/[^)]+\)/g, (match) => {
    const old = match.match(/\/([^/)]+)\)/)?.[1];
    if (!old) return match;
    const num = old.match(/^(\d+)-/)?.[1]?.padStart(3, "0");
    const slug = old.replace(/^\d+-/, "");
    if (num && wires.some((w) => w.includes(slug))) {
      const wire = wires.find((w) => w.includes(slug)) ?? `${num}-wire-${slug}.md`;
      return `](${wire})`;
    }
    return match;
  });
  for (const w of wires) {
    const slug = w.replace(/^\d+-wire-/, "").replace(/\.md$/, "");
    text = text.replace(
      new RegExp(`- \\[\\d+-${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.md\\]\\([^)]+\\)`, "g"),
      `- [${w}](${w})`,
    );
  }
  writeFileSync(path, text);
  console.log("scr:", scr);
}

console.log("done");
