
export default function ExploreTab() {
  return (
    <div className="min-h-screen flex flex-col bg-(--color-bg-warm)">

      {/* Header */}
      <div
        className="shrink-0 px-4 pt-4 pb-6 relative overflow-hidden"
        style={{ backgroundImage: 'url(/bg-header.png)', backgroundSize: 'cover', backgroundPosition: 'center top' }}
      >
        <p className="text-[15px] font-normal text-(--color-fg-secondary)">Brisa Deluxe Studio</p>
        <h1 className="text-[24px] font-semibold text-(--color-fg-primary) leading-8 mt-0.5">Explore</h1>
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-(--color-bg-warm) rounded-t-3xl"/>
      </div>

      <div className="flex-1 overflow-y-auto scrollable pb-[68px] flex flex-col items-center justify-center px-8">
        <div className="w-16 h-16 bg-(--color-border-secondary) rounded-2xl flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="11" height="11" rx="2" stroke="#a3a7ae" strokeWidth="1.8"/>
            <rect x="15" y="2" width="11" height="11" rx="2" stroke="#a3a7ae" strokeWidth="1.8"/>
            <rect x="2" y="15" width="11" height="11" rx="2" stroke="#a3a7ae" strokeWidth="1.8"/>
            <rect x="15" y="15" width="11" height="11" rx="2" stroke="#a3a7ae" strokeWidth="1.8"/>
          </svg>
        </div>
        <p className="text-[18px] font-bold text-(--color-fg-primary) mb-2 text-center">Explore coming soon</p>
        <p className="text-[14px] text-(--color-gray-500) text-center leading-6">More ways to discover your stay will appear here.</p>
      </div>
    </div>
  )
}
