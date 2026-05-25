const TABS = {
  unlock: ['Building', 'Parking', 'Door', 'WiFi'],
  arrival: ['Overview', 'Building', 'Parking', 'Transport'],
}

export default function GuidesHeader({ title, subtitle, onShare, onClose, variant = 'arrival', activeTab = 0, onTabChange }) {
  const tabs = TABS[variant] || TABS.arrival

  return (
    <div className="shrink-0">
      {/* Orange section */}
      <div className="h-[161px] bg-[#fd6301] relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white opacity-[0.06]"/>
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white opacity-[0.06]"/>

        <div className="relative z-10 px-4 pt-4">
          {/* Nav row */}
          <div className="flex items-center justify-between h-12">
            <button
              onClick={onShare}
              className="w-12 h-12 bg-white border border-(--color-border-primary) rounded-lg flex items-center justify-center shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11 2a2 2 0 100 4 2 2 0 000-4zM5 6a2 2 0 100 4 2 2 0 000-4zM11 10a2 2 0 100 4 2 2 0 000-4z" stroke="var(--color-fg-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 7.5L9 6.5M7 8.5L9 9.5" stroke="var(--color-fg-primary)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            <button
              onClick={onClose}
              className="w-12 h-12 bg-white border border-(--color-border-primary) rounded-lg flex items-center justify-center shadow-sm"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1L11 11M11 1L1 11" stroke="var(--color-fg-primary)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Title */}
          <div className="mt-4">
            <p className="text-[16px] font-normal text-(--color-fg-secondary) leading-6">{subtitle}</p>
            <h1 className="text-[24px] font-bold text-(--color-fg-primary) leading-8 mt-0.5">{title}</h1>
          </div>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="h-[68px] bg-(--color-bg-warm) flex items-center px-4">
        <div className="flex gap-2 overflow-x-auto scrollable">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => onTabChange && onTabChange(i)}
              className={`shrink-0 h-11 px-5 rounded-lg text-[14px] font-medium transition-colors ${
                activeTab === i
                  ? 'bg-(--color-fg-primary) text-white'
                  : 'bg-white text-(--color-fg-secondary) border border-(--color-border-secondary)'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
