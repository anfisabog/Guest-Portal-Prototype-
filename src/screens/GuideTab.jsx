
const sections = [
  {
    title: 'Local Recommendations',
    icon: 'MapPin',
    stubs: [
      { title: 'Best coffee in Chiado', desc: 'A Brasileira — iconic café, 3 min walk' },
      { title: 'Sunday market', desc: 'Feira da Ladra flea market — 15 min by tram' },
    ],
  },
  {
    title: 'Appliance Guides',
    icon: 'Wrench',
    stubs: [
      { title: 'Using the espresso machine', desc: 'Step-by-step guide for the Nespresso' },
      { title: 'Washer & dryer', desc: 'Cycle settings and quick-start instructions' },
    ],
  },
  {
    title: 'House Rules',
    icon: 'FileText',
    stubs: [
      { title: 'Quiet hours', desc: 'Please keep noise down from 10PM to 8AM' },
      { title: 'Recycling guide', desc: 'Sorting bins explained — yellow, green, blue' },
    ],
  },
  {
    title: 'Troubleshooting',
    icon: 'AlertCircle',
    stubs: [
      { title: 'WiFi not connecting?', desc: 'Quick fixes for common connection issues' },
      { title: 'Heating & AC', desc: 'How to adjust the thermostat and aircon remote' },
    ],
  },
]

export default function GuideTab() {
  return (
    <div className="min-h-screen flex flex-col bg-(--color-bg-warm)">

      {/* Header */}
      <div
        className="shrink-0 px-4 pt-4 pb-6 relative overflow-hidden"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg-header.png)`, backgroundSize: 'cover', backgroundPosition: 'center top' }}
      >
        <p className="text-[15px] font-normal text-(--color-fg-secondary)">Brisa Deluxe Studio</p>
        <h1 className="text-[24px] font-semibold text-(--color-fg-primary) leading-8 mt-0.5">Guidebooks</h1>
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-(--color-bg-warm) rounded-t-3xl"/>
      </div>

      <div className="flex-1 overflow-y-auto scrollable pb-[68px]">
        <div className="px-4 pt-3 flex flex-col gap-4">

          {/* Coming soon banner */}
          <div className="bg-(--color-warning-100) border border-(--color-warning-200) rounded-2xl px-4 py-3 flex items-start gap-3">
            <span className="text-[18px]">✨</span>
            <p className="text-[13px] text-(--color-warning-800) leading-5">
              <span className="font-semibold">Coming soon</span> — Your host will add local tips and guides here.
            </p>
          </div>

          {sections.map(({ title, icon, stubs }) => (
            <div key={title}>
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-5 h-5 bg-(--color-fg-tertiary) rounded-sm"/>
                <p className="text-[15px] font-bold text-(--color-fg-primary)">{title}</p>
              </div>
              <div className="flex flex-col gap-2">
                {stubs.map(({ title: stubTitle, desc }) => (
                  <div key={stubTitle} className="bg-white rounded-2xl p-4 flex items-center gap-3">
                    {/* Image placeholder */}
                    <div className="w-14 h-14 bg-(--color-bg-warm) rounded-xl shrink-0 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="2" y="4" width="16" height="12" rx="2" stroke="#c2c5cc" strokeWidth="1.4"/>
                        <circle cx="7" cy="9" r="1.5" stroke="#c2c5cc" strokeWidth="1.2"/>
                        <path d="M2 14l3.5-3 3 2.5 3-3 4 4" stroke="#c2c5cc" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-(--color-fg-primary) leading-5">{stubTitle}</p>
                      <p className="text-[13px] text-(--color-gray-500) mt-0.5">{desc}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3l5 5-5 5" stroke="#c2c5cc" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
