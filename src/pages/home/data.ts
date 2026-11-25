/**
 * Home page content, ported from "Bestari Corporate & IPO.html" (design handoff).
 * Video titles and the two non-IPO news links are placeholders from the handoff and must be replaced.
 */
import { asset, IR_MENU, ROUTES, type ImageAsset, type NavItem } from '../../content/site'
import { productPath } from '../products/catalogue'
import { PRODUCT_CATEGORIES, type ProductCategoryId } from '../products/data'

/** Centre links of the transparent home header. */
export const HEADER_LINKS: NavItem[] = [
  { label: 'Home', href: '#top' },
  { label: 'About Us', href: ROUTES.about },
  { label: 'Products', href: ROUTES.products },
  { label: 'Investor Relations', href: ROUTES.investors, children: IR_MENU },
  { label: 'Sustainability', href: ROUTES.sustainability },
]

/** The header turns solid once the page has scrolled this share of the viewport height. */
export const HEADER_SOLID_RATIO = 0.85

/** Scrolling more than this many pixels gives the header a green backdrop, so the page never shows through the links. */
export const HEADER_SCRIM_OFFSET_PX = 8

// ---------- Hero slider (first screen) ----------

export const HERO_SLIDE_INTERVAL_MS = 5000
export const HERO_SLIDE_STORAGE_KEY = 'bestari.home.hero-slide'
/** The banners are 2048 × 878 (about 2.33:1); each is saved at these widths in public/assets/hero. */
export const HERO_BANNER_WIDTHS = [768, 1024, 2048] as const

export interface HeroSlide {
  /** Banner file stem: public/assets/hero/hero-<id>-<width>.png */
  id: string
  /** Shown in the green strip under the banner and in the slide's button label. */
  title: string
  alt: string
  href: string
}

export interface HeroBannerImage {
  src: string
  srcSet: string
}

export function heroBanner(id: string): HeroBannerImage {
  return {
    src: asset(`hero/hero-${id}-1024.png`),
    srcSet: HERO_BANNER_WIDTHS.map((width) => `${asset(`hero/hero-${id}-${width}.png`)} ${width}w`).join(', '),
  }
}

/** The seven campaign banners from the bestarifood.com home slider, in the same order. */
export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: 'frying-flour',
    title: 'Multipurpose Crispy Frying Flour Mix',
    alt: 'Bestari Multipurpose Crispy Frying Flour Mix in five flavours beside two plates of fried chicken',
    href: productPath('crispy-frying-flour-mix'),
  },
  {
    id: 'salted-egg',
    title: 'Golden Salted Egg Seasoning',
    alt: 'Bestari Golden Salted Egg Seasoning pack and box with a plate of salted egg fried chicken',
    href: productPath('golden-salted-egg'),
  },
  {
    id: 'goreng-goreng',
    title: 'Goreng Goreng Fried Rice & Noodles Seasoning',
    alt: 'Four Bestari Goreng Goreng fried rice and noodle seasoning packs with plates of fried rice and noodles',
    href: ROUTES.products,
  },
  {
    id: 'rasa-sedap',
    title: 'Rasa Sedap All-in-One Seasoning',
    alt: 'Bestari Rasa Sedap All-in-One Seasoning pack with an omelette and a bowl of stir-fried vegetables',
    href: productPath('rasa-sedap'),
  },
  {
    id: 'chicken-stock',
    title: 'Chicken Stock',
    alt: 'Bestari Stok Ayam chicken stock pack with chicken soup, chicken rice and porridge',
    href: productPath('chicken-stock'),
  },
  {
    id: 'anchovy-stock',
    title: 'Anchovy Stock',
    alt: 'Bestari Stok Ikan Bilis anchovy stock pack with a bowl of noodle soup',
    href: ROUTES.products,
  },
  {
    id: 'banana-fritter',
    title: 'Banana Fritter Batter',
    alt: 'Bestari Tepung Goreng Pisang banana fritter batter pack with bananas and a basket of fritters',
    href: productPath('banana-fritter-batter'),
  },
]

// ---------- Intro band ----------

export const INTRO_PHOTO: ImageAsset = {
  src: asset('about-1.jpg'),
  alt: 'Two cooks slicing aubergine and preparing whole spices on a white kitchen counter',
}

// ---------- Product ranges ----------

export interface ProductRange {
  id: ProductCategoryId
  label: string
  /** One pack shot that stands for the range. */
  image: string
  href: string
}

const RANGE_PACKS: Record<ProductCategoryId, string> = {
  frying: 'p-flour-original-1kg.png',
  seasoning: 'p-rasasedap-230g.png',
  dessert: 'p-custard.png',
  pantry: 'p-salt.png',
}

/** The products page's four categories, in its order and with its names. */
export const PRODUCT_RANGES: readonly ProductRange[] = PRODUCT_CATEGORIES.map((category) => ({
  id: category.id,
  label: category.label,
  image: asset(RANGE_PACKS[category.id]),
  href: ROUTES.products,
}))

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
