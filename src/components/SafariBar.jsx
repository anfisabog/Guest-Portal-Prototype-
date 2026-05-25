export default function SafariBar() {
  return (
    <div className="shrink-0 bg-white">
      {/* Status bar 38px */}
      <div className="h-[38px] flex items-center justify-between px-6">
        <span className="text-[15px] font-semibold text-black">9:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="3" width="3" height="9" rx="1" fill="black"/>
            <rect x="4.5" y="2" width="3" height="10" rx="1" fill="black"/>
            <rect x="9" y="0" width="3" height="12" rx="1" fill="black"/>
            <rect x="13.5" y="0" width="3" height="12" rx="1" fill="black" fillOpacity="0.3"/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 2.4C10.4 2.4 12.5 3.4 14 5L15.5 3.5C13.6 1.3 10.9 0 8 0C5.1 0 2.4 1.3 0.5 3.5L2 5C3.5 3.4 5.6 2.4 8 2.4Z" fill="black"/>
            <path d="M8 5.6C9.6 5.6 11 6.2 12.1 7.2L13.6 5.7C12.1 4.3 10.1 3.5 8 3.5C5.9 3.5 3.9 4.3 2.4 5.7L3.9 7.2C5 6.2 6.4 5.6 8 5.6Z" fill="black"/>
            <circle cx="8" cy="10" r="1.5" fill="black"/>
          </svg>
          <div className="w-[25px] h-[12px] border border-black rounded-[3px] relative flex items-center">
            <div className="absolute left-[2px] top-[2px] bottom-[2px] right-[6px] bg-black rounded-[1.5px]"/>
            <div className="absolute -right-[3px] w-[2.5px] h-[5px] bg-black rounded-r-sm opacity-40"/>
          </div>
        </div>
      </div>
      {/* Safari address bar 56px */}
      <div className="h-[56px] flex items-center justify-center">
        <div className="w-[383px] h-[34px] bg-[#e7e7e7] rounded-[10px] flex items-center px-3 gap-2">
          <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
            <path d="M5 0C3.35 0 2 1.35 2 3V5H1C0.45 5 0 5.45 0 6V12C0 12.55 0.45 13 1 13H9C9.55 13 10 12.55 10 12V6C10 5.45 9.55 5 9 5H8V3C8 1.35 6.65 0 5 0ZM5 1.5C5.83 1.5 6.5 2.17 6.5 3V5H3.5V3C3.5 2.17 4.17 1.5 5 1.5Z" fill="#2a2a2a"/>
          </svg>
          <span className="flex-1 text-center text-[#2a2a2a] text-[16px] font-normal tracking-[-0.2px]">guest-portal.hostaway.com</span>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 10V1M7.5 1L4 4.5M7.5 1L11 4.5" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 10V13C1 13.55 1.45 14 2 14H13C13.55 14 14 13.55 14 13V10" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
