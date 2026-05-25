import { useState, Component } from 'react'

// Error boundary — prevents one broken DS component from blanking the whole page
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-600 font-mono">
          ⚠ {this.state.error.message}
        </div>
      )
    }
    return this.props.children
  }
}
import { Badge, FeaturedIcon, ProgressBar, Button, Checkbox, InputField } from '@hostaway/design-system'
import {
  Key01, Wifi, Home01, Car01, User01, Copy01, X,
  LogIn01, LogOut01, Users01, Moon01, Clock,
  Phone01, Map01, SlashCircle01, SearchMd, CheckCircle,
  ShoppingCart01, Star01, ZapFast,
} from '@hostaway/design-system/icons'
import ListRow from '../components/ListRow'
import InfoBanner from '../components/InfoBanner'
import CardSelector from '../components/CardSelector'
import CartFooter from '../components/CartFooter'
import CTABar from '../components/CTABar'

// ─────────────────────────────────────────────────────────────────
// Layout helpers
// ─────────────────────────────────────────────────────────────────

function PageSection({ title, description, children }) {
  return (
    <section className="mb-16">
      <div className="mb-8">
        <h2 className="text-[28px] font-bold text-(--color-fg-primary) leading-tight">{title}</h2>
        {description && <p className="text-[16px] text-(--color-fg-tertiary) mt-1.5 leading-6">{description}</p>}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  )
}

function ComponentBlock({ name, description, children }) {
  return (
    <div className="bg-white rounded-2xl border border-(--color-border-secondary) overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-(--color-border-secondary)">
        <p className="text-[18px] font-bold text-(--color-fg-primary)">{name}</p>
        {description && <p className="text-[14px] text-(--color-fg-tertiary) mt-0.5">{description}</p>}
      </div>
      {/* Body */}
      <div className="px-6 py-5 flex flex-col gap-8">
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </div>
  )
}

function StateGroup({ label, children, horizontal = false }) {
  return (
    <div>
      <p className="text-[12px] font-semibold text-(--color-fg-quaternary) uppercase tracking-wider mb-3">{label}</p>
      <div className={horizontal ? 'flex flex-wrap gap-3 items-start' : 'flex flex-col gap-3'}>
        {children}
      </div>
    </div>
  )
}

function StateItem({ label, children }) {
  return (
    <div>
      <p className="text-[11px] text-(--color-fg-quaternary) mb-1.5">{label}</p>
      {children}
    </div>
  )
}

// Divider between state groups
function Divider() {
  return <div className="h-px bg-(--color-border-secondary)" />
}

// Dark preview area for components that need a warm background
function WarmCanvas({ children }) {
  return (
    <div className="bg-(--color-bg-warm) rounded-xl p-4">
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// CopyBtn (used inside showcase)
// ─────────────────────────────────────────────────────────────────
function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(value).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handle}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-(--color-fg-tertiary) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors"
    >
      {copied
        ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3L11.5 3" stroke="var(--color-fg-primary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <Copy01 width={16} height={16} />
      }
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────
// Upsell Card (inline component from UpsellsTab — shown in states)
// ─────────────────────────────────────────────────────────────────
function UpsellCard({ label, description, price, unit, state }) {
  const ImgPlaceholder = () => (
    <div className="w-[100px] shrink-0 bg-(--color-bg-warm) flex items-center justify-center self-stretch rounded-l-2xl">
      <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="5" width="24" height="18" rx="3" stroke="var(--color-fg-quaternary)" strokeWidth="1.4"/>
        <circle cx="9" cy="12" r="2.5" stroke="var(--color-fg-quaternary)" strokeWidth="1.4"/>
        <path d="M2 19l6-5 5 4 4-4 7 6" stroke="var(--color-fg-quaternary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )

  const ActionButton = () => {
    switch (state) {
      case 'added-ota':
        return (
          <button disabled className="w-full h-9 border border-(--color-border-secondary) rounded-xl text-[14px] font-semibold text-(--color-fg-quaternary) bg-(--color-bg-secondary) cursor-default flex items-center justify-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Added
          </button>
        )
      case 'in-cart':
        return (
          <button className="w-full h-9 border border-(--color-border-primary) rounded-xl text-[14px] font-semibold text-(--color-fg-primary) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors">
            Remove
          </button>
        )
      case 'request-in-cart':
        return (
          <button className="w-full h-9 border border-(--color-border-primary) rounded-xl text-[14px] font-semibold text-(--color-fg-primary) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors">
            Remove request
          </button>
        )
      case 'request':
        return (
          <button className="w-full h-9 border border-(--color-border-secondary) rounded-xl text-[14px] font-semibold text-(--color-fg-secondary) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Request
          </button>
        )
      default: // 'add'
        return (
          <button className="w-full h-9 border border-(--color-border-primary) rounded-xl text-[14px] font-semibold text-(--color-fg-primary) hover:bg-(--color-bg-secondary) active:bg-(--color-bg-secondary) transition-colors">
            + Add
          </button>
        )
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex border border-(--color-border-secondary)">
      <ImgPlaceholder />
      <div className="flex-1 p-3 flex flex-col min-w-0">
        <p className="text-[18px] font-bold text-(--color-fg-primary) leading-snug">{label}</p>
        <p className="text-[16px] text-(--color-fg-tertiary) leading-snug mt-1 line-clamp-2">{description}</p>
        <div className="flex items-baseline gap-0.5 mt-2">
          {price === 'FREE'
            ? <span className="text-[16px] font-bold text-(--color-fg-primary)">FREE</span>
            : <>
                <span className="text-[16px] font-bold text-(--color-fg-primary)">{price}</span>
                {unit && <span className="text-[13px] text-(--color-fg-tertiary) ml-0.5">{unit}</span>}
              </>
          }
        </div>
        <div className="mt-2"><ActionButton /></div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Interactive Tab Bar demo
// ─────────────────────────────────────────────────────────────────
const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke={active ? 'var(--color-hostaway-secondary-600)' : 'var(--color-gray-600)'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.565c0-.574 0-.861.074-1.126a2 2 0 0 1 .318-.65c.163-.22.39-.397.843-.75l6.783-5.275c.351-.273.527-.41.72-.462a1 1 0 0 1 .523 0c.194.052.37.189.721.462l6.783 5.275c.453.353.68.53.843.75.145.195.252.416.318.65.074.265.074.552.074 1.126V17.8c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C19.48 21 18.92 21 17.8 21H6.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C3 19.48 3 18.92 3 17.8v-7.235Z"/>
  </svg>
)
const AccessIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke={active ? 'var(--color-hostaway-secondary-600)' : 'var(--color-gray-600)'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 9a1.99 1.99 0 0 0-.586-1.414A1.994 1.994 0 0 0 15 7m0 8a6 6 0 1 0-5.946-5.193c.058.434.087.651.068.789a.853.853 0 0 1-.117.346c-.068.121-.187.24-.426.479l-5.11 5.11c-.173.173-.26.26-.322.36a1 1 0 0 0-.12.29C3 17.296 3 17.418 3 17.663V19.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C3.76 21 4.04 21 4.6 21H7v-2h2v-2h2l1.58-1.58c.238-.238.357-.357.478-.425a.852.852 0 0 1 .346-.117c.138-.02.355.01.789.068.264.036.533.054.807.054Z"/>
  </svg>
)
const UpsellsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke={active ? 'var(--color-hostaway-secondary-600)' : 'var(--color-gray-600)'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2h1.306c.246 0 .37 0 .468.045a.5.5 0 0 1 .213.185c.059.092.076.213.111.457L4.571 6m0 0 1.052 7.731c.134.982.2 1.472.435 1.841a2 2 0 0 0 .853.745c.398.183.893.183 1.883.183h8.558c.942 0 1.414 0 1.799-.17a2 2 0 0 0 .841-.696c.239-.346.327-.81.503-1.735l1.324-6.95c.062-.325.093-.488.048-.615a.5.5 0 0 0-.22-.266C21.532 6 21.366 6 21.034 6H4.571ZM10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
  </svg>
)

function TabBarV2Demo() {
  const [active, setActive] = useState('home')
  const tabs = [
    { key: 'home',    label: 'Home',    icon: (a) => <HomeIcon active={a} /> },
    { key: 'access',  label: 'Access',  icon: (a) => <AccessIcon active={a} /> },
    { key: 'upsells', label: 'Upsells', icon: (a) => <UpsellsIcon active={a} /> },
  ]
  return (
    <WarmCanvas>
      <div className="bg-white rounded-2xl border border-(--color-border-secondary) shadow-sm overflow-hidden" style={{ height: 72 }}>
        <div className="flex h-full">
          {tabs.map(({ key, label, icon }) => {
            const isActive = active === key
            return (
              <button key={key} onClick={() => setActive(key)} className="flex-1 flex items-center justify-center relative">
                {isActive && <div className="absolute inset-x-1 inset-y-2 bg-(--color-bg-secondary) rounded-xl" />}
                <div className="relative z-10 flex flex-col items-center gap-0.5">
                  {icon(isActive)}
                  <span className={`text-[11px] font-semibold leading-tight ${isActive ? 'text-(--color-hostaway-secondary-600)' : 'text-(--color-gray-600)'}`}>{label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <p className="text-[12px] text-(--color-fg-quaternary) mt-3 text-center">Tap tabs to see active state</p>
    </WarmCanvas>
  )
}

function TabBarV1Demo() {
  const [active, setActive] = useState('home')
  const tabs = [
    { key: 'home',    label: 'Home',    icon: (a) => <HomeIcon active={a} /> },
    { key: 'access',  label: 'Access',  icon: (a) => <AccessIcon active={a} /> },
    { key: 'upsells', label: 'Upsells', icon: (a) => <UpsellsIcon active={a} /> },
  ]
  return (
    <WarmCanvas>
      <div className="bg-white border border-(--color-border-secondary) rounded-2xl overflow-hidden" style={{ height: 68 }}>
        <div className="flex h-full">
          {tabs.map(({ key, label, icon }) => {
            const isActive = active === key
            return (
              <button key={key} onClick={() => setActive(key)} className="flex-1 flex flex-col items-center justify-center gap-0.5 relative">
                {isActive && <div className="absolute top-0 left-4 right-4 h-[2px] bg-(--color-hostaway-secondary-600) rounded-b-full"/>}
                {icon(isActive)}
                <span className={`text-[10px] font-medium leading-tight ${isActive ? 'text-(--color-hostaway-secondary-600)' : 'text-(--color-gray-600)'}`}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
      <p className="text-[12px] text-(--color-fg-quaternary) mt-3 text-center">Tap tabs to see active state</p>
    </WarmCanvas>
  )
}

// ─────────────────────────────────────────────────────────────────
// CartFooter demo wrapper (isolates state)
// ─────────────────────────────────────────────────────────────────
const DEMO_CART = [
  { id: 'early-checkin', label: 'Early check-in', price: '€20', unit: '' },
  { id: 'baby-cot', label: 'Baby cot', price: 'FREE', unit: '' },
]

function CartFooterDemo() {
  const [items, setItems] = useState(DEMO_CART)
  return (
    <WarmCanvas>
      <div className="relative" style={{ height: 200 }}>
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="h-full bg-(--color-bg-secondary) flex items-center justify-center">
            <p className="text-[14px] text-(--color-fg-quaternary)">Screen content area</p>
          </div>
          {items.length > 0 && (
            <div className="absolute left-0 right-0 bottom-0 bg-white border-t border-(--color-border-secondary)" style={{ boxShadow: '0 -4px 16px rgba(0,0,0,0.08)' }}>
              <CartFooterInner items={items} onRemove={(id) => setItems(p => p.filter(i => i.id !== id))} />
            </div>
          )}
        </div>
      </div>
      {items.length === 0 && (
        <button onClick={() => setItems(DEMO_CART)} className="mt-3 w-full h-9 border border-(--color-border-primary) rounded-xl text-[14px] font-semibold text-(--color-fg-secondary) hover:bg-(--color-bg-secondary) transition-colors">
          Reset cart
        </button>
      )}
      <p className="text-[12px] text-(--color-fg-quaternary) mt-3 text-center">Remove items from cart to see empty state</p>
    </WarmCanvas>
  )
}

function CartFooterInner({ items, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const total = items.reduce((s, i) => s + (i.price === 'FREE' ? 0 : parseFloat(i.price.replace(/[^0-9.]/g, '')) || 0), 0)
  return (
    <>
      {expanded && (
        <div className="px-4 pt-3 pb-3 bg-(--color-bg-warm) border-b border-(--color-border-secondary)">
          <p className="text-[13px] font-bold text-(--color-fg-primary) mb-2.5">Payment summary</p>
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center gap-2 mb-1.5">
              <span className="text-[12px] text-(--color-fg-tertiary) flex-1 min-w-0 truncate">{item.label}</span>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[12px] text-(--color-fg-tertiary)">{item.price}</span>
                <button onClick={() => onRemove(item.id)} className="w-5 h-5 flex items-center justify-center rounded text-(--color-fg-quaternary) hover:text-(--color-fg-primary)">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between px-4" style={{ height: 80 }}>
        <button onClick={() => setExpanded(v => !v)} className="flex flex-col items-start gap-0.5">
          <span className="text-[12px] text-(--color-fg-tertiary) leading-none">Total</span>
          <div className="flex items-center gap-1">
            <span className="text-[20px] font-bold text-(--color-fg-primary) leading-tight">€{total.toFixed(2)}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
              <path d="M4 6l4 4 4-4" stroke="var(--color-fg-tertiary)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
        <button className="h-11 px-6 bg-(--color-fg-primary) rounded-xl text-[14px] font-semibold text-white hover:opacity-90 active:opacity-80 transition-opacity">
          Pay now
        </button>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────
// CheckInCTAButton demo (no routing)
// ─────────────────────────────────────────────────────────────────
function CheckInCTADemo() {
  const [state, setState] = useState('fresh')
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {['fresh','started'].map(s => (
          <button key={s} onClick={() => setState(s)}
            className={`px-3 h-8 rounded-lg text-[13px] font-medium border transition-colors ${state === s ? 'bg-(--color-fg-primary) text-white border-(--color-fg-primary)' : 'border-(--color-border-secondary) text-(--color-fg-secondary) hover:bg-(--color-bg-secondary)'}`}>
            {s === 'fresh' ? 'Fresh start' : 'In progress'}
          </button>
        ))}
      </div>
      {state === 'fresh'
        ? <button className="w-full h-12 bg-(--color-fg-primary) rounded-xl text-[15px] font-semibold text-white active:opacity-90">Start Check-in</button>
        : <button className="w-full h-12 bg-(--color-fg-primary) rounded-xl text-[15px] font-semibold text-white active:opacity-90 flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333l-3.666.667.666-3.667L11.333 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Edit Check-in Form
          </button>
      }
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// CardSelector demo
// ─────────────────────────────────────────────────────────────────
const PAYMENT_OPTIONS = [
  { value: 'apple-pay', label: 'Apple Pay', icon: (
    <svg viewBox="0 0 32 18" width="32" height="18" fill="currentColor">
      <path d="M5.8 2.4c.5-.6 1.3-1 2-1 .1.8-.2 1.5-.7 2.1-.5.5-1.2.9-2 .9-.1-.8.2-1.5.7-2zm-.7 1.1C3.6 3.7 2.5 5 2.5 6.4c0 1.3.7 2.2 1.3 2.9.7.8 1.5 1.1 2.2 1.1.8 0 1.5-.3 2-.6.5-.3.9-.5 1.4-.5.4 0 .8.2 1.3.5.5.3 1.1.6 1.9.6.9 0 1.8-.4 2.5-1.2.4-.5.7-1 .9-1.4-.4-.2-.7-.4-1-.7-.6-.6-1-1.4-1-2.3 0-.8.3-1.6.9-2.2.3-.3.7-.6 1.1-.8-.6-.8-1.5-1.3-2.4-1.3-.8 0-1.4.3-1.9.6-.4.2-.8.4-1.1.4-.4 0-.7-.2-1.2-.4-.5-.3-1.1-.6-1.9-.6-.9 0-1.9.4-2.7 1.5z"/>
      <path d="M18.7 1.5h2.8l2.7 7.5 2.7-7.5H30v9h-1.8V4.3l-2.5 6.2h-1.7l-2.5-6.2v6.2h-1.8V1.5z"/>
    </svg>
  )},
  { value: 'google-pay', label: 'Google Pay', icon: (
    <svg viewBox="0 0 40 16" width="40" height="16" fill="none">
      <text x="0" y="13" fontSize="13" fontWeight="500" fill="#4285F4" fontFamily="sans-serif">G</text>
      <text x="9" y="13" fontSize="13" fontWeight="400" fill="#EA4335" fontFamily="sans-serif">o</text>
      <text x="17" y="13" fontSize="13" fontWeight="400" fill="#FBBC05" fontFamily="sans-serif">o</text>
      <text x="25" y="13" fontSize="13" fontWeight="400" fill="#4285F4" fontFamily="sans-serif">g</text>
      <text x="33" y="13" fontSize="13" fontWeight="400" fill="#34A853" fontFamily="sans-serif">le</text>
    </svg>
  )},
  { value: 'card', label: 'Credit card', icon: (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <path d="M2 10h20"/>
    </svg>
  )},
]

function CardSelectorDemo() {
  const [val, setVal] = useState('card')
  return <CardSelector options={PAYMENT_OPTIONS} value={val} onChange={setVal} />
}

// ─────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────
export default function ComponentsPreview() {
  const [cbChecked, setCbChecked] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [inputError, setInputError] = useState(false)

  return (
    <div className="min-h-screen bg-(--color-bg-secondary)">
      {/* ── Page header ── */}
      <div className="bg-white border-b border-(--color-border-secondary) sticky top-0 z-50">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-semibold text-(--color-fg-quaternary) uppercase tracking-wider">Hostaway</p>
            <h1 className="text-[20px] font-bold text-(--color-fg-primary) leading-tight">Guest Portal · Component Library</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-(--color-fg-quaternary)">DS v2.75</span>
          </div>
        </div>
      </div>

      {/* ── Intro tabs ── */}
      <div className="max-w-[900px] mx-auto px-6 pt-8 pb-2">
        <div className="bg-white rounded-2xl border border-(--color-border-secondary) p-5 mb-8">
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-(--color-bg-secondary) rounded-xl flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-fg-primary)" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-(--color-fg-primary)">Two sections below</p>
                <p className="text-[13px] text-(--color-fg-tertiary)">DS components · B2C local components</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-(--color-bg-secondary) rounded-xl flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-fg-primary)" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-(--color-fg-primary)">All states shown</p>
                <p className="text-[13px] text-(--color-fg-tertiary)">Default · Hover · Active · Disabled · Error</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-(--color-bg-secondary) rounded-xl flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-fg-primary)" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-(--color-fg-primary)">Interactive</p>
                <p className="text-[13px] text-(--color-fg-tertiary)">Click, toggle and test live</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 pb-20">

        {/* ══════════════════════════════════════════════════════════
            PART 1 — HOSTAWAY DESIGN SYSTEM
        ══════════════════════════════════════════════════════════ */}
        <PageSection
          title="Hostaway Design System"
          description="Components imported from @hostaway/design-system and used in this project. Always check the DS MCP for the latest API before editing."
        >

          {/* Badge */}
          <ComponentBlock name="Badge" description="pill-color type. Used for status labels, tags, and inline metadata.">
            <StateGroup label="Colors" horizontal>
              <StateItem label="gray">
                <Badge data-id="badge-gray" type="pill-color" size="sm" color="gray">Starts in 3 weeks</Badge>
              </StateItem>
              <StateItem label="success">
                <Badge data-id="badge-success" type="pill-color" size="sm" color="success">Checked in ✓</Badge>
              </StateItem>
              <StateItem label="warning">
                <Badge data-id="badge-warning" type="pill-color" size="sm" color="warning">Pending</Badge>
              </StateItem>
              <StateItem label="error">
                <Badge data-id="badge-error" type="pill-color" size="sm" color="error">Overdue</Badge>
              </StateItem>
              <StateItem label="brand">
                <Badge data-id="badge-brand" type="pill-color" size="sm" color="brand">New</Badge>
              </StateItem>
            </StateGroup>
            <Divider />
            <StateGroup label="Sizes" horizontal>
              <StateItem label="sm (default)">
                <Badge data-id="badge-sm" type="pill-color" size="sm" color="gray">Host</Badge>
              </StateItem>
              <StateItem label="md">
                <Badge data-id="badge-md" type="pill-color" size="md" color="gray">Host</Badge>
              </StateItem>
              <StateItem label="lg">
                <Badge data-id="badge-lg" type="pill-color" size="lg" color="gray">Host</Badge>
              </StateItem>
            </StateGroup>
          </ComponentBlock>

          {/* FeaturedIcon */}
          <ComponentBlock name="FeaturedIcon" description="Icon in a styled container. Used as row icons in ListRow and access cards.">
            <StateGroup label="Colors (theme: modern, size: sm)" horizontal>
              {['gray','brand','success','warning','error'].map(color => (
                <StateItem key={color} label={color}>
                  <FeaturedIcon data-id={`fi-${color}`} icon={Key01} size="sm" color={color} theme="modern" />
                </StateItem>
              ))}
            </StateGroup>
            <Divider />
            <StateGroup label="Sizes (color: gray, theme: modern)" horizontal>
              {['xs','sm','md','lg','xl'].map(size => (
                <StateItem key={size} label={size}>
                  <FeaturedIcon data-id={`fi-size-${size}`} icon={Home01} size={size} color="gray" theme="modern" />
                </StateItem>
              ))}
            </StateGroup>
            <Divider />
            <StateGroup label="Themes (size: sm, color: brand)" horizontal>
              {['modern','light','dark'].map(theme => (
                <StateItem key={theme} label={theme}>
                  <FeaturedIcon data-id={`fi-theme-${theme}`} icon={Star01} size="sm" color="brand" theme={theme} />
                </StateItem>
              ))}
            </StateGroup>
            <Divider />
            <StateGroup label="Icons used in this project" horizontal>
              {[
                [Key01,'Key01'], [Wifi,'Wifi'], [Home01,'Home01'], [Car01,'Car01'],
                [User01,'User01'], [LogIn01,'LogIn01'], [LogOut01,'LogOut01'],
                [Users01,'Users01'], [Moon01,'Moon01'], [Clock,'Clock'],
                [Phone01,'Phone01'], [Map01,'Map01'], [SlashCircle01,'SlashCircle01'],
                [Copy01,'Copy01'], [SearchMd,'SearchMd'], [CheckCircle,'CheckCircle'],
              ].map(([Icon, name]) => (
                <StateItem key={name} label={name}>
                  <FeaturedIcon data-id={`fi-icon-${name}`} icon={Icon} size="sm" color="gray" theme="modern" />
                </StateItem>
              ))}
            </StateGroup>
          </ComponentBlock>

          {/* ProgressBar */}
          <ComponentBlock name="ProgressBar" description="Check-in step progress. Shown in OciStepLayout header.">
            <StateGroup label="Values">
              {[20, 40, 60, 80, 100].map(v => (
                <StateItem key={v} label={`${v}% (step ${v/20} of 5)`}>
                  <div className="w-[200px]">
                    <ProgressBar data-id={`pb-${v}`} value={v} />
                  </div>
                </StateItem>
              ))}
            </StateGroup>
          </ComponentBlock>

          {/* Button */}
          <ComponentBlock name="Button" description="DS primary action button. Used in CTABar (Continue steps).">
            <StateGroup label="Colors" horizontal>
              {['primary','secondary','tertiary','primary-destructive','link-gray','link-color'].map(color => (
                <StateItem key={color} label={color}>
                  <Button data-id={`btn-${color}`} color={color} size="sm">Button</Button>
                </StateItem>
              ))}
            </StateGroup>
            <Divider />
            <StateGroup label="Sizes (color: primary)" horizontal>
              {['sm','xl'].map(size => (
                <StateItem key={size} label={size}>
                  <Button data-id={`btn-size-${size}`} color="primary" size={size}>Continue</Button>
                </StateItem>
              ))}
            </StateGroup>
            <Divider />
            <StateGroup label="States" horizontal>
              <StateItem label="default">
                <Button data-id="btn-default" color="primary" size="sm">Continue</Button>
              </StateItem>
              <StateItem label="disabled">
                <Button data-id="btn-disabled" color="primary" size="sm" isDisabled>Continue</Button>
              </StateItem>
              <StateItem label="loading">
                <Button data-id="btn-loading" color="primary" size="sm" isLoading>Continue</Button>
              </StateItem>
            </StateGroup>
          </ComponentBlock>

          {/* Checkbox */}
          <ComponentBlock name="Checkbox" description="Used in Step4 agreements — guest must check each house rule before signing.">
            <StateGroup label="States" horizontal>
              <StateItem label="unchecked">
                <Checkbox data-id="cb-unchecked" isSelected={false} onChange={() => {}}>I agree</Checkbox>
              </StateItem>
              <StateItem label="checked (interactive)">
                <Checkbox data-id="cb-checked" isSelected={cbChecked} onChange={setCbChecked}>I agree to the terms</Checkbox>
              </StateItem>
              <StateItem label="disabled unchecked">
                <Checkbox data-id="cb-disabled" isDisabled isSelected={false} onChange={() => {}}>Disabled</Checkbox>
              </StateItem>
              <StateItem label="disabled checked">
                <Checkbox data-id="cb-disabled-checked" isDisabled isSelected onChange={() => {}}>Disabled checked</Checkbox>
              </StateItem>
            </StateGroup>
          </ComponentBlock>

          {/* InputField */}
          <ComponentBlock name="InputField" description="Used throughout check-in form steps (Step1, Step2). Always needs data-id.">
            <StateGroup label="States">
              <StateItem label="default">
                <InputField data-id="if-default" label="First name" placeholder="e.g. Maria" value={inputVal} onChange={e => setInputVal(e.target.value)} />
              </StateItem>
              <StateItem label="with hint">
                <InputField data-id="if-hint" label="Date of birth" placeholder="DD / MM / YYYY" hint="Needed for identity verification" />
              </StateItem>
              <StateItem label="error">
                <InputField data-id="if-error" label="Email address" placeholder="e.g. name@email.com"
                  isInvalid hint="Please enter a valid email address" value="not-an-email" onChange={() => {}} />
              </StateItem>
              <StateItem label="disabled">
                <InputField data-id="if-disabled" label="Booking reference" value="HAW-2024-001234" isDisabled onChange={() => {}} />
              </StateItem>
              <StateItem label="required">
                <InputField data-id="if-required" label="Last name" placeholder="e.g. Santos" isRequired />
              </StateItem>
            </StateGroup>
          </ComponentBlock>

        </PageSection>


        {/* ══════════════════════════════════════════════════════════
            PART 2 — B2C GUEST EXPERIENCE COMPONENTS
        ══════════════════════════════════════════════════════════ */}
        <PageSection
          title="B2C Guest Experience"
          description="Custom components built for this portal. Not in the central DS — guest-journey specific only."
        >

          {/* ListRow */}
          <ComponentBlock name="ListRow" description="The core reusable row for access info, house rules, stay details, host contact. Enforces icon + meta + label (16px min) + optional right action.">
            <StateGroup label="Default — icon + label">
              <div className="bg-white rounded-2xl px-5 py-1">
                <ListRow icon={LogIn01} label="Wed, 31 Oct · from 14:00" />
                <ListRow icon={LogOut01} label="Thu, 01 Nov · until 12:00" />
                <ListRow icon={Users01} label="2 guests" border={false} />
              </div>
            </StateGroup>
            <Divider />
            <StateGroup label="With meta label above">
              <div className="bg-white rounded-2xl px-5 py-1">
                <ListRow icon={Key01} meta="Door code" label="4821" />
                <ListRow icon={Wifi} meta="WiFi · Network: Brisa_Guest" label="sunshine2024" action={<CopyBtn value="sunshine2024" />} border={false} />
              </div>
            </StateGroup>
            <Divider />
            <StateGroup label="With right action — badge">
              <div className="bg-white rounded-2xl px-5 py-1">
                <ListRow icon={User01} meta="Host" label="Sofia Mendes · +351 912 345 678" action={<Badge data-id="lr-badge" type="pill-color" size="sm" color="gray">Host</Badge>} border={false} />
              </div>
            </StateGroup>
            <Divider />
            <StateGroup label="With right action — View guide button">
              <div className="bg-white rounded-2xl px-5 py-1">
                <ListRow
                  icon={Home01}
                  meta="How to get in"
                  label="Rua das Flores 42 · Floor 3 · Apt 3B"
                  action={
                    <button className="h-8 px-3 bg-(--color-bg-secondary) rounded-lg text-[13px] font-semibold text-(--color-fg-primary) hover:bg-(--color-border-secondary) transition-colors shrink-0">
                      View guide
                    </button>
                  }
                  border={false}
                />
              </div>
            </StateGroup>
            <Divider />
            <StateGroup label="House rules — no border on last item">
              <div className="bg-white rounded-2xl px-5 py-1">
                <ListRow icon={Clock} meta="Quiet hours" label="10PM – 8AM" />
                <ListRow icon={SlashCircle01} label="No pets allowed" />
                <ListRow icon={SlashCircle01} label="No smoking" border={false} />
              </div>
            </StateGroup>
          </ComponentBlock>

          {/* SafariBar */}
          <ComponentBlock name="SafariBar" description="Simulated iOS Safari address bar. Always at the top of every screen. Non-interactive.">
            <StateGroup label="Default">
              <div className="bg-white rounded-xl border border-(--color-border-secondary) overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-(--color-border-secondary)">
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-(--color-fg-quaternary) opacity-40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-(--color-fg-quaternary) opacity-40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-(--color-fg-quaternary) opacity-40" />
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-1.5 bg-(--color-bg-secondary) rounded-lg h-8 px-2">
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><rect x="1" y="4" width="8" height="7" rx="1" stroke="var(--color-gray-400)" strokeWidth="1.2"/><path d="M3 4V3a2 2 0 0 1 4 0v1" stroke="var(--color-gray-400)" strokeWidth="1.2"/></svg>
                    <span className="text-[12px] text-(--color-gray-500) font-medium">guest-portal.hostaway.com</span>
                  </div>
                  <div className="w-14 shrink-0" />
                </div>
              </div>
            </StateGroup>
          </ComponentBlock>

          {/* BottomTabBarV2 */}
          <ComponentBlock name="BottomTabBarV2" description="Pill-style tab bar (default variant). Active tab gets a full-height pill background. Interactive — tap to switch.">
            <StateGroup label="Interactive demo">
              <TabBarV2Demo />
            </StateGroup>
          </ComponentBlock>

          {/* BottomTabBar V1 */}
          <ComponentBlock name="BottomTabBar (V1)" description="Classic underline tab bar. Alternative variant. Interactive — tap to switch.">
            <StateGroup label="Interactive demo">
              <TabBarV1Demo />
            </StateGroup>
          </ComponentBlock>

          {/* CartFooter */}
          <ComponentBlock name="CartFooter" description="Sticky cart summary bar. Replaces tab bar when cart has payable items. Expands to show itemised summary. Remove items to see it disappear.">
            <StateGroup label="Interactive demo — with items">
              <CartFooterDemo />
            </StateGroup>
          </ComponentBlock>

          {/* CTABar */}
          <ComponentBlock name="CTABar" description="Sticky bottom CTA inside check-in flow steps. Uses DS Button internally.">
            <StateGroup label="Default">
              <div className="bg-white rounded-xl border border-(--color-border-secondary) overflow-hidden">
                <CTABar onContinue={() => {}} />
              </div>
            </StateGroup>
            <Divider />
            <StateGroup label="Custom label">
              <div className="bg-white rounded-xl border border-(--color-border-secondary) overflow-hidden">
                <CTABar onContinue={() => {}} continueLabel="Complete check-in" />
              </div>
            </StateGroup>
          </ComponentBlock>

          {/* CheckInCTAButton */}
          <ComponentBlock name="CheckInCTAButton" description="Contextual start/resume button. Appears on Homepage and AccessReveal locked state.">
            <StateGroup label="Interactive — toggle state">
              <CheckInCTADemo />
            </StateGroup>
          </ComponentBlock>

          {/* InfoBanner */}
          <ComponentBlock name="InfoBanner" description="Compliance/info callout. Used in Step1 for data collection disclosure.">
            <StateGroup label="With title + close button">
              <InfoBanner
                icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="var(--color-fg-primary)" strokeWidth="1.4"/><path d="M10 9v5M10 7v.5" stroke="var(--color-fg-primary)" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                title="Why we ask this"
                description="Your personal details are required by local regulations. They're stored securely and never shared with third parties."
                onClose={() => {}}
              />
            </StateGroup>
            <Divider />
            <StateGroup label="Description only (no title, no close)">
              <InfoBanner
                icon={<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 5.5V10c0 4 3.1 7.4 7 8 3.9-.6 7-4 7-8V5.5L10 2z" stroke="var(--color-fg-primary)" strokeWidth="1.3" strokeLinejoin="round"/><path d="M10 7v3M10 12.5v.5" stroke="var(--color-fg-primary)" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                description="No charge yet — we'll check availability first and send you a payment link once confirmed."
              />
            </StateGroup>
          </ComponentBlock>

          {/* CardSelector */}
          <ComponentBlock name="CardSelector" description="Radio-card grid. Used for payment method selection in Step5. Supports string (img src) or ReactNode icons.">
            <StateGroup label="Interactive — payment methods">
              <CardSelectorDemo />
            </StateGroup>
            <Divider />
            <StateGroup label="Two options">
              <TwoOptionCardSelector />
            </StateGroup>
          </ComponentBlock>

          {/* UpsellCard */}
          <ComponentBlock name="UpsellCard" description="Horizontal card used in UpsellsTab and Homepage upsell section. Five action states depending on item type and cart state.">
            <StateGroup label="+ Add — default purchasable item">
              <UpsellCard label="Early check-in" description="Arrive before 3PM and settle in early." price="€20" state="add" />
            </StateGroup>
            <Divider />
            <StateGroup label="FREE — no cost item">
              <UpsellCard label="Baby cot" description="Available on request. Set up before you arrive." price="FREE" state="add" />
            </StateGroup>
            <Divider />
            <StateGroup label="In cart — Remove button">
              <UpsellCard label="Early check-in" description="Arrive before 3PM and settle in early." price="€20" state="in-cart" />
            </StateGroup>
            <Divider />
            <StateGroup label="Requires request — stock-limited">
              <UpsellCard label="Parking spot" description="Reserved parking 2 min from the property." price="€8" unit="/day" state="request" />
            </StateGroup>
            <Divider />
            <StateGroup label="Request in cart — Remove request">
              <UpsellCard label="Parking spot" description="Reserved parking 2 min from the property." price="€8" unit="/day" state="request-in-cart" />
            </StateGroup>
            <Divider />
            <StateGroup label="Added by OTA — disabled">
              <UpsellCard label="Airport transfer" description="Pre-booked via your booking platform." price="€45" state="added-ota" />
            </StateGroup>
          </ComponentBlock>

          {/* How to get in modal trigger */}
          <ComponentBlock name="HowToGetIn guide modal" description="Full-screen bottom sheet with rich arrival guide content — photos, video embed, step-by-step with images, and a host note. Triggered from the Access tab.">
            <StateGroup label="Trigger (opens modal)">
              <HowToGetInPreview />
            </StateGroup>
          </ComponentBlock>

        </PageSection>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Helpers defined after main export (JSX refs needed)
// ─────────────────────────────────────────────────────────────────

function TwoOptionCardSelector() {
  const [val, setVal] = useState('leisure')
  const opts = [
    { value: 'leisure', label: 'Leisure', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
    { value: 'business', label: 'Business', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  ]
  return <CardSelector options={opts} value={val} onChange={setVal} />
}

function HowToGetInPreview() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="bg-white rounded-2xl px-5 py-1">
        <ListRow
          icon={Home01}
          meta="How to get in"
          label="Rua das Flores 42 · Floor 3 · Apt 3B"
          action={
            <button
              onClick={() => setOpen(true)}
              className="h-8 px-3 bg-(--color-bg-secondary) rounded-lg text-[13px] font-semibold text-(--color-fg-primary) hover:bg-(--color-border-secondary) transition-colors"
            >
              View guide
            </button>
          }
          border={false}
        />
      </div>
      {open && (
        <div className="fixed inset-0 z-[300] flex flex-col" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="relative mt-auto bg-white rounded-t-3xl flex flex-col" style={{ maxHeight: '92vh' }}>
            <div className="shrink-0 px-5 pt-4 pb-3">
              <div className="w-10 h-1 bg-(--color-border-secondary) rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-(--color-fg-tertiary) leading-tight mb-0.5">Rua das Flores 42 · Floor 3 · Apt 3B</p>
                  <h2 className="text-[20px] font-bold text-(--color-fg-primary) leading-tight">How to get in</h2>
                </div>
                <button onClick={() => setOpen(false)} className="w-9 h-9 bg-(--color-bg-secondary) rounded-xl flex items-center justify-center text-(--color-fg-tertiary) hover:text-(--color-fg-primary) transition-colors">
                  <X width={16} height={16} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 px-5 pb-10 space-y-6">
              <div className="rounded-2xl overflow-hidden bg-(--color-bg-secondary) aspect-video flex flex-col items-center justify-center gap-2">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="2" y="6" width="28" height="20" rx="4" stroke="var(--color-fg-quaternary)" strokeWidth="1.6"/><circle cx="11" cy="14" r="3" stroke="var(--color-fg-quaternary)" strokeWidth="1.6"/><path d="M2 22l7-6 6 5 4-4 9 7" stroke="var(--color-fg-quaternary)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <span className="text-[13px] text-(--color-fg-quaternary)">Property entrance photo</span>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-(--color-fg-primary) mb-2">Video walkthrough</p>
                <div className="rounded-2xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 4.5l11 5.5-11 5.5V4.5z" fill="white"/></svg>
                  </div>
                  <span className="text-[13px] text-white/60">Host video guide · 2:34</span>
                </div>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-(--color-fg-primary) mb-3">Step-by-step</p>
                <div className="flex flex-col gap-4">
                  {['Head to Rua das Flores 42. Look for the blue door.','Take the elevator to floor 3, turn left.','Apartment 3B — last door on the right.','Enter code 4821, wait for green light.'].map((text, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-(--color-fg-primary) flex items-center justify-center shrink-0">
                        <span className="text-[12px] font-bold text-white">{i+1}</span>
                      </div>
                      <p className="text-[16px] text-(--color-fg-secondary) leading-[26px] flex-1">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-(--color-bg-secondary) rounded-2xl p-4">
                <p className="text-[13px] font-semibold text-(--color-fg-primary) mb-1">Note from Sofia</p>
                <p className="text-[16px] text-(--color-fg-secondary) leading-[26px]">If you have any trouble with the keypad, ring the intercom (button 3B) and I'll buzz you in. Welcome! 😊</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
