/**
 * About Us content, copied verbatim from the handoff's "Bestari About.html".
 * Backgrounds are CSS colour values (tokens or the handoff's per-product hexes).
 */
import { ROUTES, type LinkItem } from '../../content/site'

export type HeroPackId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

/** Floating packshot in the hero. Its position, size and tilt come from `.pk.<id>` in about.css. */
export interface HeroPack {
  id: HeroPackId
  file: string
}

export const HERO_PACKS: readonly HeroPack[] = [
  { id: 'a', file: 'p-flour-original-1kg.png' },
  { id: 'b', file: 'p-curry-meat.png' },
  { id: 'c', file: 'p-saltedegg-800g.png' },
  { id: 'd', file: 'p-chickenstock-1kg.png' },
  { id: 'e', file: 'p-tempura-500g.png' },
  { id: 'f', file: 'p-banana-1kg.png' },
]

export const HERO_LINES = { first: 'We are', second: 'Bestari.' } as const

export const HERO_CAPTIONS: readonly string[] = ['About us', 'Mudah dan sedap · Since 2004', 'Let’s makan together']

/** A run of the purpose statement. Highlighted runs are maroon. */
export interface PurposeSegment {
  text: string
  isHighlight?: boolean
}

export const PURPOSE_SEGMENTS: readonly PurposeSegment[] = [
  {
    text: 'Every great meal starts with incredible ingredients, and ours begins with our name. We make super easy, ready-to-cook, ',
  },
  { text: 'Halal', isHighlight: true },
  { text: ' food products so that ' },
  { text: 'everyone can cook delicious food easily', isHighlight: true },
  { text: ', and families can spend more time together.' },
]

export interface HistoryCard {
  id: string
  /** The big serif word or year at the top of the card. */
  label: string
  title: string
  body: string
  /** Omitted for the dashed "future" card. */
  background?: string
  image?: string
  tag?: string
  isFuture?: boolean
}

export const HISTORY_CARDS: readonly HistoryCard[] = [
  {
    id: 'founded',
    label: '2004',
    title: 'Once upon a coating mix…',
    body: 'The Bestari brand is established with its Crispy Fried Chicken Coating Mix, our multipurpose crispy frying flour mix.',
    background: '#E89A1C',
    image: 'p-flour-original-1kg.png',
  },
  {
    id: 'grow',
    label: 'Grow',
    title: 'From one mix to a full pantry',
    body: 'Curry premixes, salted egg, tempura, chicken stock, batters, desserts and pantry staples join the family.',
    background: 'var(--maroon)',
    image: 'p-curry-meat.png',
  },
  {
    id: 'superbrands',
    label: '2020',
    title: 'Superbrands, Malaysia’s Choice',
    body: 'Our frying flour mix is recognised as a Superbrand by Malaysian consumers.',
    background: '#C8861A',
    tag: 'Award',
  },
  {
    id: 'today',
    label: 'Today',
    title: 'Category leader',
    body: 'Our coating mix leads its category in Malaysia, and is a favourite with homes and the HORECA industry.',
    background: 'var(--green)',
    image: 'p-chickenstock-1kg.png',
  },
  {
    id: 'bursa',
    label: '2026',
    title: 'Ready for Bursa',
    body: 'In Oct 2026 the SC approved our Main Market listing and classified us Shariah-compliant.',
    background: 'var(--ink)',
    tag: 'Milestone',
  },
  {
    id: 'next',
    label: 'Next',
    title: 'And the story continues…',
    body: 'A new production facility in Banting, ingredient processing, and new flavours to make more meals mudah dan sedap.',
    isFuture: true,
  },
]

export const TRIO_WORDS: readonly string[] = ['Mudah.', 'Sedap.', 'Bersama.']

export interface LabelledText {
  label: string
  text: string
}

export const TRIO_ROWS: readonly LabelledText[] = [
  { label: 'Mudah', text: 'Quick, simple methods for tasty food with minimal effort.' },
  { label: 'Sedap', text: 'Passionate recipes that deliver the essence of a great meal.' },
  { label: 'Bersama', text: 'Food that helps people spend time together. Let’s makan!' },
]

export interface BusinessPanel {
  id: string
  number: string
  title: string
  body: string
  background: string
  /** Packshot revealed when the panel is active. */
  image?: string
  /** Dashed photo placeholder shown instead of a packshot. */
  photoPlaceholder?: string
}

export const BUSINESS_PANELS: readonly BusinessPanel[] = [
  {
    id: 'premixes',
    number: '01',
    title: 'Food premixes',
    body: 'Seasoned flour, seasoning and food base premixes, blended in precise proportions. Sold in retail packs and larger commercial packs.',
    background: 'var(--maroon)',
    image: 'p-flour-mala-520g.png',
  },
  {
    id: 'ingredients',
    number: '02',
    title: 'Food ingredients',
    body: 'Supply of food ingredients such as starches, spices, Himalayan rock salt and flavour enhancers.',
    background: '#C8861A',
    image: 'p-spices.png',
  },
  {
    id: 'equipment',
    number: '03',
    title: 'Processing equipment',
    body: 'Supply of food processing and production equipment to food manufacturers.',
    background: 'var(--green)',
    photoPlaceholder: '[ processing equipment photo ]',
  },
  {
    id: 'maintenance',
    number: '04',
    title: 'Parts & maintenance',
    body: 'Sales of spare parts and maintenance services to keep our customers’ lines running.',
    background: 'var(--ink)',
    photoPlaceholder: '[ service team photo ]',
  },
]

export const MARQUEE_FACTS: readonly string[] = [
  'Since 2004',
  '100% JAKIM Halal',
  '#1 Crispy Coating Mix',
  'HACCP · ISO 22000',
  'Buatan Malaysia',
  'Superbrands 2020',
]

export interface Stat {
  value: string
  label: string
}

export const HQ_STATS: readonly Stat[] = [
  { value: '67,465', label: 'sq ft built-up area' },
  { value: '~10 acres', label: 'planned new site, Banting' },
  { value: '2', label: 'channels: retail & commercial' },
  { value: '100%', label: 'products JAKIM Halal' },
]

export interface Leader {
  name: string
  role: string
  /** True while the title is still to be confirmed from the prospectus. */
  isRolePlaceholder?: boolean
  background: string
}

export const LEADERS: readonly Leader[] = [
  { name: 'Lai Kok Siong', role: 'Managing Director', background: 'var(--maroon)' },
  { name: 'Gabriel Lai Yung-Yao', role: 'Head of Sales & Marketing', background: 'var(--green)' },
  { name: 'Gary Lai Yung-Hui', role: 'Head of Production', background: '#C8861A' },
  { name: 'Fong Zhoon Zhien', role: 'Title per prospectus', isRolePlaceholder: true, background: 'var(--ink)' },
  { name: 'Chang Kok Leong', role: 'Title per prospectus', isRolePlaceholder: true, background: 'var(--maroon-deep)' },
]

/** "You may also like" card: `label` is the card title. */
export interface AlsoLikeCard extends LinkItem {
  eyebrow: string
  background: string
}

export const ALSO_LIKE: readonly AlsoLikeCard[] = [
  {
    href: ROUTES.investors,
    eyebrow: 'Investor Relations',
    label: 'IPO, board & financials',
    background: 'var(--green-deep)',
  },
  { href: ROUTES.shop, eyebrow: 'shop.bestarifood.com', label: 'Shop our products', background: 'var(--maroon)' },
]
