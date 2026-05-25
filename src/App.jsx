import { useState } from 'react'
import { SCREENS } from './screens'
import PreLogin from './screens/PreLogin'
import Homepage from './screens/Homepage'
import Step1 from './screens/Step1'
import Step2 from './screens/Step2'
import Step3Unlock from './screens/Step3Unlock'
import Step4Agreements from './screens/Step4Agreements'
import Step5Payment from './screens/Step5Payment'
import Step6Confirmation from './screens/Step6Confirmation'
import ArrivalGuide from './screens/ArrivalGuide'
import DoubleConfirmation from './screens/DoubleConfirmation'
import AccessReveal from './screens/AccessReveal'
import UpsellsTab from './screens/UpsellsTab'
import UpsellCheckout from './screens/UpsellCheckout'
import BottomTabBar from './components/BottomTabBar'
import BottomTabBarV2 from './components/BottomTabBarV2'
import CartFooter, { CART_FOOTER_HEIGHT } from './components/CartFooter'
import DevPanel from './components/DevPanel'

const FLOW_SCREENS = new Set([
  SCREENS.STEP1, SCREENS.STEP2, SCREENS.STEP3,
  SCREENS.STEP4, SCREENS.STEP5, SCREENS.STEP6,
  SCREENS.ARRIVAL_GUIDE, SCREENS.PRE_LOGIN,
  SCREENS.UPSELL_CHECKOUT,
])

export default function App() {
  const [screen, setScreen] = useState(SCREENS.PRE_LOGIN)
  const [showExitModal, setShowExitModal] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [checkInComplete, setCheckInComplete] = useState(false)
  const [formDirty, setFormDirty] = useState(false)
  const [demoMode, setDemoMode] = useState(true)
  const [showDevPanel, setShowDevPanel] = useState(false)
  const [tabBarVariant, setTabBarVariant] = useState('v2') // 'v1' | 'v2'
  const [checkInStarted, setCheckInStarted] = useState(false)
  const [checkInResumeStep, setCheckInResumeStep] = useState(null)
  const [upsellCheckoutContext, setUpsellCheckoutContext] = useState('upsell') // 'checkin' | 'upsell'
  const [cartItems, setCartItems] = useState([])

  const addToCart = (item) => {
    setCartItems(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item])
  }
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id))
  }

  const navigate = (to) => {
    if (to === SCREENS.HOMEPAGE) setActiveTab('home')
    else if (to === SCREENS.ACCESS_REVEAL) setActiveTab('access')
    // Reset dirty flag when starting check-in fresh
    if (to === SCREENS.STEP1) setFormDirty(false)
    setScreen(to)
  }

  const handleBuyNow = (item) => {
    // FREE items auto-confirmed in drawer — drawer calls onBuy to close, no checkout needed
    if (item.price === 'FREE') return
    setCartItems([{ ...item }])
    setUpsellCheckoutContext('upsell')
    navigate(SCREENS.UPSELL_CHECKOUT)
  }

  // Only show confirmation drawer if user actually changed something
  const handleExitCheckin = () => {
    if (formDirty) {
      setShowExitModal(true)
    } else {
      setScreen(SCREENS.HOMEPAGE)
      setActiveTab('home')
    }
  }

  const confirmExit = () => {
    setShowExitModal(false)
    setCheckInStarted(true)
    setCheckInResumeStep(screen) // resume from the exact step they saved on
    setScreen(SCREENS.HOMEPAGE)
    setActiveTab('home')
  }
  const cancelExit = () => setShowExitModal(false)

  const handleCheckInComplete = () => {
    setCheckInComplete(true)
    setCheckInStarted(false)
    setCheckInResumeStep(null)
    setActiveTab('access')
  }

  const showTabBar = !FLOW_SCREENS.has(screen)

  // Progress: 4 steps (25% each) base; 5 steps (20%) when upsell cart has items
  const hasUpsells = cartItems.length > 0
  const stepProgress = hasUpsells
    ? { step1: 20, step2: 40, step4: 60, step5: 80 }
    : { step1: 25, step2: 50, step4: 75, step5: 100 }

  const renderScreen = () => {
    switch (screen) {
      case SCREENS.PRE_LOGIN:
        return <PreLogin navigate={navigate} />
      case SCREENS.HOMEPAGE:
        return <Homepage navigate={navigate} checkInComplete={checkInComplete} demoMode={demoMode} onOpenDevPanel={() => setShowDevPanel(true)} tabBarVariant={tabBarVariant} onBuyNow={handleBuyNow} checkInStarted={checkInStarted} checkInResumeStep={checkInResumeStep} />
      case SCREENS.STEP1:
        return <Step1 navigate={navigate} onExit={handleExitCheckin} onFormDirty={() => setFormDirty(true)} onAddToCart={addToCart} onRemoveFromCart={removeFromCart} progress={stepProgress.step1} />
      case SCREENS.STEP2:
        return <Step2 navigate={navigate} onExit={handleExitCheckin} onFormDirty={() => setFormDirty(true)} progress={stepProgress.step2} />
      case SCREENS.STEP3:
        return <Step3Unlock navigate={navigate} onExit={handleExitCheckin} />
      case SCREENS.STEP4:
        return <Step4Agreements navigate={navigate} onExit={handleExitCheckin} progress={stepProgress.step4} />
      case SCREENS.STEP5:
        return <Step5Payment navigate={navigate} onExit={handleExitCheckin} progress={stepProgress.step5}
          onContinue={() => navigate(SCREENS.STEP6)}
          cartItems={cartItems}
          onRemoveFromCart={removeFromCart}
        />
      case SCREENS.STEP6:
        return <Step6Confirmation navigate={navigate} onCheckInComplete={handleCheckInComplete} />
      case SCREENS.ARRIVAL_GUIDE:
        return <ArrivalGuide navigate={navigate} />
      case SCREENS.ACCESS_REVEAL:
        return <AccessReveal navigate={navigate} checkInComplete={checkInComplete} demoMode={demoMode} checkInStarted={checkInStarted} checkInResumeStep={checkInResumeStep} onBuyNow={handleBuyNow} />
      case SCREENS.UPSELLS:
        return <UpsellsTab tabBarVariant={tabBarVariant} navigate={navigate} onBuyNow={handleBuyNow} />
      case SCREENS.UPSELL_CHECKOUT:
        return <UpsellCheckout
          context={upsellCheckoutContext}
          cartItems={cartItems}
          onRemoveFromCart={removeFromCart}
          navigate={navigate}
          onExit={handleExitCheckin}
          onConfirm={() => navigate(upsellCheckoutContext === 'checkin' ? SCREENS.STEP6 : SCREENS.UPSELLS)}
        />
      default:
        return <PreLogin navigate={navigate} />
    }
  }

  const screenContent = (
    <>
      {renderScreen()}
      {showTabBar && (tabBarVariant === 'v2'
        ? <BottomTabBarV2 activeTab={activeTab} onTabChange={setActiveTab} navigate={navigate} />
        : <BottomTabBar   activeTab={activeTab} onTabChange={setActiveTab} navigate={navigate} />
      )}
      {showExitModal && (
        <DoubleConfirmation onConfirm={confirmExit} onCancel={cancelExit} />
      )}
      {showDevPanel && (
        <DevPanel
          demoMode={demoMode}
          setDemoMode={setDemoMode}
          guidebooksEnabled={false}
          setGuidebooksEnabled={() => {}}
          tabBarVariant={tabBarVariant}
          setTabBarVariant={setTabBarVariant}
          onClose={() => setShowDevPanel(false)}
        />
      )}
    </>
  )

  return (
    <div id="phone-shell-portal" className="phone-shell">
      {screenContent}
    </div>
  )
}
