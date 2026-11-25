/**
 * Home page content, ported from "Bestari Corporate & IPO.html" (design handoff).
 * Video titles and the two non-IPO news links are placeholders from the handoff and must be replaced.
 */
import { asset, IR_MENU, ROUTES, type ImageAsset, type NavItem } from '../../content/site'

/** Centre links of the transparent home header. */
export const HEADER_LINKS: NavItem[] = [
  { label: 'Our Brands', href: '#brands' },
  { label: 'About Us', href: ROUTES.about },
  { label: 'Products', href: ROUTES.products },
  { label: 'Investor Relations', href: ROUTES.investors, children: IR_MENU },
  { label: 'Sustainability', href: ROUTES.sustainability },
]

/** The header turns solid once the page has scrolled this share of the viewport height. */
export const HEADER_SOLID_RATIO = 0.85

/** Scrolling more than this many pixels gives the header a green backdrop over the hero, so the slogan never shows through the links. */
export const HEADER_SCRIM_OFFSET_PX = 8

// ---------- Hero slider (first screen) ----------

export const HERO_SLIDE_INTERVAL_MS = 5000
export const HERO_SLIDE_STORAGE_KEY = 'bestari.home.hero-slide'

export interface HeroPack {
  src: string
  alt: string
}

export interface HeroSlide {
  id: string
  /** Background: deep Pantone 342C green or the light neutral. */
  tone: 'deep' | 'light'
  eyebrow: string
  title: string
  href: string
  linkLabel: string
  /** Shown left to right; phones show the first two. */
  packs: readonly HeroPack[]
}

const pack = (file: string, alt: string): HeroPack => ({ src: asset(file), alt })

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: 'frying',
    tone: 'deep',
    eyebrow: 'Bestari · Since 2004',
    title: 'Multipurpose Crispy Frying Flour Mix',
    href: ROUTES.products,
    linkLabel: 'View frying flours',
    packs: [
      pack('p-flour-original-1kg.png', 'Bestari Crispy Frying Flour Mix, Original 1 kg pack'),
      pack('p-flour-hot-1kg.png', 'Bestari Crispy Frying Flour Mix, Hot and Spicy 1 kg pack'),
      pack('p-flour-garlic-1kg.png', 'Bestari Crispy Frying Flour Mix, Garlic 1 kg pack'),
      pack('p-flour-mala-520g.png', 'Bestari Crispy Frying Flour Mix, Mala 520 g pack'),
    ],
  },
  {
    id: 'seasonings',
    tone: 'light',
    eyebrow: 'Seasonings & stocks',
    title: 'Stocks, premixes and seasonings',
    href: ROUTES.products,
    linkLabel: 'View seasonings',
    packs: [
      pack('p-chickenstock-1kg.png', 'Bestari Chicken Stock, 1 kg pack'),
      pack('p-rasasedap-230g.png', 'Bestari Rasa Sedap All-in-One Seasoning, 230 g pack'),
      pack('p-curry-meat.png', 'Bestari Instant Curry Powder Premix pack'),
      pack('p-saltedegg-800g.png', 'Bestari Golden Salted Egg Seasoning, 800 g pack'),
    ],
  },
  {
    id: 'sides',
    tone: 'deep',
    eyebrow: 'Batters, kuih & sides',
    title: 'Banana fritters, cucur, custard and more',
    href: ROUTES.products,
    linkLabel: 'View the range',
    packs: [
      pack('p-banana-1kg.png', 'Bestari Banana Fritter Batter, 1 kg pack'),
      pack('p-cucur.png', 'Bestari Cucur Udang premix, 160 g pack'),
      pack('p-custard.png', 'Bestari Custard Powder pack'),
      pack('p-mashed.png', 'Bestari Instant Mashed Potatoes with Black Pepper Gravy pack'),
    ],
  },
  {
    id: 'pantry',
    tone: 'light',
    eyebrow: 'Pantry staples',
    title: 'Rock salt, spices, starch and MSG',
    href: ROUTES.products,
    linkLabel: 'View pantry staples',
    packs: [
      pack('p-salt.png', 'Bestari Iodised Himalayan Rock Salt, 350 g pack'),
      pack('p-spices.png', 'Bestari Serbuk Cili chilli powder, 100 g pack'),
      pack('p-starch.png', 'Bestari Potato Starch, 350 g pack'),
      pack('p-msg.png', 'Bestari Flavour Enhancer MSG, 1 kg pack'),
    ],
  },
]

// ---------- Slogan hero ----------

export type FloatSlot = 'f1' | 'f2' | 'f3' | 'f4'

export interface FloatingPack {
  slot: FloatSlot
  image: string
  /** Parallax depth in px: the pack moves up to half of this with the mouse (sign sets the direction). */
  depth: number
}

export const FLOATING_PACKS: FloatingPack[] = [
  { slot: 'f1', image: asset('p-chickenstock-1kg.png'), depth: 28 },
  { slot: 'f2', image: asset('p-saltedegg-800g.png'), depth: -22 },
  { slot: 'f3', image: asset('p-banana-1kg.png'), depth: -30 },
  { slot: 'f4', image: asset('p-flour-hot-1kg.png'), depth: 24 },
]

export const SLOGAN = {
  first: 'Mudah',
  middle: 'dan',
  last: 'Sedap!',
  /** "Sedap!" starts 0.45s in: 9 steps of the 50ms letter stagger. */
  lastStartIndex: 9,
  chipLeft: asset('p-flour-original-1kg.png'),
  chipRight: asset('p-curry-meat.png'),
  captionLeft: 'We are Bestari · Since 2004',
  captionRight: 'Simple & Tasty',
} as const

// ---------- Intro doors ----------

export interface Door {
  href: string
  eyebrow: string
  title: string
  cta: string
  image: ImageAsset
  /** A solid colour turns the door into a packshot door; without it the image fills the card. */
  background?: string
}

export const DOORS: Door[] = [
  {
    href: ROUTES.about,
    eyebrow: 'Our Story',
    title: 'The playful sous chef',
    cta: 'About Bestari',
    image: { src: asset('about-1.jpg'), alt: '' },
  },
  {
    href: ROUTES.investors,
    eyebrow: 'Investor Relations',
    title: 'SC approved · Main Market IPO',
    cta: 'IPO details',
    image: { src: asset('p-curry-meat.png'), alt: '' },
    background: 'var(--brand-deep)',
  },
  {
    href: ROUTES.shop,
    eyebrow: 'Shop Today',
    title: 'Your pantry, delivered',
    cta: 'Shop now',
    image: { src: asset('p-flour-mala-520g.png'), alt: '' },
    background: 'var(--brand)',
  },
]

// ---------- Brands carousel ----------

export interface BrandSlide {
  image: string
  /** Section background while the slide is showing. */
  bg: string
  eyebrow: string
  name: string
  nameZh: string
  /** Outline word repeated in the marquee behind the pack. */
  marquee: string
}

export const BRAND_SLIDES: BrandSlide[] = [
  { image: asset('p-flour-original-1kg.png'), bg: '#E89A1C', eyebrow: 'Our original · Since 2004', name: 'Multipurpose Crispy Frying Flour Mix', nameZh: '多用途香脆炸粉', marquee: 'RANGUP' },
  { image: asset('p-curry-meat.png'), bg: '#7E1B1E', eyebrow: 'Instant premix', name: 'Instant Curry Powder Premix', nameZh: '速煮咖喱粉料', marquee: 'KARI' },
  { image: asset('p-saltedegg-800g.png'), bg: '#C8861A', eyebrow: 'Golden & creamy', name: 'Golden Salted Egg Seasoning', nameZh: '金沙咸蛋粉', marquee: 'TELUR MASIN' },
  { image: asset('p-tempura-500g.png'), bg: '#2A1A14', eyebrow: 'Light & crispy', name: 'Tempura', nameZh: '天妇罗粉', marquee: 'TEMPURA' },
  { image: asset('p-chickenstock-1kg.png'), bg: '#1E6A3E', eyebrow: 'Kitchen essential', name: 'Chicken Stock', nameZh: '鸡精调料粉', marquee: 'STOK AYAM' },
  { image: asset('p-rasasedap-230g.png'), bg: '#B5261E', eyebrow: 'All-in-one', name: 'Rasa Sedap All-in-One Seasoning', nameZh: '多用途全一调味料', marquee: 'RASA SEDAP' },
  { image: asset('p-banana-1kg.png'), bg: '#2E7D4A', eyebrow: 'Minum petang', name: 'Banana Fritter Batter', nameZh: '香脆炸香蕉粉', marquee: 'PISANG GORENG' },
  { image: asset('p-cucur.png'), bg: '#5A1013', eyebrow: 'Kuih favourite', name: 'Cucur', nameZh: '马来炸糕', marquee: 'CUCUR' },
  { image: asset('p-custard.png'), bg: '#D19A1E', eyebrow: 'Sweet treats', name: 'Custard', nameZh: '吉士粉', marquee: 'KASTARD' },
  { image: asset('p-salt.png'), bg: '#134A2B', eyebrow: 'Pantry staple', name: 'Iodised Himalayan Rock Salt', nameZh: '喜马拉雅含碘岩盐', marquee: 'GARAM' },
]

export const CAROUSEL = {
  autoplayMs: 5500,
  swipeThresholdPx: 60,
  storageKey: 'bestari_hero',
  /** The marquee repeats the word 8 times so the -50% loop is seamless. */
  marqueeRepeats: 8,
} as const

// ---------- Purpose ----------

export interface Pillar {
  number: string
  title: string
  text: string
}

export const PILLARS: Pillar[] = [
  { number: '01', title: 'Mudah — Simple', text: 'Quick methods for tasty food with minimal effort.' },
  { number: '02', title: 'Sedap — Tasty', text: 'Passionate recipes that deliver the essence of a great meal.' },
  { number: '03', title: 'Selamat — Safe', text: 'HACCP, ISO 22000 and 100% JAKIM Halal certified.' },
]

// ---------- Recipe videos ----------

export interface RecipeVideo {
  /** YouTube video id (from the current bestarifood.com). */
  id: string
  kind: string
  /** Placeholder title from the handoff. */
  title: string
  thumb: string
}

export const RECIPE_VIDEOS: RecipeVideo[] = [
  { id: 'KZR6Iwb8rFM', kind: 'Recipe video', title: 'Bestari kitchen favourites', thumb: asset('promo-stock.jpg') },
  { id: 'fvWXN3qudkE', kind: 'Recipe video', title: 'Crispy every time', thumb: asset('promo-tempura.jpg') },
  { id: 'Q42PiIpi7x8', kind: 'Recipe video', title: 'Tea-time fritters', thumb: asset('promo-banana.jpg') },
  { id: 'Dksc4mpD6hw', kind: 'What’s new', title: 'Goreng Goreng range', thumb: asset('home-extra.jpg') },
]

const YOUTUBE_EMBED = 'https://www.youtube-nocookie.com/embed/'

export function videoEmbedUrl(id: string, shouldAutoplay: boolean): string {
  return `${YOUTUBE_EMBED}${id}?rel=0${shouldAutoplay ? '&autoplay=1' : ''}`
}

// ---------- Latest ----------

interface NewsBase {
  label: string
  title: string
  href: string
}

/** The IPO card shows a serif badge on green-deep; the others show a square photo. */
export type NewsItem = (NewsBase & { kind: 'badge'; badge: string }) | (NewsBase & { kind: 'image'; image: string })

export const NEWS: NewsItem[] = [
  {
    kind: 'badge',
    badge: 'IPO',
    label: 'Investor Relations',
    title: 'Bestari Food secures SC approval for Main Market listing',
    href: ROUTES.investors,
  },
  { kind: 'image', image: asset('home-extra.jpg'), label: 'New product', title: 'Goreng Goreng fried rice seasoning', href: '#' },
  { kind: 'image', image: asset('promo-tempura.jpg'), label: 'Recipe video', title: 'Light & crispy tempura', href: '#' },
]

/** Destinations the handoff left as "#". */
export const PLACEHOLDER_LINKS = {
  allNews: '#',
} as const
