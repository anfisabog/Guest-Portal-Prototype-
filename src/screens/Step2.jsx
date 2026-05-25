import { useState } from 'react'
import { SCREENS } from '../screens'
import OciStepLayout from '../components/OciStepLayout'
import CountryBottomSheet from '../components/CountryBottomSheet'
import CardSelector from '../components/CardSelector'
import { InputField } from '@hostaway/design-system'
import { formatDate, validateDate, handleDateChange } from '../utils/dateUtils'

const DOC_OPTIONS = [
  { value: 'Passport', label: 'Passport', icon: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="3" width="20" height="22" rx="2" stroke="var(--color-fg-primary)" strokeWidth="1.5"/>
      <circle cx="14" cy="13" r="4" stroke="var(--color-fg-primary)" strokeWidth="1.3"/>
      <path d="M8 20h12" stroke="var(--color-fg-primary)" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )},
  { value: 'ID card', label: 'ID card', icon: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="7" width="24" height="14" rx="2" stroke="var(--color-fg-primary)" strokeWidth="1.5"/>
      <circle cx="9" cy="14" r="3" stroke="var(--color-fg-primary)" strokeWidth="1.3"/>
      <path d="M15 12h7M15 16h5" stroke="var(--color-fg-primary)" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )},
  { value: "Driver's license", label: "Driver's license", icon: (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="7" width="24" height="14" rx="2" stroke="var(--color-fg-primary)" strokeWidth="1.5"/>
      <circle cx="9" cy="15" r="2.5" stroke="var(--color-fg-primary)" strokeWidth="1.2"/>
      <path d="M14 12h8M14 16h6" stroke="var(--color-fg-primary)" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M6 10h6" stroke="var(--color-fg-primary)" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )},
]

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="14" r="6" stroke="var(--color-fg-primary)" strokeWidth="1.5"/>
      <path d="M15 9l5-5M20 4h-4M20 4v4" stroke="var(--color-fg-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
  { value: 'Female', label: 'Female', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="10" r="6" stroke="var(--color-fg-primary)" strokeWidth="1.5"/>
      <path d="M12 16v6M9 20h6" stroke="var(--color-fg-primary)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )},
  { value: 'Other', label: 'Other', icon: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="6" stroke="var(--color-fg-primary)" strokeWidth="1.5"/>
      <path d="M12 18v5M9 21h6" stroke="var(--color-fg-primary)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 7l4-4M21 3h-3M21 3v3" stroke="var(--color-fg-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
]

// Shared styles matching DS InputField visually
const triggerBase = 'w-full h-11 border border-(--color-border-primary) rounded-xl px-3.5 flex items-center bg-white font-[family-name:var(--font-body)] cursor-pointer'
const triggerLabel = 'flex items-center gap-0.5 text-[14px] font-medium text-(--color-fg-secondary) mb-1.5'

// Clear X button shown inside dropdown trigger when value is set
function ClearBtn({ onClear }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClear() }}
      className="w-6 h-6 rounded-full bg-(--color-bg-warm) flex items-center justify-center shrink-0"
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 1l6 6M7 1L1 7" stroke="var(--color-fg-secondary)" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </button>
  )
}

// Chevron shown when no value selected
const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6l4 4 4-4" stroke="var(--color-fg-quaternary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Date field helpers

function validateDocNumber(val, type) {
  if (!val) return null
  if (val.length < 5) return 'Too short — keep typing'
  if (!/^[A-Za-z0-9 \-]+$/.test(val)) return 'Only letters, numbers, spaces and hyphens'
  return null
}

// Document number meta per type
const DOC_META = {
  'Passport':         { label: 'Passport number',  placeholder: 'e.g. PT0123456' },
  'ID card':          { label: 'ID number',         placeholder: 'e.g. 12345678 3 ZZ1' },
  "Driver's license": { label: 'Licence number',    placeholder: 'e.g. SANTO801203MA9DL' },
}

// Fields shown only for Passport + ID card (not on driver's license)
const NEEDS_NATIONALITY = ['Passport', 'ID card']

export default function Step2({ navigate, onExit, progress = 50 }) {
  const [docType, setDocType]                     = useState('Passport')
  const [nationality, setNationality]             = useState('')
  const [countryOfIssue, setCountryOfIssue]       = useState('')
  const [sex, setSex]                             = useState('')

  // Controlled + validated fields
  const [docNumber, setDocNumber]       = useState('')
  const [docNumberError, setDocNumberError] = useState(null)
  const [dob, setDob]                   = useState('')
  const [dobError, setDobError]         = useState(null)
  const [issueDate, setIssueDate]       = useState('')
  const [issueDateError, setIssueDateError] = useState(null)
  const [expiryDate, setExpiryDate]     = useState('')
  const [expiryDateError, setExpiryDateError] = useState(null)

  const [showNationalityModal, setShowNationalityModal]       = useState(false)
  const [showCountryIssueModal, setShowCountryIssueModal]     = useState(false)

  const needsNationality = NEEDS_NATIONALITY.includes(docType)
  const { label: docNumLabel, placeholder: docNumPlaceholder } = DOC_META[docType]

  // Dropdown error states
  const [nationalityError, setNationalityError]           = useState(null)
  const [countryIssueError, setCountryIssueError]         = useState(null)
  const [sexError, setSexError]                           = useState(null)
  const [placeOfBirth, setPlaceOfBirth]                   = useState('')
  const [placeOfBirthError, setPlaceOfBirthError]         = useState(null)

  const fieldError = 'text-[12px] text-(--color-fg-error-primary) mt-1'
  const triggerClass = (hasError) =>
    `w-full h-11 border rounded-xl px-3.5 flex items-center bg-white font-[family-name:var(--font-body)] cursor-pointer transition-colors ${
      hasError ? 'border-(--color-border-error)' : 'border-(--color-border-primary)'
    }`

  function handleContinue() {
    let valid = true
    const fail = (setter, msg) => { setter(msg); valid = false }

    if (!docNumber.trim() || docNumberError) fail(setDocNumberError, docNumberError || `${docNumLabel} is required`)

    if (needsNationality) {
      if (!nationality)           fail(setNationalityError, 'Select your nationality')
      else                        setNationalityError(null)
    } else {
      if (!countryOfIssue)        fail(setCountryIssueError, 'Select the country that issued this document')
      else                        setCountryIssueError(null)
    }

    if (!dob)                     fail(setDobError, 'Date of birth is required')
    else if (dobError)            valid = false

    if (needsNationality) {
      if (!placeOfBirth.trim())   fail(setPlaceOfBirthError, 'Place of birth is required')
      else                        setPlaceOfBirthError(null)
      if (!sex)                   fail(setSexError, 'Select a gender option')
      else                        setSexError(null)
    }

    if (!issueDate)               fail(setIssueDateError, 'Issue date is required')
    else if (issueDateError)      valid = false
    if (!expiryDate)              fail(setExpiryDateError, 'Expiry date is required')
    else if (expiryDateError)     valid = false

    if (valid) navigate(SCREENS.STEP4)
  }

  return (
    <>
      {showNationalityModal && (
        <CountryBottomSheet
          title="Nationality"
          value={nationality}
          onChange={val => { setNationality(val); setNationalityError(null) }}
          onClose={() => setShowNationalityModal(false)}
        />
      )}
      {showCountryIssueModal && (
        <CountryBottomSheet
          title="Country of issue"
          value={countryOfIssue}
          onChange={val => { setCountryOfIssue(val); setCountryIssueError(null) }}
          onClose={() => setShowCountryIssueModal(false)}
        />
      )}

      <OciStepLayout
        title="Document"
        progress={progress}
        navigate={navigate}
        onExit={onExit}
        backTo={SCREENS.STEP1}
        onContinue={handleContinue}
        continueLabel="Continue"
      >
        <div className="px-5 pt-5 pb-12 flex flex-col gap-4">

          {/* ── Document type selector ── */}
          <div>
            <p className="text-[14px] font-medium text-(--color-fg-secondary) mb-3">Type</p>
            <CardSelector
              options={DOC_OPTIONS}
              value={docType}
              onChange={setDocType}
            />
          </div>

          {/* ── Document number (label changes per type) ── */}
          <InputField
            key={`doc-num-${docType}`}
            data-id="document-number"
            label={docNumLabel}
            placeholder={docNumPlaceholder}
            value={docNumber}
            onChange={val => {
              setDocNumber(val)
              setDocNumberError(validateDocNumber(val, docType))
            }}
            isInvalid={!!docNumberError}
            hint={docNumberError}
            isRequired
            fieldSize="full"
            labelPosition="top"
          />

          {/* ── Nationality + Country of residence — Passport & ID only ── */}
          {needsNationality && (
            <>
              <div>
                <label className={triggerLabel}>
                  Nationality<span className="text-(--color-hostaway-secondary-600)">*</span>
                </label>
                <div onClick={() => setShowNationalityModal(true)} className={triggerClass(!!nationalityError)}>
                  <span className={`flex-1 text-left text-[16px] font-normal leading-6 ${nationality ? 'text-(--color-fg-secondary)' : 'text-(--color-fg-tertiary)'}`}>
                    {nationality || 'Select nationality'}
                  </span>
                  {nationality && <ClearBtn onClear={() => setNationality('')} />}
                  <Chevron />
                </div>
                {nationalityError && <p className={fieldError}>{nationalityError}</p>}
              </div>

            </>
          )}

          {/* ── Country of issue — Driver's license only ── */}
          {!needsNationality && (
            <div>
              <label className={triggerLabel}>
                Country of issue<span className="text-(--color-hostaway-secondary-600)">*</span>
              </label>
              <div onClick={() => setShowCountryIssueModal(true)} className={triggerClass(!!countryIssueError)}>
                <span className={`flex-1 text-left text-[16px] font-normal leading-6 ${countryOfIssue ? 'text-(--color-fg-secondary)' : 'text-(--color-fg-tertiary)'}`}>
                  {countryOfIssue || 'Select country'}
                </span>
                {countryOfIssue && <ClearBtn onClear={() => setCountryOfIssue('')} />}
                <Chevron />
              </div>
              {countryIssueError && <p className={fieldError}>{countryIssueError}</p>}
            </div>
          )}

          {/* ── Date of birth — all types ── */}
          <InputField
            data-id="date-of-birth"
            label="Date of birth"
            placeholder="DD / MM / YYYY"
            value={dob}
            onChange={val => handleDateChange(val, setDob, setDobError)}
            isInvalid={!!dobError}
            hint={dobError}
            isRequired
            fieldSize="full"
            labelPosition="top"
          />

          {/* ── Place of birth — Passport & ID only ── */}
          {needsNationality && (
            <InputField
              data-id="place-of-birth"
              label="Place of birth"
              placeholder="e.g. Lisbon, Portugal"
              value={placeOfBirth}
              onChange={val => { setPlaceOfBirth(val); if (val.trim()) setPlaceOfBirthError(null) }}
              isInvalid={!!placeOfBirthError}
              hint={placeOfBirthError}
              isRequired
              fieldSize="full"
              labelPosition="top"
            />
          )}

          {/* ── Sex — Passport & ID only ── */}
          {needsNationality && (
            <div>
              <p className="text-[14px] font-medium text-(--color-fg-secondary) mb-3">Gender <span className="text-(--color-hostaway-secondary-600)">*</span></p>
              <CardSelector
                options={GENDER_OPTIONS}
                value={sex}
                onChange={v => { setSex(v); setSexError(null) }}
              />
              {sexError && <p className={fieldError}>{sexError}</p>}
            </div>
          )}

          {/* ── Issue date + Expiry date — all types ── */}
          <div className="flex gap-3">
            <div className="flex-1">
              <InputField
                data-id="issue-date"
                label="Issue date"
                placeholder="DD / MM / YYYY"
                value={issueDate}
                onChange={val => handleDateChange(val, setIssueDate, setIssueDateError)}
                isInvalid={!!issueDateError}
                hint={issueDateError}
                isRequired
                fieldSize="full"
                labelPosition="top"
              />
            </div>
            <div className="flex-1">
              <InputField
                data-id="expiry-date"
                label="Expiry date"
                placeholder="DD / MM / YYYY"
                value={expiryDate}
                onChange={val => handleDateChange(val, setExpiryDate, setExpiryDateError)}
                isInvalid={!!expiryDateError}
                hint={expiryDateError}
                isRequired
                fieldSize="full"
                labelPosition="top"
              />
            </div>
          </div>

        </div>
      </OciStepLayout>
    </>
  )
}
