/**
 * Site-wide content from the design handoff (design_handoff_bestari_website/README.md, theme.css, site.js).
 * Page-specific data lives in each page folder.
 */

export interface LinkItem {
  label: string
  href: string
}

export interface ImageAsset {
  src: string
  alt: string
}

/** Images from the handoff live in public/assets; BASE_URL keeps them working under the GitHub Pages subpath. */
export function asset(file: string): string {
  return `${import.meta.env.BASE_URL}assets/${file}`
}

export const ROUTES = {
  home: '/',
  about: '/about-us',
  investors: '/investor-relations',
  shop: '/shop',
  whereToBuy: '/where-to-buy',
} as const

export const LOGO: ImageAsset = { src: asset('logo.png'), alt: 'Bestari Food Berhad' }

export const CERT_STRIP: ImageAsset = {
  src: asset('about-cert.jpg'),
  alt: 'ISO 22000, HACCP, Buatan Malaysia, MeSTI and Halal Malaysia certifications',
}

export const COMPANY = {
  name: 'Bestari Food Berhad',
  addressLines: [
    'Lot 29119, Jalan Rajawali, Batu 9, Kampung Kebun Baru,',
    '42500 Telok Panglima Garang, Kuala Langat, Selangor',
  ],
  phone: { label: '+60 3-3122 5399', href: 'tel:+60331225399' } satisfies LinkItem,
  email: { label: 'enquiry@bestarifood.com', href: 'mailto:enquiry@bestarifood.com' } satisfies LinkItem,
}

/** Inner-page header links (site.js). */
export const MAIN_NAV: LinkItem[] = [
  { label: 'Home', href: ROUTES.home },
  { label: 'About Us', href: ROUTES.about },
  { label: 'Investor Relations', href: ROUTES.investors },
]

export const SHOP_CTA: LinkItem = { label: 'Shop online', href: ROUTES.shop }

export interface FooterColumn {
  title: string
  links: LinkItem[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'Company',
    links: [
      { label: 'About us', href: ROUTES.about },
      { label: 'Our journey', href: `${ROUTES.about}#journey` },
      { label: 'Contact', href: COMPANY.email.href },
    ],
  },
  {
    title: 'Investors',
    links: [
      { label: 'IPO', href: `${ROUTES.investors}#ipo` },
      { label: 'Financials', href: `${ROUTES.investors}#financials` },
      { label: 'Board & management', href: `${ROUTES.investors}#board` },
      { label: 'IR contact', href: `${ROUTES.investors}#contact` },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'shop.bestarifood.com', href: ROUTES.shop },
      { label: 'Where to buy', href: ROUTES.whereToBuy },
      { label: 'Bulk / F&B', href: `${ROUTES.shop}#trade` },
    ],
  },
]

export const LEGAL = {
  copyright: '© 2026 Bestari Food Berhad. All rights reserved.',
  links: 'Privacy · Terms · PDPA',
}
