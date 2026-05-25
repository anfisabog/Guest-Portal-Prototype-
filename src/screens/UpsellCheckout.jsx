import { useState, useEffect } from 'react'
import { SCREENS } from '../screens'
import OciStepLayout from '../components/OciStepLayout'
import { formatPrice } from '../utils/formatPrice'

function parsePrice(price) {
  if (price === 'FREE') return 0
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0
}

function getCurrency(cartItems) {
  const item = cartItems.find(i => i.price !== 'FREE')
  return item ? item.price.replace(/[0-9., ]/g, '') || '€' : '€'
}

const PAYMENT_METHODS = [
  { id: 'apple-pay',  label: 'Apple Pay',  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
  { id: 'google-pay', label: 'Google Pay', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 11.5v1.5h3.5c-.15.9-1.1 2.65-3.5 2.65C9.65 15.65 7.8 13.75 7.8 11.5S9.65 7.35 12 7.35c1.3 0 2.15.55 2.65 1.05l1.8-1.75C15.3 5.45 13.8 4.75 12 4.75 8.1 4.75 5 7.85 5 11.75S8.1 18.75 12 18.75c4.1 0 6.8-2.9 6.8-6.95 0-.45-.05-.8-.1-1.15L12 10.6v.9z" fill="#4285F4"/><path d="M6.2 9.35l-2.1-1.55A7.3 7.3 0 0 0 3 11.75c0 1.5.4 2.9 1.1 4.1L6.2 14.1a4.4 4.4 0 0 1-.4-2.35c0-.85.15-1.65.4-2.4z" fill="#34A853"/><path d="M12 19c2 0 3.7-.65 4.95-1.8l-2.35-1.8c-.65.45-1.5.75-2.6.75-2.4 0-4.4-1.6-5.15-3.75L4.2 14.2C5.45 16.95 8.5 19 12 19z" fill="#FBBC04"/><path d="M19.8 11.5c0-.6-.05-1.2-.15-1.75H12v3.5h4.4c-.2 1-.75 1.85-1.6 2.4l2.35 1.8c1.4-1.3 2.2-3.2 2.2-5.35-.05-.15-.1-.35-.1-.6z" fill="#EA4335"/></svg> },
  { id: 'card',       label: 'Credit / Debit card', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M2 9h20" stroke="currentColor" strokeWidth="1.6"/><path d="M6 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
  { id: 'ideal',      label: 'iDEAL',               sublabel: 'Netherlands', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="3" fill="#CC0066" opacity=".12"/><text x="4" y="16" fontSize="9" fontWeight="700" fill="#CC0066" fontFamily="sans-serif">iD</text></svg> },
  { id: 'bancontact', label: 'Bancontact',           sublabel: 'Belgium',     icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="3" fill="#005498" opacity=".12"/><text x="3.5" y="16" fontSize="7" fontWeight="700" fill="#005498" fontFamily="sans-serif">BC</text></svg> },
  { id: 'klarna',     label: 'Klarna',               sublabel: 'Pay later',   icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="18" rx="3" fill="#FFB3C7" opacity=".5"/><text x="4" y="16" fontSize="8" fontWeight="800" fill="#17120E" fontFamily="sans-serif">klarna</text></svg> },
]
const PRIMARY_METHODS = ['apple-pay', 'google-pay', 'card']

// ── Confetti ──────────────────────────────────────────────────────────────────
const CONFETTI_COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#96E6A1','#FFEAA7','#DDA0DD','#FFB347','#87CEEB']
const CONFETTI_PIECES = Array.from({ length: 40 }, (_, i) => ({
  id: i, color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  left: ((i * 37 + 13) % 100) + '%',
  delay: ((i * 0.07) % 0.9).toFixed(2) + 's',
  duration: (1.4 + (i * 0.05) % 1.2).toFixed(2) + 's',
  width: (6 + (i % 4) * 2) + 'px', height: (8 + (i % 3) * 3) + 'px',
  rotate: (i * 47) % 360,
}))
function ConfettiOverlay() {
  return (
    <div className="absolute inset-0 z-[200] pointer-events-none overflow-hidden">
      <style>{`@keyframes co-fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}75%{opacity:1}100%{transform:translateY(920px) rotate(720deg);opacity:0}}`}</style>
      {CONFETTI_PIECES.map(p => (
        <div key={p.id} style={{ position:'absolute', top:0, left:p.left, width:p.width, height:p.height, backgroundColor:p.color, borderRadius:'2px', animation:`co-fall ${p.duration} ${p.delay} ease-in forwards`, transform:`rotate(${p.rotate}deg)` }} />
      ))}
    </div>
  )
}

export default function UpsellCheckout({ context = 'upsell', cartItems = [], onRemoveFromCart, navigate, onExit, onConfirm }) {
  const [step, setStep]                 = useState(1) // 1 = product detail, 2 = payment
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [showMore, setShowMore]         = useState(false)
  const [cardNumber, setCardNumber]     = useState('')
  const [cardName, setCardName]         = useState('')
  const [expiry, setExpiry]             = useState('')
  const [cvc, setCvc]                   = useState('')
  const [paid, setPaid]                 = useState(false)

  const item        = cartItems[0]
  const total       = cartItems.reduce((sum, i) => sum + parsePrice(i.price), 0)
  const currency    = getCurrency(cartItems)
  const isRequest   = item?.requiresRequest ?? false
  const itemLabel   = item?.label ?? 'your extra'

  // Auto-close when cart emptied
  useEffect(() => {
    if (!paid && cartItems.length === 0) {
      if (context === 'checkin') onExit?.()
      else navigate(SCREENS.UPSELLS)
    }
  }, [cartItems.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const formatCard   = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const formatExpiry = v => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>=3?`${d.slice(0,2)}/${d.slice(2)}`:d }

  const handleClose = () => {
    if (context === 'checkin') onExit?.()
    else navigate(SCREENS.UPSELLS)
  }

  const handlePay = () => {
    if (!isRequest) { setPaid(true); return }
    if (onConfirm) onConfirm()
    else if (context === 'checkin') navigate(SCREENS.STEP6)
    else navigate(SCREENS.UPSELLS)
  }

  const handleDone = () => {
    if (onConfirm) onConfirm()
    else if (context === 'checkin') navigate(SCREENS.STEP6)
    else navigate(SCREENS.UPSELLS)
  }

  // ── Step 2 CTA label ─────────────────────────────────────────────────────
  const step2Cta = isRequest
    ? 'Send a request'
    : `Pay ${currency}${total.toFixed(2)}`

  const selectedMethodObj = PAYMENT_METHODS.find(m => m.id === selectedMethod)

  // ── Success screen ────────────────────────────────────────────────────────
  if (paid) {
    return (
      <div
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}pack-your-bags.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <ConfettiOverlay />
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-20 h-20 rounded-full bg-(--color-hostaway-secondary-600) flex items-center justify-center mb-6 shadow-lg">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M7 18l7 7 15-15" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-[22px] font-bold text-(--color-fg-primary) text-center leading-[30px] mb-3">{itemLabel} added to your reservation</h1>
          <p className="text-[16px] text-(--color-fg-tertiary) text-center leading-6">
            Nothing to worry about — your payment went through and everything is sorted.
          </p>
        </div>
        <div className="shrink-0 px-4 pb-8">
          <button onClick={handleDone} className="w-full h-14 bg-(--color-fg-primary) rounded-2xl flex items-center justify-center active:opacity-90 transition-opacity">
            <span className="text-[16px] font-semibold text-white">Go back home</span>
          </button>
        </div>
      </div>
    )
  }

  if (!item) return null

  // ── Step 1: Product detail ────────────────────────────────────────────────
  if (step === 1) {
    const { label, description, extendedDescription, price, unit, image, requiresRequest } = item
    const isFree = price === 'FREE'
    const step1Cta = isFree ? 'Add for free' : requiresRequest ? `Request for ${formatPrice(price)}` : 'Continue to payment'

    return (
      <OciStepLayout
        title={label}
        subtitle="Brisa Deluxe Studio"
        progress={50}
        hideBack
        onExit={handleClose}
        continueLabel={step1Cta}
        onContinue={() => isFree ? handleDone() : setStep(2)}
      >
        <div className="px-5 pt-5 pb-4">
          {/* Hero image */}
          {image && (
            <div className="w-full rounded-2xl overflow-hidden mb-5" style={{ height: 200 }}>
              <img src={image} alt={label} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-3 mb-5">
            {extendedDescription
              ? extendedDescription.split('\n\n').map((para, i) => (
                  <p key={i} className="text-[16px] text-(--color-fg-secondary) leading-relaxed">{para}</p>
                ))
              : <p className="text-[16px] text-(--color-fg-secondary) leading-relaxed">{description}</p>
            }
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mb-4">
            {isFree ? (
              <span className="text-[20px] font-bold text-(--color-hostaway-secondary-600)">FREE</span>
            ) : (
              <>
                <span className="text-[20px] font-bold text-(--color-fg-primary)">{formatPrice(price)}</span>
                {unit && <span className="text-[14px] text-(--color-fg-tertiary)">{unit}</span>}
              </>
            )}
          </div>

          {requiresRequest && !isFree && (
            <div className="px-4 py-3 bg-(--color-bg-secondary) rounded-xl">
              <p className="text-[14px] text-(--color-fg-secondary) leading-snug">
                Subject to availability. <span className="font-semibold text-(--color-fg-primary)">No charge yet</span> — we'll confirm and send you a payment link.
              </p>
            </div>
          )}
        </div>
      </OciStepLayout>
    )
  }

  // ── Step 2: Payment ───────────────────────────────────────────────────────
  return (
    <OciStepLayout
      title="Payment"
      subtitle="Brisa Deluxe Studio"
      progress={100}
      onBack={() => setStep(1)}
      onExit={handleClose}
      continueLabel={step2Cta}
      onContinue={handlePay}
    >
      <div className="px-5 pt-5 pb-6">

        {/* Request flow: no payment methods, just info */}
        {isRequest ? (
          <>
            {/* Request banner */}
            <div className="px-4 py-3.5 bg-white rounded-2xl border border-(--color-border-secondary) flex gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
                <path d="M10 2L3 5.5V10c0 4 3.1 7.4 7 8 3.9-.6 7-4 7-8V5.5L10 2z" stroke="var(--color-fg-primary)" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M10 7v3M10 12.5v.5" stroke="var(--color-fg-primary)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="text-[14px] text-(--color-fg-secondary) leading-snug">
                We'll check availability first. <span className="font-semibold text-(--color-fg-primary)">No charge yet</span> — once confirmed we'll charge your saved payment method or send you a payment link.
              </p>
            </div>
</>
        ) : (
          <>
            {/* Payment method list */}
            <p className="text-[18px] font-semibold text-(--color-fg-primary) leading-tight mb-4">Payment method</p>

            <div className="flex flex-col gap-2 mb-2">
              {PAYMENT_METHODS.filter(m => showMore || PRIMARY_METHODS.includes(m.id)).map(method => {
                const active = selectedMethod === method.id
                return (
                  <button key={method.id} onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors text-left ${active ? 'border-(--color-hostaway-secondary-600) bg-(--color-bg-secondary)' : 'border-(--color-border-primary) bg-white hover:bg-(--color-bg-secondary)'}`}
                  >
                    <span className={active ? 'text-(--color-hostaway-secondary-600)' : 'text-(--color-fg-tertiary)'}>{method.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[16px] font-medium leading-tight ${active ? 'text-(--color-fg-primary)' : 'text-(--color-fg-secondary)'}`}>{method.label}</p>
                      {method.sublabel && <p className="text-[13px] text-(--color-fg-tertiary) leading-tight mt-0.5">{method.sublabel}</p>}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${active ? 'border-(--color-hostaway-secondary-600)' : 'border-(--color-border-primary)'}`}>
                      {active && <div className="w-2.5 h-2.5 rounded-full bg-(--color-hostaway-secondary-600)" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Show more toggle */}
            <button onClick={() => setShowMore(v => !v)}
              className="flex items-center gap-1.5 mb-6 text-[14px] font-medium text-(--color-fg-tertiary) hover:text-(--color-fg-primary) transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}>
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {showMore ? 'Show fewer options' : 'Show more payment options'}
            </button>

            {/* Card details */}
            {selectedMethod === 'card' && (
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-[18px] font-semibold text-(--color-fg-primary)">Card details</p>

                <div>
                  <label className="text-[14px] font-medium text-(--color-fg-secondary) mb-1 block">
                    Card number<span className="text-(--color-hostaway-secondary-600) ml-0.5">*</span>
                  </label>
                  <div className="h-12 border border-(--color-border-primary) rounded-xl flex items-center bg-white overflow-hidden">
                    <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))}
                      className="flex-1 px-4 text-[16px] font-normal text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-transparent tracking-wide" />
                    <div className="h-full px-3 border-l border-(--color-border-primary) flex items-center justify-center bg-white">
                      <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                        <rect x="0" y="0" width="22" height="16" rx="3" fill="var(--color-border-secondary)"/>
                        <circle cx="8" cy="8" r="5" fill="#eb001b"/><circle cx="14" cy="8" r="5" fill="#f79e1b"/>
                        <path d="M11 5a5 5 0 000 6 5 5 0 000-6z" fill="#ff5f00"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[14px] font-medium text-(--color-fg-secondary) mb-1 block">
                    Cardholder name<span className="text-(--color-hostaway-secondary-600) ml-0.5">*</span>
                  </label>
                  <input type="text" placeholder="Name as on card" value={cardName} onChange={e => setCardName(e.target.value)}
                    className="w-full h-12 border border-(--color-border-primary) rounded-xl px-4 text-[16px] font-normal text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-white" />
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[14px] font-medium text-(--color-fg-secondary) mb-1 block">
                      Expiry date<span className="text-(--color-hostaway-secondary-600) ml-0.5">*</span>
                    </label>
                    <input type="text" inputMode="numeric" placeholder="MM / YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                      className="w-full h-12 border border-(--color-border-primary) rounded-xl px-4 text-[16px] font-normal text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-white tracking-wide" />
                  </div>
                  <div className="w-[120px]">
                    <label className="text-[14px] font-medium text-(--color-fg-secondary) mb-1 block">
                      CVC<span className="text-(--color-hostaway-secondary-600) ml-0.5">*</span>
                    </label>
                    <div className="h-12 border border-(--color-border-primary) rounded-xl flex items-center bg-white overflow-hidden">
                      <input type="text" inputMode="numeric" placeholder="•••" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g,'').slice(0,4))}
                        className="flex-1 pl-4 text-[16px] font-normal text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-transparent tracking-widest" />
                      <div className="pr-3 flex items-center text-(--color-fg-quaternary)">
                        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                          <rect x="0.5" y="0.5" width="17" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                          <path d="M0 4h18" stroke="currentColor" strokeWidth="1.8"/>
                          <rect x="2" y="7" width="5" height="2" rx="0.5" fill="currentColor" opacity=".4"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Redirect/wallet info */}
            {selectedMethod !== 'card' && selectedMethod !== 'apple-pay' && selectedMethod !== 'google-pay' && (
              <div className="mb-6 px-4 py-3 bg-(--color-bg-secondary) rounded-xl border border-(--color-border-secondary)">
                <p className="text-[16px] text-(--color-fg-secondary) leading-snug">
                  You'll be redirected to <span className="font-semibold text-(--color-fg-primary)">{selectedMethodObj?.label}</span> to complete your payment securely.
                </p>
              </div>
            )}
            {(selectedMethod === 'apple-pay' || selectedMethod === 'google-pay') && (
              <div className="mb-6 px-4 py-3 bg-(--color-bg-secondary) rounded-xl border border-(--color-border-secondary)">
                <p className="text-[16px] text-(--color-fg-secondary) leading-snug">
                  Tap <span className="font-semibold text-(--color-fg-primary)">{step2Cta}</span> to authenticate with {selectedMethodObj?.label}.
                </p>
              </div>
            )}

            {/* Secure note */}
            <div className="flex items-center gap-2">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
                <path d="M7 0L1 3v4c0 3.55 2.56 6.88 6 7.68C10.44 13.88 13 10.55 13 7V3L7 0z" fill="var(--color-border-secondary)"/>
                <path d="M5 7.5l1.5 1.5L9 6" stroke="var(--color-gray-500)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[14px] text-(--color-gray-500)">Payments are encrypted and secure</span>
            </div>
          </>
        )}
      </div>
    </OciStepLayout>
  )
}
