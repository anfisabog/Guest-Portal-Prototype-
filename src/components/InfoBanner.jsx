/**
 * InfoBanner — reusable info/compliance banner
 *
 * Props:
 *   icon        — ReactNode (SVG element)
 *   title       — string (optional)
 *   description — ReactNode
 *   onClose     — () => void (optional — renders X button when provided)
 */
export default function InfoBanner({ icon, title, description, onClose }) {
  return (
    <div className="relative rounded-2xl px-4 pt-4 pb-4 bg-(--color-bg-secondary) border border-(--color-border-secondary)">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-0.5 text-(--color-gray-400)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* Icon */}
      <div className="mb-2">
        {icon}
      </div>

      {/* Title (optional) */}
      {title && (
        <p className="text-[15px] font-semibold text-(--color-fg-primary) leading-5 mb-1 pr-6">
          {title}
        </p>
      )}

      {/* Description */}
      <p className="text-[14px] text-(--color-fg-tertiary) leading-5 pr-6">
        {description}
      </p>
    </div>
  )
}
