import { SCREENS } from '../screens'
import MenuButton from '../components/MenuButton'

export default function PreLogin({ navigate }) {
  return (
    <div className="h-screen flex flex-col relative overflow-hidden" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg-full.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>

      <div className="relative z-10 flex flex-col flex-1">

        <div className="flex-1 flex flex-col px-4 pt-4 overflow-hidden">
          {/* Header row: weather left, menu right */}
          <div className="flex items-center justify-between mb-5">
            <div className="h-8 bg-(--color-bg-secondary) border border-(--color-border-secondary) rounded-full px-3 inline-flex items-center gap-1.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3.5" fill="var(--color-warning-600)" stroke="var(--color-warning-600)"/>
                <path d="M8 1V2M8 14V15M1 8H2M14 8H15M3.05 3.05L3.76 3.76M12.24 12.24L12.95 12.95M3.05 12.95L3.76 12.24M12.24 3.76L12.95 3.05" stroke="var(--color-warning-600)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[12px] font-bold text-(--color-fg-primary)">21°C</span>
              <span className="text-[14px] font-medium text-(--color-fg-primary) opacity-40">|</span>
              <span className="text-[12px] font-bold text-(--color-fg-primary)">Mostly sunny</span>
            </div>
            <MenuButton />
          </div>

          {/* CTA Card — centered, full 16px grid */}
          <div className="flex-1 flex items-center pb-6">
          <div className="w-full bg-white border border-(--color-border-secondary) rounded-2xl overflow-hidden">
            <div className="px-5 pt-8 pb-6">
              {/* Illustration */}
              <div className="flex justify-center mb-5">
                <img src={`${import.meta.env.BASE_URL}empty-state.svg`} alt="" className="w-[160px]" />
              </div>

              <h2 className="text-[22px] font-bold text-(--color-fg-primary) text-center mb-2 leading-[30px]">
                Find your reservation
              </h2>
              <p className="text-[14px] text-(--color-fg-tertiary) text-center mb-6">
                Enter your details to access your stay
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate(SCREENS.HOMEPAGE)}
                  className="w-full h-11 bg-(--color-fg-primary) rounded-lg flex items-center justify-center active:opacity-90"
                >
                  <span className="text-[15px] font-semibold text-white">Enter last name</span>
                </button>
                <button
                  onClick={() => navigate(SCREENS.HOMEPAGE)}
                  className="w-full h-11 bg-white border border-(--color-border-primary) rounded-lg flex items-center justify-center active:opacity-80"
                >
                  <span className="text-[15px] font-semibold text-(--color-fg-secondary)">Enter email</span>
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
