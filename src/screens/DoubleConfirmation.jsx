import { useState, useRef } from 'react'

export default function DoubleConfirmation({ onConfirm, onCancel }) {
  const [dragY, setDragY] = useState(0)
  const [snapping, setSnapping] = useState(false)
  const startYRef = useRef(null)

  const handleTouchStart = (e) => {
    setSnapping(false)
    startYRef.current = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    const delta = Math.max(0, e.touches[0].clientY - startYRef.current)
    setDragY(delta)
  }

  const handleTouchEnd = () => {
    if (dragY > 100) {
      onCancel()
    } else {
      setSnapping(true)
      setDragY(0)
    }
  }

  // Also support mouse drag for desktop preview
  const handleMouseDown = (e) => {
    setSnapping(false)
    startYRef.current = e.clientY
    const onMove = (ev) => {
      const delta = Math.max(0, ev.clientY - startYRef.current)
      setDragY(delta)
    }
    const onUp = (ev) => {
      const delta = Math.max(0, ev.clientY - startYRef.current)
      if (delta > 100) {
        onCancel()
      } else {
        setSnapping(true)
        setDragY(0)
      }
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const overlayOpacity = Math.max(0, 0.8 * (1 - dragY / 250))

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: `rgba(10,12,18,${overlayOpacity})` }}
    >
      {/* Tap backdrop to cancel */}
      <div className="absolute inset-0" onClick={() => dragY === 0 && onCancel()} />

      {/* Bottom sheet */}
      <div
        className="relative z-10 bg-white rounded-t-3xl select-none"
        style={{
          minHeight: 307,
          transform: `translateY(${dragY}px)`,
          transition: snapping ? 'transform 250ms ease-out' : 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 bg-(--color-border-primary) rounded-full" />
        </div>

        {/* Content */}
        <div className="px-5 pt-3 pb-6">
          <h3 className="text-[20px] font-bold text-(--color-fg-primary) leading-[30px] mb-2">
            Finish checking in later?
          </h3>
          <p className="text-[16px] text-(--color-fg-secondary) leading-6 mb-5">
            Don't worry, your progress will be saved.
          </p>

          <div className="h-px bg-(--color-border-primary) mb-5" />

          <div className="flex flex-col gap-3">
            <button
              onClick={onCancel}
              className="w-full h-12 bg-(--color-fg-primary) rounded-lg flex items-center justify-center active:opacity-90 transition-opacity"
            >
              <span className="text-[16px] font-semibold text-white">Keep checking in</span>
            </button>
            <button
              onClick={onConfirm}
              className="w-full h-12 bg-white border border-(--color-border-secondary) rounded-lg flex items-center justify-center active:opacity-90 transition-opacity"
            >
              <span className="text-[16px] font-medium text-(--color-fg-secondary)">Save and exit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
