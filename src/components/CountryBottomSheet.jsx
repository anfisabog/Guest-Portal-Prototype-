import { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export const COUNTRIES = [
  ['🇦🇩','Andorra'],['🇦🇫','Afghanistan'],['🇦🇬','Antigua and Barbuda'],['🇦🇱','Albania'],
  ['🇦🇲','Armenia'],['🇦🇴','Angola'],['🇦🇷','Argentina'],['🇦🇹','Austria'],
  ['🇦🇺','Australia'],['🇦🇿','Azerbaijan'],['🇧🇦','Bosnia and Herzegovina'],['🇧🇩','Bangladesh'],
  ['🇧🇪','Belgium'],['🇧🇫','Burkina Faso'],['🇧🇬','Bulgaria'],['🇧🇭','Bahrain'],
  ['🇧🇷','Brazil'],['🇧🇹','Bhutan'],['🇧🇼','Botswana'],['🇧🇾','Belarus'],
  ['🇨🇦','Canada'],['🇨🇩','DR Congo'],['🇨🇫','Central African Republic'],['🇨🇬','Congo'],
  ['🇨🇭','Switzerland'],['🇨🇮',"Côte d'Ivoire"],['🇨🇱','Chile'],['🇨🇲','Cameroon'],
  ['🇨🇳','China'],['🇨🇴','Colombia'],['🇨🇷','Costa Rica'],['🇨🇺','Cuba'],
  ['🇨🇻','Cape Verde'],['🇨🇾','Cyprus'],['🇨🇿','Czech Republic'],['🇩🇪','Germany'],
  ['🇩🇰','Denmark'],['🇩🇿','Algeria'],['🇪🇨','Ecuador'],['🇪🇬','Egypt'],
  ['🇪🇷','Eritrea'],['🇪🇸','Spain'],['🇪🇹','Ethiopia'],['🇫🇮','Finland'],
  ['🇫🇯','Fiji'],['🇫🇷','France'],['🇬🇦','Gabon'],['🇬🇧','United Kingdom'],
  ['🇬🇪','Georgia'],['🇬🇭','Ghana'],['🇬🇲','Gambia'],['🇬🇳','Guinea'],
  ['🇬🇶','Equatorial Guinea'],['🇬🇷','Greece'],['🇬🇹','Guatemala'],['🇬🇼','Guinea-Bissau'],
  ['🇬🇾','Guyana'],['🇭🇳','Honduras'],['🇭🇷','Croatia'],['🇭🇹','Haiti'],
  ['🇭🇺','Hungary'],['🇮🇩','Indonesia'],['🇮🇪','Ireland'],['🇮🇱','Israel'],
  ['🇮🇳','India'],['🇮🇶','Iraq'],['🇮🇷','Iran'],['🇮🇸','Iceland'],
  ['🇮🇹','Italy'],['🇯🇲','Jamaica'],['🇯🇴','Jordan'],['🇯🇵','Japan'],
  ['🇰🇪','Kenya'],['🇰🇬','Kyrgyzstan'],['🇰🇭','Cambodia'],['🇰🇲','Comoros'],
  ['🇰🇳','Saint Kitts and Nevis'],['🇰🇵','North Korea'],['🇰🇷','South Korea'],['🇰🇼','Kuwait'],
  ['🇰🇿','Kazakhstan'],['🇱🇦','Laos'],['🇱🇧','Lebanon'],['🇱🇨','Saint Lucia'],
  ['🇱🇮','Liechtenstein'],['🇱🇰','Sri Lanka'],['🇱🇷','Liberia'],['🇱🇸','Lesotho'],
  ['🇱🇹','Lithuania'],['🇱🇺','Luxembourg'],['🇱🇻','Latvia'],['🇱🇾','Libya'],
  ['🇲🇦','Morocco'],['🇲🇩','Moldova'],['🇲🇪','Montenegro'],['🇲🇬','Madagascar'],
  ['🇲🇰','North Macedonia'],['🇲🇱','Mali'],['🇲🇲','Myanmar'],['🇲🇳','Mongolia'],
  ['🇲🇷','Mauritania'],['🇲🇹','Malta'],['🇲🇺','Mauritius'],['🇲🇻','Maldives'],
  ['🇲🇼','Malawi'],['🇲🇽','Mexico'],['🇲🇾','Malaysia'],['🇲🇿','Mozambique'],
  ['🇳🇦','Namibia'],['🇳🇪','Niger'],['🇳🇬','Nigeria'],['🇳🇮','Nicaragua'],
  ['🇳🇱','Netherlands'],['🇳🇴','Norway'],['🇳🇵','Nepal'],['🇳🇿','New Zealand'],
  ['🇴🇲','Oman'],['🇵🇦','Panama'],['🇵🇪','Peru'],['🇵🇬','Papua New Guinea'],
  ['🇵🇭','Philippines'],['🇵🇰','Pakistan'],['🇵🇱','Poland'],['🇵🇸','Palestine'],
  ['🇵🇹','Portugal'],['🇵🇼','Palau'],['🇵🇾','Paraguay'],['🇶🇦','Qatar'],
  ['🇷🇴','Romania'],['🇷🇸','Serbia'],['🇷🇺','Russia'],['🇷🇼','Rwanda'],
  ['🇸🇦','Saudi Arabia'],['🇸🇧','Solomon Islands'],['🇸🇨','Seychelles'],['🇸🇩','Sudan'],
  ['🇸🇪','Sweden'],['🇸🇬','Singapore'],['🇸🇮','Slovenia'],['🇸🇰','Slovakia'],
  ['🇸🇱','Sierra Leone'],['🇸🇲','San Marino'],['🇸🇳','Senegal'],['🇸🇴','Somalia'],
  ['🇸🇷','Suriname'],['🇸🇸','South Sudan'],['🇸🇹','São Tomé and Príncipe'],['🇸🇻','El Salvador'],
  ['🇸🇾','Syria'],['🇸🇿','Eswatini'],['🇹🇩','Chad'],['🇹🇬','Togo'],
  ['🇹🇭','Thailand'],['🇹🇯','Tajikistan'],['🇹🇱','Timor-Leste'],['🇹🇲','Turkmenistan'],
  ['🇹🇳','Tunisia'],['🇹🇴','Tonga'],['🇹🇷','Turkey'],['🇹🇹','Trinidad and Tobago'],
  ['🇹🇻','Tuvalu'],['🇹🇿','Tanzania'],['🇺🇦','Ukraine'],['🇺🇬','Uganda'],
  ['🇺🇸','United States'],['🇺🇾','Uruguay'],['🇺🇿','Uzbekistan'],['🇻🇦','Vatican City'],
  ['🇻🇨','Saint Vincent and the Grenadines'],['🇻🇪','Venezuela'],['🇻🇳','Vietnam'],
  ['🇻🇺','Vanuatu'],['🇼🇸','Samoa'],['🇾🇪','Yemen'],['🇿🇦','South Africa'],
  ['🇿🇲','Zambia'],['🇿🇼','Zimbabwe'],
]

export default function CountryBottomSheet({ title, value, onChange, onClose }) {
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(false)
  const [portalTarget, setPortalTarget] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setPortalTarget(document.getElementById('phone-shell-portal'))
  }, [])

  useEffect(() => {
    if (!portalTarget) return
    const id = requestAnimationFrame(() => {
      setVisible(true)
      // Focus without scrolling background content
      inputRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(id)
  }, [portalTarget])

  const filtered = useMemo(() =>
    search.trim()
      ? COUNTRIES.filter(([, name]) => name.toLowerCase().includes(search.toLowerCase()))
      : COUNTRIES,
    [search]
  )

  const sheet = (
    <div
      style={{
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        background: visible ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
        transition: 'background 300ms ease-out',
      }}
    >
      {/* 94px SafariBar + 24px gap below address bar — tap to close */}
      <div style={{ height: 118, flexShrink: 0 }} onClick={onClose} />
      {/* White drawer — fills remaining 850px */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRadius: '24px 24px 0 0',
          overflow: 'hidden',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 300ms ease-out',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
          <span className="text-[16px] font-bold text-(--color-fg-primary)">{title}</span>
          <button onClick={onClose} className="w-9 h-9 bg-(--color-bg-warm) rounded-lg flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="var(--color-fg-primary)" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {/* Search */}
        <div className="px-5 pb-3 shrink-0">
          <div className="h-11 border border-(--color-border-primary) rounded-xl px-3.5 flex items-center gap-2 bg-white focus-within:border-(--color-fg-primary) transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="var(--color-gray-400)" strokeWidth="1.4"/>
              <path d="M11 11l3 3" stroke="var(--color-gray-400)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder={`Search ${title.toLowerCase()}`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-[16px] font-normal leading-6 text-(--color-fg-primary) placeholder:text-(--color-fg-tertiary) bg-transparent outline-none"
            />
          </div>
        </div>
        {/* Scrollable list — contained, never escapes drawer */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map(([flag, name]) => (
            <button
              key={name}
              onClick={() => { onChange(name); onClose() }}
              className={`w-full flex items-center gap-3 px-5 h-[52px] text-left transition-colors ${
                value === name ? 'bg-(--color-bg-success-secondary)' : 'hover:bg-(--color-bg-secondary)'
              }`}
            >
              <span className="text-[22px]">{flag}</span>
              <span className={`text-[15px] ${value === name ? 'font-semibold text-(--color-fg-primary)' : 'font-medium text-(--color-fg-secondary)'}`}>
                {name}
              </span>
              {value === name && (
                <svg className="ml-auto" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4" stroke="var(--color-hostaway-secondary-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  // Portal directly into phone-shell — clipped to 402×874px by its overflow:hidden
  if (!portalTarget) return null
  return createPortal(sheet, portalTarget)
}
