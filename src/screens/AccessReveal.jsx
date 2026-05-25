import { useState, useEffect } from 'react'
import { SCREENS } from '../screens'
import ListRow from '../components/ListRow'
import CheckInCTAButton from '../components/CheckInCTAButton'
import HowToGetInModal from '../components/HowToGetInModal'
import { upsellItems } from '../data/upsells'
import { Badge, FeaturedIcon } from '@hostaway/design-system'
import { Key01, Wifi, Home01, Car01, User01, Copy01, X, Phone01, Map01, ChevronDown } from '@hostaway/design-system/icons'

// ── Functional copy button — reuses Copy01 DS icon ──────────────────────────
function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-(--color-fg-tertiary) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors"
    >
      {copied
        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3L11.5 3" stroke="var(--color-fg-primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <Copy01 width={16} height={16} />
      }
    </button>
  )
}


// ── How to get in trigger row ─────────────────────────────────────────────────
function HowToGetInRow() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ListRow
        icon={Home01}
        meta="How to get in"
        label="Rua das Flores 42 · Floor 3 · Apt 3B"
        action={
          <button
            onClick={() => setOpen(true)}
            className="h-8 px-3 bg-(--color-bg-secondary) rounded-lg text-[13px] font-semibold text-(--color-fg-primary) hover:bg-(--color-border-secondary) active:bg-(--color-border-secondary) transition-colors shrink-0"
          >
            View guide
          </button>
        }
        border={false}
      />
      {open && <HowToGetInModal onClose={() => setOpen(false)} />}
    </>
  )
}

// ── Host accordion ───────────────────────────────────────────────────────────
function HostAccordion() {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 py-3"
      >
        <div className="w-10 h-10 rounded-xl bg-(--color-bg-secondary) flex items-center justify-center shrink-0">
          <User01 width={20} height={20} />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[12px] text-(--color-fg-tertiary) leading-tight">Host</p>
          <p className="text-[16px] text-(--color-fg-primary) leading-tight mt-[4px]">Sofia Mendes</p>
        </div>
        <ChevronDown
          width={16} height={16}
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          className="text-(--color-fg-tertiary) shrink-0"
        />
      </button>
      {open && (
        <div className="border-t border-(--color-border-secondary)">
          {/* Phone */}
          <div className="flex items-center gap-3 py-3">
            <div className="w-10 h-10 rounded-xl bg-(--color-bg-secondary) flex items-center justify-center shrink-0">
              <Phone01 width={18} height={18} />
            </div>
            <p className="flex-1 text-[16px] text-(--color-fg-primary)">+351 912 345 678</p>
            <CopyBtn value="+351 912 345 678" />
          </div>
          {/* Address */}
          <div className="flex items-center gap-3 py-3 border-t border-(--color-border-secondary)">
            <div className="w-10 h-10 rounded-xl bg-(--color-bg-secondary) flex items-center justify-center shrink-0">
              <Map01 width={18} height={18} />
            </div>
            <p className="flex-1 text-[16px] text-(--color-fg-primary)">Rua das Flores 42 · Floor 3 · Apt 3B</p>
            <CopyBtn value="Rua das Flores 42, Floor 3, Apt 3B" />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Parking row ───────────────────────────────────────────────────────────────
function ParkingRow({ onBuyNow }) {
  const parkingItem = upsellItems.find(i => i.id === 'parking')
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="w-10 h-10 rounded-xl bg-(--color-bg-secondary) flex items-center justify-center shrink-0">
        <Car01 width={20} height={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-(--color-fg-tertiary) leading-tight">Parking</p>
        <p className="text-[16px] text-(--color-fg-primary) leading-tight mt-[4px]">Parque Flores · 2 min walk</p>
        <p className="text-[14px] font-semibold text-(--color-fg-primary) mt-0.5">€8.00 <span className="text-[13px] font-normal text-(--color-fg-tertiary)">/day</span></p>
      </div>
      <button
        onClick={() => onBuyNow?.(parkingItem)}
        className="h-8 px-3 bg-(--color-bg-secondary) rounded-lg text-[13px] font-semibold text-(--color-fg-primary) hover:bg-(--color-border-secondary) active:bg-(--color-border-secondary) transition-colors shrink-0"
      >
        Add
      </button>
    </div>
  )
}

// ── Confetti ─────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#96E6A1','#FFEAA7','#DDA0DD','#FFB347','#87CEEB']
const CONFETTI_PIECES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  left: ((i * 37 + 13) % 100) + '%',
  delay: ((i * 0.07) % 0.9).toFixed(2) + 's',
  duration: (1.4 + (i * 0.05) % 1.2).toFixed(2) + 's',
  width:  (6 + (i % 4) * 2) + 'px',
  height: (8 + (i % 3) * 3) + 'px',
  rotate: (i * 47) % 360,
}))

function ConfettiOverlay() {
  return (
    <div className="absolute inset-0 z-[200] pointer-events-none overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          75%  { opacity: 1; }
          100% { transform: translateY(920px) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {CONFETTI_PIECES.map(p => (
        <div key={p.id} style={{
          position: 'absolute', top: 0, left: p.left,
          width: p.width, height: p.height,
          backgroundColor: p.color, borderRadius: '2px',
          animation: `confetti-fall ${p.duration} ${p.delay} ease-in forwards`,
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </div>
  )
}

// ── Locked state ─────────────────────────────────────────────────────────────
function LockedState({ navigate, checkInStarted, checkInResumeStep }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}home%20page%20background.png)`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }}>
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-[68px]">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-sm">
          <svg viewBox="0 0 24 24" width="28" height="28" stroke="var(--color-fg-primary)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h2 className="text-[20px] font-bold text-(--color-fg-primary) text-center mb-2">Check in first</h2>
        <p className="text-[16px] text-(--color-fg-tertiary) text-center leading-6 mb-6">
          Complete your check-in to unlock door codes, WiFi, parking and arrival info.
        </p>
        <CheckInCTAButton
          checkInStarted={checkInStarted}
          checkInResumeStep={checkInResumeStep}
          navigate={navigate}
        />
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function AccessReveal({ navigate, checkInComplete, checkInStarted, checkInResumeStep, onBuyNow }) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (!checkInComplete) return
    setShowConfetti(true)
    const t = setTimeout(() => setShowConfetti(false), 3200)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!checkInComplete) {
    return <LockedState navigate={navigate} checkInStarted={checkInStarted} checkInResumeStep={checkInResumeStep} />
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}home%20page%20background.png)`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }}>
      {showConfetti && <ConfettiOverlay />}

      <div className="flex-1 overflow-y-auto scrollable pb-[104px]">
        {/* Header */}
        <div className="px-4 pt-5 pb-4">
          <h1 className="text-[22px] font-bold text-(--color-fg-primary) leading-tight">You're all set 🎉</h1>
          <p className="text-[16px] text-(--color-fg-tertiary) mt-0.5">Brisa Deluxe Studio · Wed, 31 Oct</p>
        </div>

        {/* Access cards */}
        <div className="px-4 flex flex-col gap-3">

          {/* Door code + WiFi */}
          <div className="bg-white rounded-2xl px-5 py-1">
            <ListRow
              icon={Key01}
              meta="Door code"
              label="4821"
            />
            <ListRow
              icon={Wifi}
              meta="WiFi · Network: Brisa_Guest"
              label="sunshine2024"
              action={<CopyBtn value="sunshine2024" />}
              border={false}
            />
          </div>

          {/* How to get in */}
          <div className="bg-white rounded-2xl px-5 py-1">
            <HowToGetInRow />
          </div>

          {/* Parking */}
          <div className="bg-white rounded-2xl px-5 py-1">
            <ParkingRow onBuyNow={onBuyNow} />
          </div>

          {/* Host accordion */}
          <div className="bg-white rounded-2xl px-5">
            <HostAccordion />
          </div>

        </div>
      </div>

    </div>
  )
}
