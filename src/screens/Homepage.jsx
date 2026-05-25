import { useState, useRef } from 'react'
import UpsellDrawer from '../components/UpsellDrawer'
import { SCREENS } from '../screens'
import MenuButton from '../components/MenuButton'
import { upsellItems } from '../data/upsells'
import CheckInCTAButton from '../components/CheckInCTAButton'
import ListRow from '../components/ListRow'
import { Badge, FeaturedIcon, EmptyState } from '@hostaway/design-system'
import {
  LogIn01, LogOut01, Users01, Moon01, Link01, LinkExternal01,
  Clock, Mail01, Download01, CheckCircle,
  Wifi, Phone01, Map01, FileAttachment01, SlashCircle01, Copy01, SearchMd,
} from '@hostaway/design-system/icons'


// ── Small inline amenity icon ──────────────────────────────────────────────
function AmenityIcon({ path }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d={path} stroke="var(--color-fg-tertiary)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}


// ── CopyBtn — small icon button for copying text ──────────────────────────
function CopyBtn() {
  return (
    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-(--color-fg-tertiary) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors cursor-pointer shrink-0">
      <Copy01 width={16} height={16} />
    </button>
  )
}

// ── EditOnBadge — read-only source indicator ──────────────────────────────
// Shows "Edit on [platform]" to signal value is managed externally.
// Reuses the same Badge (pill-color / sm / gray) as reservation badges.
// platform: 'airbnb' | 'booking' | 'vrbo' (add platform icons as needed)
function EditOnBadge({ platform = 'airbnb' }) {
  return (
    <Badge type="pill-color" size="sm" color="gray">
      <span className="flex items-center gap-1 whitespace-nowrap">
        Edit on
        {platform === 'airbnb' && <span className="font-semibold">Airbnb</span>}
      </span>
    </Badge>
  )
}

// ── Amenity row ────────────────────────────────────────────────────────────
function AmenityItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-(--color-border-secondary) last:border-b-0">
      <FeaturedIcon icon={icon} size="sm" color="gray" theme="modern" />
      <span className="text-[15px] text-(--color-fg-primary)">{label}</span>
    </div>
  )
}

// ── Amenity section label ──────────────────────────────────────────────────
function AmenityCategory({ label }) {
  return (
    <p className="text-[12px] font-semibold text-(--color-fg-tertiary) uppercase tracking-wider pt-4 pb-1">
      {label}
    </p>
  )
}

// ── Accordion ──────────────────────────────────────────────────────────────
function Accordion({ label, children, content, emptyText, demoMode }) {
  const [open, setOpen] = useState(false)
  const isEmpty = !demoMode && emptyText

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between h-[68px] px-5 hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <span className="text-[16px] font-semibold text-(--color-fg-primary)">{label}</span>
        <svg
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          className={`transition-transform duration-200 shrink-0 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M5 8l5 5 5-5" stroke="var(--color-gray-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-(--color-border-secondary)">
          {children ?? (
            <div className="px-5 pb-5 pt-4">
              <p className={`text-[14px] leading-6 ${isEmpty ? 'text-(--color-fg-secondary) italic' : 'text-(--color-fg-tertiary)'}`}>
                {isEmpty ? emptyText : content}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Homepage ───────────────────────────────────────────────────────────────
export default function Homepage({ navigate, checkInComplete, demoMode, onOpenDevPanel, tabBarVariant = 'v2', onBuyNow, checkInStarted, checkInResumeStep }) {
  const [showMore, setShowMore] = useState(false)
  const [devTapCount, setDevTapCount] = useState(0)
  const [showMapDrawer, setShowMapDrawer] = useState(false)
  const [mapDragY, setMapDragY] = useState(0)
  const [mapSnapping, setMapSnapping] = useState(false)
  const [upsellDrawerItem, setUpsellDrawerItem] = useState(null)
  const [addedUpsells, setAddedUpsells] = useState(new Set())
  const mapDragStart = useRef(null)

  const handleMapDragStart = (clientY) => { setMapSnapping(false); mapDragStart.current = clientY }
  const handleMapDragMove = (clientY) => { setMapDragY(Math.max(0, clientY - mapDragStart.current)) }
  const handleMapDragEnd = (clientY) => {
    const delta = Math.max(0, clientY - mapDragStart.current)
    if (delta > 120) { setShowMapDrawer(false); setMapDragY(0) }
    else { setMapSnapping(true); setMapDragY(0) }
  }
  const closeMapDrawer = () => { setShowMapDrawer(false); setMapDragY(0) }

  const handlePropertyTap = () => {
    const next = devTapCount + 1
    setDevTapCount(next)
    if (next >= 5) { setDevTapCount(0); onOpenDevPanel() }
    setTimeout(() => setDevTapCount(0), 1200)
  }

  return (
    <div className="min-h-screen flex flex-col relative">

      {/* ── Map drawer (same pattern as DoubleConfirmation) ── */}
      {showMapDrawer && (
        <div
          className="absolute inset-0 z-50 flex flex-col justify-end"
          style={{ background: `rgba(10,12,18,${Math.max(0, 0.7 * (1 - mapDragY / 300))})` }}
        >
          {/* Tap backdrop to close */}
          <div className="absolute inset-0" onClick={closeMapDrawer} />
          {/* Sheet — leaves 94px at top (SafariBar = 38px status + 56px URL bar) */}
          <div
            className="relative z-10 bg-white rounded-t-3xl flex flex-col select-none"
            style={{
              height: 'calc(100% - 94px)',
              transform: `translateY(${mapDragY}px)`,
              transition: mapSnapping ? 'transform 250ms ease-out' : 'none',
            }}
          >
            {/* Drag handle — full-width grab zone */}
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing shrink-0"
              onTouchStart={e => handleMapDragStart(e.touches[0].clientY)}
              onTouchMove={e => handleMapDragMove(e.touches[0].clientY)}
              onTouchEnd={e => handleMapDragEnd(e.changedTouches[0].clientY)}
              onMouseDown={e => {
                handleMapDragStart(e.clientY)
                const onMove = ev => handleMapDragMove(ev.clientY)
                const onUp = ev => { handleMapDragEnd(ev.clientY); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
                window.addEventListener('mousemove', onMove)
                window.addEventListener('mouseup', onUp)
              }}
            >
              <div className="w-10 h-1 bg-(--color-border-primary) rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 shrink-0">
              <div>
                <p className="text-[16px] font-semibold text-(--color-fg-primary)">C/ Alcazabilla 2, 29012 Málaga</p>
                <p className="text-[13px] text-(--color-fg-tertiary)">Brisa Deluxe Studio</p>
              </div>
              <button
                onClick={closeMapDrawer}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-(--color-fg-tertiary) hover:bg-(--color-bg-secondary) transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {/* Map fills remainder */}
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-4.4350%2C36.7130%2C-4.4080%2C36.7300&layer=mapnik&marker=36.7213%2C-4.4214"
              className="flex-1 border-0 w-full rounded-b-3xl"
              title="Full map"
            />
          </div>
        </div>
      )}

      <div
        className={`flex-1 overflow-y-auto scrollable`}
        style={{ paddingBottom: tabBarVariant === 'v2' ? 104 : 68, backgroundImage: `url(${import.meta.env.BASE_URL}home%20page%20background.png)`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }}
      >

        {/* ── Hero Header ── */}
        <div className="relative px-4 pt-4 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img src={`${import.meta.env.BASE_URL}property-logo.png`} alt="Property logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-[16px] font-semibold text-(--color-fg-primary) leading-tight">Welcome, Maria</span>
            </div>
            <MenuButton />
          </div>

          {/* Booking overview card */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-normal text-(--color-fg-tertiary) leading-5">Your stay at</p>
                <button onClick={handlePropertyTap} className="text-left">
                  <p className="text-[16px] font-bold text-(--color-fg-primary) leading-6 mt-0.5">Brisa Deluxe Studio</p>
                </button>
                <div className="flex items-center gap-x-1 gap-y-[2px] mt-1.5 flex-wrap">
                  <Badge type="pill-color" size="sm" color="gray">2 guests</Badge>
                  <span className="w-[3px] h-[3px] rounded-full bg-(--color-border-primary) shrink-0" />
                  <Badge type="pill-color" size="sm" color="gray">Starts in 3 weeks</Badge>
                  {checkInComplete && (
                    <>
                      <span className="w-[3px] h-[3px] rounded-full bg-(--color-border-primary) shrink-0" />
                      <Badge type="pill-color" size="sm" color="success">Checked in</Badge>
                    </>
                  )}
                </div>
                <button className="mt-2 flex items-center gap-1" onClick={() => setShowMore(v => !v)}>
                  <span className="text-[13px] font-medium text-(--color-fg-tertiary)">Show {showMore ? 'less' : 'more'}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className={`transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}>
                    <path d="M4 6l4 4 4-4" stroke="var(--color-gray-500)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <div className="w-[100px] h-[100px] rounded-xl shrink-0 overflow-hidden">
                <img src={`${import.meta.env.BASE_URL}brisa-studio.png`} alt="Brisa Deluxe Studio" className="w-full h-full object-cover" />
              </div>
            </div>

            {showMore && (
              <div className="px-4 pb-4 flex gap-3">
                <div className="flex-1 bg-(--color-bg-warm) rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <LogIn01 width={14} height={14} className="text-(--color-fg-quaternary) shrink-0" />
                    <span className="text-[14px] font-normal text-(--color-fg-tertiary)">Check in</span>
                  </div>
                  <p className="text-[18px] font-bold text-(--color-fg-primary) leading-tight">Wed, 31 Oct</p>
                  <p className="text-[14px] font-normal text-(--color-fg-tertiary) mt-2">from 14:00</p>
                </div>
                <div className="flex-1 bg-(--color-bg-warm) rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <LogOut01 width={14} height={14} className="text-(--color-fg-quaternary) shrink-0" />
                    <span className="text-[14px] font-normal text-(--color-fg-tertiary)">Check out</span>
                  </div>
                  <p className="text-[18px] font-bold text-(--color-fg-primary) leading-tight">Thu, 01 Nov</p>
                  <p className="text-[14px] font-normal text-(--color-fg-tertiary) mt-2">until 12:00</p>
                </div>
              </div>
            )}

            <div className="px-4 pb-4">
              {!checkInComplete ? (
                <CheckInCTAButton
                  checkInStarted={checkInStarted}
                  checkInResumeStep={checkInResumeStep}
                  navigate={navigate}
                />
              ) : (
                <button
                  onClick={() => navigate(SCREENS.ACCESS_REVEAL)}
                  className="w-full h-11 border border-(--color-border-primary) rounded-xl text-[16px] font-semibold text-(--color-fg-primary) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M5 7V5a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  Check-in instructions
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Upsells (both states) ── */}
        {demoMode && (
          <div className="pb-2">
            <p className="text-[16px] font-bold text-(--color-fg-primary) mb-2 px-4">Enhance your stay</p>
            <div className="flex gap-3 overflow-x-auto pl-4 pr-4 scrollable">
              {upsellItems.map((item) => {
                const { id, label, description, price, unit, image, addedByOTA } = item
                const isAdded = addedUpsells.has(id)
                const clickable = !addedByOTA
                return (
                  <div
                    key={id}
                    onClick={clickable ? () => setUpsellDrawerItem(item) : undefined}
                    className={`bg-white rounded-2xl flex-shrink-0 w-[220px] flex flex-col overflow-hidden ${clickable ? 'cursor-pointer active:opacity-80' : ''}`}
                  >
                    {/* Image */}
                    <div className="w-full h-[110px] bg-(--color-bg-warm) overflow-hidden">
                      {image
                        ? <img src={image} alt={label} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="2" y="5" width="24" height="18" rx="3" stroke="var(--color-fg-quaternary)" strokeWidth="1.4"/><circle cx="9" cy="12" r="2.5" stroke="var(--color-fg-quaternary)" strokeWidth="1.4"/><path d="M2 19l6-5 5 4 4-4 7 6" stroke="var(--color-fg-quaternary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                      }
                    </div>
                    {/* Content */}
                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-[14px] font-bold text-(--color-fg-primary) leading-5 mb-1">{label}</p>
                      <p className="text-[12px] text-(--color-fg-tertiary) leading-4 line-clamp-2 flex-1">{description}</p>
                      {/* Price row + indicator */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-0.5">
                          {price === 'FREE' ? (
                            <span className="text-[14px] font-bold text-(--color-hostaway-secondary-600)">FREE</span>
                          ) : (
                            <>
                              <span className="text-[14px] font-bold text-(--color-fg-primary)">{price}</span>
                              {unit && <span className="text-[11px] text-(--color-fg-tertiary) ml-0.5">{unit}</span>}
                            </>
                          )}
                        </div>
                        {addedByOTA ? (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-(--color-bg-secondary) text-(--color-fg-quaternary) border border-(--color-border-secondary)">
                            Included
                          </span>
                        ) : isAdded ? (
                          <span className="w-5 h-5 rounded-full bg-(--color-hostaway-secondary-600) flex items-center justify-center shrink-0">
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 4l4 4-4 4" stroke="var(--color-fg-quaternary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Accordions — always visible ── */}
        <div className="px-4 flex flex-col gap-2 pb-6">

            {/* Your stay */}
            <Accordion label="Your stay">
              <div className="px-4 pt-1 pb-1">
                <ListRow icon={LogIn01} label="Wed, 31 Oct · from 14:00" />
                <ListRow icon={LogOut01} label="Thu, 01 Nov · until 12:00" />
                <ListRow icon={Users01} label="2 guests" action={<EditOnBadge />} />
                <ListRow icon={Moon01} label="2 nights" action={<EditOnBadge />} />
                <ListRow
                  icon={Link01}
                  label="Reservation details"
                  border={false}
                  action={<LinkExternal01 width={16} height={16} className="text-(--color-fg-tertiary)" />}
                  interactive
                />
              </div>
            </Accordion>

            {/* Amenities */}
            <Accordion label="Amenities">
              <AmenitiesContent />
            </Accordion>

            {/* House rules */}
            <Accordion label="House rules" emptyText="No house rules added yet." demoMode={demoMode}>
              {demoMode ? <HouseRulesContent /> : null}
            </Accordion>

            {/* Contacts */}
            <Accordion label="Contacts">
              <div className="px-4 pt-1 pb-3">
                <ListRow icon={Users01} meta="Host" label="Sofia Mendes" />
                <ListRow icon={Phone01} label="+351 912 345 678"
                  action={<CopyBtn />} />
                <ListRow icon={Map01} label="C/ Alcazabilla 2, 29012 Málaga"
                  border={false} action={<CopyBtn />} />
                <div className="relative mt-3 rounded-xl overflow-hidden h-[160px]">
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-4.4350%2C36.7130%2C-4.4080%2C36.7300&layer=mapnik&marker=36.7213%2C-4.4214"
                    className="w-full h-full border-0"
                    title="Map"
                    scrolling="no"
                    style={{ pointerEvents: 'none' }}
                  />
                  <button
                    onClick={() => setShowMapDrawer(true)}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                    aria-label="Open full map"
                  >
                    <div className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M9 1h4v4M5 13H1V9M13 1l-5 5M1 13l5-5" stroke="var(--color-fg-primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </Accordion>

            {/* Invoices and receipts */}
            <Accordion label="Invoices and receipts">
              <div className="px-5 pt-4 pb-5 flex flex-col gap-3">
                <button className="w-full h-11 border border-(--color-border-primary) rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold text-(--color-fg-secondary) hover:bg-(--color-bg-secondary) hover:border-(--color-border-brand) active:bg-(--color-bg-tertiary) transition-colors cursor-pointer">
                  <Mail01 width={16} height={16} className="text-(--color-fg-tertiary)" />
                  Send invoice to email
                </button>
                <button className="w-full h-11 border border-(--color-border-primary) rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold text-(--color-fg-secondary) hover:bg-(--color-bg-secondary) hover:border-(--color-border-brand) active:bg-(--color-bg-tertiary) transition-colors cursor-pointer">
                  <Download01 width={16} height={16} className="text-(--color-fg-tertiary)" />
                  Download invoice
                </button>
                <div className="border-t border-(--color-border-secondary) pt-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle width={16} height={16} className="text-(--color-success-700)" />
                      <span className="text-[14px] text-(--color-fg-tertiary)">Already paid</span>
                    </div>
                    <span className="text-[14px] font-semibold text-(--color-fg-primary)">$220</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-(--color-fg-primary)">Left to pay</span>
                    <span className="text-[14px] font-bold text-(--color-fg-primary)">$220</span>
                  </div>
                </div>
              </div>
            </Accordion>

            {/* Cancellation */}
            <Accordion label="Cancellation">
              <div className="px-5 pt-4 pb-5">
                <p className="text-[15px] font-semibold text-(--color-fg-primary) mb-2">Free cancellation</p>
                <p className="text-[14px] leading-6 text-(--color-fg-tertiary)">
                  Cancel within 48 hours of booking for a full refund. After that, cancel at least 7 days before check-in to receive a full refund.
                </p>
                <div className="mt-4 pt-4 border-t border-(--color-border-secondary)">
                  <p className="text-[14px] text-(--color-fg-tertiary) leading-6">
                    Cancellations made less than 7 days before check-in are non-refundable.
                  </p>
                </div>
              </div>
            </Accordion>

            {/* Attachments */}
            <Accordion label="Attachments">
              <div className="px-5 pt-4 pb-5">
                <button className="w-full flex items-center gap-3 p-3 border border-(--color-border-secondary) rounded-xl hover:bg-(--color-bg-secondary) hover:border-(--color-border-primary) active:bg-(--color-bg-tertiary) active:border-(--color-border-primary) transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-(--color-bg-warm) rounded-lg flex items-center justify-center shrink-0">
                    <FileAttachment01 width={18} height={18} className="text-(--color-fg-tertiary)" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-semibold text-(--color-fg-primary)">Rental Agreement</p>
                    <p className="text-[12px] text-(--color-fg-tertiary)">PDF · 124 KB</p>
                  </div>
                  <Download01 width={18} height={18} className="text-(--color-fg-tertiary) shrink-0" />
                </button>
              </div>
            </Accordion>

          </div>
      </div>

      {/* Upsell drawer */}
      {upsellDrawerItem && (
        <UpsellDrawer
          item={upsellDrawerItem}
          onClose={() => setUpsellDrawerItem(null)}
          onBuy={(item) => {
            setUpsellDrawerItem(null)
            if (item.price === 'FREE') {
              setAddedUpsells(prev => new Set([...prev, item.id]))
            } else {
              onBuyNow?.(item)
            }
          }}
        />
      )}
    </div>
  )
}

// ── House Rules content (shared between pre & post check-in) ──────────────
function HouseRulesContent() {
  return (
    <div className="px-4 pt-1 pb-3">
      <ListRow icon={Clock} meta="Quiet hours" label="10PM – 8AM" />
      <ListRow icon={SlashCircle01} label="No pets allowed" />
      <ListRow icon={SlashCircle01} label="No smoking" />
      <ListRow icon={SlashCircle01} label="No parties or events" />
      <ListRow icon={SlashCircle01} label="No unregistered guests" border={false} />
    </div>
  )
}

// ── Amenities data ─────────────────────────────────────────────────────────
const AMENITY_CATEGORIES = [
  { label: 'Bathroom', items: [
    ['Bathtub',          'M2 14h16M4 14V9a2 2 0 012-2h8a2 2 0 012 2v5'],
    ['Hot water',        'M10 3c0 3-4 4-4 8M14 3c0 3-4 4-4 8M7 17h6'],
    ['Shower',           'M8 2h4M10 2v5M6 7h8M10 12v6M8 18h4'],
    ['Hair dryer',       'M3 4h9l3 4-3 4H3V4zM15 8h3'],
    ['Towels provided',  'M4 7h12v3a4 4 0 01-4 4H8a4 4 0 01-4-4V7z'],
  ]},
  { label: 'Bedroom & Laundry', items: [
    ['Bed linens',               'M2 13V9a2 2 0 012-2h12a2 2 0 012 2v4M2 17v-4h16v4M2 13h16'],
    ['Extra pillows & blankets', 'M4 9h12v5H4V9zM6 9V7h8v2'],
    ['Hangers',                  'M10 4a2 2 0 000 3M10 7L4 14h12L10 7'],
    ['Iron',                     'M2 13h13l2-5H5L2 13zM2 13l-1 4'],
    ['Washer',                   'M3 3h14v14H3V3zM10 10m-3 0a3 3 0 106 0 3 3 0 00-6 0'],
    ['Dryer',                    'M3 3h14v14H3V3zM8 6h1M10 6h1M10 10m-2.5 0a2.5 2.5 0 105 0 2.5 2.5 0 00-5 0'],
    ['Wardrobe',                 'M3 3h14v14H3V3zM10 3v14'],
  ]},
  { label: 'Kitchen & Dining', items: [
    ['Coffee maker',     'M6 3h8v8a4 4 0 01-4 4 4 4 0 01-4-4V3zM4 7h2M14 7h2'],
    ['Microwave',        'M2 6h16v8H2V6zM14 8v4M14 9h1'],
    ['Oven',             'M2 5h16v11H2V5zM2 10h16M6 7h2'],
    ['Refrigerator',     'M5 2h10a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1zM4 8h12M8 5v2'],
    ['Stove',            'M2 9h16v8H2V9zM2 9V6h16v3M7 6V4M13 6V4'],
    ['Toaster',          'M4 9h12v4a1 1 0 01-1 1H5a1 1 0 01-1-1V9zM7 9V6M13 9V6M4 14h12'],
    ['Cooking basics',   'M4 4l2 12h8l2-12H4zM2 4h16'],
    ['Dishes & cutlery', 'M8 2v16M12 2v6a4 4 0 010 8v-2'],
    ['Blender',          'M7 3h6l2 7H5L7 3zM9 10v6M7 16h6'],
    ['Kettle',           'M6 4h8v8a4 4 0 01-4 4 4 4 0 01-4-4V4zM14 7h3'],
  ]},
  { label: 'Internet & Entertainment', items: [
    ['Wifi',         null],
    ['Smart TV',     'M2 5h16v11H2V5zM7 18h6M10 16v2'],
    ['Netflix',      'M7 3v14M13 3v14M7 10l6-7M7 17l6-7'],
    ['Board games',  'M3 3h14v14H3V3zM3 10h14M10 3v14'],
    ['Books & guides','M4 2h12v16H4V2zM4 8h12M7 5h6'],
  ]},
  { label: 'Heating & Cooling', items: [
    ['Air conditioning', 'M10 3v14M3 10h14M5.5 5.5l9 9M14.5 5.5l-9 9'],
    ['Heating',          'M5 17c0-3 2-5 5-9 3 4 5 6 5 9a5 5 0 01-10 0z'],
    ['Ceiling fan',      'M10 9m-1 0a1 1 0 102 0 1 1 0 00-2 0M10 3v4M10 15v2M3 9h4M17 9h-4'],
  ]},
  { label: 'Safety', items: [
    ['Smoke alarm',           'M10 2a4 4 0 014 4v1h2v3H4V7h2V6a4 4 0 014-4zM7 10v1a3 3 0 006 0v-1'],
    ['Carbon monoxide alarm', 'M10 4a6 6 0 100 12A6 6 0 0010 4zM10 7v3l2 1'],
    ['Fire extinguisher',     'M9 2h2v4H9zM10 6v10M7 9h6M7 16h6a1 1 0 010 2H7a1 1 0 010-2z'],
    ['First aid kit',         'M3 7h14v9a1 1 0 01-1 1H4a1 1 0 01-1-1V7zM3 7V5a1 1 0 011-1h12a1 1 0 011 1v2M8 12h4M10 10v4'],
    ['Security lock',         'M5 9V6a5 5 0 0110 0v3M3 9h14v9H3V9z'],
  ]},
]

// ── Amenities content (shared between pre & post check-in) ────────────────
function AmenitiesContent() {
  const [query, setQuery] = useState('')
  const q = query.toLowerCase().trim()

  const filtered = AMENITY_CATEGORIES
    .map(cat => ({ ...cat, items: cat.items.filter(([label]) => !q || label.toLowerCase().includes(q)) }))
    .filter(cat => cat.items.length > 0)

  // Check if query matches an upsell item
  const upsellMatch = q
    ? upsellItems.find(u => u.label.toLowerCase().includes(q) || q.split(' ').some(w => w.length > 2 && u.label.toLowerCase().includes(w)))
    : null

  return (
    <div>
      {/* Search */}
      <div className="px-4 pt-3 pb-1">
        <div className="relative flex items-center">
          <SearchMd width={16} height={16} className="absolute left-3 text-(--color-fg-quaternary) pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search amenities…"
            className="w-full h-10 pl-9 pr-3 text-[14px] border border-(--color-border-primary) rounded-xl bg-white text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) outline-none focus:border-(--color-border-brand) transition-colors font-[family-name:var(--font-body)]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 text-(--color-fg-quaternary) hover:text-(--color-fg-tertiary)"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pt-1 pb-4">
        {filtered.length === 0 ? (
          upsellMatch ? (
            /* ── Upsell match empty state ── */
            <div className="py-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-[14px] font-semibold text-(--color-fg-primary)">Not a standard amenity</p>
                <p className="text-[13px] text-(--color-fg-tertiary) leading-5">Not included, but you can add it to your stay.</p>
              </div>
              <div className="border border-(--color-border-secondary) rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-(--color-bg-warm) rounded-lg shrink-0 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="1" y="3" width="16" height="12" rx="2" stroke="var(--color-fg-tertiary)" strokeWidth="1.3"/>
                    <circle cx="6" cy="8" r="1.5" fill="var(--color-fg-tertiary)"/>
                    <path d="M1 12l4-3 3 2.5 3-3 5 3.5" stroke="var(--color-fg-tertiary)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-(--color-fg-primary)">{upsellMatch.label}</p>
                  <p className="text-[13px] text-(--color-hostaway-secondary-600) font-medium">
                    {upsellMatch.price === 'FREE' ? 'FREE' : `${upsellMatch.price}${upsellMatch.unit}`}
                  </p>
                </div>
                <button className="h-9 px-4 bg-(--color-fg-primary) rounded-xl text-[13px] font-semibold text-white shrink-0">
                  Add
                </button>
              </div>
            </div>
          ) : (
            /* ── Generic no-match empty state ── */
            <div className="py-5 flex flex-col items-center text-center gap-3">
              <FeaturedIcon icon={SearchMd} size="sm" color="gray" theme="modern" />
              <div className="flex flex-col gap-1">
                <p className="text-[14px] font-semibold text-(--color-fg-primary)">Not listed here</p>
                <p className="text-[13px] text-(--color-fg-tertiary) leading-5">
                  This apartment may not have it, or it goes by a different name. Try another keyword or ask the host directly.
                </p>
              </div>
              <button className="h-9 px-4 border border-(--color-border-primary) rounded-xl text-[13px] font-semibold text-(--color-fg-secondary)">
                Message host
              </button>
            </div>
          )
        ) : (
          filtered.map(cat => (
            <div key={cat.label}>
              <AmenityCategory label={cat.label} />
              {cat.items.map(([label, path]) => (
                <AmenityItem
                  key={label}
                  label={label}
                  icon={path === null
                    ? <Wifi width={20} height={20} className="text-(--color-fg-tertiary)" />
                    : <AmenityIcon path={path} />
                  }
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
