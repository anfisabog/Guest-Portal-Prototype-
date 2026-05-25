import { useState } from 'react'

// Height of the collapsed bar — screens add this to their bottom padding when cart is active
export const CART_FOOTER_HEIGHT = 80

function parsePrice(price) {
  if (price === 'FREE') return 0
  return parseFloat(price.replace(/[^0-9.]/g, '')) || 0
}

function getCurrency(cartItems) {
  const item = cartItems.find(i => i.price !== 'FREE')
  return item ? item.price.replace(/[0-9., ]/g, '') || '€' : '€'
}

export default function CartFooter({ cartItems, onRemove, onPayNow }) {
  const [expanded, setExpanded] = useState(false)

  const total = cartItems.reduce((sum, item) => sum + parsePrice(item.price), 0)
  const currency = getCurrency(cartItems)

  return (
    <div
      className="fixed bg-white z-[60] border-t border-(--color-border-secondary)"
      style={{ bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 900, boxShadow: '0 -4px 16px rgba(0,0,0,0.08)' }}
    >
      {/* Expandable payment summary — grows upward */}
      {expanded && (
        <div className="px-4 pt-3 pb-3 bg-(--color-bg-warm) border-b border-(--color-border-secondary)">
          <p className="text-[13px] font-bold text-(--color-fg-primary) mb-2.5">Payment summary</p>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-[13px] text-(--color-fg-secondary)">Upgrades and extras</span>
              <span className="text-[13px] font-semibold text-(--color-fg-primary)">{currency}{total.toFixed(2)}</span>
            </div>
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center gap-2">
                <span className="text-[12px] text-(--color-fg-tertiary) flex-1 min-w-0 truncate">{item.label}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[12px] text-(--color-fg-tertiary)">{item.price}</span>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="w-5 h-5 flex items-center justify-center rounded text-(--color-fg-quaternary) hover:text-(--color-fg-primary) transition-colors"
                    aria-label={`Remove ${item.label}`}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-1.5 mt-0.5 border-t border-(--color-border-secondary)">
              <span className="text-[13px] text-(--color-fg-secondary)">Taxes & fees</span>
              <span className="text-[13px] text-(--color-fg-secondary)">€0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[13px] font-bold text-(--color-fg-primary)">Total</span>
              <span className="text-[13px] font-bold text-(--color-fg-primary)">{currency}{total.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-[11px] text-(--color-fg-tertiary) mt-2.5">This will be charged before you check out.</p>
        </div>
      )}

      {/* Collapsed bar — Total + Pay now */}
      <div className="flex items-center justify-between px-4" style={{ height: CART_FOOTER_HEIGHT }}>
        <button
          className="flex flex-col items-start gap-0.5"
          onClick={() => setExpanded(v => !v)}
          aria-label="Toggle payment summary"
        >
          <span className="text-[12px] text-(--color-fg-tertiary) leading-none">Total</span>
          <div className="flex items-center gap-1">
            <span className="text-[20px] font-bold text-(--color-fg-primary) leading-tight">
              {currency}{total.toFixed(2)}
            </span>
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            >
              <path d="M4 6l4 4 4-4" stroke="var(--color-fg-tertiary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>

        <button
          onClick={() => onPayNow?.()}
          className="h-11 px-6 bg-(--color-fg-primary) rounded-xl text-[14px] font-semibold text-white hover:opacity-90 active:opacity-80 transition-opacity"
        >
          Pay now
        </button>
      </div>
    </div>
  )
}
