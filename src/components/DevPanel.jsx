function Toggle({ label, desc, value, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-(--color-bg-warm) last:border-0">
      <div className="flex-1">
        <p className="text-[14px] font-semibold text-(--color-fg-primary)">{label}</p>
        {desc && <p className="text-[12px] text-(--color-gray-500) mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5 relative ${value ? 'bg-(--color-hostaway-secondary-600)' : 'bg-(--color-border-primary)'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? 'left-5' : 'left-0.5'}`}/>
      </button>
    </div>
  )
}

export default function DevPanel({ demoMode, setDemoMode, guidebooksEnabled, setGuidebooksEnabled, tabBarVariant, setTabBarVariant, checkInComplete, setCheckInComplete, onClose }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-8 z-10">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-[16px] font-bold text-(--color-fg-primary)">Dev / Demo panel</p>
            <p className="text-[12px] text-[#a3a7ae]">Hidden from guest flow · Triple-tap logo to open</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-(--color-bg-warm) rounded-full flex items-center justify-center"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1L9 9M9 1L1 9" stroke="var(--color-gray-500)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="h-px bg-(--color-border-secondary) my-4"/>

        <Toggle
          label="Check-in complete"
          desc="ON = post check-in state · OFF = pre check-in (locked access)"
          value={checkInComplete}
          onChange={setCheckInComplete}
        />
        <Toggle
          label="Demo mode (populated)"
          desc="ON = full content · OFF = empty/minimal PM setup"
          value={demoMode}
          onChange={setDemoMode}
        />
        <Toggle
          label="Enable Guidebooks module"
          desc="ON = active Guide tab · OFF = greyed with lock"
          value={guidebooksEnabled}
          onChange={setGuidebooksEnabled}
        />
        <Toggle
          label="Tab bar — pill style (V2)"
          desc="ON = pill indicator · OFF = top-line indicator (V1)"
          value={tabBarVariant === 'v2'}
          onChange={(v) => setTabBarVariant(v ? 'v2' : 'v1')}
        />
      </div>
    </div>
  )
}
