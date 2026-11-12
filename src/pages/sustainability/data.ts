/**
 * Sustainability page content. The layout follows the Farm Fresh sustainability page the client referenced
 * (hero with reports, a commitment diagram, then one coloured band per pillar); the copy is Bestari's own.
 *
 * Facts come from content already on the site: certifications, the Banting facility and machinery from the IPO
 * proceeds, the employee share allocation, and the SC approval. Commitments are DRAFT copy for Bestari's
 * sign-off, and every figure still to be measured is a placeholder (a stat without `value`, rendered with <Ph>).
 */
import { asset, COMPANY, type ImageAsset } from '../../content/site'

export const HERO = {
  eyebrow: 'Sustainability',
  title: 'Good food, made responsibly.',
  lede: 'We’ve been making food in Malaysia since 2004, and we believe it should do good for the people and places we call home. Here’s how we’re growing Bestari, sustainably.',
  image: {
    src: asset('about-1.jpg'),
    alt: 'Hands slicing fresh aubergine beside bowls of whole spices',
  } satisfies ImageAsset,
}

export const COMMITMENT = {
  title: 'Our commitment',
  body: [
    'Sustainability is more than how we treat the land. It’s making sure every meal made with Bestari is safe, that our people and partners do well with us, and that we leave a lighter footprint as we grow.',
    'We focus on five pillars, guided by Bursa Malaysia’s sustainability framework.',
  ],
  ringCentre: ['Sustainable', 'outcomes'],
} as const

/** Band colour of a pillar section, and the colour of its segment in the commitment ring. */
export type PillarTone = 'brand' | 'sand' | 'saffron' | 'deep' | 'ink'

export interface Highlight {
  title: string
  text: string
}

export interface PillarStat {
  label: string
  /** Omitted while the figure is still being measured. */
  value?: string
}

export interface Pillar {
  /** Section anchor, e.g. "/sustainability#food-safety". */
  id: string
  number: string
  /** Bursa reporting area, shown as the eyebrow. */
  area: string
  /** Label on the commitment ring and the pillar links. */
  short: string
  title: string
  intro: string
  body: readonly string[]
  highlights: readonly Highlight[]
  stats?: readonly PillarStat[]
  image?: ImageAsset
  tone: PillarTone
}

export const PILLARS: readonly Pillar[] = [
  {
    id: 'food-safety',
    number: '01',
    area: 'Marketplace',
    short: 'Safe food',
    title: 'Safe, Halal food for every kitchen',
    intro:
      'Families and food businesses trust us with their meals, so food safety and Halal integrity come first in everything we make.',
    body: [
      'Every Bestari product is certified Halal by JAKIM, and our production runs on HACCP and ISO 22000 food safety management systems, audited by independent certification bodies.',
      'We blend our premixes in precise proportions, check ingredients as they arrive and batches before they leave, and keep every batch traceable from supplier to shelf.',
    ],
    highlights: [
      { title: '100% JAKIM Halal', text: 'Every product we make carries Malaysia’s Halal certification.' },
      { title: 'HACCP · ISO 22000', text: 'Certified food safety systems, from receiving ingredients to sealing each pack.' },
      { title: 'MeSTI · Buatan Malaysia', text: 'Recognised under MeSTI, and proudly made in Selangor since 2004.' },
    ],
    image: { src: asset('p-flour-original-1kg.png'), alt: 'Bestari Crispy Fried Chicken Coating Mix, 1 kg pack' },
    tone: 'brand',
  },
  {
    id: 'environment',
    number: '02',
    area: 'Environment',
    short: 'Lighter footprint',
    title: 'Making more with less',
    intro:
      'Good food shouldn’t cost the earth. We’re working to use less energy, water and packaging for every pack we make, and to waste less along the way.',
    body: [
      'Our new production facility in Banting is planned around integrated mixing and packaging lines, silo systems and automated palletising. Handling ingredients in bulk means fewer sacks, less spillage and fewer trips between process steps.',
      'We’re setting a baseline for our energy, water and waste now, so we can report our progress openly every year.',
    ],
    highlights: [
      { title: 'Bulk, not bags', text: 'Silo systems at Banting will take in key ingredients in bulk, cutting single-use sacks.' },
      { title: 'Less waste per batch', text: 'Precise blending and automated packing help us get more good packs from every batch.' },
      { title: 'Smarter packaging', text: 'We’re reviewing our packs to use less plastic, without compromising freshness.' },
    ],
    stats: [
      { label: 'energy use per tonne produced' },
      { label: 'water use per tonne produced' },
      { label: 'production waste diverted from landfill' },
    ],
    tone: 'sand',
  },
  {
    id: 'people',
    number: '03',
    area: 'Workplace',
    short: 'Our people',
    title: 'Growing with our people',
    intro:
      'Behind every pack is a team that makes it happen. We want every colleague to go home safe, and to keep learning while they’re with us.',
    body: [
      'Safety comes first on our production floor, with clear procedures, protective equipment and regular training for everyone who works on our lines.',
      'As we move into our new facility, we’re investing in skills, from running automated lines to food safety and Halal assurance, so our people grow with the business.',
    ],
    highlights: [
      { title: 'Safe workplaces', text: 'Safety briefings, protective gear and routine checks on every shift.' },
      { title: 'Skills for tomorrow', text: 'Training in food safety, Halal assurance and new automated equipment.' },
      { title: 'Shared success', text: 'Eligible employees were offered IPO shares, so our people can own a part of Bestari.' },
    ],
    stats: [{ label: 'employees' }, { label: 'training hours per employee' }, { label: 'lost-time injuries' }],
    tone: 'saffron',
  },
  {
    id: 'communities',
    number: '04',
    area: 'Community',
    short: 'Communities',
    title: 'Cooking up stronger communities',
    intro:
      'Bestari grew up in Malaysian kitchens. We give back by helping the cooks, small businesses and suppliers around us grow too.',
    body: [
      'Our commercial packs serve hawkers, restaurants, caterers and food manufacturers. Consistent, ready-to-cook premixes help small F&B businesses serve great food with less prep and less waste.',
      'We buy from local suppliers wherever we can, and work with distributors and resellers across Malaysia and abroad, creating income well beyond our own factory gates.',
    ],
    highlights: [
      { title: 'Small F&B, big flavour', text: 'Commercial packs that help hawkers and restaurants cook consistently and efficiently.' },
      { title: 'Partners nationwide', text: 'Distributors and resellers who bring Bestari to shops across Malaysia and abroad.' },
      { title: 'Recipes for everyone', text: 'Free recipe videos that help anyone cook a great meal at home.' },
    ],
    stats: [{ label: 'of ingredient spend with Malaysian suppliers' }, { label: 'distribution partners' }],
    tone: 'deep',
  },
  {
    id: 'governance',
    number: '05',
    area: 'Governance',
    short: 'Governance',
    title: 'Doing business the right way',
    intro:
      'Strong governance holds everything else together. As we join Bursa Malaysia’s Main Market, we’re building sustainability into how the Board runs the business.',
    body: [
      'In October 2026 the Securities Commission approved our Main Market listing and classified Bestari as Shariah-compliant.',
      'Our Board oversees sustainability, supported by management who track progress on the topics that matter most to our business and stakeholders. We’ll report on them every year in our Sustainability Statement.',
    ],
    highlights: [
      { title: 'Shariah-compliant', text: 'Classified Shariah-compliant by the Securities Commission Malaysia.' },
      { title: 'Board oversight', text: 'Sustainability risks and opportunities reviewed at Board level.' },
      { title: 'Ethics & integrity', text: 'Anti-bribery and whistleblowing policies for everyone we work with.' },
    ],
    tone: 'ink',
  },
]

export interface SustainabilityReport {
  title: string
  note: string
  /** PDF link; omitted until the report is published. */
  href?: string
}

export const REPORTS_SECTION = {
  id: 'reports',
  title: 'Sustainability reporting',
  lede: 'We’ll publish a Sustainability Statement every year with our Annual Report, starting with our first year as a listed company.',
} as const

export const REPORTS: readonly SustainabilityReport[] = [
  { title: 'Sustainability Statement 2026', note: 'Published with our Annual Report 2026' },
]

export const CONTACT = {
  title: 'Questions or ideas?',
  text: 'We’d love to hear from customers, partners and investors about how we can do better.',
  link: COMPANY.email,
} as const
