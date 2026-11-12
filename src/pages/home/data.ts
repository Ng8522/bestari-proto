/**
 * Home page content, ported from "Bestari Corporate & IPO.html" (design handoff).
 * Video titles and the two non-IPO news links are placeholders from the handoff and must be replaced.
 */
import { asset, ROUTES, type ImageAsset, type LinkItem } from '../../content/site'

/** Centre links of the transparent home header. */
export const HEADER_LINKS: LinkItem[] = [
  { label: 'Our Brands', href: '#brands' },
  { label: 'About Us', href: ROUTES.about },
  { label: 'Investor Relations', href: ROUTES.investors },
  { label: 'News', href: '#latest' },
]

/** The header turns solid once the page has scrolled this share of the viewport height. */
export const HEADER_SOLID_RATIO = 0.85

/** Scrolling more than this many pixels gives the header a green backdrop over the hero, so the slogan never shows through the links. */
export const HEADER_SCRIM_OFFSET_PX = 8

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
    eyebrow: 'shop.bestarifood.com',
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
