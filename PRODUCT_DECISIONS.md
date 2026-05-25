# Guest Portal — Product Decisions & Behavior Log

Living document. Records all confirmed behavior rules, design decisions, and system logic from product feedback sessions. Intended for handoff to the product and engineering team.

---

## 1. Upsell System

### 1.1 Product States

| State | Trigger | UI behavior |
|---|---|---|
| Default | Item not added, not OTA | Clickable card with chevron → opens UpsellCheckout |
| Added (FREE) | Guest confirmed a free item | Trash icon button appears bottom-right; tap removes |
| Included | `addedByOTA: true` | "Included" pill, card not clickable, no actions |

**Rule:** If a product was added by the OTA (e.g. airport transfer), the status must show "Included" with no ability to open, read more, or interact. There is nothing the guest can do about it — it's already part of their reservation.

### 1.2 Pricing Display

**Rule:** Flat / one-time fees show price only — no unit label.  
**Rule:** Recurring or per-use fees show price + unit.

| Unit type | Example | Display |
|---|---|---|
| Flat fee | Early check-in, Late check-out, Airport transfer | `€20` |
| Per night | Parking spot, Extend stay | `€8 / per night` |
| Per person | City walking tour | `€18 / per person` |

"Per reservation" and "per transfer" are equivalent to flat fees — never display them.

### 1.3 UpsellCheckout Flow (2-step)

All upsell purchases — regardless of entry point (Upsells tab, Homepage cards, Amenities search, Access page parking) — go through the same 2-step checkout. **No legacy bottom-sheet drawer anywhere.**

**Step 1 — Product detail**
- Progress bar at 50%
- Back button hidden (`hideBack`)
- Hero image (with horizontal margins + rounded corners)
- Extended description paragraphs
- Price (no unit for flat fees)
- Availability note if `requiresRequest: true`
- CTA: `"Add for free"` / `"Continue to payment"` / `"Request for €X"`
- FREE items: clicking CTA confirms immediately, navigates back (no Step 2)

**Step 2 — Payment**
- Progress bar at 100%
- Back button → returns to Step 1
- Payment methods: 3 primary (Apple Pay, Google Pay, Credit/Debit card) visible by default; remaining options (iDEAL, Bancontact, Klarna…) in "Show more" accordion
- Card details section: labeled fields — Card number (with Mastercard icon), Cardholder name, Expiry date, CVC (with icon)
- "Payments are encrypted and secure" note
- **No order summary or remove buttons in payment step.** If guest wants to cancel, they close the screen.
- Request items (`requiresRequest: true`): no payment methods shown — only info banner ("No charge yet") + "Send a request" CTA

**Success screen**
- Background: pack-your-bags illustration
- Confetti animation
- Teal checkmark icon
- Title: `"Payment confirmed! 🎉"`
- Subtitle: `"Nothing to worry about — your payment went through and everything is sorted."`
- CTA: `"Go back home"` → navigates to Homepage

### 1.4 CTA Button Labels

| Scenario | Label |
|---|---|
| FREE item | `Add for free` |
| Paid, request required | `Request for €X` → Step 2: `Send a request` |
| Paid, direct purchase | `Continue to payment` → Step 2: `Pay €X.XX` |

Price always includes `.00` (e.g. `€20.00`). No unit in CTA button.

---

## 2. Check-in Flow

### 2.1 Step Structure & Progress

| Cart state | Steps | Progress per step |
|---|---|---|
| No extras | 4 steps | 25% each |
| Has extras (upsells added) | 5 steps | 20% each |

Steps: Personal details → Guests → (Unlock) → Agreements → Payment → Confirmation

### 2.2 Step 1 — Personal Details

**Fields in order:**
1. Compliance banner ("Why do we ask these questions?") — collapsible, shown by default
2. First name (required)
3. Last name (required)
4. Email address (required)
5. Phone number (required) — see §2.3
6. Date of birth (required)
7. — divider — Contact details
8. Postal code + City (side by side)
9. Street address
10. — divider — Personalize your stay
11. Estimated arrival time (required) — triggers ArrivalTimeBottomSheet
12. Travel purpose (card selector: Leisure / Business / Both)
13. Car registration (optional)

**Removed:** Amenity / extras search input. This was added without being requested and must not appear in Step 1.

### 2.3 Phone Input

- Country flag displayed left of input, auto-detected from the number typed
- No chevron, no dropdown country picker (not functional yet)
- Full number including country code typed in one field
- Format hint in placeholder: `+351 (___) ___ - ____`
- Validation: must start with `+`, minimum 8 digits

### 2.4 Arrival Time

- Tapping field opens `ArrivalTimeBottomSheet`
- Standard slots: no extra charge
- Early slots (before standard check-in): triggers early check-in upsell, auto-adds to cart, badge `"extra fee"` shown on the field
- No default value — field starts empty, required

### 2.5 Step 5 — Payment

**Empty state (no extras in cart):**
- Simple checkmark icon (teal ring + checkmark, no decorative elements)
- Title: `"Nothing to pay"`
- Subtitle: `"No extras were added to your stay. Tap Complete to finish your check-in."` — **no bold text anywhere in subtext**
- CTA: `"Complete"`

**With extras:**
- Same payment UI as UpsellCheckout Step 2 (see §1.3)
- Order summary shown at bottom with × remove buttons per item
- Total displayed
- CTA: `"Pay €X"`

### 2.6 Step 6 — Confirmation

- "All done" CTA calls `onCheckInComplete()` then navigates to Homepage
- `checkInComplete` flag set to `true`
- Tab bar switches to Access tab

---

## 3. Access Tab (Post Check-in)

### 3.1 Gate

Accessible **only** when `checkInComplete = true`. Pre-completion shows locked state with "Check in first" prompt + CTA to start/resume check-in.

### 3.2 Content (populated)

- Door code: **4821** — displayed, **no copy button** (security: code should not be casually copied)
- WiFi: network `Brisa_Guest`, password `sunshine2024`, copy button on password only
- How to get in: "View guide" → full-screen modal with photo, video walkthrough, step-by-step instructions
- Parking: shows name, distance, price → "Add" button → opens UpsellCheckout
- Host: accordion → phone (with copy) + address (with copy)

### 3.3 Visual

Same background image as Homepage (`home page background.png`).  
Confetti plays once on first visit after check-in completes.

---

## 4. Homepage

### 4.1 Pre Check-in State

- Reservation card (dates, property name)
- Checklist with single item: "Check in" only
- "Check in now" CTA button

### 4.2 Post Check-in State

- Checklist collapsed with green ✓ "Complete"
- Horizontal scroll upsell cards ("Enhance your stay")
- Accordions: Amenities, House rules, Property info

### 4.3 Amenities Accordion

- Search field inside accordion
- If query matches a standard amenity → filter list shown
- If query matches an upsell item → "Not a standard amenity" note + product card with "Add" button
- "Add" → `onBuyNow(item)` → opens UpsellCheckout flow (same as Upsells tab)
- If no match → generic empty state with host contact suggestion

### 4.4 Demo Mode

Controlled via Dev Panel (triple-tap logo):
- Demo ON (default): all content populated
- Demo OFF: no upsells, placeholder logo, "No house rules added yet"

---

## 5. Upsells Tab

- Same background image as Homepage and Access tab
- Full-width vertical card list
- Card click → `onBuyNow(item)` → UpsellCheckout (no drawer)
- `addedByOTA` items: not clickable, "Included" pill
- FREE confirmed items: trash icon button (secondary color, no disabled look) for removal
- Default state: chevron arrow bottom-right

---

## 6. Navigation & Tab Bar

### 6.1 Tabs

| Tab | Icon | Behavior |
|---|---|---|
| Home | House | Navigate to Homepage |
| Check-in | Key | Pre-complete → Step 1; Post-complete → AccessReveal |
| Explore | Grid | Stub screen (coming soon) |
| Guide | Compass | Disabled by default; toggled via Dev Panel |

### 6.2 Visibility

Tab bar **hidden** on: `STEP1`, `STEP2`, `STEP3`, `STEP4`, `STEP5`, `STEP6`, `ARRIVAL_GUIDE`, `PRE_LOGIN`, `UPSELL_CHECKOUT`.

These screens have their own CTABar. Adding a second bottom bar would be cluttered.

### 6.3 Safe Area

Screens with tab bar: `pb-[68px]` (v1) or `pb-[104px]` (v2) on scrollable content to prevent tab bar overlap.

### 6.4 Tab Bar Visual Style (V2)

- Container: `rounded-full` (pill shape, fully rounded) — not `rounded-2xl` or `rounded-[28px]`
- Active tab indicator: `rounded-full` (fully rounded pill background) — not `rounded-[20px]`
- Height: 72px container, `inset-x-1 inset-y-2` for active pill inset
- Total reserved space: 104px (32px gradient fade + 72px bar + 3px bottom padding)

---

## 7. Copy & UX Writing Rules

| Rule | Detail |
|---|---|
| No bold in subtext | Inline `<span className="font-semibold">` inside body/subtitle copy is forbidden. All subtext uses single weight. |
| No excited payment copy | Payment success ≠ exciting event. Use calm, reassuring language. |
| Flat fee CTAs | No unit in CTA: `"Buy now for €20.00"` not `"Buy now for €20.00 / per reservation"` |
| Price format | Always `€X.XX` (two decimal places) in CTAs and formal displays |
| Minimum text size | 16px body, 18px titles |
| CTA labels | Action verbs, specific: `"Add for free"` not `"Confirm"`. `"Send a request"` not `"Submit"`. |
| Empty states | Must include: what this space is for + why it's empty + what to do |
| Error messages | Formula: what happened + why + how to fix |

---

## 8. Technical Constraints

### 8.1 Image Paths

All public-folder images **must** use `${import.meta.env.BASE_URL}filename` — required for GitHub Pages deployment where base path is `/Guest-Portal-Prototype-/`.

Spaces in filenames must be URL-encoded in CSS `url()` contexts:  
`url(${import.meta.env.BASE_URL}home%20page%20background.png)`

### 8.2 Design System Tokens

- Never hardcode hex values or pixel sizes for color/spacing
- Always use DS Tailwind token syntax: `text-(--color-fg-primary)`, `bg-(--color-bg-secondary)`
- When DS MCP not connected → **stop and ask**. Never fall back to hardcoded values.
- DS Button only accepts `size="sm"` or `size="xl"` — no `"md"`

### 8.3 Dev Server

Always use `localhost:3000`. Never use 5173, 5174, or other Vite default ports.

### 8.4 New Components Rule

Every time a new component with variants is created → update ComponentsPreview screen.

### 8.5 Layout

- Never hardcode width on phone shell — use `max-width` + `margin: 0 auto`
- OciStepLayout white card: `min-h-[calc(100vh-8px)]` to prevent background showing below short content

---

## 9. OciStepLayout (Check-in Screen Shell)

- Background image: `bg-full.png`
- Nav row: back button (left) + progress bar (center) + exit/X button (right)
- Title + subtitle centered below nav
- White card slides up from 168px, sticky at 8px from top
- Sticky CTA bar at bottom (`CTABar` component)
- `hideBack`: removes back button, shows spacer
- `noScroll`: fixed-height card (used on Step4 agreements)

---

## 10. Homepage — Reservation Card

### 10.1 Badge Row

Badges ("2 guests", "Starts in 3 weeks", "Checked in") use `gap-1` (4px) uniformly — both horizontal and vertical axes. Dot separators `•` sit between each badge.

### 10.2 "Check-in instructions" Button

Shown post-check-in on the reservation card. Opens `HowToGetInModal` (bottom sheet) directly — does **not** navigate to the Access tab. Guest stays in context.

---

## 11. HowToGetInModal

Shared component (`src/components/HowToGetInModal.jsx`). Used by both:
- **Homepage** — "Check-in instructions" button on reservation card
- **AccessReveal** — "View guide" button on the How to get in row

Content:
- Property exterior photo (Unsplash placeholder)
- Video walkthrough section with thumbnail + play button overlay
- Step-by-step with numbered circles; steps with images show real Unsplash photos (building entrance, keypad entry)
- Host note at bottom

**Rule:** Both entry points share the exact same modal component. Never duplicate.

### 11.1 Tab Structure

Uses DS `Tabs` component (`type="button-border"`, segmented control style).

| Tab | Content |
|---|---|
| Video | Full-width video thumbnail with play button overlay + short description |
| Step-by-step | Numbered steps with inline Unsplash photos + host note at bottom |

Property exterior photo always shown above the tabs (not inside either tab).

---

## 12. Upsells Tab — Visual

Same background image as Homepage and AccessReveal (`home page background.png`). All three tabs sharing a background creates visual consistency across the logged-in experience.

---

## 13. Behavior Decision Log

| # | Decision | Rationale |
|---|---|---|
| 1 | OTA-added products are "Included", no interaction | Guest cannot change OTA inclusions; showing a buy flow would be misleading |
| 2 | Flat fees show price only, no unit | "per reservation" / "per transfer" adds no information — it's implicitly once |
| 3 | Remove UpsellDrawer entirely | Duplicate UI — product detail + CTA already exists in UpsellCheckout Step 1 |
| 4 | No order summary in upsell payment step | Guest chose the item in Step 1. Showing it again with a remove button creates second-guessing. To cancel: close the screen. |
| 5 | No amenity search in Step 1 | Check-in form is for registration data only. Upsell discovery belongs in the Upsells tab and Amenities accordion. |
| 6 | Access tab gated by checkInComplete | Door codes and access info must not be shown before the guest has completed registration |
| 7 | Door code has no copy button | Security consideration — codes should not be casually copied to clipboard |
| 8 | Payment success: calm copy, no "excited" | Payment confirmation is administrative, not a celebration. Reassurance is more appropriate than excitement. |
| 9 | Tab bar hidden during check-in steps | Avoids two overlapping bottom bars; check-in has its own CTABar |
| 10 | Phone input: flag only, no picker chevron | Country picker not yet functional; showing chevron implies interactivity that doesn't exist |
| 11 | "Complete" CTA on Step 5 when no extras | No payment needed — "Complete" is accurate and not misleading |
| 12 | FREE items skip Step 2 entirely | No payment to take — confirm immediately in Step 1, navigate back |
| 13 | Early arrival auto-adds upsell to cart | Contextual upsell: guest signals early arrival need → offer it inline at the right moment |
| 14 | 5-step progress when cart has items | Payment becomes a full step; progress bar must reflect actual journey |
| 15 | Amenities "Add" → UpsellCheckout flow | Consistent purchase path regardless of entry point. Drawer was legacy; all upsell flows use the same 2-step checkout. |
| 16 | "Check-in instructions" opens modal, not Access tab | Guest is already on Homepage. Opening a bottom sheet keeps context; navigating away is disruptive. |
| 17 | HowToGetInModal is a shared component | Identical content appears from two entry points. Single source of truth prevents drift. |
| 18 | Step 5 empty state: no decorative icons, no rocket | Functional screen, not celebratory. Clean checkmark + plain copy. No emojis, no bold inline text. |
| 19 | Payment success subtitle: reassuring, not excited | "Nothing to worry about — your payment went through and everything is sorted." Calm tone for a transactional moment. |
| 20 | Tab bar + active indicator: `rounded-full` | Fully pill-shaped container and selected tab — partial rounding (`rounded-2xl`) looked unfinished. Consistent with Hostaway app style. |
| 21 | Upsell tab cart ≠ check-in cart | Items purchased via Upsells tab must never appear in check-in Step 5 payment summary. Two separate carts: `checkInCartItems` (check-in flow only) and `upsellCartItems` (upsell tab flow only). |
| 22 | Upsell success: product-focused, no emoji | Paid items: full success page, title = `"{Product name} added to your reservation"` at 22px — not "Payment confirmed", no emoji. FREE and request items: no full page — toast banner auto-dismisses after 3s. FREE: "X added to your reservation". Request: "X requested — we'll be in touch". |
