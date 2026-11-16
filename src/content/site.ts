/**
 * Site-wide content from the design handoff (design_handoff_bestari_website/README.md, theme.css, site.js).
 * Page-specific data lives in each page folder.
 */
import { IR_BASE, IR_NAV, irPath, sectionHref } from './ir-nav'

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
  investors: IR_BASE,
  shop: '/shop',
  onsiteOutlets: '/onsite-outlets',
  /** Old URL for Onsite Outlets, kept so shared links still land on the page. */
  legacyWhereToBuy: '/where-to-buy',
  sustainability: '/sustainability',
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

/** A header link; `children` render as its dropdown (NavDropdown). */
export interface NavItem extends LinkItem {
  children?: readonly LinkItem[]
}

/** The header's Investor Relations dropdown: one link per IR section (IR_NAV in ir-nav.ts). */
export const IR_MENU: readonly LinkItem[] = IR_NAV.map((section) => ({ label: section.label, href: sectionHref(section) }))

/** Inner-page header links (site.js). */
export const MAIN_NAV: NavItem[] = [
  { label: 'Home', href: ROUTES.home },
  { label: 'About Us', href: ROUTES.about },
  { label: 'Investor Relations', href: ROUTES.investors, children: IR_MENU },
  { label: 'Sustainability', href: ROUTES.sustainability },
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
      { label: 'Sustainability', href: ROUTES.sustainability },
      { label: 'Contact', href: COMPANY.email.href },
    ],
  },
  {
    title: 'Investors',
    links: [
      { label: 'IPO Centre', href: irPath('ipo-centre', 'overview') },
      { label: 'Financial info', href: irPath('financial-info', 'highlights') },
      { label: 'Board of directors', href: irPath('corporate-info', 'directors-profile') },
      { label: 'IR contact', href: irPath('contact') },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'Shop Today', href: ROUTES.shop },
      { label: 'Onsite Outlets', href: ROUTES.onsiteOutlets },
      { label: 'Bulk / F&B', href: `${ROUTES.shop}#trade` },
    ],
  },
]

export const LEGAL = {
  copyright: '© 2026 Bestari Food Berhad. All rights reserved.',
  links: 'Privacy · Terms · PDPA',
}
