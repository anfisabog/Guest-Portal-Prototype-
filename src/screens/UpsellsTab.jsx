import { useState } from 'react'
import { upsellItems } from '../data/upsells'
import UpsellDrawer from '../components/UpsellDrawer'

export default function UpsellsTab({ tabBarVariant = 'v2', onBuyNow }) {
  const [drawerItem, setDrawerItem] = useState(null)
  const [addedItems, setAddedItems] = useState(new Set())
  const pb = tabBarVariant === 'v2' ? 104 : 68

  const handleDrawerBuy = (item) => {
    setDrawerItem(null)
    if (item.price === 'FREE') {
      setAddedItems(prev => new Set([...prev, item.id]))
    } else {
      onBuyNow?.(item)
    }
  }

  const handleRemove = (e, id) => {
    e.stopPropagation()
    setAddedItems(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  return (
    <div className="min-h-screen flex flex-col bg-(--color-bg-warm)">

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
                onClick={clickable ? () => setDrawerItem(item) : undefined}
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
                  {/* Title */}
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
                          <span className="text-[15px] font-bold text-(--color-fg-primary)">{price}</span>
                          {unit && <span className="text-[12px] text-(--color-fg-tertiary) ml-0.5">{unit}</span>}
                        </>
                      )}
                    </div>

                    {/* Action */}
                    {addedByOTA ? (
                      /* Included — disabled pill */
                      <span className="text-[12px] font-semibold px-3 py-1 rounded-full bg-(--color-bg-secondary) text-(--color-fg-quaternary) border border-(--color-border-secondary)">
                        Included
                      </span>
                    ) : isAdded ? (
                      /* Trash icon — remove */
                      <button
                        onClick={(e) => handleRemove(e, id)}
                        className="w-8 h-8 rounded-xl border border-(--color-border-secondary) flex items-center justify-center text-(--color-fg-quaternary) hover:border-(--color-fg-error-primary) hover:text-(--color-fg-error-primary) active:opacity-70 transition-colors shrink-0"
                        aria-label="Remove"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 4h10M5 4V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V4M6 7v3M8 7v3M3 4l.75 7.25A.75.75 0 0 0 4.5 12h5a.75.75 0 0 0 .75-.75L11 4"
                            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    ) : (
                      /* Arrow chevron */
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

      {/* Drawer */}
      {drawerItem && (
        <UpsellDrawer
          item={drawerItem}
          onClose={() => setDrawerItem(null)}
          onBuy={handleDrawerBuy}
        />
      )}
    </div>
  )
}
