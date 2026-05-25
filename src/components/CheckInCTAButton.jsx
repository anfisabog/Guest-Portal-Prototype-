import { SCREENS } from '../screens'

// Shared CTA button for starting or resuming check-in.
// Used on: Homepage reservation card, AccessReveal locked state.
// Props:
//   checkInStarted    — user began but didn't finish
//   checkInResumeStep — screen to return them to (defaults to STEP1)
//   navigate          — App navigate fn
export default function CheckInCTAButton({ checkInStarted, checkInResumeStep, navigate }) {
  if (checkInStarted) {
    return (
      <button
        onClick={() => navigate(checkInResumeStep || SCREENS.STEP1)}
        className="w-full h-12 bg-(--color-fg-primary) rounded-xl text-[15px] font-semibold text-white active:opacity-90 flex items-center justify-center gap-2"
      >
        {/* Pencil / edit icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333l-3.666.667.666-3.667L11.333 2Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Edit Check-in Form
      </button>
    )
  }

  return (
    <button
      onClick={() => navigate(SCREENS.STEP1)}
      className="w-full h-12 bg-(--color-fg-primary) rounded-xl text-[15px] font-semibold text-white active:opacity-90"
    >
      Start Check-in
    </button>
  )
}
