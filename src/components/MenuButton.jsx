// Shared menu/hamburger button — used on Homepage and PreLogin.
// Single source of truth for icon style, size, and button container.
export default function MenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 bg-white border border-(--color-border-primary) rounded-lg flex items-center justify-center active:opacity-80"
    >
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
        <path d="M1 1h16M1 6h16M1 11h16" stroke="var(--color-fg-primary)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  )
}
