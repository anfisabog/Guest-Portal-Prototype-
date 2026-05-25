import { upsellItems } from '../data/upsells'
import { formatPrice } from '../utils/formatPrice'

export default function UpsellsTab({ tabBarVariant = 'v2', onBuyNow, addedItems = new Set(), onRemoveFreeItem }) {
  const pb = tabBarVariant === 'v2' ? 104 : 68

  const handleRemove = (e, id) => {
    e.stopPropagation()
    onRemoveFreeItem?.(id)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}home%20page%20background.png)`, backgroundSize: 'cover', backgroundPosition: 'center top', backgroundRepeat: 'no-repeat' }}>
      <div className="flex-1 overflow-y-auto scrollable" style={{ paddingBottom: pb }}>
        {/* Header */}
        <div className="px-4 pt-5 pb-3">
          <h1 className="text-[22px] font-bold text-(--color-fg-primary) leading-tight">Enhance your stay</h1>
          <p className="text-[14px] text-(--color-fg-tertiary) mt-1">Add extras to make your trip even better</p>
        </div>

        {/* Cards */}
        <div className="px-4 flex flex-col gap-3 pb-4">
          {upsellItems.map((item) => {
            const { id, label, description, price, unit, image, addedByOTA } = item
            const isAdded = addedItems.has(id)
            const clickable = !addedByOTA

            return (
              <div
                key={id}
                onClick={clickable ? () => onBuyNow?.(item) : undefined}
                className={`bg-white rounded-2xl overflow-hidden flex ${clickable ? 'cursor-pointer active:opacity-80' : ''}`}
              >
                {/* Image */}
                {image
                  ? <div className="w-[110px] shrink-0 self-stretch overflow-hidden"><img src={image} alt={label} className="w-full h-full object-cover" /></div>
                  : (
                    <div className="w-[110px] shrink-0 bg-(--color-bg-warm) flex items-center justify-center self-stretch">
                      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="2" y="5" width="24" height="18" rx="3" stroke="var(--color-fg-quaternary)" strokeWidth="1.4"/>
                        <circle cx="9" cy="12" r="2.5" stroke="var(--color-fg-quaternary)" strokeWidth="1.4"/>
                        <path d="M2 19l6-5 5 4 4-4 7 6" stroke="var(--color-fg-quaternary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )
                }

                {/* Content */}
                <div className="flex-1 p-3 flex flex-col min-w-0">
                  <p className="text-[18px] font-bold text-(--color-fg-primary) leading-snug">{label}</p>
                  <p className="text-[15px] text-(--color-fg-tertiary) leading-snug mt-1 line-clamp-2 flex-1">{description}</p>

                  {/* Bottom row: price + action */}
                  <div className="flex items-center justify-between mt-2">
                    {/* Price */}
                    <div className="flex items-baseline gap-0.5">
                      {price === 'FREE' ? (
                        <span className="text-[15px] font-bold text-(--color-hostaway-secondary-600)">FREE</span>
                      ) : (
                        <>
                          <span className="text-[15px] font-bold text-(--color-fg-primary)">{formatPrice(price)}</span>
                          {unit && <span className="text-[12px] text-(--color-fg-tertiary) ml-0.5">{unit}</span>}
                        </>
                      )}
                    </div>

                    {/* Action */}
                    {addedByOTA ? (
                      <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-(--color-bg-secondary) text-(--color-fg-quaternary) border border-(--color-border-secondary)">
                        Included
                      </span>
                    ) : isAdded ? (
                      <button
                        onClick={(e) => handleRemove(e, id)}
                        className="w-9 h-9 rounded-xl border border-(--color-border-primary) flex items-center justify-center text-(--color-fg-secondary) hover:border-(--color-fg-error-primary) hover:text-(--color-fg-error-primary) hover:bg-red-50 active:opacity-70 transition-colors shrink-0"
                        aria-label="Remove"
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M3 5.5h12M7 5.5V3.75A.75.75 0 0 1 7.75 3h2.5a.75.75 0 0 1 .75.75V5.5M7.5 9v4M10.5 9v4M4 5.5l1 9.25A.75.75 0 0 0 5.75 15h6.5a.75.75 0 0 0 .75-.75L14 5.5"
                            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
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
    </div>
  )
}
