/**
 * CardSelector — reusable radio-card grid.
 *
 * Props:
 *   options  — [{ value: string, label: string, icon: string | ReactNode }]
 *              icon = string → rendered as <img src>
 *              icon = ReactNode → rendered as-is (SVG, etc.)
 *   value    — currently selected value (string)
 *   onChange — (value: string) => void
 */
export default function CardSelector({ options, value, onChange }) {
  return (
    <div className="flex gap-2">
      {options.map(({ value: optVal, label, icon }) => {
        const selected = value === optVal
        return (
          <button
            key={optVal}
            onClick={() => onChange(optVal)}
            className={`flex-1 bg-white rounded-2xl pt-8 pb-6 flex flex-col items-center gap-3 border-2 transition-colors relative ${
              selected
                ? 'border-(--color-hostaway-secondary-600)'
                : 'border-(--color-border-secondary)'
            }`}
          >
            {/* Radio indicator — top-left */}
            <div className={`absolute top-3 left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selected
                ? 'border-(--color-hostaway-secondary-600) bg-(--color-hostaway-secondary-600)'
                : 'border-(--color-border-primary)'
            }`}>
              {selected && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>

            {/* Icon — fixed 32×32 slot */}
            <div className="w-8 h-8 flex items-center justify-center">
              {typeof icon === 'string'
                ? <img src={icon} alt={label} className="w-8 h-8" />
                : icon}
            </div>

            {/* Label */}
            <span className={`text-[15px] font-semibold text-center leading-5 ${
              selected ? 'text-(--color-fg-primary)' : 'text-(--color-fg-secondary)'
            }`}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
