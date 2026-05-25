import { SCREENS } from '../screens'
import CTABar from './CTABar'
import { ProgressBar } from '@hostaway/design-system'

/**
 * Scroll architecture (single scroll container, CSS sticky for the 8px cap):
 *
 * Root div: h-screen relative — NO overflow-hidden.
 *   Removing overflow-hidden here is what makes `position: sticky` work.
 *   sticky only breaks when an overflow:hidden ancestor sits between the sticky
 *   element and its scroll container.
 *
 * Layers:
 *   z-0  Bg image (absolute inset-0)
 *   z-10 Nav row (absolute top-[0px]) + Title (absolute top-[64px])
 *   z-20 Scroll container (absolute inset-0, overflow-y-auto, pointer-events-none)
 *          → spacer 262px (transparent, clicks pass through to nav)
 *          → white card (sticky top-[8px], min-h-[772px], pointer-events-auto)
 *               content scrolls naturally here — no inner scroll container needed
 *   z-30 SafariBar (absolute top-0) + CTABar (absolute bottom-0)
 *
 * 8px gap math:
 *   sticky top-[8px] = SafariBar(94px) + 8px gap.
 *   Card can grow freely with content. Sticky hard-caps it at 102px from phone top.
 *
 * noScroll (Step4 agreements):
 *   Card is h-[calc(100vh-168px)] = viewport - spacer. Outer never scrolls.
 *   Content is a fixed flex layout — everything above the fold.
 */
export default function OciStepLayout({
  children,
  overlay,
  title,
  subtitle = 'Brisa Deluxe Studio',
  progress,
  navigate,
  onExit,
  backTo,
  onBack,
  hideBack = false,
  continueLabel = 'Continue',
  onContinue,
  hideContinue = false,
  noScroll = false,
}) {
  const handleBack = () => {
    if (onBack) onBack()
    else if (navigate && backTo) navigate(backTo)
  }

  return (
    // NO overflow-hidden here — required for sticky to work inside the scroll container
    <div className="h-screen relative">
      {/* ── Bg image ── z-0 */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}bg-full.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      {/* ── Nav row ── z-10 */}
      <div className="absolute top-[0px] left-0 right-0 z-10 px-4 pt-4">
        <div className="flex items-center justify-between h-12">
          {hideBack ? (
            <div className="w-10 h-10" />
          ) : (
            <button
              onClick={handleBack}
              className="w-10 h-10 bg-white border border-(--color-border-primary) rounded-lg flex items-center justify-center active:opacity-70"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M7 1L1 7L7 13" stroke="var(--color-fg-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          <div className="w-[150px]">
            <ProgressBar data-id="step-progress" value={progress} />
          </div>

          <button
            onClick={onExit}
            className="w-10 h-10 bg-white border border-(--color-border-primary) rounded-lg flex items-center justify-center active:opacity-70"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="var(--color-fg-primary)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Title section ── z-10 */}
      <div className="absolute top-[64px] left-0 right-0 z-10 px-4 pt-4 pb-5 text-center">
        <p className="text-[15px] font-normal text-(--color-fg-tertiary) leading-6">{subtitle}</p>
        <h1 className="text-[24px] font-semibold text-(--color-fg-primary) leading-8 mt-0.5">{title}</h1>
      </div>

      {/* ── SafariBar ── z-30 */}
      <div className="absolute top-0 left-0 right-0 z-30">
      </div>

      {/* ── Single scroll container — card moves up, content scrolls freely ── z-20 */}
      <div className="absolute inset-0 z-20 overflow-y-auto scrollable pointer-events-none">
        {/* Spacer: 262px transparent — taps pass through to fixed nav below */}
        <div className="h-[168px] shrink-0" />

        {noScroll ? (
          /* Step4: fixed height, no scroll, everything above fold */
          <div className="bg-white rounded-t-3xl h-[calc(100vh-168px)] pb-[88px] flex flex-col overflow-hidden pointer-events-auto">
            {children}
          </div>
        ) : (
          /* sticky top-[8px] = SafariBar(94) + 8px. Card sized to content, no forced min-h. */
          <div className="sticky top-[8px] bg-white rounded-t-3xl pb-[88px] pointer-events-auto">
            {children}
          </div>
        )}
      </div>

      {/* ── CTABar ── z-30 */}
      {!hideContinue && (
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <CTABar
            onContinue={onContinue}
            continueLabel={continueLabel}
          />
        </div>
      )}

      {/* ── Overlays ── */}
      {overlay}
    </div>
  )
}
