import { SCREENS } from '../screens'

export default function Step6Confirmation({ navigate, onCheckInComplete }) {
  const handleDone = () => {
    onCheckInComplete()
    navigate(SCREENS.ACCESS_REVEAL)
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundImage: `url(${import.meta.env.BASE_URL}pack-your-bags.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <img src={`${import.meta.env.BASE_URL}checked-in.svg`} alt="" className="w-[280px] mb-8" />
        <h1 className="text-[32px] font-bold text-(--color-fg-primary) text-center leading-[40px] mb-2">Pack your bags</h1>
        <p className="text-[16px] text-(--color-fg-tertiary) text-center leading-6">You're checked in, time to get excited</p>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-4 pb-8">
        <button
          onClick={handleDone}
          className="w-full h-14 bg-(--color-fg-primary) rounded-2xl flex items-center justify-center"
        >
          <span className="text-[16px] font-semibold text-white">All done</span>
        </button>
      </div>
    </div>
  )
}
