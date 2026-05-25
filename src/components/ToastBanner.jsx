import { useEffect, useState } from 'react'

export default function ToastBanner({ message, visible, onHide }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (!visible) { setFading(false); return }
    setFading(false)
    const hide = setTimeout(() => setFading(true), 2200)   // start fade-out at 2.2s
    const done = setTimeout(() => onHide?.(), 2700)        // unmount at 2.7s
    return () => { clearTimeout(hide); clearTimeout(done) }
  }, [visible, message])

  if (!visible) return null

  return (
    <div
      className="fixed z-[400] pointer-events-none"
      style={{
        bottom: 116,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: 868, // 900 - 32px
        transition: 'opacity 0.45s ease',
        opacity: fading ? 0 : 1,
      }}
    >
      <div className="bg-(--color-fg-primary) rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-lg">
        <div className="w-6 h-6 rounded-full bg-(--color-hostaway-secondary-600) flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l2.5 2.5L10 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-[14px] font-medium text-white leading-snug">{message}</p>
      </div>
    </div>
  )
}
