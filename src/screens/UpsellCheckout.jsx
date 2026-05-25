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

export default function UpsellCheckout({ context = 'upsell', cartItems = [], onRemoveFromCart, navigate, onExit, onConfirm }) {
  const total = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0)
  const currency = getCurrency(cartItems)
  const isRequestFlow = cartItems.some(i => i.requiresRequest)

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else if (context === 'checkin') {
      navigate(SCREENS.STEP6)
    } else {
      navigate(SCREENS.HOMEPAGE)
    }
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
            {!isRequestFlow && (
              <p className="text-[11px] text-(--color-fg-tertiary) mt-3">This will be charged before you check out.</p>
            )}
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
              : `Confirm & pay ${currency}${total.toFixed(2)}`}
        </button>
        {isRequestFlow && cartItems.length > 0 && (
          <p className="text-[12px] text-(--color-fg-tertiary) text-center mt-2">No payment will be charged yet</p>
        )}
      </div>
    </div>
  )
}
