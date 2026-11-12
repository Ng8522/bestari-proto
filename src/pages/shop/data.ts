/**
 * Shop catalogue from "Bestari Shop.html" (the `P` array, bundles and trust strip).
 * All prices are sample placeholders for design purposes; in production they come from the commerce backend.
 */
import { asset } from '../../content/site'

export const CART_STORAGE_KEY = 'bestari_cart'

export const PAYMENT_METHODS = "FPX · Visa / Mastercard · Touch 'n Go · GrabPay"

export const CATEGORIES = ['Frying flour', 'Seasoning', 'Dessert & snack', 'Pantry'] as const
export type Category = (typeof CATEGORIES)[number]
export type CategoryFilter = 'All' | Category
export const CATEGORY_FILTERS: readonly CategoryFilter[] = ['All', ...CATEGORIES]

export interface Variant {
  label: string
  price: number
  img: string
}

export interface ProductBadge {
  label: string
  tone: 'saffron' | 'green'
}

export interface Product {
  id: string
  category: Category
  name: string
  zh: string
  /** Lower is more popular ("Sort: Popular"). */
  popularity: number
  /** The first variant is selected by default. */
  variants: readonly [Variant, ...Variant[]]
  badge?: ProductBadge
  /** Malay search terms, so the search placeholder's examples ("tepung goreng", "kari") find products. */
  keywords?: string
}

function variant(label: string, price: number, file: string): Variant {
  return { label, price, img: asset(file) }
}

export const PRODUCTS: readonly Product[] = [
  {
    id: 'flour',
    category: 'Frying flour',
    name: 'Multipurpose Crispy Frying Flour Mix',
    zh: '多用途香脆炸粉',
    badge: { label: 'Bestseller', tone: 'saffron' },
    popularity: 1,
    keywords: 'tepung goreng',
    variants: [
      variant('Original 1KG', 11.9, 'p-flour-original-1kg.png'),
      variant('Hot & Spicy 1KG', 11.9, 'p-flour-hot-1kg.png'),
      variant('Garlic 1KG', 11.9, 'p-flour-garlic-1kg.png'),
      variant('520g', 7.9, 'p-flour-mala-520g.png'),
      variant('Original 150g', 2.5, 'p-flour-original-150g.png'),
    ],
  },
  {
    id: 'flour150',
    category: 'Frying flour',
    name: 'Crispy Frying Flour Mix — 150g Flavours',
    zh: '香脆炸粉 150g',
    popularity: 3,
    keywords: 'tepung goreng',
    variants: [
      variant('Tom Yum', 2.5, 'p-flour-tomyum-150g.png'),
      variant('Black Pepper', 2.5, 'p-flour-blackpepper-150g.png'),
      variant('Hot & Spicy', 2.5, 'p-flour-hot-150g.png'),
    ],
  },
  {
    id: 'curry',
    category: 'Seasoning',
    name: 'Instant Curry Powder Premix',
    zh: '速煮咖喱粉料',
    popularity: 2,
    keywords: 'serbuk kari',
    variants: [
      variant('Chicken & Meat', 3.9, 'p-curry-meat.png'),
      variant('Fish & Seafood', 3.9, 'p-curry-fish.png'),
    ],
  },
  {
    id: 'egg',
    category: 'Seasoning',
    name: 'Golden Salted Egg Seasoning',
    zh: '金沙咸蛋粉',
    badge: { label: 'Favourite', tone: 'saffron' },
    popularity: 4,
    variants: [variant('800g', 24.9, 'p-saltedegg-800g.png'), variant('150g', 5.9, 'p-saltedegg-150g.png')],
  },
  {
    id: 'tempura',
    category: 'Frying flour',
    name: 'Tempura',
    zh: '天妇罗粉',
    popularity: 6,
    variants: [variant('500g', 6.5, 'p-tempura-500g.png')],
  },
  {
    id: 'stock',
    category: 'Seasoning',
    name: 'Chicken Stock',
    zh: '鸡精调料粉',
    popularity: 5,
    variants: [variant('1KG', 17.9, 'p-chickenstock-1kg.png'), variant('230g', 4.9, 'p-chickenstock-230g.png')],
  },
  {
    id: 'rasa',
    category: 'Seasoning',
    name: 'Rasa Sedap All-in-One Seasoning',
    zh: '多用途全一调味料',
    badge: { label: 'New', tone: 'green' },
    popularity: 7,
    variants: [variant('230g', 4.9, 'p-rasasedap-230g.png')],
  },
  {
    id: 'banana',
    category: 'Frying flour',
    name: 'Banana Fritter Batter',
    zh: '香脆炸香蕉粉',
    popularity: 8,
    keywords: 'tepung goreng pisang',
    variants: [variant('1KG', 9.9, 'p-banana-1kg.png')],
  },
  {
    id: 'mash',
    category: 'Dessert & snack',
    name: 'Instant Mashed Potatoes',
    zh: '即食土豆马铃薯泥',
    popularity: 9,
    variants: [variant('Pack', 6.9, 'p-mashed.png')],
  },
  {
    id: 'cucur',
    category: 'Dessert & snack',
    name: 'Cucur',
    zh: '马来炸糕',
    popularity: 10,
    variants: [variant('Pack', 3.5, 'p-cucur.png')],
  },
  {
    id: 'custard',
    category: 'Dessert & snack',
    name: 'Custard',
    zh: '吉士粉',
    popularity: 11,
    variants: [variant('Pack', 4.5, 'p-custard.png')],
  },
  {
    id: 'starch',
    category: 'Pantry',
    name: 'Starch',
    zh: '优质淀粉',
    popularity: 12,
    variants: [variant('Pack', 3.2, 'p-starch.png')],
  },
  {
    id: 'spices',
    category: 'Pantry',
    name: 'Spices',
    zh: '优质香料',
    popularity: 13,
    variants: [variant('Pack', 3.9, 'p-spices.png')],
  },
  {
    id: 'salt',
    category: 'Pantry',
    name: 'Iodised Himalayan Rock Salt',
    zh: '喜马拉雅含碘岩盐',
    popularity: 14,
    variants: [variant('Pack', 5.5, 'p-salt.png')],
  },
  {
    id: 'msg',
    category: 'Pantry',
    name: 'Flavour Enhancer MSG',
    zh: '鲜增味精',
    popularity: 15,
    variants: [variant('1KG', 12.9, 'p-msg.png'), variant('450g', 6.5, 'p-msg.png'), variant('100g', 1.9, 'p-msg.png')],
  },
]

/** The promo banner's "Add Mala 520g to cart" button. */
export const HERO_PROMO = { productId: 'flour', variantLabel: '520g' } as const

export interface BundleShot {
  img: string
  /** Horizontal offset inside the stack, e.g. '28%'. */
  left: string
}

export interface Bundle {
  id: string
  name: string
  description: string
  price: number
  was: number
  /** Thumbnail shown in the cart. */
  img: string
  shots: readonly BundleShot[]
}

export const BUNDLES: readonly Bundle[] = [
  {
    id: 'ayam-goreng-trio',
    name: 'Ayam Goreng Trio',
    description: 'Original, Hot & Spicy and Garlic 1 KG — for the family gathering.',
    price: 39.9,
    was: 44.7,
    img: asset('p-flour-original-1kg.png'),
    shots: [
      { img: asset('p-flour-original-1kg.png'), left: '0' },
      { img: asset('p-flour-hot-1kg.png'), left: '28%' },
      { img: asset('p-flour-garlic-1kg.png'), left: '56%' },
    ],
  },
  {
    id: 'curry-night',
    name: 'Curry Night',
    description: 'Instant Curry Powder Premix for chicken & meat, and fish & seafood.',
    price: 12.9,
    was: 14.8,
    img: asset('p-curry-meat.png'),
    shots: [
      { img: asset('p-curry-meat.png'), left: '0' },
      { img: asset('p-curry-fish.png'), left: '40%' },
    ],
  },
  {
    id: 'minum-petang-set',
    name: 'Minum Petang Set',
    description: 'Banana Fritter Batter, Cucur and Tempura — tea-time fritters, sorted.',
    price: 21.9,
    was: 25.6,
    img: asset('p-banana-1kg.png'),
    shots: [
      { img: asset('p-banana-1kg.png'), left: '0' },
      { img: asset('p-cucur.png'), left: '28%' },
      { img: asset('p-tempura-500g.png'), left: '56%' },
    ],
  },
]

export interface Perk {
  title: string
  detail: string
}

/** Trust strip under the promo hero. */
export const PERKS: readonly Perk[] = [
  { title: '100% Halal JAKIM', detail: 'Every single product' },
  { title: 'Direct from factory', detail: 'HACCP · ISO 22000' },
  { title: 'Secure payment', detail: 'FPX · Cards · e-Wallet' },
  { title: 'Recipe with every order', detail: 'Mudah dan sedap' },
]

/** Bulk, F&B and reseller benefits in the trade band. */
export const TRADE_POINTS: readonly string[] = [
  '1 KG & carton-size packs',
  'Tiered trade pricing',
  'Scheduled deliveries',
  'Become a Bestari distributor',
]
