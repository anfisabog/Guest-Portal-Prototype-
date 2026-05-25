export function formatDate(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0,2)} / ${digits.slice(2)}`
  return `${digits.slice(0,2)} / ${digits.slice(2,4)} / ${digits.slice(4)}`
}

export function validateDate(val) {
  if (!val) return null
  if (/[a-zA-Z]/.test(val)) return 'Use numbers only — DD / MM / YYYY'
  const digits = val.replace(/\D/g, '')
  if (!digits) return null
  if (digits.length < 8) return 'Enter a complete date (DD / MM / YYYY)'
  const dd = parseInt(digits.slice(0,2))
  const mm = parseInt(digits.slice(2,4))
  const yyyy = parseInt(digits.slice(4,8))
  if (dd < 1 || dd > 31) return 'Day must be 01–31'
  if (mm < 1 || mm > 12) return 'Month must be 01–12'
  if (yyyy < 1900 || yyyy > 2100) return 'Enter a valid year'
  return null
}

export function handleDateChange(raw, setter, errorSetter) {
  if (/[a-zA-Z]/.test(raw)) {
    setter(raw)
    errorSetter('Use numbers only — DD / MM / YYYY')
  } else {
    const formatted = formatDate(raw)
    setter(formatted)
    errorSetter(validateDate(formatted))
  }
}
