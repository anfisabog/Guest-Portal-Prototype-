import { useEffect } from 'react'
import { Tabs } from '@hostaway/design-system'

const STEPS = [
  {
    step: 1,
    text: 'Head to Rua das Flores 42. Look for the blue door on the left side of the building.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&h=300&q=80',
    imageAlt: 'Building entrance with blue door',
  },
  {
    step: 2,
    text: 'Take the elevator to floor 3. Turn left when you exit.',
    image: null,
  },
  {
    step: 3,
    text: 'Apartment 3B is the last door on the right. You\'ll see a keypad next to the handle.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&h=300&q=80',
    imageAlt: 'Door with keypad entry system',
  },
  {
    step: 4,
    text: 'Enter code 4821 on the keypad and wait for the green light before pushing the door.',
    image: null,
  },
]

export default function HowToGetInModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ maxWidth: 900, left: '50%', transform: 'translateX(-50%)', width: '100%' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative mt-auto bg-white rounded-t-3xl flex flex-col" style={{ maxHeight: '92vh' }}>

        {/* Handle + Header */}
        <div className="shrink-0 px-5 pt-4 pb-3">
          <div className="w-10 h-1 bg-(--color-border-secondary) rounded-full mx-auto mb-4" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-bold text-(--color-fg-primary) leading-tight">How to get in</h2>
              <p className="text-[15px] text-(--color-fg-tertiary) leading-snug mt-1">Rua das Flores 42 · Floor 3 · Apt 3B</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white border border-(--color-border-primary) rounded-lg flex items-center justify-center active:opacity-70 shrink-0"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="var(--color-fg-primary)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto scrollable flex-1 pb-10">

          {/* Property exterior photo */}
          <div className="mx-5 mb-5 rounded-2xl overflow-hidden aspect-video bg-(--color-bg-secondary)">
            <img
              src="https://images.unsplash.com/photo-1555636222-cae831e670b3?auto=format&fit=crop&w=800&h=450&q=80"
              alt="Property exterior — Rua das Flores 42"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Segmented tabs: Video | Step-by-step */}
          <div className="px-5">
            <Tabs defaultSelectedKey="video">
              <Tabs.List
                data-id="how-to-get-in-tabs"
                type="button-border"
                size="md"
                items={[
                  { id: 'video', label: 'Video' },
                  { id: 'steps', label: 'Step-by-step' },
                ]}
              />

              {/* Video tab */}
              <Tabs.Panel id="video" className="mt-4">
                <div className="rounded-2xl overflow-hidden aspect-video relative bg-black">
                  <img
                    src="https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=800&h=450&q=80"
                    alt="Video walkthrough thumbnail"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 bg-white/25 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 4.5l11 5.5-11 5.5V4.5z" fill="white"/>
                      </svg>
                    </div>
                    <span className="text-[13px] text-white/80 font-medium">Host video guide · 2:34</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none rounded-2xl" />
                </div>
                <p className="text-[14px] text-(--color-fg-tertiary) leading-[22px] mt-3">
                  Watch Sofia's full walkthrough — from the front door to finding your keys inside.
                </p>
              </Tabs.Panel>

              {/* Step-by-step tab */}
              <Tabs.Panel id="steps" className="mt-4">
                <div className="flex flex-col gap-5">
                  {STEPS.map(({ step, text, image, imageAlt }) => (
                    <div key={step} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-(--color-fg-primary) flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[12px] font-bold text-white">{step}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[16px] text-(--color-fg-secondary) leading-[26px]">{text}</p>
                        {image && (
                          <div className="mt-2 rounded-xl overflow-hidden h-[150px]">
                            <img src={image} alt={imageAlt} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Host note */}
                  <div className="bg-(--color-bg-secondary) rounded-2xl p-4">
                    <p className="text-[13px] font-semibold text-(--color-fg-primary) mb-1">Note from Sofia</p>
                    <p className="text-[16px] text-(--color-fg-secondary) leading-[26px]">
                      If you have any trouble with the keypad, ring the intercom (button 3B) and I'll buzz you in. Welcome! 😊
                    </p>
                  </div>
                </div>
              </Tabs.Panel>
            </Tabs>
          </div>

        </div>
      </div>
    </div>
  )
}
