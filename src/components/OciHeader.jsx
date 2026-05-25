import { ProgressBar } from '@hostaway/design-system'

export default function OciHeader({ title, subtitle = 'Brisa Deluxe Studio', progress, navigate, onExit, backTo, onBack, hideBack = false }) {
  const handleBack = () => {
    if (onBack) onBack()
    else if (navigate && backTo) navigate(backTo)
  }

  return (
    <div className="shrink-0 h-[180px] relative overflow-hidden" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}bg-header.png)`, backgroundSize: 'cover', backgroundPosition: 'center top' }}>
      <div className="relative z-10 px-4 pt-4">
        {/* Nav row */}
        <div className="flex items-center justify-between">
          {hideBack ? (
            <div className="w-10 h-10" />
          ) : (
            <button
              onClick={handleBack}
              className="w-10 h-10 bg-white border border-(--color-border-primary) rounded-lg flex items-center justify-center"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M7 1L1 7L7 13" stroke="var(--color-fg-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          <div className="flex items-center gap-2 w-[150px]">
            <ProgressBar value={progress} className="w-full" />
          </div>

          <button
            onClick={onExit}
            className="w-10 h-10 bg-white border border-(--color-border-primary) rounded-lg flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="var(--color-fg-primary)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Title block */}
        <div className="mt-4">
          <p className="text-[15px] font-normal text-(--color-fg-tertiary) leading-6">{subtitle}</p>
          <h1 className="text-[24px] font-semibold text-(--color-fg-primary) leading-8 mt-0.5">{title}</h1>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-5 bg-white rounded-t-3xl" />
    </div>
  )
}
