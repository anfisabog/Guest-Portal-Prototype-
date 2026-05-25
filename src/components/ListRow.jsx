import { FeaturedIcon } from '@hostaway/design-system'

// ── ListRow — reusable icon + label (+ optional meta above + optional right action) ──
// Use for: Contacts, House Rules, Your Stay, Access cards, any key-value list item.
//
// icon        = DS icon component passed to FeaturedIcon
// meta        = small tertiary label above the main text (e.g. "Host", "Check-in", "Door code")
// label       = primary text
// action      = optional JSX on the right (CopyBtn, chevron, badge, etc.)
// interactive = wraps in <button> with hover/active bg; always adds text-left
// border      = separator line below (default true; set false on last item)

export default function ListRow({ icon, meta, label, action, border = true, interactive = false }) {
  const base = `flex items-center gap-3 py-3 ${border ? 'border-b border-(--color-border-secondary) last:border-b-0' : ''}`
  const inner = (
    <>
      <FeaturedIcon icon={icon} size="sm" color="gray" theme="modern" />
      <div className="flex flex-col gap-[2px] flex-1 min-w-0">
        {meta && <span className="text-[12px] text-(--color-fg-tertiary) leading-tight">{meta}</span>}
        <span className="text-[16px] text-(--color-fg-primary) leading-tight">{label}</span>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </>
  )
  if (interactive) {
    return (
      <button className={`w-[calc(100%+40px)] -ml-5 px-5 text-left rounded-(--radius-xl) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors cursor-pointer ${base}`}>
        {inner}
      </button>
    )
  }
  return <div className={base}>{inner}</div>
}
