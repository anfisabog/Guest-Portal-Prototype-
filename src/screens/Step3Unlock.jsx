import { useState } from 'react'
import { SCREENS } from '../screens'
import GuidesHeader from '../components/GuidesHeader'

const accordions = [
  {
    title: 'Building entrance',
    content: (
      <div className="space-y-3">
        <div className="w-full h-36 bg-(--color-bg-warm) rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-(--color-border-secondary) rounded-xl mx-auto mb-2 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="var(--color-gray-500)" strokeWidth="1.5"/>
                <path d="M9 9h6M9 12h6M9 15h4" stroke="var(--color-gray-500)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-[13px] text-(--color-gray-500)">Building photo</p>
          </div>
        </div>
        <p className="text-[14px] text-(--color-fg-secondary) leading-6">
          Rua das Flores 42, Lisbon 1200-192. The building has a blue door with a brass number plate. Press intercom button #4 and wait for the buzz to open the main entrance.
        </p>
      </div>
    ),
  },
  {
    title: 'Parking',
    content: (
      <p className="text-[14px] text-(--color-fg-secondary) leading-6">
        Nearest parking: Parque de Estacionamento do Chiado (3 min walk). Street parking available on Rua do Século Mon–Fri after 8PM, all day Sat–Sun.
      </p>
    ),
  },
  {
    title: 'Door access',
    content: (
      <div className="space-y-3">
        <p className="text-[14px] text-(--color-fg-secondary) leading-6 mb-3">Your door code is ready. Take elevator to floor 3, turn left. Apartment 3B is the last door on the right.</p>
        <div className="bg-(--color-fg-primary) rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-medium text-white/50 mb-1">Door code</p>
            <p className="text-[32px] font-bold text-white tracking-[0.15em]">4721</p>
            <p className="text-[12px] text-white/40 mt-1">Valid May 15 3PM – May 20 11AM</p>
          </div>
          <button className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
              <rect x="5" y="1" width="11" height="13" rx="2" stroke="white" strokeWidth="1.5"/>
              <rect x="2" y="6" width="11" height="13" rx="2" fill="var(--color-fg-primary)" stroke="white" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>
      </div>
    ),
  },
  {
    title: 'WiFi',
    content: (
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-(--color-bg-secondary) rounded-xl p-4 border border-(--color-border-secondary)">
          <div>
            <p className="text-[13px] text-(--color-gray-500) mb-0.5">Network</p>
            <p className="text-[16px] font-semibold text-(--color-fg-primary)">Brisa_Guest</p>
          </div>
          <div className="w-px h-8 bg-(--color-border-secondary)"/>
          <div>
            <p className="text-[13px] text-(--color-gray-500) mb-0.5">Password</p>
            <p className="text-[16px] font-semibold text-(--color-fg-primary)">welcome2024</p>
          </div>
          <button className="w-8 h-8 bg-(--color-fg-primary) rounded-lg flex items-center justify-center">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <rect x="4" y="1" width="10" height="11" rx="1.5" stroke="white" strokeWidth="1.3"/>
              <rect x="2" y="6" width="10" height="11" rx="1.5" fill="var(--color-fg-primary)" stroke="white" strokeWidth="1.3"/>
            </svg>
          </button>
        </div>
      </div>
    ),
  },
]

export default function Step3Unlock({ navigate, onExit }) {
  const [activeTab, setActiveTab] = useState(0)
  const [expanded, setExpanded] = useState(0)

  return (
    <div className="min-h-screen flex flex-col bg-(--color-bg-warm)">
      <GuidesHeader
        title="Get inside"
        subtitle="Brisa Deluxe Studio"
        variant="unlock"
        onShare={() => {}}
        onClose={onExit}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-y-auto scrollable bg-(--color-bg-warm)">
        <div className="px-4 py-4 pb-[68px] flex flex-col gap-2">
          {accordions.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden">
              <button
                className="w-full flex items-center gap-3 px-5 h-[68px] text-left"
                onClick={() => setExpanded(expanded === i ? null : i)}
              >
                <span className="flex-1 text-[16px] font-bold text-(--color-fg-primary)">{item.title}</span>
                <svg
                  width="24" height="24" viewBox="0 0 24 24" fill="none"
                  className={`shrink-0 transition-transform duration-200 ${expanded === i ? 'rotate-180' : ''}`}
                >
                  <path d="M6 9L12 15L18 9" stroke="var(--color-gray-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {expanded === i && (
                <div className="px-5 pb-5 border-t border-(--color-border-secondary)">
                  <div className="pt-4">{item.content}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
