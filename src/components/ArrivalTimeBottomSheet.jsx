import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import InfoBanner from './InfoBanner'

// 1h increments, 12:00 PM → 12:00 AM (midnight)
// Slots before standard check-in (15:00) are early check-in with extra charge
const STANDARD_HOUR = 15 // 3:00 PM

const SLOTS = [
  { hour: 12, label: '12:00 PM', display: '12:00 PM — noon' },
  { hour: 13, label: '1:00 PM',  display: '1:00 PM' },
  { hour: 14, label: '2:00 PM',  display: '2:00 PM' },
  { hour: 15, label: '3:00 PM',  display: '3:00 PM' },
  { hour: 16, label: '4:00 PM',  display: '4:00 PM' },
  { hour: 17, label: '5:00 PM',  display: '5:00 PM' },
  { hour: 18, label: '6:00 PM',  display: '6:00 PM' },
  { hour: 19, label: '7:00 PM',  display: '7:00 PM' },
  { hour: 20, label: '8:00 PM',  display: '8:00 PM' },
  { hour: 21, label: '9:00 PM',  display: '9:00 PM' },
  { hour: 22, label: '10:00 PM', display: '10:00 PM' },
  { hour: 23, label: '11:00 PM', display: '11:00 PM' },
  { hour: 24, label: '12:00 AM', display: '12:00 AM — midnight' },
]

export default function ArrivalTimeBottomSheet({ value, onChange, onClose, onSelectEarlySlot }) {
  const [visible, setVisible] = useState(false)
  const [portalTarget, setPortalTarget] = useState(null)

  useEffect(() => {
    setPortalTarget(document.getElementById('phone-shell-portal'))
  }, [])

  useEffect(() => {
    if (!portalTarget) return
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [portalTarget])

  const sheet = (
    <div
      style={{
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        background: visible ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
        transition: 'background 300ms ease-out',
      }}
    >
      {/* tap-to-close area */}
      <div style={{ height: 118, flexShrink: 0 }} onClick={onClose} />

      {/* White drawer */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 300ms ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-[16px] font-bold text-(--color-fg-primary)">Arrival time</span>
          <button onClick={onClose} className="w-9 h-9 bg-(--color-bg-warm) rounded-lg flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="var(--color-fg-primary)" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Early check-in note */}
        <div className="px-5 pb-3 shrink-0">
          <InfoBanner
            icon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="var(--color-fg-tertiary)" strokeWidth="1.3"/>
                <path d="M8 5v3.5M8 11h.01" stroke="var(--color-fg-tertiary)" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            }
            description={<>Standard check-in from <strong className="text-(--color-fg-secondary) font-semibold">3:00 PM</strong>. Early check-in comes with an extra fee.</>}
          />
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {SLOTS.map(({ hour, label, display }) => {
            const isEarly = hour < STANDARD_HOUR
            const isSelected = value === label

            return (
              <button
                key={hour}
                onClick={() => { onChange(label); onSelectEarlySlot?.(hour < STANDARD_HOUR); onClose() }}
                className={`w-full flex items-center justify-between px-5 h-[56px] transition-colors ${
                  isSelected ? 'bg-(--color-bg-success-secondary)' : 'hover:bg-(--color-bg-secondary)'
                }`}
              >
                <span className={`text-[15px] font-medium ${
                  isSelected ? 'text-(--color-fg-primary) font-semibold' : 'text-(--color-fg-secondary)'
                }`}>
                  {display}
                </span>

                <div className="flex items-center gap-2">
                  {isEarly && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-(--color-bg-warning-secondary) text-(--color-fg-warning)">
                      Extra charge
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  if (!portalTarget) return null
  return createPortal(sheet, portalTarget)
}
