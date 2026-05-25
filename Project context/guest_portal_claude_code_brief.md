# Guest Portal — Claude Code Build Brief
**Hostaway Product Design  |  Interactive Prototype  |  Iteration v2  |  Guest Portal Session Only**

Last updated: May 2026 | Owner: Anfisa Bogomolova | For: Claude Code

---

## 0. Session Scope — Read This First

> **This session covers the guest-facing portal only. PM Settings is a separate session.**

### 0.1 This session: Guest Portal (Surface A)

Iterate on the existing prototype codebase. **Do not start from scratch.** The prototype is already responsive and working well — this session applies targeted changes based on the feedback below.

- Scope: Home tab, Check-in tab, access reveal post-completion, Guidebooks placeholder toggle
- All data: hardcoded, no backend, no auth

### 0.2 Separate session: PM Settings (Surface B)

**PM Settings — the host-facing template management and Guest Experience hub — is explicitly out of scope for this session. Do not build it, scaffold it, or add routing/state for it.**

You need to understand it for system-level thinking (it drives what content the guest portal receives), but you are not designing or building it here.

What PM Settings will eventually cover (context only, do not build):

- Guest Experience hub — new top-level area in the PMS for all guest portal configuration
- Global templates — create/edit templates applied across multiple listings, with bulk assignment
- Check-in instructions setup — video, images, rich text, per-listing or template-level
- Conditional logic — when to show/hide door codes based on check-in date, compliance, payment status

The data contract connecting the two surfaces is a simple JSON shape (property name, logo URL, door code, WiFi, instructions, upsell items). In this session that data is hardcoded. The PM Settings session will build the UI that produces it.

---

## 1. Start Here: Existing Codebase

> ⚠️ Do not start from scratch. The prototype already exists and works. Your job is to iterate on it.

Anfi will paste the existing code into this conversation. Before making any changes:

1. Read the full existing code
2. Identify the component structure and state model
3. Confirm your understanding back to Anfi
4. Only then begin making changes

Make targeted edits to existing components — do not rewrite what already works. Follow the existing code's patterns. This brief describes desired outcomes, not a prescribed implementation.

After each significant change, confirm with Anfi before continuing. Do not bundle all changes into one pass.

---

## 2. Why This Matters

The current portal is a single-page experience guests cannot navigate. Key problems from PM interviews:

- Guests receive 3–5 separate links. **Single link is the #1 ask** from every PM interviewed.
- Door codes, WiFi, and access instructions are buried. Guests can't find them quickly.
- 7/32 weekly check-ins are still incomplete the day before arrival — guests arrive without codes.
- PMs with 50+ listings cannot manage per-listing. Templates are non-negotiable at scale.
- Current portal looks "really basic" — doesn't match PM's own professional website quality.

Competitive benchmark: **Enso Connect's Boarding Pass** (single link, all steps unified) is the UX bar. Breezeway and Operto being used on top of Hostaway is a direct churn signal this redesign must close.

---

## 3. Iteration Changes — v2 Delta from Existing Prototype

These are the specific changes to make. Everything not listed here should remain as-is.

### 3.1 Add sticky bottom tab bar

Add an app-like sticky bottom nav bar. It must:

- Contain 4 tabs: **Home** (house icon), **Check-in** (key icon), **Guide** (compass icon — greyed/locked by default), **Explore** (grid icon — stub, tappable but no content)
- Stay sticky — never scrolls away with page content
- Show active tab with a teal/brand colour underline indicator
- Show icon + label on each tab

The Guide tab connects to the Guidebooks placeholder (Section 5). Default state: greyed out with a lock icon.

### 3.2 Merge check-in flow + access instructions into Check-in tab

The current flow has "Arrival guide" and "Get inside" as locked cards on the Home tab. **Remove those cards.** Everything moves into the Check-in tab.

**Check-in tab — pre-completion state** (runs the existing multi-step form):

- Step 1: Personal details — keep as-is (name, surname, email, DOB, arrival time)
- Step 2: Document — keep as-is (passport/ID/license selector + fields)
- Step 3: Rental agreement + signature — keep as-is
- Step 4: Confirmation screen — keep "Pack your bags" screen

**Check-in tab — post-completion state** (new screen to add after Step 4):

- Door code displayed prominently (large, bold, easy to copy)
- WiFi name + password
- Step-by-step arrival instructions (text block + image placeholder)
- Host contact: name + phone number

> 🔴 **HARD CONSTRAINT: Door code and access instructions are NEVER visible in the pre-completion state. The gate is absolute — no exceptions.**

### 3.3 Update Home tab — two states

**Pre-check-in state** (update existing):

- Remove the locked "Arrival guide" and "Get inside" cards — they now live in the Check-in tab
- Keep: reservation card, arrival checklist with progress bar, "Check in" Start CTA
- The "Check in" CTA navigates to the Check-in tab

**Post-check-in state** (existing — keep as-is):

- Checklist collapsed and marked Complete with green checkmark
- Upsell cards visible (horizontal scroll)
- House rules, amenities, property info as collapsible accordions

### 3.4 Add logo to header

- Position: top-left of portal header, visible on all screens
- **Empty/default state:** grey rounded rectangle, text "Your logo here"
- **Populated state:** logo image, max 120px wide, vertically centred in header
- Use the placeholder in the prototype — in the real product this is configured in PM Settings

### 3.5 Arrival time field — no default value

- The arrival time input on Step 1 must have **no pre-selected value**
- Field is blank — guest must actively choose a time
- "Continue" is active regardless (no validation blocking in prototype)

> Cleaning/ops scheduling depends on this data. A silent default corrupts ops data.

---

## 4. Empty State vs. Populated State

> ⚠️ Design for both explicitly. The portal must work even when a PM has done minimal setup.

### 4.1 Populated state (demo default)

Hardcode the following as the default demo content:

| Field | Value |
|---|---|
| Property name | Brisa Deluxe Studio |
| Property photo | Warm interior placeholder (as in existing screenshots) |
| Guest name | Maria Alvarez |
| Check-in date | Wed, 31 Oct |
| Check-out date | Thu, 01 Nov |
| Door code | 4821 |
| WiFi name | Brisa_Guest |
| WiFi password | sunshine2024 |
| Access note | Use the keypad on the front door. Code resets at checkout. |
| Host name | Sofia Mendes |
| Host phone | +351 912 345 678 |
| Upsell items | Bike rental (€25/person), Sauna (FREE), City walking tour (€18/person) |

### 4.2 Empty state (minimal PM setup)

Add a **dev/demo toggle** (hidden from the main guest flow) to switch between populated and empty states. When empty state is active:

- **No check-in instructions:** Show card — "Your host will share arrival instructions closer to your check-in date. Questions? Use the chat below."
- **No upsells:** Hide the section entirely. No empty card placeholders.
- **No logo:** Show the grey "Your logo here" placeholder.
- **No house rules:** Collapse section with muted text — "No house rules added yet."

---

## 5. Guidebooks — Placeholder Only

> 🔮 Q4+ future direction. Not in MVP scope. Scaffold only — no real content or interactions.

Guidebooks are a Q4 strategic bet that still need proper discovery and design. **Do not build guidebook content or interactions.** Include a togglable placeholder so stakeholders can see the future navigation pattern in demos.

### 5.1 Why this matters (context only)

- During-stay becomes useful: local recommendations, appliance guides, troubleshooting
- AI has a knowledge base to draw from — Q&A becomes automatable
- PM support burden drops: "How to use sauna" → guide link, not a WhatsApp message
- Breezeway and Touchstay are used by PMs today specifically because of this layer

### 5.2 What to build

Add a toggle in the dev/demo panel labelled "Enable Guidebooks module".

**When ON:**

- Guide tab becomes active (not greyed) in the bottom nav
- Guide tab shows a placeholder screen: Local Recommendations, Appliance Guides, House Rules, Troubleshooting
- 1–2 non-functional stub cards per section (image placeholder + title + short description only)
- Banner at top: "Coming soon — Your host will add local tips and guides here."

**When OFF (default):**

- Guide tab visible in nav but greyed out with lock icon
- Tapping shows tooltip: "Guidebooks coming soon"

> 🔴 No real guidebook interactions, content editing, or AI features. Visual placeholder only.

---

## 6. Technical Constraints

| Constraint | Rule |
|---|---|
| Framework | React, functional components, hooks |
| Styling | Tailwind CSS — follow whatever approach is already in the codebase |
| State | Follow existing state patterns |
| Backend | None. All data hardcoded. No API calls. |
| Icons | lucide-react |
| Form validation | Not required — Continue/Complete buttons advance state only |
| Auth | None |

---

## 7. Non-Negotiable Design Constraints

| Constraint | Rule |
|---|---|
| Door code gating | NEVER visible before check-in form 100% complete. No exceptions. |
| Single link | Everything in one URL. No navigation away to external pages mid-flow. |
| Arrival time | No default value. Guest must actively select. |
| Logo | Always shown in header. Placeholder if not set — never an empty header. |
| Tab bar | Sticky. Always visible. Never scrolls with content. |
| Progress bar | On every check-in step. Accurate percentage. |
| Compliance banner | "Why do we ask this?" must appear on the personal details step. |
| PM Settings | Not in this session. Do not scaffold or stub it. |

---

## 8. Success Criteria

The prototype is ready for design crit and stakeholder review when:

- A tester can open the portal, complete all check-in steps, and see the door code revealed without any help
- Bottom tab bar is present and all tabs are tappable
- Check-in tab and Home tab both have correct pre- and post-completion states
- Logo placeholder is visible in the header on every screen
- Guidebooks toggle works: ON = active tab with stub content, OFF = greyed tab with tooltip
- Both populated and empty states work when the demo toggle is set
- All changes are additions/edits to existing code — no working screens regressed

---

## 9. Out of Scope for This Session

- PM Settings / Guest Experience hub — separate session
- Real guidebook content, AI chatbot, or generative features
- White-labelling configuration beyond the logo placeholder
- Authority reporting / compliance data submission
- Multi-language support
- Upsell purchase flows (cards display only)
- Form validation or error states
- Custom domain routing or multi-portal architecture

---

## 10. Screen Reference Summary

| Screen | Source | Action |
|---|---|---|
| Home — pre check-in | Existing prototype | Update: add tab bar, logo, remove locked arrival cards |
| Home — post check-in | Existing prototype | Update: add tab bar, logo |
| Check-in step 1 — Personal details | Existing prototype | Keep — arrival time field: no default |
| Check-in step 2 — Document | Existing prototype | Keep as-is |
| Check-in step 3 — Rental agreement | Existing prototype | Keep as-is |
| Check-in step 4 — Confirmation | Existing prototype | Keep as-is |
| Check-in complete — Access revealed | New | Door code, WiFi, arrival instructions (post-completion only) |
| Guide tab — Guidebooks placeholder | New | Toggled via demo panel |

---

*UX Research — Hostaway Product Design — May 2026*
