import { SCREENS } from '../screens'

// Icons extracted from @untitledui/icons — same paths, rendered as inline SVG
const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" stroke={active ? 'var(--color-hostaway-secondary-600)' : 'var(--color-gray-500)'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.565c0-.574 0-.861.074-1.126a2 2 0 0 1 .318-.65c.163-.22.39-.397.843-.75l6.783-5.275c.351-.273.527-.41.72-.462a1 1 0 0 1 .523 0c.194.052.37.189.721.462l6.783 5.275c.453.353.68.53.843.75.145.195.252.416.318.65.074.265.074.552.074 1.126V17.8c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874C19.48 21 18.92 21 17.8 21H6.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C3 19.48 3 18.92 3 17.8v-7.235Z"/>
  </svg>
)

const AccessIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" stroke={active ? 'var(--color-hostaway-secondary-600)' : 'var(--color-gray-500)'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 9a1.99 1.99 0 0 0-.586-1.414A1.994 1.994 0 0 0 15 7m0 8a6 6 0 1 0-5.946-5.193c.058.434.087.651.068.789a.853.853 0 0 1-.117.346c-.068.121-.187.24-.426.479l-5.11 5.11c-.173.173-.26.26-.322.36a1 1 0 0 0-.12.29C3 17.296 3 17.418 3 17.663V19.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C3.76 21 4.04 21 4.6 21H7v-2h2v-2h2l1.58-1.58c.238-.238.357-.357.478-.425a.852.852 0 0 1 .346-.117c.138-.02.355.01.789.068.264.036.533.054.807.054Z"/>
  </svg>
)

const UpsellsIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" stroke={active ? 'var(--color-hostaway-secondary-600)' : 'var(--color-gray-500)'} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 2h1.306c.246 0 .37 0 .468.045a.5.5 0 0 1 .213.185c.059.092.076.213.111.457L4.571 6m0 0 1.052 7.731c.134.982.2 1.472.435 1.841a2 2 0 0 0 .853.745c.398.183.893.183 1.883.183h8.558c.942 0 1.414 0 1.799-.17a2 2 0 0 0 .841-.696c.239-.346.327-.81.503-1.735l1.324-6.95c.062-.325.093-.488.048-.615a.5.5 0 0 0-.22-.266C21.532 6 21.366 6 21.034 6H4.571ZM10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
  </svg>
)


export default function BottomTabBar({ activeTab, onTabChange, navigate, cartCount = 0 }) {
  const tabs = [
    {
      key: 'home',
      label: 'Home',
      icon: (active) => <HomeIcon active={active} />,
      onPress: () => { onTabChange('home'); navigate(SCREENS.HOMEPAGE) },
    },
    {
      key: 'access',
      label: 'Access',
      icon: (active) => <AccessIcon active={active} />,
      onPress: () => { onTabChange('access'); navigate(SCREENS.ACCESS_REVEAL) },
    },
    {
      key: 'upsells',
      label: 'Upsells',
      icon: (active) => <UpsellsIcon active={active} />,
      onPress: () => { onTabChange('upsells'); navigate(SCREENS.UPSELLS) },
    },
  ]

  return (
    <div className="fixed bg-white border-t border-(--color-border-secondary) z-50" style={{ bottom: 0, height: 68, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 900 }}>
      <div className="flex h-full">
        {tabs.map(({ key, label, icon, onPress }) => {
          const active = activeTab === key
          return (
            <button
              key={key}
              onClick={onPress}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
            >
              {active && (
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-(--color-hostaway-secondary-600) rounded-b-full"/>
              )}
              <div className="relative">
                {icon(active)}
                {key === 'upsells' && cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-(--color-hostaway-secondary-600) rounded-full flex items-center justify-center px-[3px]">
                    <span className="text-[10px] font-bold text-white leading-none">{cartCount > 99 ? '99+' : cartCount}</span>
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-medium leading-tight ${active ? 'text-(--color-hostaway-secondary-600)' : 'text-(--color-gray-500)'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
