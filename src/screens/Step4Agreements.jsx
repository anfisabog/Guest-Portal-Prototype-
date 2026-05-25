import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { SCREENS } from '../screens'
import OciStepLayout from '../components/OciStepLayout'
import { Checkbox } from '@hostaway/design-system'

const RENTAL_TEXT = `RENTAL AGREEMENT

This Short-Term Rental Agreement ("Agreement") is entered into between the property owner ("Host") and the guest ("Guest") for the rental of the property described herein.

1. PROPERTY
The Host agrees to rent the property located at Rua das Flores 42, Apartment 3B, Lisbon, Portugal ("Property") to the Guest for the duration specified at the time of booking.

2. TERM
The rental period begins at check-in time on the arrival date and ends at check-out time on the departure date as confirmed in the booking.

3. RENTAL RATE
Guest agrees to pay the rental rate as quoted at the time of booking, including all applicable fees and taxes.

4. OCCUPANCY
The Property shall be occupied only by the registered Guests. No additional guests are permitted without prior written consent from the Host.

5. HOUSE RULES
Guest agrees to abide by all house rules provided separately. Violation of house rules may result in immediate termination of the rental agreement without refund.

6. DAMAGE AND LIABILITY
Guest accepts full responsibility for any damage caused to the Property or its contents during the rental period. Guest agrees to report any damage immediately to the Host.

7. CHECK-IN / CHECK-OUT
Guest agrees to vacate the Property by the agreed check-out time. Late check-out without prior approval may incur additional charges.

8. CANCELLATION
Cancellation terms apply as stated in the booking confirmation. The Host reserves the right to cancel the booking in exceptional circumstances.

9. GOVERNING LAW
This Agreement shall be governed by the laws of Portugal.

By accepting this agreement, Guest confirms they have read, understood, and agree to all terms stated above.`

const HOUSE_RULES_TEXT = `PROPERTY HOUSE RULES

Please read the following rules carefully. By checking in, you agree to comply with all house rules.

QUIET HOURS
Quiet hours are strictly observed between 10:00 PM and 8:00 AM. Please keep noise to a minimum and be considerate of neighbours.

NO SMOKING
Smoking is strictly prohibited inside the property, including balconies. A cleaning fee of €150 will be charged for violations.

NO PARTIES OR EVENTS
The property may not be used for parties, events, or gatherings beyond the registered number of guests.

MAXIMUM OCCUPANCY
Only registered guests are permitted to stay overnight. Visitors must leave by 10:00 PM.

PETS
No pets are allowed on the property unless explicitly agreed in writing before arrival.

WASTE & RECYCLING
Please sort waste according to local guidelines: yellow bin for packaging, green bin for glass, blue bin for paper. General waste goes in the grey bin.

CHECK-OUT
Please leave the property in a clean and tidy condition. Wash and put away dishes. Remove all food from the refrigerator. Lock all windows and doors.

DAMAGE
Please report any damage or breakage immediately. Guests are responsible for any damage caused during their stay.

KEYS
Do not duplicate keys. A fee of €50 will be charged for lost keys.

Thank you for your cooperation and we hope you enjoy your stay!`

function DocModal({ title, content, onClose }) {
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

  const modal = (
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
      <div style={{ height: 24, flexShrink: 0 }} onClick={onClose} />
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
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-[16px] font-bold text-(--color-fg-primary)">{title}</span>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-(--color-bg-warm) rounded-lg flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="var(--color-fg-primary)" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }} className="px-5 pb-8">
          {content.split('\n\n').map((para, i) => (
            <p key={i} className={`text-[14px] leading-6 text-(--color-fg-secondary) mb-4 ${para === para.toUpperCase() && para.length < 60 ? 'font-bold text-(--color-fg-primary)' : ''}`}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  )

  if (!portalTarget) return null
  return createPortal(modal, portalTarget)
}

export default function Step4Agreements({ navigate, onExit, progress = 75 }) {
  const [checkedTnC, setCheckedTnC] = useState(true)
  const [checkedRules, setCheckedRules] = useState(true)
  const [checkedMarketing, setCheckedMarketing] = useState(false)
  const [signed, setSigned] = useState(false)
  const [modal, setModal] = useState(null)
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect()
    const src = e.touches ? e.touches[0] : e
    return [src.clientX - rect.left, src.clientY - rect.top]
  }

  const startDraw = (e) => {
    e.preventDefault()
    drawingRef.current = true
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const [x, y] = getPos(e, canvas)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!drawingRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineWidth = 2
    ctx.strokeStyle = 'var(--color-fg-primary)'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const [x, y] = getPos(e, canvas)
    ctx.lineTo(x, y)
    ctx.stroke()
    setSigned(true)
  }

  const stopDraw = () => { drawingRef.current = false }

  const clearSignature = () => {
    const canvas = canvasRef.current
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    setSigned(false)
  }

  const overlay = (
    <>
      {modal === 'rental' && <DocModal title="Rental Agreement" content={RENTAL_TEXT} onClose={() => setModal(null)} />}
      {modal === 'rules' && <DocModal title="Property House Rules" content={HOUSE_RULES_TEXT} onClose={() => setModal(null)} />}
    </>
  )

  return (
    <OciStepLayout
      title="Rental agreements"
      progress={progress}
      navigate={navigate}
      onExit={onExit}
      backTo={SCREENS.STEP2}
      onContinue={() => navigate(SCREENS.STEP5)}
      continueLabel="Continue"
      overlay={overlay}
      noScroll
    >
        {/* flex-1 fills card content area (612px card - 88px pb = 524px) */}
        <div className="px-5 pt-4 flex-1 flex flex-col overflow-hidden">

          {/* Checkboxes */}
          <div className="flex flex-col gap-3 mb-4 shrink-0">
            <Checkbox
              data-id="agree-rental"
              isSelected={checkedTnC}
              onChange={setCheckedTnC}
              label={<span>I agree with <button onClick={() => setModal('rental')} className="font-semibold underline">Rental Agreement</button></span>}
            />
            <Checkbox
              data-id="agree-rules"
              isSelected={checkedRules}
              onChange={setCheckedRules}
              label={<span>I agree with <button onClick={() => setModal('rules')} className="font-semibold underline">Property House Rules</button></span>}
            />
            <Checkbox
              data-id="agree-marketing"
              isSelected={checkedMarketing}
              onChange={setCheckedMarketing}
              label="I consent to receive marketing communications and special offers"
            />
          </div>

          {/* Signature label */}
          <div className="flex items-center gap-1 mb-2 shrink-0">
            <span className="text-[14px] font-medium text-(--color-fg-secondary)">Sign within the box</span>
            <span className="text-(--color-hostaway-secondary-600)">*</span>
          </div>

          {/* Signature box — fills remaining space; no min-h needed, flex-1 handles it */}
          <div className="flex-1 relative border border-(--color-border-primary) rounded-xl overflow-hidden bg-white">
            {signed && (
              <button
                onClick={clearSignature}
                className="absolute top-3 right-3 z-10 w-9 h-9 bg-white border border-(--color-border-secondary) rounded-lg flex items-center justify-center"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h12M5 4V3a1 1 0 011-1h4a1 1 0 011 1v1M6 7v5M10 7v5M3 4l1 9a1 1 0 001 1h6a1 1 0 001-1l1-9" stroke="var(--color-fg-tertiary)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            <canvas
              ref={canvasRef}
              width={370}
              height={400}
              className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
            {!signed && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-[14px] text-(--color-gray-400)">Sign here</p>
              </div>
            )}
          </div>

        </div>
      </OciStepLayout>
  )
}
