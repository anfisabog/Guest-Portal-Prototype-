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
      // FREE — track as added, no checkout needed
      setAddedItems(prev => new Set([...prev, item.id]))
    } else {
      onBuyNow?.(item)
    }
  }

  const handleRemove = (id) => {
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
            const { id, label, description, price, unit, image } = item
            const isAdded = addedItems.has(id)
            return (
              <div key={id} className="bg-white rounded-2xl overflow-hidden flex">
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
                  <p className="text-[16px] text-(--color-fg-tertiary) leading-snug mt-1 line-clamp-2">{description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-0.5 mt-2">
                    {price === 'FREE' ? (
                      <span className="text-[16px] font-bold text-(--color-hostaway-secondary-600)">FREE</span>
                    ) : (
                      <>
                        <span className="text-[16px] font-bold text-(--color-fg-primary)">{price}</span>
                        {unit && <span className="text-[13px] text-(--color-fg-tertiary) ml-0.5">{unit}</span>}
                      </>
                    )}
                  </div>

                  {/* CTA — Read more or Remove */}
                  {isAdded ? (
                    <button
                      onClick={() => handleRemove(id)}
                      className="mt-2 w-full h-9 border border-(--color-border-secondary) rounded-xl text-[14px] font-semibold text-(--color-fg-tertiary) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => setDrawerItem(item)}
                      className="mt-2 w-full h-9 border border-(--color-border-primary) rounded-xl text-[14px] font-semibold text-(--color-fg-primary) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors"
                    >
                      Read more
                    </button>
                  )}
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
