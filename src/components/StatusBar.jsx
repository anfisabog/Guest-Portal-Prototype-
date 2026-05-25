export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 bg-white h-11">
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
        <div className="flex items-center gap-0.5">
          <div className="w-6 h-3 border border-black rounded-sm relative">
            <div className="absolute inset-0.5 right-1 bg-black rounded-sm"/>
          </div>
        </div>
      </div>
    </div>
  )
}
