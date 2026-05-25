import { useState } from 'react'
import { SCREENS } from '../screens'
import OciStepLayout from '../components/OciStepLayout'

// Stripe-supported payment methods relevant to global / EU short-term rental guests
const PAYMENT_METHODS = [
  {
    id: 'apple-pay',
    label: 'Apple Pay',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    ),
  },
  {
    id: 'google-pay',
    label: 'Google Pay',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 11.5v1.5h3.5c-.15.9-1.1 2.65-3.5 2.65C9.65 15.65 7.8 13.75 7.8 11.5S9.65 7.35 12 7.35c1.3 0 2.15.55 2.65 1.05l1.8-1.75C15.3 5.45 13.8 4.75 12 4.75 8.1 4.75 5 7.85 5 11.75S8.1 18.75 12 18.75c4.1 0 6.8-2.9 6.8-6.95 0-.45-.05-.8-.1-1.15L12 10.6v.9z" fill="#4285F4"/>
        <path d="M6.2 9.35l-2.1-1.55A7.3 7.3 0 0 0 3 11.75c0 1.5.4 2.9 1.1 4.1L6.2 14.1a4.4 4.4 0 0 1-.4-2.35c0-.85.15-1.65.4-2.4z" fill="#34A853"/>
        <path d="M12 19c2 0 3.7-.65 4.95-1.8l-2.35-1.8c-.65.45-1.5.75-2.6.75-2.4 0-4.4-1.6-5.15-3.75L4.2 14.2C5.45 16.95 8.5 19 12 19z" fill="#FBBC04"/>
        <path d="M19.8 11.5c0-.6-.05-1.2-.15-1.75H12v3.5h4.4c-.2 1-.75 1.85-1.6 2.4l2.35 1.8c1.4-1.3 2.2-3.2 2.2-5.35-.05-.15-.1-.35-.1-.6z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: 'card',
    label: 'Credit / Debit card',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M2 9h20" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M6 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'ideal',
    label: 'iDEAL',
    sublabel: 'Netherlands',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="18" rx="3" fill="#CC0066" opacity=".12"/>
        <text x="4" y="16" fontSize="9" fontWeight="700" fill="#CC0066" fontFamily="sans-serif">iD</text>
      </svg>
    ),
  },
  {
    id: 'bancontact',
    label: 'Bancontact',
    sublabel: 'Belgium',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="18" rx="3" fill="#005498" opacity=".12"/>
        <text x="3.5" y="16" fontSize="7" fontWeight="700" fill="#005498" fontFamily="sans-serif">BC</text>
      </svg>
    ),
  },
  {
    id: 'blik',
    label: 'BLIK',
    sublabel: 'Poland',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="18" rx="3" fill="#E2001A" opacity=".12"/>
        <text x="3.5" y="16" fontSize="8" fontWeight="700" fill="#E2001A" fontFamily="sans-serif">BK</text>
      </svg>
    ),
  },
  {
    id: 'sepa',
    label: 'SEPA Direct Debit',
    sublabel: 'EU bank accounts',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 12h16M4 8h16M4 16h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'klarna',
    label: 'Klarna',
    sublabel: 'Pay later / instalments',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="18" rx="3" fill="#FFB3C7" opacity=".5"/>
        <text x="4" y="16" fontSize="8" fontWeight="800" fill="#17120E" fontFamily="sans-serif">klarna</text>
      </svg>
    ),
  },
  {
    id: 'sofort',
    label: 'Sofort',
    sublabel: 'Germany · Austria · CH',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="18" rx="3" fill="#EF7C00" opacity=".15"/>
        <text x="3" y="16" fontSize="7" fontWeight="700" fill="#EF7C00" fontFamily="sans-serif">SOFORT</text>
      </svg>
    ),
  },
]

const PRIMARY_METHODS = ['apple-pay', 'google-pay', 'card']
const parsePrice = (p) => p === 'FREE' ? 0 : parseFloat(p.replace(/[^0-9.]/g, '')) || 0

export default function Step5Payment({ navigate, onExit, onContinue, progress = 100, cartItems = [], onRemoveFromCart }) {
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [cardNumber, setCardNumber]         = useState('')
  const [cardName, setCardName]             = useState('')
  const [expiry, setExpiry]                 = useState('')
  const [cvc, setCvc]                       = useState('')
  const [showMore, setShowMore]             = useState(false)

  const formatCard = (val) =>
    val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    return digits.length >= 3 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits
  }

  const selected     = PAYMENT_METHODS.find(m => m.id === selectedMethod)
  const extrasTotal  = cartItems.reduce((s, i) => s + parsePrice(i.price), 0)
  const hasExtras    = cartItems.length > 0
  const ctaLabel     = hasExtras ? `Pay €${extrasTotal}` : 'Complete'

  return (
    <OciStepLayout
      title="Payments"
      progress={progress}
      navigate={navigate}
      onExit={onExit}
      backTo={SCREENS.STEP4}
      onContinue={onContinue || (() => navigate(SCREENS.STEP6))}
      continueLabel={ctaLabel}
      noScroll={!hasExtras}
    >
      {!hasExtras ? (
        /* ── Empty state — nothing to pay ── */
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-(--color-bg-secondary) flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 6c-1.1 0-2 .9-2 2v1.2A11 11 0 0 0 9 20c0 6.08 4.92 11 11 11s11-4.92 11-11a11 11 0 0 0-9-10.8V8c0-1.1-.9-2-2-2z" fill="var(--color-border-secondary)"/>
              <path d="M20 8v8l4 4" stroke="var(--color-hostaway-secondary-600)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="20" cy="20" r="11" stroke="var(--color-hostaway-secondary-600)" strokeWidth="2" fill="none"/>
              <path d="M14 20l4 4 8-8" stroke="var(--color-hostaway-secondary-600)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-[22px] font-bold text-(--color-fg-primary) mb-3">Ready to check in? Let's go! 🚀</p>
          <p className="text-[16px] text-(--color-fg-tertiary) leading-relaxed max-w-[260px]">
            No extras added, nothing to pay. Tap <span className="font-semibold text-(--color-fg-primary)">Complete</span> and your stay begins!
          </p>
        </div>
      ) : (
      <div className="px-5 pt-5 pb-6">
        <>
        {/* ── Payment method list ── */}
        <p className="text-[18px] font-semibold text-(--color-fg-primary) leading-tight mb-4">Payment method</p>

        <div className="flex flex-col gap-2 mb-2">
          {PAYMENT_METHODS.filter(m => showMore || PRIMARY_METHODS.includes(m.id)).map(method => {
            const active = selectedMethod === method.id
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors text-left ${
                  active
                    ? 'border-(--color-hostaway-secondary-600) bg-(--color-bg-secondary)'
                    : 'border-(--color-border-primary) bg-white hover:bg-(--color-bg-secondary)'
                }`}
              >
                <span className={active ? 'text-(--color-hostaway-secondary-600)' : 'text-(--color-fg-tertiary)'}>
                  {method.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-[16px] font-medium leading-tight ${active ? 'text-(--color-fg-primary)' : 'text-(--color-fg-secondary)'}`}>
                    {method.label}
                  </p>
                  {method.sublabel && (
                    <p className="text-[13px] text-(--color-fg-tertiary) leading-tight mt-0.5">{method.sublabel}</p>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  active ? 'border-(--color-hostaway-secondary-600)' : 'border-(--color-border-primary)'
                }`}>
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-(--color-hostaway-secondary-600)" />}
                </div>
              </button>
            )
          })}
        </div>

        {/* Show more / less toggle */}
        <button
          onClick={() => setShowMore(v => !v)}
          className="flex items-center gap-1.5 mb-6 text-[14px] font-medium text-(--color-fg-tertiary) hover:text-(--color-fg-primary) transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={`transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {showMore ? 'Show fewer options' : 'Show more payment options'}
        </button>

        {/* ── Card details (only for card method) ── */}
        {selectedMethod === 'card' && (
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-[18px] font-semibold text-(--color-fg-primary)">Card details</p>

            {/* Card number */}
            <div>
              <label className="text-[14px] font-medium text-(--color-fg-secondary) mb-1 block">
                Card number<span className="text-(--color-hostaway-secondary-600) ml-0.5">*</span>
              </label>
              <div className="h-12 border border-(--color-border-primary) rounded-xl flex items-center bg-white overflow-hidden">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCard(e.target.value))}
                  className="flex-1 px-4 text-[16px] font-normal text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-transparent tracking-wide"
                />
                <div className="h-full px-3 border-l border-(--color-border-primary) flex items-center justify-center bg-white">
                  <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                    <rect x="0" y="0" width="22" height="16" rx="3" fill="var(--color-border-secondary)"/>
                    <circle cx="8" cy="8" r="5" fill="#eb001b"/>
                    <circle cx="14" cy="8" r="5" fill="#f79e1b"/>
                    <path d="M11 5a5 5 0 000 6 5 5 0 000-6z" fill="#ff5f00"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Cardholder name */}
            <div>
              <label className="text-[14px] font-medium text-(--color-fg-secondary) mb-1 block">
                Cardholder name<span className="text-(--color-hostaway-secondary-600) ml-0.5">*</span>
              </label>
              <input
                type="text"
                placeholder="Name as on card"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                className="w-full h-12 border border-(--color-border-primary) rounded-xl px-4 text-[16px] font-normal text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-white"
              />
            </div>

            {/* Expiry + CVC side by side */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[14px] font-medium text-(--color-fg-secondary) mb-1 block">
                  Expiry date<span className="text-(--color-hostaway-secondary-600) ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="MM / YY"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  className="w-full h-12 border border-(--color-border-primary) rounded-xl px-4 text-[16px] font-normal text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-white tracking-wide"
                />
              </div>
              <div className="w-[120px]">
                <label className="text-[14px] font-medium text-(--color-fg-secondary) mb-1 block">
                  CVC<span className="text-(--color-hostaway-secondary-600) ml-0.5">*</span>
                </label>
                <div className="h-12 border border-(--color-border-primary) rounded-xl flex items-center bg-white overflow-hidden">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="•••"
                    value={cvc}
                    onChange={e => setCvc(e.target.value.replace(/\D/g,'').slice(0,4))}
                    className="flex-1 pl-4 text-[16px] font-normal text-(--color-fg-primary) placeholder:text-(--color-fg-quaternary) bg-transparent tracking-widest"
                  />
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

        {/* Redirect methods — show info banner */}
        {selectedMethod !== 'card' && selectedMethod !== 'apple-pay' && selectedMethod !== 'google-pay' && (
          <div className="mb-6 px-4 py-3 bg-(--color-bg-secondary) rounded-xl border border-(--color-border-secondary)">
            <p className="text-[16px] text-(--color-fg-secondary) leading-snug">
              You'll be redirected to <span className="font-semibold text-(--color-fg-primary)">{selected?.label}</span> to complete your payment securely.
            </p>
          </div>
        )}

        {/* Wallet methods */}
        {(selectedMethod === 'apple-pay' || selectedMethod === 'google-pay') && (
          <div className="mb-6 px-4 py-3 bg-(--color-bg-secondary) rounded-xl border border-(--color-border-secondary)">
            <p className="text-[16px] text-(--color-fg-secondary) leading-snug">
              Tap <span className="font-semibold text-(--color-fg-primary)">{ctaLabel}</span> to authenticate with {selected?.label}.
            </p>
          </div>
        )}

        {/* Secure note */}
        <div className="flex items-center gap-2 mb-6">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
            <path d="M7 0L1 3v4c0 3.55 2.56 6.88 6 7.68C10.44 13.88 13 10.55 13 7V3L7 0z" fill="var(--color-border-secondary)"/>
            <path d="M5 7.5l1.5 1.5L9 6" stroke="var(--color-gray-500)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[14px] text-(--color-gray-500)">Payments are encrypted and secure</span>
        </div>

        {/* Amount summary */}
        <div className="bg-(--color-bg-secondary) rounded-xl p-4 border border-(--color-border-secondary)">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between mb-3">
              <span className="text-[16px] text-(--color-fg-secondary) flex-1">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-medium text-(--color-fg-primary)">
                  {item.price === 'FREE' ? 'FREE' : `${item.price}${item.unit || ''}`}
                </span>
                <button
                  onClick={() => onRemoveFromCart?.(item.id)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-(--color-fg-quaternary) hover:text-(--color-fg-primary) hover:bg-(--color-border-secondary) transition-colors"
                  aria-label={`Remove ${item.label}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <div className="h-px bg-(--color-border-secondary) mb-3"/>
          <div className="flex justify-between">
            <span className="text-[18px] font-semibold text-(--color-fg-primary)">Total</span>
            <span className="text-[18px] font-semibold text-(--color-fg-primary)">€{extrasTotal}.00</span>
          </div>
        </div>
        </>
        </div>
      )}
    </OciStepLayout>
  )
}
