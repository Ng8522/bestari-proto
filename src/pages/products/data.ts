/**
 * Product catalogue, ported from bestarifood.com/products and its product pages (names, pack sizes and specs as
 * published there). Pack photos come from public/assets; a pack without its own photo shows another pack of the
 * same product, with a caption saying so.
 */
import { asset } from '../../content/site'

export const PRODUCT_CATEGORIES = [
  { id: 'frying', label: 'Frying flours & batters' },
  { id: 'seasoning', label: 'Seasonings' },
  { id: 'dessert', label: 'Desserts & sides' },
  { id: 'pantry', label: 'Pantry staples' },
] as const

export type ProductCategoryId = (typeof PRODUCT_CATEGORIES)[number]['id']

/** Trade details printed on the product pages. Any field still to be confirmed is left out. */
export interface PackSpecs {
  /** EAN-13, digits only. */
  barcode?: string
  shelfLife?: string
  /** Pack dimensions in cm. */
  dimensions?: string
  carton?: string
}

export interface Pack {
  /** Unique within its product. */
  id: string
  /** Picker label, e.g. "Original 1 kg". */
  label: string
  /** Net weight as printed on the pack. */
  size: string
  image?: string
  /** Malay and Chinese names, for products that group several items (starches, spices). */
  localName?: string
  specs?: PackSpecs
}

export interface ProductLine {
  slug: string
  category: ProductCategoryId
  name: string
  nameMs?: string
  nameZh: string
  tagline: string
  /** The first pack is selected when the page opens. */
  packs: readonly [Pack, ...Pack[]]
}

const MONTHS_18 = '18 months'
const MONTHS_24 = '24 months'
const MONTHS_36 = '36 months'

const FLOUR_1KG = { shelfLife: MONTHS_18, dimensions: '28 (W) × 25 (H) × 5 (D)', carton: '20 × 1 kg' }
const BOX_150G = { shelfLife: MONTHS_18, dimensions: '8 (W) × 16 (H) × 5 (D)', carton: '6 trays × 12 boxes × 150 g' }
const POUCH_350G = { shelfLife: MONTHS_24, dimensions: '16.5 (W) × 22 (H) × 3 (D)', carton: '24 × 350 g' }
const SPICE_100G = { shelfLife: MONTHS_18, dimensions: '16.5 (W) × 22 (H) × 3 (D)', carton: '48 × 100 g' }
const SPICE_500G = { shelfLife: MONTHS_18, dimensions: '16.5 (W) × 22 (H) × 3 (D)', carton: '24 × 500 g' }
const CURRY_75G = { shelfLife: MONTHS_18, dimensions: '8 (W) × 15 (H) × 5 (D)', carton: '12 boxes × 2 trays × 75 g' }
const CUCUR_160G = { shelfLife: MONTHS_18, dimensions: '17 (W) × 17 (H) × 3 (D)', carton: '24 × 160 g' }
const CUSTARD_300G = { shelfLife: MONTHS_18, dimensions: '17 (W) × 21 (H) × 3 (D)', carton: '24 × 300 g' }
const MASH_BOX = { shelfLife: '12 months', dimensions: '13 (L) × 16 (H) × 4 (D)', carton: '6 boxes × 4 trays' }
const SALT_350G = { shelfLife: MONTHS_36, dimensions: '11.5 (W) × 20 (H) × 1.5 (D)', carton: '24 × 350 g' }
const MASH_SIZE = '2 × 55 g mash mix + 2 × 10 g gravy'

export const PRODUCT_LINES: readonly ProductLine[] = [
  {
    slug: 'crispy-frying-flour-mix',
    category: 'frying',
    name: 'Multipurpose Crispy Frying Flour Mix',
    nameMs: 'Campuran Tepung Goreng Rangup Serbaguna',
    nameZh: '多用途香脆炸粉',
    tagline: 'Our original · Since 2004',
    packs: [
      { id: 'original-1kg', label: 'Original 1 kg', size: '1 kg', image: asset('p-flour-original-1kg.png'), specs: { barcode: '9555279100018', ...FLOUR_1KG } },
      { id: 'hot-spicy-1kg', label: 'Hot & Spicy 1 kg', size: '1 kg', image: asset('p-flour-hot-1kg.png'), specs: { barcode: '9555279100063', ...FLOUR_1KG } },
      { id: 'garlic-1kg', label: 'Garlic 1 kg', size: '1 kg', image: asset('p-flour-garlic-1kg.png'), specs: { barcode: '9555279103644', ...FLOUR_1KG, dimensions: '20.5 (W) × 28 (H) × 5 (D)' } },
      { id: 'kaw-kaw-1kg', label: 'Kaw Kaw 1 kg', size: '1 kg', image: asset('p-flour-kawkaw-1kg.png') },
      { id: 'mala-520g', label: 'Mala 520 g', size: '520 g', image: asset('p-flour-mala-520g.png') },
      { id: 'original-150g', label: 'Original 150 g', size: '150 g', image: asset('p-flour-original-150g.png'), specs: { barcode: '9555279103231', ...BOX_150G } },
      { id: 'hot-spicy-150g', label: 'Hot & Spicy 150 g', size: '150 g', image: asset('p-flour-hot-150g.png'), specs: { barcode: '9555279103224', ...BOX_150G } },
      { id: 'garlic-150g', label: 'Garlic 150 g', size: '150 g', specs: { barcode: '9555279103286', ...BOX_150G } },
      { id: 'tom-yum-150g', label: 'Tom Yum 150 g', size: '150 g', image: asset('p-flour-tomyum-150g.png'), specs: { barcode: '9555279103217', ...BOX_150G } },
      { id: 'black-pepper-150g', label: 'Black Pepper 150 g', size: '150 g', image: asset('p-flour-blackpepper-150g.png'), specs: { barcode: '9555279103279', ...BOX_150G } },
      { id: 'kaw-kaw-150g', label: 'Kaw Kaw 150 g', size: '150 g' },
      { id: 'mala-150g', label: 'Mala 150 g', size: '150 g' },
    ],
  },
  {
    slug: 'instant-curry-premix',
    category: 'seasoning',
    name: 'Instant Curry Powder Premix',
    nameMs: 'Pracampur Serbuk Kari Segera',
    nameZh: '速煮咖喱粉料',
    tagline: 'Instant premix',
    packs: [
      { id: 'chicken-meat', label: 'Chicken & Meat', size: '75 g (makes about 260 g of curry paste)', image: asset('p-curry-meat.png'), specs: { barcode: '9555279104245', ...CURRY_75G } },
      { id: 'fish-seafood', label: 'Fish & Seafood', size: '75 g (makes about 260 g of curry paste)', image: asset('p-curry-fish.png'), specs: { barcode: '9555279104252', ...CURRY_75G } },
    ],
  },
  {
    slug: 'golden-salted-egg',
    category: 'seasoning',
    name: 'Golden Salted Egg Seasoning',
    nameMs: 'Campuran Telur Masin Keemasan',
    nameZh: '金沙咸蛋粉',
    tagline: 'Golden & creamy',
    packs: [
      { id: '800g', label: '800 g', size: '800 g', image: asset('p-saltedegg-800g.png'), specs: { barcode: '9555279104146', shelfLife: MONTHS_18, dimensions: '25 (W) × 30 (H) × 5 (D)', carton: '12 packets × 800 g' } },
      { id: '150g', label: '150 g', size: '150 g', image: asset('p-saltedegg-150g.png'), specs: { barcode: '9555279104153', shelfLife: MONTHS_18, dimensions: '8 (W) × 15 (H) × 5 (D)', carton: '12 boxes × 2 trays × 150 g' } },
    ],
  },
  {
    slug: 'tempura',
    category: 'frying',
    name: 'Tempura Flour',
    nameMs: 'Tepung Tempura',
    nameZh: '天妇罗粉',
    tagline: 'Light & crispy',
    packs: [
      // The live page repeats the 150 g pack's barcode, dimensions and carton for this pack, so only these are kept.
      { id: '500g', label: '500 g', size: '500 g', image: asset('p-tempura-500g.png'), specs: { shelfLife: MONTHS_18 } },
      { id: '150g', label: '150 g', size: '150 g', specs: { barcode: '9555279103293', ...BOX_150G } },
    ],
  },
  {
    slug: 'chicken-stock',
    category: 'seasoning',
    name: 'Chicken Stock',
    nameMs: 'Stok Ayam',
    nameZh: '鸡精调料粉',
    tagline: 'Kitchen essential',
    packs: [
      { id: '1kg', label: '1 kg', size: '1 kg', image: asset('p-chickenstock-1kg.png'), specs: { barcode: '9555279103392', shelfLife: MONTHS_18, dimensions: '25 (W) × 30 (H) × 5 (D)', carton: '12 × 1 kg' } },
      { id: '230g', label: '230 g', size: '230 g', image: asset('p-chickenstock-230g.png'), specs: { barcode: '9555279103668', shelfLife: MONTHS_18, dimensions: '17 (W) × 22.5 (H) × 1.5 (D)', carton: '24 × 230 g' } },
    ],
  },
  {
    slug: 'rasa-sedap',
    category: 'seasoning',
    name: 'Rasa Sedap All-in-One Seasoning',
    nameZh: '多用途全一调味料',
    tagline: 'All-in-one',
    packs: [
      { id: '230g', label: '230 g', size: '230 g', image: asset('p-rasasedap-230g.png') },
      { id: '100g', label: '100 g', size: '100 g' },
      { id: '20g', label: '20 g', size: '20 g' },
    ],
  },
  {
    slug: 'banana-fritter-batter',
    category: 'frying',
    name: 'Banana Fritter Batter',
    nameMs: 'Tepung Goreng Pisang',
    nameZh: '香脆炸香蕉粉',
    tagline: 'Minum petang',
    packs: [
      { id: '1kg', label: '1 kg', size: '1 kg', image: asset('p-banana-1kg.png'), specs: { barcode: '9555279104368', shelfLife: MONTHS_18, dimensions: '28 (W) × 25 (H) × 5 (D)', carton: '12 × 1 kg' } },
      { id: '250g', label: '250 g', size: '250 g', specs: { barcode: '9555279103651', shelfLife: MONTHS_18, dimensions: '16.5 (W) × 22 (H) × 3 (D)', carton: '24 × 250 g' } },
    ],
  },
  {
    slug: 'instant-mashed-potatoes',
    category: 'dessert',
    name: 'Instant Mashed Potatoes',
    nameMs: 'Kentang Putar Segera',
    nameZh: '即食土豆马铃薯泥',
    tagline: 'Gravy in the box',
    packs: [
      { id: 'black-pepper-gravy', label: 'Black Pepper Gravy', size: MASH_SIZE, image: asset('p-mashed.png'), specs: { barcode: '9555279103958', ...MASH_BOX } },
      { id: 'chicken-gravy', label: 'Chicken Gravy', size: MASH_SIZE, specs: { barcode: '9555279103965', ...MASH_BOX } },
    ],
  },
  {
    slug: 'cucur',
    category: 'frying',
    name: 'Cucur Flour',
    nameMs: 'Tepung Cucur',
    nameZh: '马来炸糕',
    tagline: 'Kuih favourite',
    packs: [
      { id: 'prawn', label: 'Udang (Prawn)', size: '160 g', image: asset('p-cucur.png'), specs: { barcode: '9555279103385', ...CUCUR_160G } },
      { id: 'coconut', label: 'Lemak Manis (Coconut)', size: '160 g', specs: { barcode: '9555279103361', ...CUCUR_160G } },
    ],
  },
  {
    slug: 'custard',
    category: 'dessert',
    name: 'Custard Powder',
    nameMs: 'Tepung Kastard',
    nameZh: '吉士粉',
    tagline: 'Sweet treats',
    packs: [
      { id: 'original', label: 'Original', size: '300 g', image: asset('p-custard.png'), specs: { barcode: '9555279103347', ...CUSTARD_300G } },
      { id: 'sweet-corn', label: 'Sweet Corn', size: '300 g', specs: { barcode: '9555279103354', ...CUSTARD_300G } },
    ],
  },
  {
    slug: 'starches',
    category: 'pantry',
    name: 'Starches',
    nameMs: 'Tepung & Kanji',
    nameZh: '优质淀粉',
    tagline: 'Four everyday starches',
    packs: [
      { id: 'potato', label: 'Potato Starch', localName: 'Tepung Ubi Kentang · 马铃薯淀粉', size: '350 g', image: asset('p-starch.png'), specs: { barcode: '9555279103019', ...POUCH_350G } },
      { id: 'tapioca', label: 'Tapioca Starch', localName: 'Tepung Ubi Kayu · 木薯淀粉', size: '350 g', specs: { barcode: '9555279103637', ...POUCH_350G } },
      { id: 'wheat', label: 'Wheat Starch', localName: 'Kanji Gandum · 小麦淀粉', size: '350 g', specs: { barcode: '9555279103026', ...POUCH_350G } },
      { id: 'corn', label: 'Corn Starch', localName: 'Tepung Jagung · 玉蜀黍淀粉', size: '350 g', specs: { barcode: '9555279103002', ...POUCH_350G } },
    ],
  },
  {
    slug: 'spices',
    category: 'pantry',
    name: 'Spices',
    nameMs: 'Rempah Ratus',
    nameZh: '优质香料',
    tagline: 'Ground spices',
    packs: [
      { id: 'chilli-100g', label: 'Chilli 100 g', localName: 'Serbuk Cili · 辣椒粉', size: '100 g', image: asset('p-spices.png'), specs: { barcode: '9555279103712', ...SPICE_100G } },
      { id: 'chilli-500g', label: 'Chilli 500 g', localName: 'Serbuk Cili · 辣椒粉', size: '500 g', specs: { barcode: '9555279103750', ...SPICE_500G } },
      { id: 'turmeric-100g', label: 'Turmeric 100 g', localName: 'Serbuk Kunyit · 黄姜粉', size: '100 g', specs: { barcode: '9555279103743', ...SPICE_100G } },
      { id: 'turmeric-500g', label: 'Turmeric 500 g', localName: 'Serbuk Kunyit · 黄姜粉', size: '500 g', specs: { barcode: '9555279103767', ...SPICE_500G } },
      { id: 'cumin-100g', label: 'Cumin 100 g', localName: 'Serbuk Jintan Putih · 孜然粉', size: '100 g', specs: { barcode: '9555279103729', ...SPICE_100G } },
      { id: 'fennel-100g', label: 'Fennel 100 g', localName: 'Serbuk Jintan Manis · 粗谷粉', size: '100 g', specs: { barcode: '9555279103736', ...SPICE_100G } },
      { id: 'coriander-100g', label: 'Coriander 100 g', localName: 'Serbuk Ketumbar · 芫茜粉', size: '100 g', specs: { barcode: '9555279103811', ...SPICE_100G, dimensions: '11.5 (W) × 17 (H) × 2.5 (D)' } },
    ],
  },
  {
    slug: 'himalayan-rock-salt',
    category: 'pantry',
    name: 'Iodised Himalayan Rock Salt',
    nameMs: 'Garam Himalaya Beriodida',
    nameZh: '喜马拉雅含碘岩盐',
    tagline: 'Pantry staple',
    packs: [
      { id: 'crystal', label: 'Crystal Rock Salt', size: '350 g', image: asset('p-salt.png'), specs: { barcode: '9555279103705', ...SALT_350G } },
      { id: 'refined', label: 'Refined Rock Salt', size: '350 g', specs: { barcode: '9555279103699', ...SALT_350G } },
    ],
  },
  {
    slug: 'msg',
    category: 'seasoning',
    name: 'Flavour Enhancer MSG',
    nameMs: 'Penambah Perisa MSG',
    nameZh: '鲜增味精',
    tagline: 'Monosodium glutamate',
    packs: [
      // The live page gives this pack the Crystal Rock Salt barcode, so the barcode is left out until confirmed.
      { id: '1kg', label: '1 kg', size: '1 kg', image: asset('p-msg.png'), specs: { shelfLife: MONTHS_36, dimensions: '25 (W) × 28 (H) × 5 (D)', carton: '12 × 1 kg' } },
      { id: '450g', label: '450 g', size: '450 g' },
      { id: '100g', label: '100 g', size: '100 g' },
    ],
  },
]
