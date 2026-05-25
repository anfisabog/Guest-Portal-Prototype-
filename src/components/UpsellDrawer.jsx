import { useEffect, useState } from 'react'

// ── Upsell detail drawer — full-screen bottom sheet ───────────────────────────
// FREE items: confirm instantly, show success state, close automatically.
// Paid items: "Buy now — €X" / "Request — €X" → navigate to checkout.

export default function UpsellDrawer({ item, onClose, onBuy }) {
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // FREE: auto-confirm and close after 1.8s
  useEffect(() => {
    if (!confirmed) return
    const t = setTimeout(() => { onBuy(item) }, 1800)
    return () => clearTimeout(t)
  }, [confirmed]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!item) return null
  const { label, tagline, description, extendedDescription, price, unit, requiresRequest, addedByOTA, image } = item
  const isFree = price === 'FREE'

  const priceLabel = isFree ? 'FREE' : `${price}${unit ? ' ' + unit : ''}`
  const ctaLabel = isFree
    ? 'Add for free'
    : requiresRequest
      ? `Request — ${price}${unit ? ' ' + unit : ''}`
      : `Buy now — ${price}${unit ? ' ' + unit : ''}`

  const handleCta = () => {
    if (isFree) setConfirmed(true)
    else onBuy(item)
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ maxWidth: 900, left: '50%', transform: 'translateX(-50%)', width: '100%' }}
    >
      {/* Backdrop (slim strip at top since sheet is nearly full screen) */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet — full height */}
      <div
        className="relative mt-auto bg-white rounded-t-3xl flex flex-col overflow-hidden"
        style={{ height: '93vh' }}
      >
        {/* Drag handle */}
        <div className="shrink-0 flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-(--color-border-primary)" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-(--color-bg-secondary) rounded-full flex items-center justify-center active:opacity-70 transition-opacity z-10"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="var(--color-fg-primary)" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto scrollable flex-1 pb-[104px]">

          {/* Hero image */}
          <div className="w-full h-[220px] bg-(--color-bg-secondary) shrink-0">
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
          </div>

          {/* Content */}
          <div className="px-5 pt-5">
            {/* Title */}
            <h2 className="text-[26px] font-bold text-(--color-fg-primary) leading-tight mb-1">{label}</h2>

            {/* Tagline */}
            {tagline && (
              <p className="text-[15px] text-(--color-fg-tertiary) mb-4">{tagline}</p>
            )}

            {/* Description paragraphs */}
            <div className="flex flex-col gap-3 mb-5">
              {extendedDescription
                ? extendedDescription.split('\n\n').map((para, i) => (
                    <p key={i} className="text-[16px] text-(--color-fg-secondary) leading-relaxed">{para}</p>
                  ))
                : <p className="text-[16px] text-(--color-fg-secondary) leading-relaxed">{description}</p>
              }
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5">
              {isFree ? (
                <span className="text-[20px] font-bold text-(--color-hostaway-secondary-600)">FREE</span>
              ) : (
                <>
                  <span className="text-[20px] font-bold text-(--color-fg-primary)">{price}</span>
                  {unit && <span className="text-[14px] text-(--color-fg-tertiary)">{unit}</span>}
                </>
              )}
            </div>

            {requiresRequest && !isFree && (
              <div className="mt-3 px-4 py-3 bg-(--color-bg-secondary) rounded-xl">
                <p className="text-[14px] text-(--color-fg-secondary) leading-snug">
                  Subject to availability. <span className="font-semibold text-(--color-fg-primary)">No charge yet</span> — we'll confirm and send you a payment link.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sticky CTA footer ── */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-white border-t border-(--color-border-secondary)">
          {confirmed ? (
            <div className="w-full h-12 bg-(--color-hostaway-secondary-600) rounded-xl flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[16px] font-semibold text-white">Added to your stay!</span>
            </div>
          ) : addedByOTA ? (
            <div className="w-full h-12 bg-(--color-bg-secondary) rounded-xl flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8l4 4 8-8" stroke="var(--color-fg-tertiary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[16px] font-semibold text-(--color-fg-tertiary)">Already included</span>
            </div>
          ) : (
            <button
              onClick={handleCta}
              className="w-full h-12 bg-(--color-fg-primary) rounded-xl text-[16px] font-semibold text-white active:opacity-90 transition-opacity"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
