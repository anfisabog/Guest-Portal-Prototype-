import { useState, useEffect } from 'react'
import { SCREENS } from '../screens'

// Upsell cart review + pay page.
// context='checkin' — step within check-in flow: back arrow + close button + progress bar
// context='upsell'  — standalone from Upsells tab: close only, no back, no progress

function parsePrice(price) {
  if (price === 'FREE') return 0
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0
}

function getCurrency(cartItems) {
  const item = cartItems.find(i => i.price !== 'FREE')
  return item ? item.price.replace(/[0-9., ]/g, '') || '€' : '€'
}

const PAYMENT_METHODS = [
  { id: 'apple-pay',   label: 'Apple Pay',          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
  { id: 'google-pay',  label: 'Google Pay',         icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 11.5v1.5h3.5c-.15.9-1.1 2.65-3.5 2.65C9.65 15.65 7.8 13.75 7.8 11.5S9.65 7.35 12 7.35c1.3 0 2.15.55 2.65 1.05l1.8-1.75C15.3 5.45 13.8 4.75 12 4.75 8.1 4.75 5 7.85 5 11.75S8.1 18.75 12 18.75c4.1 0 6.8-2.9 6.8-6.95 0-.45-.05-.8-.1-1.15L12 10.6v.9z" fill="#4285F4"/></svg> },
  { id: 'card',        label: 'Credit / Debit card', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M2 9h20" stroke="currentColor" strokeWidth="1.6"/><path d="M6 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg> },
]

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
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName]     = useState('')
  const [expiry, setExpiry]         = useState('')
  const [cvc, setCvc]               = useState('')
  const [paid, setPaid]             = useState(false)

  const total = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0)
  const currency = getCurrency(cartItems)
  const isRequestFlow = cartItems.some(i => i.requiresRequest)
  const itemLabel = cartItems[0]?.label ?? 'your extra'

  // Auto-close when cart emptied by removing last item
  useEffect(() => {
    if (!paid && cartItems.length === 0) {
      if (context === 'checkin') onExit?.()
      else navigate(SCREENS.UPSELLS)
    }
  }, [cartItems.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const formatCard   = v => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const formatExpiry = v => { const d=v.replace(/\D/g,'').slice(0,4); return d.length>=3?`${d.slice(0,2)}/${d.slice(2)}`:d }

  const handleConfirm = () => {
    if (!isRequestFlow && cartItems.length > 0) {
      // Show success screen
      setPaid(true)
      return
    }
    if (onConfirm) onConfirm()
    else if (context === 'checkin') navigate(SCREENS.STEP6)
    else navigate(SCREENS.HOMEPAGE)
  }

  const handleDone = () => {
    if (onConfirm) onConfirm()
    else if (context === 'checkin') navigate(SCREENS.STEP6)
    else navigate(SCREENS.UPSELLS)
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (paid) {
    return (
      <div
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}pack-your-bags.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <ConfettiOverlay />
        {/* Centered content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="w-20 h-20 rounded-full bg-(--color-hostaway-secondary-600) flex items-center justify-center mb-6 shadow-lg">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M7 18l7 7 15-15" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-[32px] font-bold text-(--color-fg-primary) text-center leading-[40px] mb-3">You're all set! 🎉</h1>
          <p className="text-[16px] text-(--color-fg-tertiary) text-center leading-6">
            <span className="font-semibold text-(--color-fg-primary)">{itemLabel}</span> has been added to your reservation.
          </p>
        </div>
        {/* Footer — pinned to bottom like Step6 */}
        <div className="shrink-0 px-4 pb-8">
          <button
            onClick={handleDone}
            className="w-full h-14 bg-(--color-fg-primary) rounded-2xl flex items-center justify-center active:opacity-90 transition-opacity"
          >
            <span className="text-[16px] font-semibold text-white">Go back home</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-(--color-bg-warm)">

      {/* ── Header ── */}
      <div
        className="relative flex items-center justify-between px-4 shrink-0"
        style={{ paddingTop: 16, paddingBottom: 16 }}
      >
        {/* Back — checkin context only */}
        {context === 'checkin' ? (
          <button
            onClick={() => navigate(SCREENS.STEP5)}
            className="w-9 h-9 bg-white border border-(--color-border-secondary) rounded-lg flex items-center justify-center active:opacity-70"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="var(--color-fg-primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <div className="w-9" /> /* spacer to keep close button right-aligned */
        )}

        {/* Progress bar — checkin only */}
        {context === 'checkin' && (
          <div className="absolute left-1/2 -translate-x-1/2 w-[120px] h-1 bg-(--color-border-secondary) rounded-full overflow-hidden">
            <div className="h-full bg-(--color-fg-primary) rounded-full" style={{ width: '95%' }} />
          </div>
        )}

        {/* Close button — always shown */}
        <button
          onClick={context === 'checkin' ? onExit : () => navigate(SCREENS.UPSELLS)}
          className="w-9 h-9 bg-white border border-(--color-border-secondary) rounded-lg flex items-center justify-center active:opacity-70"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="var(--color-fg-primary)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto scrollable pb-[96px]">

        {/* Title */}
        <div className="px-5 pt-2 pb-5">
          <p className="text-[13px] text-(--color-fg-tertiary) mb-0.5">Brisa Deluxe Studio</p>
          <h1 className="text-[26px] font-bold text-(--color-fg-primary) leading-tight">Your extras</h1>
        </div>

        {/* Cart items */}
        <div className="px-5 flex flex-col gap-3 mb-5">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-5 text-center">
              <p className="text-[15px] text-(--color-fg-tertiary)">Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3">
                {/* Icon placeholder */}
                <div className="w-10 h-10 rounded-xl bg-(--color-bg-warm) flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 1h1.2c.22 0 .33 0 .42.04a.45.45 0 0 1 .19.17c.05.08.07.19.1.41L3.5 4m0 0 .95 6.96c.12.88.18 1.32.39 1.66a1.8 1.8 0 0 0 .77.67c.36.16.8.16 1.7.16h7.7c.85 0 1.27 0 1.62-.15a1.8 1.8 0 0 0 .76-.63c.21-.31.29-.73.45-1.56l1.19-6.25c.06-.29.08-.44.04-.55a.45.45 0 0 0-.2-.24C18 4 17.83 4 17.53 4H3.5ZM7.5 17a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0Zm7.2 0a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0Z"
                      stroke="var(--color-fg-quaternary)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-(--color-fg-primary) leading-snug">{item.label}</p>
                  <p className="text-[13px] text-(--color-fg-tertiary) mt-0.5">
                    {item.price === 'FREE' ? 'FREE' : `${item.price}${item.unit || ''}`}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-(--color-fg-quaternary) hover:bg-(--color-bg-secondary) hover:text-(--color-fg-primary) active:bg-(--color-bg-secondary) transition-colors shrink-0"
                  aria-label={`Remove ${item.label}`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 4h10M5 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4M6 7v3M8 7v3M3 4l.75 7.25A.75.75 0 0 0 4.5 12h5a.75.75 0 0 0 .75-.75L11 4"
                      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* ── Payment method selection (paid non-request items only) ── */}
        {cartItems.length > 0 && !isRequestFlow && total > 0 && (
          <div className="mx-5 mb-4">
            <p className="text-[16px] font-semibold text-(--color-fg-primary) mb-3">Payment method</p>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map(({ id, label, icon }) => {
                const active = selectedMethod === id
                return (
                  <button key={id} onClick={() => setSelectedMethod(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors text-left ${active ? 'border-(--color-hostaway-secondary-600) bg-(--color-bg-secondary)' : 'border-(--color-border-primary) bg-white hover:bg-(--color-bg-secondary)'}`}
                  >
                    <span className={active ? 'text-(--color-hostaway-secondary-600)' : 'text-(--color-fg-tertiary)'}>{icon}</span>
                    <span className={`flex-1 text-[16px] font-medium ${active ? 'text-(--color-fg-primary)' : 'text-(--color-fg-secondary)'}`}>{label}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'border-(--color-hostaway-secondary-600)' : 'border-(--color-border-primary)'}`}>
                      {active && <div className="w-2.5 h-2.5 rounded-full bg-(--color-hostaway-secondary-600)" />}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Card details */}
            {selectedMethod === 'card' && (
              <div className="mt-3 flex flex-col gap-2">
                <div className="h-12 border border-(--color-border-primary) rounded-xl flex items-center bg-white overflow-hidden">
                  <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))}
                    className="flex-1 px-4 text-[16px] text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-transparent tracking-wide" />
                </div>
                <input type="text" placeholder="Cardholder name" value={cardName} onChange={e => setCardName(e.target.value)}
                  className="w-full h-12 border border-(--color-border-primary) rounded-xl px-4 text-[16px] text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-white" />
                <div className="flex gap-2">
                  <input type="text" inputMode="numeric" placeholder="MM / YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                    className="flex-1 h-12 border border-(--color-border-primary) rounded-xl px-4 text-[16px] text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-white" />
                  <input type="text" inputMode="numeric" placeholder="CVC" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g,'').slice(0,4))}
                    className="w-[100px] h-12 border border-(--color-border-primary) rounded-xl px-4 text-[16px] text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-white tracking-widest" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Request-flow info banner */}
        {cartItems.length > 0 && isRequestFlow && (
          <div className="mx-5 mb-4 px-4 py-3.5 bg-white rounded-2xl border border-(--color-border-secondary) flex gap-3">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5">
              <path d="M10 2L3 5.5V10c0 4 3.1 7.4 7 8 3.9-.6 7-4 7-8V5.5L10 2z" stroke="var(--color-fg-primary)" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M10 7v3M10 12.5v.5" stroke="var(--color-fg-primary)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p className="text-[14px] text-(--color-fg-secondary) leading-snug">
              We'll check availability first. <span className="font-semibold text-(--color-fg-primary)">No charge yet</span> — once confirmed we'll charge your saved payment method or send you a payment link.
            </p>
          </div>
        )}

        {/* Payment breakdown */}
        {cartItems.length > 0 && (
          <div className="mx-5 bg-white rounded-2xl p-4 border border-(--color-border-secondary)">
            <p className="text-[13px] font-bold text-(--color-fg-primary) mb-3">Order summary</p>
            <div className="flex flex-col gap-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-[13px] text-(--color-fg-secondary)">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.requiresRequest && (
                      <span className="text-[11px] font-semibold text-(--color-fg-warning) bg-(--color-bg-warning-secondary) px-1.5 py-0.5 rounded-full">pending</span>
                    )}
                    <span className="text-[13px] font-medium text-(--color-fg-primary)">{item.price === 'FREE' ? 'FREE' : `${item.price}${item.unit || ''}`}</span>
                  </div>
                </div>
              ))}
              <div className="h-px bg-(--color-border-secondary) my-1" />
              {!isRequestFlow && (
                <div className="flex justify-between">
                  <span className="text-[13px] text-(--color-fg-secondary)">Taxes & fees</span>
                  <span className="text-[13px] text-(--color-fg-secondary)">€0.00</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[14px] font-bold text-(--color-fg-primary)">{isRequestFlow ? 'Est. total' : 'Total'}</span>
                <span className="text-[14px] font-bold text-(--color-fg-primary)">{isRequestFlow ? 'TBD' : `${currency}${total.toFixed(2)}`}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky CTA ── */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3 bg-(--color-bg-warm)" style={{ boxShadow: '0 -8px 24px rgba(0,0,0,0.06)' }}>
        <button
          onClick={handleConfirm}
          disabled={cartItems.length === 0}
          className="w-full h-12 bg-(--color-fg-primary) rounded-xl text-[15px] font-semibold text-white active:opacity-90 disabled:opacity-40 transition-opacity"
        >
          {cartItems.length === 0
            ? 'Nothing to pay'
            : isRequestFlow
              ? 'Send a request'
              : selectedMethod === 'apple-pay'
                ? `Pay with Apple Pay for ${currency}${total.toFixed(2)}`
                : selectedMethod === 'google-pay'
                  ? `Pay with Google Pay for ${currency}${total.toFixed(2)}`
                  : `Pay ${currency}${total.toFixed(2)}`}
        </button>
        {isRequestFlow && cartItems.length > 0 && (
          <p className="text-[12px] text-(--color-fg-tertiary) text-center mt-2">No payment will be charged yet</p>
        )}
      </div>
    </div>
  )
}
