/** Central store profile + commerce rules, reused across checkout and the receipt. */

export const STORE = {
  name: 'Chaudhry Sanitary, Electric & Hardware',
  shortName: 'Chaudhry',
  tagline: 'Sanitary · Electric · Hardware',
  address: 'Main Bazar, Model Town',
  city: 'Lahore, Punjab, Pakistan',
  phones: ['+92 300 1234567', '+92 42 35601234'],
  whatsapp: '923001234567',
  email: 'info@chaudhry.pk',
  website: 'www.chaudhry.pk',
  ntn: '1234567-8', // National Tax Number (demo)
} as const;

export const DELIVERY = {
  /** Orders at or above this subtotal ship free. */
  freeThreshold: 5000,
  fee: 250,
} as const;

/** Promo codes accepted at checkout → percentage discount off the subtotal. */
export const PROMO_CODES: Record<string, { percent: number; label: string }> = {
  CHAUDHRY10: { percent: 10, label: '10% off — thank-you offer' },
  WELCOME5: { percent: 5, label: '5% off — new customer' },
  BUILD15: { percent: 15, label: '15% off — bulk hardware' },
};
