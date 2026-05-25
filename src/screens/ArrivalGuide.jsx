import { useState } from 'react'
import { SCREENS } from '../screens'
import GuidesHeader from '../components/GuidesHeader'

const sections = [
  {
    title: 'Getting here',
    content: (
      <div className="space-y-3">
        {/* Map placeholder */}
        <div className="w-full h-36 bg-(--color-border-secondary) rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, var(--color-border-primary) 0, var(--color-border-primary) 1px, transparent 0, transparent 50%), repeating-linear-gradient(90deg, var(--color-border-primary) 0, var(--color-border-primary) 1px, transparent 0, transparent 50%)',
            backgroundSize: '24px 24px'
          }}/>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-10 h-10 bg-(--color-warning-600) rounded-full flex items-center justify-center shadow-lg">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                <path d="M9 0C5.69 0 3 2.69 3 6C3 10.5 9 19 9 19C9 19 15 10.5 15 6C15 2.69 12.31 0 9 0ZM9 8.5C7.62 8.5 6.5 7.38 6.5 6C6.5 4.62 7.62 3.5 9 3.5C10.38 3.5 11.5 4.62 11.5 6C11.5 7.38 10.38 8.5 9 8.5Z" fill="white"/>
              </svg>
            </div>
            <div className="mt-1.5 bg-white rounded-full px-2.5 py-0.5 shadow-sm">
              <span className="text-[12px] font-semibold text-(--color-fg-primary)">Brisa Deluxe Studio</span>
            </div>
          </div>
        </div>
        <p className="text-[14px] text-(--color-fg-secondary) leading-6">
          Rua das Flores 42, Lisbon 1200-192. 10 min walk from Baixa-Chiado metro station. Look for the blue door with brass number plate.
        </p>
        <div className="flex gap-2">
          <button className="flex-1 h-10 bg-(--color-bg-warm) rounded-lg flex items-center justify-center gap-2">
            <span className="text-[13px] font-medium text-(--color-fg-primary)">Maps</span>
          </button>
          <button className="flex-1 h-10 bg-(--color-bg-warm) rounded-lg flex items-center justify-center gap-2">
            <span className="text-[13px] font-medium text-(--color-fg-primary)">Directions</span>
          </button>
        </div>
      </div>
    ),
  },
  {
    title: 'From the airport',
    content: (
      <div className="space-y-3">
        {[
          { mode: '🚇', label: 'Metro', detail: 'Red Line → Alameda, transfer Green Line → Baixa-Chiado. 30 min · €1.65' },
          { mode: '🚌', label: 'Aerobus', detail: 'Line 1 or 2 → Praça do Comércio. 45 min · €4.00' },
          { mode: '🚕', label: 'Taxi / Uber', detail: 'Direct to door. ~20 min · €15–20' },
        ].map(({ mode, label, detail }) => (
          <div key={label} className="flex items-start gap-3 p-3 bg-(--color-bg-secondary) rounded-xl border border-(--color-border-secondary)">
            <span className="text-xl">{mode}</span>
            <div>
              <p className="text-[14px] font-semibold text-(--color-fg-primary)">{label}</p>
              <p className="text-[13px] text-(--color-fg-tertiary) mt-0.5">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Parking',
    content: (
      <p className="text-[14px] text-(--color-fg-secondary) leading-6">
        Parque de Estacionamento do Chiado (3 min walk). Street parking on Rua do Século: free Mon–Fri after 8PM, all day Sat–Sun.
      </p>
    ),
  },
  {
    title: 'Public transport',
    content: (
      <p className="text-[14px] text-(--color-fg-secondary) leading-6">
        Nearest metro: Baixa-Chiado (Green + Blue lines), 10 min walk. Tram 28 stops at Chiado (2 min walk). Bus 758 stops on Rua das Flores.
      </p>
    ),
  },
]

export default function ArrivalGuide({ navigate }) {
  const [activeTab, setActiveTab] = useState(0)
  const [expanded, setExpanded] = useState(0)

  return (
    <div className="min-h-screen flex flex-col bg-(--color-bg-warm)">
      <GuidesHeader
        title="Arrival guide"
        subtitle="Lisbon, Portugal"
        variant="arrival"
        onShare={() => {}}
        onClose={() => navigate(SCREENS.HOMEPAGE)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex-1 overflow-y-auto scrollable bg-(--color-bg-warm)">
        <div className="px-4 py-4 flex flex-col gap-2">
          {sections.map((item, i) => (
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
