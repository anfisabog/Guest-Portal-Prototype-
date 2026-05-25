/**
 * Formats a price string to always show 2 decimal places.
 * "€20" → "€20.00"  |  "€8" → "€8.00"  |  "FREE" → "FREE"
 */
export function formatPrice(price) {
  if (!price || price === 'FREE') return price
  const match = price.match(/^([^0-9]*)([0-9.]+)(.*)$/)
  if (!match) return price
  const [, symbol, num, suffix] = match
  return `${symbol}${parseFloat(num).toFixed(2)}${suffix}`
}
