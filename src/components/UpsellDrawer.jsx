import { useEffect } from 'react'

// ── Upsell detail drawer — full-width bottom sheet ────────────────────────────
// Opens when user taps "Read more" on any upsell card.
// Shows hero image, description, price, then "Buy now" / "Request now" CTA.

export default function UpsellDrawer({ item, onClose, onBuy }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!item) return null
  const { label, description, price, unit, requiresRequest, image } = item
  const ctaLabel = requiresRequest ? 'Request now' : 'Buy now'

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ maxWidth: 900, left: '50%', transform: 'translateX(-50%)', width: '100%' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Sheet */}
      <div
        className="relative mt-auto bg-white rounded-t-3xl flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* ── Hero image ── */}
        <div className="relative shrink-0 h-[260px] bg-(--color-bg-secondary)">
          {image
            ? <img src={image} alt={label} className="w-full h-full object-cover" />
            : (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="3" y="7" width="34" height="26" rx="4" stroke="var(--color-fg-quaternary)" strokeWidth="1.6"/>
                  <circle cx="13" cy="17" r="3.5" stroke="var(--color-fg-quaternary)" strokeWidth="1.6"/>
                  <path d="M3 29l9-8 8 7 6-6 11 9" stroke="var(--color-fg-quaternary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )
          }
          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/30 rounded-full flex items-center justify-center active:bg-black/50 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto scrollable flex-1 px-5 pt-5 pb-[100px]">

          <h2 className="text-[22px] font-bold text-(--color-fg-primary) leading-tight">{label}</h2>
          <p className="text-[16px] text-(--color-fg-secondary) leading-relaxed mt-2">{description}</p>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-1">
            {price === 'FREE' ? (
              <span className="text-[26px] font-bold text-(--color-fg-primary)">FREE</span>
            ) : (
              <>
                <span className="text-[26px] font-bold text-(--color-fg-primary)">{price}</span>
                {unit && <span className="text-[16px] text-(--color-fg-tertiary)">{unit}</span>}
              </>
            )}
          </div>

          {requiresRequest && (
            <div className="mt-4 px-4 py-3 bg-(--color-bg-secondary) rounded-xl">
              <p className="text-[14px] text-(--color-fg-secondary) leading-snug">
                Subject to availability. <span className="font-semibold text-(--color-fg-primary)">No charge yet</span> — we'll confirm and send a payment link.
              </p>
            </div>
          )}
        </div>

        {/* ── Sticky CTA footer ── */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white border-t border-(--color-border-secondary)">
          <button
            onClick={() => onBuy(item)}
            className="w-full h-12 bg-(--color-fg-primary) rounded-xl text-[16px] font-semibold text-white active:opacity-90 transition-opacity"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
