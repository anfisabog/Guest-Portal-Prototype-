// Shared upsell items — used on Homepage (horizontal scroll) and UpsellsTab (full-width vertical)
// requiresRequest: true — availability must be confirmed before payment is taken
export const upsellItems = [
  { id: 'early-checkin',    label: 'Early check-in',    description: 'Arrive early and settle in from 10:00 AM',        price: '€20',  unit: '',       image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&h=220&q=80' },
  { id: 'baby-cot',         label: 'Baby cot',          description: 'Cosy cot set up and ready before your arrival',    price: 'FREE', unit: '',       image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=400&h=220&q=80' },
  { id: 'parking',          label: 'Parking spot',      description: 'Reserved spot at Parque Flores, 2 min walk away',  price: '€8',   unit: '/day',  requiresRequest: true, image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=400&h=220&q=80' },
  { id: 'extend-stay',      label: 'Extend your stay',  description: 'Love it here? Add an extra night easily',           price: '€120', unit: '/night', requiresRequest: true, image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&h=220&q=80' },
  { id: 'late-checkout',    label: 'Late check-out',    description: 'Extra time to relax before you head off',           price: '€30',  unit: '',       requiresRequest: true, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&h=220&q=80' },
  { id: 'airport-transfer', label: 'Airport transfer',  description: 'Private car straight to the airport',               price: '€45',  unit: '', addedByOTA: true,         image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=400&h=220&q=80' },
  { id: 'walking-tour',     label: 'City walking tour', description: 'Explore the best hidden spots in Lisbon',           price: '€18',  unit: '/person',                       image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&h=220&q=80' },
]
