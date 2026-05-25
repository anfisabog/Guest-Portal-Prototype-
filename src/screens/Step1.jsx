import { useState } from 'react'
import { SCREENS } from '../screens'
import OciStepLayout from '../components/OciStepLayout'
import ArrivalTimeBottomSheet from '../components/ArrivalTimeBottomSheet'
import CardSelector from '../components/CardSelector'
import InfoBanner from '../components/InfoBanner'
import { InputField } from '@hostaway/design-system'
import { handleDateChange, validateDate } from '../utils/dateUtils'

const TRAVEL_OPTIONS = () => [
  { value: 'Leisure',  label: 'Leisure',  icon: `${import.meta.env.BASE_URL}icon-umbrella.svg` },
  { value: 'Business', label: 'Business', icon: `${import.meta.env.BASE_URL}icon-briefcase.svg` },
  { value: 'Both',     label: 'Both',     icon: `${import.meta.env.BASE_URL}icon-luggage.svg` },
]

// Sorted longest-prefix-first for correct matching (e.g. +351 before +35)
const PHONE_PREFIXES = [
  ['+1268','🇦🇬'],['+1284','🇻🇬'],['+1340','🇻🇮'],['+1345','🇰🇾'],
  ['+1441','🇧🇲'],['+1473','🇬🇩'],['+1649','🇹🇨'],['+1664','🇲🇸'],
  ['+1670','🇲🇵'],['+1671','🇬🇺'],['+1684','🇦🇸'],['+1721','🇸🇽'],
  ['+1758','🇱🇨'],['+1767','🇩🇲'],['+1784','🇻🇨'],['+1809','🇩🇴'],
  ['+1868','🇹🇹'],['+1869','🇰🇳'],['+1876','🇯🇲'],
  ['+351','🇵🇹'],['+352','🇱🇺'],['+353','🇮🇪'],['+354','🇮🇸'],
  ['+355','🇦🇱'],['+356','🇲🇹'],['+357','🇨🇾'],['+358','🇫🇮'],
  ['+359','🇧🇬'],['+370','🇱🇹'],['+371','🇱🇻'],['+372','🇪🇪'],
  ['+380','🇺🇦'],['+381','🇷🇸'],['+385','🇭🇷'],['+386','🇸🇮'],
  ['+420','🇨🇿'],['+421','🇸🇰'],['+971','🇦🇪'],['+972','🇮🇱'],
  ['+212','🇲🇦'],['+213','🇩🇿'],['+216','🇹🇳'],['+218','🇱🇾'],
  ['+220','🇬🇲'],['+221','🇸🇳'],['+234','🇳🇬'],['+254','🇰🇪'],
  ['+255','🇹🇿'],['+256','🇺🇬'],['+261','🇲🇬'],['+263','🇿🇼'],
  ['+20','🇪🇬'],['+27','🇿🇦'],['+30','🇬🇷'],['+31','🇳🇱'],
  ['+32','🇧🇪'],['+33','🇫🇷'],['+34','🇪🇸'],['+36','🇭🇺'],
  ['+39','🇮🇹'],['+40','🇷🇴'],['+41','🇨🇭'],['+43','🇦🇹'],
  ['+44','🇬🇧'],['+45','🇩🇰'],['+46','🇸🇪'],['+47','🇳🇴'],
  ['+48','🇵🇱'],['+49','🇩🇪'],['+51','🇵🇪'],['+52','🇲🇽'],
  ['+54','🇦🇷'],['+55','🇧🇷'],['+56','🇨🇱'],['+57','🇨🇴'],
  ['+58','🇻🇪'],['+60','🇲🇾'],['+61','🇦🇺'],['+62','🇮🇩'],
  ['+63','🇵🇭'],['+64','🇳🇿'],['+65','🇸🇬'],['+66','🇹🇭'],
  ['+81','🇯🇵'],['+82','🇰🇷'],['+84','🇻🇳'],['+86','🇨🇳'],
  ['+90','🇹🇷'],['+91','🇮🇳'],['+92','🇵🇰'],['+98','🇮🇷'],
  ['+7','🇷🇺'],['+1','🇺🇸'],
]

function detectFlag(phone) {
  if (!phone.startsWith('+')) return null
  for (const [prefix, flag] of PHONE_PREFIXES) {
    if (phone.startsWith(prefix)) return flag
  }
  return null
}

function validatePhone(val) {
  if (!val.trim()) return 'Enter your phone number'
  if (!val.startsWith('+')) return 'Include country code — e.g. +351 912 345 678'
  if (val.replace(/\D/g, '').length < 8) return 'Number too short — check and try again'
  return null
}

function validateEmail(val) {
  if (!val.trim()) return 'Enter your email address'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "That doesn't look right — check your email"
  return null
}

const triggerClass = (hasError) =>
  `w-full h-11 border rounded-xl px-3.5 flex items-center bg-white font-[family-name:var(--font-body)] cursor-pointer transition-colors ${
    hasError ? 'border-(--color-border-error)' : 'border-(--color-border-primary)'
  }`
const triggerLabel = 'flex items-center gap-0.5 text-[14px] font-medium text-(--color-fg-secondary) mb-1.5'
const fieldError   = 'text-[12px] text-(--color-fg-error-primary) mt-1'

export default function Step1({ navigate, onExit, onFormDirty, onAddToCart, onRemoveFromCart, progress = 25 }) {
  const [purpose, setPurpose]               = useState('Leisure')
  const [showWhyBanner, setShowWhyBanner]   = useState(true)

  // Personal details
  const [firstName, setFirstName]           = useState('Maria')
  const [firstNameError, setFirstNameError] = useState(null)
  const [lastName, setLastName]             = useState('Santos')
  const [lastNameError, setLastNameError]   = useState(null)
  const [email, setEmail]                   = useState('maria.santos@gmail.com')
  const [emailError, setEmailError]         = useState(null)
  const [phone, setPhone]                   = useState('+351 912 345 678')
  const [phoneError, setPhoneError]         = useState(null)
  const [phoneCode, setPhoneCode]           = useState('+351')
  const [phoneFlag2, setPhoneFlag2]         = useState('🇵🇹')
  const [dob, setDob]                       = useState('')
  const [dobError, setDobError]             = useState(null)

  // Contact details
  const [postalCode, setPostalCode]         = useState('')
  const [postalCodeError, setPostalCodeError] = useState(null)
  const [city, setCity]                     = useState('')
  const [cityError, setCityError]           = useState(null)
  const [streetAddress, setStreetAddress]   = useState('')
  const [streetAddressError, setStreetAddressError] = useState(null)

  // Personalize your stay
  const [arrivalTime, setArrivalTime]       = useState('')
  const [arrivalError, setArrivalError]     = useState(null)
  const [isEarlyArrival, setIsEarlyArrival] = useState(false)
  const [showArrivalSheet, setShowArrivalSheet] = useState(false)

  const [carNumber, setCarNumber]           = useState('')

  const phoneFlag = detectFlag(phone) || phoneFlag2
  const phonePlaceholder = `${phoneCode} (___) ___ - ____`

  function handleContinue() {
    let valid = true
    const fail = (setter, msg) => { setter(msg); valid = false }

    if (!firstName.trim())      fail(setFirstNameError, 'First name is required')
    else                        setFirstNameError(null)
    if (!lastName.trim())       fail(setLastNameError, 'Last name is required')
    else                        setLastNameError(null)

    const emailErr = validateEmail(email)
    if (emailErr)               fail(setEmailError, emailErr)
    else                        setEmailError(null)

    const phoneErr = validatePhone(phone)
    if (phoneErr)               fail(setPhoneError, phoneErr)
    else                        setPhoneError(null)

    if (!dob)                   fail(setDobError, 'Date of birth is required')
    else if (dobError)          valid = false

    setPostalCodeError(null)
    setCityError(null)
    setStreetAddressError(null)

    if (!arrivalTime)           fail(setArrivalError, 'Select your estimated arrival time')
    else                        setArrivalError(null)

    if (valid) { onFormDirty?.(); navigate(SCREENS.STEP2) }
  }

  return (
    <>
      {showArrivalSheet && (
        <ArrivalTimeBottomSheet
          value={arrivalTime}
          onChange={val => { setArrivalTime(val); setArrivalError(null) }}
          onClose={() => setShowArrivalSheet(false)}
          onSelectEarlySlot={(isEarly) => {
            setIsEarlyArrival(isEarly)
            if (isEarly) {
              onAddToCart?.({ id: 'early-checkin', label: 'Early check-in', price: '€25', unit: '' })
            } else {
              onRemoveFromCart?.('early-checkin')
            }
          }}
        />
      )}
      <OciStepLayout
        title="Personal details"
        progress={progress}
        navigate={navigate}
        onExit={onExit}
        hideBack
        onContinue={handleContinue}
        continueLabel="Continue"
      >
      <div className="px-5 pt-5 pb-12 flex flex-col gap-4">

        {/* Compliance banner */}
        {showWhyBanner && (
          <InfoBanner
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L3 5.5V10c0 4 3.1 7.4 7 8 3.9-.6 7-4 7-8V5.5L10 2z" stroke="var(--color-fg-primary)" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            }
            title="Why do we ask these questions?"
            description="We are required by law to send guest details to local authorities."
            onClose={() => setShowWhyBanner(false)}
          />
        )}

        {/* ── Personal details ── */}
        <InputField data-id="first-name" label="First name" placeholder="e.g. Maria"
          value={firstName} onChange={val => { setFirstName(val); if (val.trim()) setFirstNameError(null) }}
          isInvalid={!!firstNameError} hint={firstNameError}
          isRequired fieldSize="full" labelPosition="top" />
        <InputField data-id="last-name" label="Last name" placeholder="e.g. Santos"
          value={lastName} onChange={val => { setLastName(val); if (val.trim()) setLastNameError(null) }}
          isInvalid={!!lastNameError} hint={lastNameError}
          isRequired fieldSize="full" labelPosition="top" />

        <InputField data-id="email-address" label="Email address" placeholder="e.g. name@email.com"
          value={email} type="email"
          onChange={val => { setEmail(val); if (emailError) setEmailError(validateEmail(val)) }}
          isInvalid={!!emailError} hint={emailError} isRequired fieldSize="full" labelPosition="top" />

        {/* Phone — flag prefix + formatted placeholder */}
        <div>
          <label className={triggerLabel}>
            Phone number <span className="text-(--color-hostaway-secondary-600)">*</span>
          </label>
          <div className={`h-11 border rounded-xl flex items-center bg-white overflow-hidden transition-colors focus-within:border-(--color-fg-primary) ${
            phoneError ? 'border-(--color-border-error)' : 'border-(--color-border-primary)'
          }`}>
            {/* Flag only — no chevron (country picker not yet functional) */}
            <div className="pl-3.5 pr-2 flex items-center shrink-0">
              <span className="text-[18px] leading-none">{phoneFlag}</span>
            </div>
            {/* Number input */}
            <input
              type="tel"
              value={phone}
              onChange={e => {
                const val = e.target.value
                setPhone(val)
                // Track country code for placeholder
                const match = PHONE_PREFIXES.find(([p]) => val.startsWith(p))
                if (match) { setPhoneCode(match[0]); setPhoneFlag2(match[1]) }
                if (phoneError) setPhoneError(validatePhone(val))
              }}
              placeholder={phonePlaceholder}
              className="flex-1 h-full pr-3.5 text-[16px] font-normal text-(--color-fg-primary) placeholder:text-(--color-fg-tertiary) bg-transparent outline-none font-[family-name:var(--font-body)]"
            />
          </div>
          {phoneError && <p className={fieldError}>{phoneError}</p>}
        </div>

        <InputField data-id="date-of-birth-step1" label="Date of birth" placeholder="DD / MM / YYYY"
          value={dob} onChange={val => handleDateChange(val, setDob, setDobError)}
          isInvalid={!!dobError} hint={dobError} isRequired fieldSize="full" labelPosition="top" />

        {/* ── Contact details ── */}
        <div className="h-px bg-(--color-border-secondary) mt-2"/>
        <h2 className="text-[20px] font-semibold text-(--color-fg-primary) leading-[30px] -mb-1">Contact details</h2>

        <div className="flex gap-3">
          <div className="w-[130px]">
            <InputField data-id="postal-code" label="Postal code" placeholder="1000-001"
              value={postalCode} onChange={val => { setPostalCode(val); if (val.trim()) setPostalCodeError(null) }}
              isInvalid={!!postalCodeError} hint={postalCodeError} fieldSize="full" labelPosition="top" />
          </div>
          <div className="flex-1">
            <InputField data-id="city" label="City" placeholder="Amsterdam"
              value={city} onChange={val => { setCity(val); if (val.trim()) setCityError(null) }}
              isInvalid={!!cityError} hint={cityError} fieldSize="full" labelPosition="top" />
          </div>
        </div>

        <InputField data-id="street-address" label="Street address" placeholder="Enter address"
          value={streetAddress} onChange={val => { setStreetAddress(val); if (val.trim()) setStreetAddressError(null) }}
          isInvalid={!!streetAddressError} hint={streetAddressError} fieldSize="full" labelPosition="top" />

        {/* ── Personalize your stay ── */}
        <div className="h-px bg-(--color-border-secondary) mt-2"/>
        <h2 className="text-[20px] font-semibold text-(--color-fg-primary) leading-[30px] -mb-1">Personalize your stay</h2>

        {/* Estimated arrival time */}
        <div>
          <label className={triggerLabel}>
            Estimated arrival time <span className="text-(--color-hostaway-secondary-600)">*</span>
          </label>
          <div onClick={() => setShowArrivalSheet(true)} className={triggerClass(!!arrivalError)}>
            <span className={`flex-1 text-left text-[16px] font-normal leading-6 ${arrivalTime ? 'text-(--color-fg-secondary)' : 'text-(--color-fg-tertiary)'}`}>
              {arrivalTime || 'Select time'}
            </span>
            {arrivalTime && isEarlyArrival && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-(--color-bg-warning-secondary) text-(--color-fg-warning) shrink-0 mr-1.5">
                extra fee
              </span>
            )}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="var(--color-fg-quaternary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {arrivalError && <p className={fieldError}>{arrivalError}</p>}
        </div>

        {/* Travel purpose */}
        <div>
          <p className="text-[14px] font-medium text-(--color-fg-secondary) mb-3">Travel purpose</p>
          <CardSelector
            options={TRAVEL_OPTIONS()}
            value={purpose}
            onChange={(v) => { setPurpose(v); onFormDirty?.() }}
          />
        </div>

        {/* Car registration — optional */}
        <InputField data-id="car-number" label="Car registration" placeholder="e.g. AB-12-CD"
          value={carNumber} onChange={setCarNumber} fieldSize="full" labelPosition="top" />

      </div>
      </OciStepLayout>
    </>
  )
}
