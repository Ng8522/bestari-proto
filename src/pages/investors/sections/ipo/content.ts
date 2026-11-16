/**
 * Copy for the IPO Centre pages. Figures come from content/prospectus.ts and data.ts; the explanations of how a
 * Malaysian IPO works are general and always point readers to the registered prospectus for the specifics.
 */
import { SHARES_PER_LOT } from '../../calculator'
import { CORPORATE_DIRECTORY, IPO_TERMS } from '../../content/prospectus'
import { ALLOCATION, ALLOCATION_TOTAL } from '../../data'

/* Important notice (the disclaimer gate in front of every IPO Centre page) */

export const IPO_NOTICE: readonly string[] = [
  'The information in the IPO Centre is about the proposed initial public offering (IPO) of Bestari Food Berhad and its listing on the Main Market of Bursa Malaysia Securities Berhad. It is provided for information only.',
  'It does not constitute or form part of any offer or invitation to subscribe for or purchase, or any solicitation of an offer to subscribe for or purchase, any shares of Bestari Food Berhad, in Malaysia or in any other jurisdiction.',
  'This information is intended only for persons in Malaysia. It is not for distribution in, and must not be accessed from, any jurisdiction where doing so would be unlawful.',
  'Any application for IPO shares may only be made on the basis of the prospectus registered with the Securities Commission Malaysia (SC). Read the registered prospectus in full, and consult your own professional advisers, before making any investment decision.',
  'Figures shown here are taken from the draft prospectus on the SC’s prospectus exposure page and may change in the registered prospectus.',
]

export const IPO_NOTICE_CONFIRM =
  'By selecting “I agree”, you confirm that you have read and understood this notice and that you are a person in Malaysia.'

/* Offer structure */

export interface OfferRow {
  component: string
  shares: string
  detail: string
}

const trancheDescription = (id: string): string => ALLOCATION.find((tranche) => tranche.id === id)?.description ?? ''

/** The lines of a CORPORATE_DIRECTORY entry, e.g. the issuing house's name. */
export function directoryLines(label: string): readonly string[] {
  return CORPORATE_DIRECTORY.find((entry) => entry.label === label)?.lines ?? []
}

export const ISSUING_HOUSE = directoryLines('Issuing house').join(', ')

/** The IPO by source of shares, then by investor group, then the totals (the last row is the enlarged capital). */
export const OFFER_STRUCTURE: readonly OfferRow[] = [
  {
    component: 'Public issue',
    shares: IPO_TERMS.publicIssue,
    detail: 'New shares issued by Bestari Food Berhad. The money raised goes to the Group.',
  },
  {
    component: 'Offer for sale',
    shares: IPO_TERMS.offerForSale,
    detail: `Existing shares offered by the selling shareholder, ${IPO_TERMS.sellingShareholder}.`,
  },
  { component: 'Institutional offering', shares: IPO_TERMS.institutional, detail: trancheDescription('institutional') },
  {
    component: 'Retail offering',
    shares: IPO_TERMS.retail,
    detail: `${trancheDescription('public')}; ${trancheDescription('pink').toLowerCase()} (pink form).`,
  },
  { component: 'Total IPO shares', shares: ALLOCATION_TOTAL.replace(' IPO shares', ' shares'), detail: 'Public issue plus offer for sale.' },
  { component: 'Enlarged share capital on listing', shares: IPO_TERMS.enlargedShares, detail: 'All shares in issue after the public issue.' },
]

/** Labels in CORPORATE_DIRECTORY for the advisers and agents named for the IPO. */
export const KEY_PARTY_LABELS: readonly string[] = [
  'Principal adviser, sole underwriter & sole placement agent',
  'Issuing house',
  'Share registrar',
  'Solicitors',
  'Auditors & reporting accountants',
]

/* Timetable */

export interface Stage {
  title: string
  description: string
}

/** How a Malaysian IPO generally runs, stage by stage. */
export const IPO_STAGES: readonly Stage[] = [
  {
    title: 'Prospectus launch',
    description: 'The prospectus registered with the SC is issued, and the application period opens.',
  },
  {
    title: 'Application period',
    description: 'Eligible investors apply for shares electronically or on the application forms, as the prospectus sets out.',
  },
  {
    title: 'Closing and balloting',
    description: 'Applications close. If the retail offering is oversubscribed, the issuing house holds a ballot to decide who receives shares.',
  },
  {
    title: 'Allotment and refunds',
    description: 'Successful applicants receive shares in their CDS accounts. Unsuccessful and partly successful applicants are refunded.',
  },
  { title: 'Listing', description: 'The shares are listed and start trading on the Main Market of Bursa Malaysia.' },
]

/* Competitive strengths */

export interface RouteToMarket {
  title: string
  channel: string
  customers: string
}

/** The two routes to market named in the company overview. */
export const ROUTES_TO_MARKET: readonly RouteToMarket[] = [
  { title: 'Retail', channel: 'Retail packs', customers: 'Supermarkets and other retail outlets, for home cooks.' },
  {
    title: 'Commercial',
    channel: 'Commercial packs',
    customers: 'Food manufacturers, hotels, restaurants, cafés and caterers.',
  },
]

/* How to apply (general; the registered prospectus sets out the exact procedures) */

export interface ApplicationChannel {
  title: string
  who: string
  how: string
}

export const APPLICATION_CHANNELS: readonly ApplicationChannel[] = [
  {
    title: 'Electronic Share Application',
    who: 'Malaysian public',
    how: 'Apply at the ATMs of participating financial institutions, using your bank card and CDS account number.',
  },
  {
    title: 'Internet Share Application',
    who: 'Malaysian public',
    how: 'Apply through the internet banking websites of participating financial institutions.',
  },
  {
    title: 'Application forms',
    who: 'Malaysian public and eligible persons',
    how: 'White forms are for the Malaysian public. Pink forms are for the eligible directors, employees and contributors offered shares in the pink-form tranche.',
  },
]

export const BEFORE_YOU_APPLY: readonly string[] = [
  'Read the registered prospectus in full, including its risk factors.',
  'Open a Central Depository System (CDS) account with Bursa Malaysia Depository, through a stockbroker, if you do not have one. Allotted shares are credited to this account.',
  'Use one channel only: as a rule, each person may make one application for the public tranche.',
  `Apply for a whole number of board lots (${SHARES_PER_LOT} shares each), and have the full amount payable ready.`,
]

export interface FaqEntry {
  question: string
  answer: string
}

export const IPO_FAQ: readonly FaqEntry[] = [
  {
    question: 'When do applications open?',
    answer: 'Applications open when the registered prospectus is issued. The opening and closing dates have not been announced yet; they will be in the prospectus and in our IPO timetable.',
  },
  {
    question: 'What is the minimum application?',
    answer: `Shares trade in board lots of ${SHARES_PER_LOT}. Applications are made for one board lot or more, in multiples of ${SHARES_PER_LOT} shares; the prospectus confirms the minimum.`,
  },
  {
    question: 'What is balloting?',
    answer: 'When more shares are applied for than the retail offering has, the issuing house draws a ballot, in a fair and equitable way, to decide which applications succeed.',
  },
  {
    question: 'When will I get a refund?',
    answer: 'If your application is unsuccessful or only partly successful, the money for the shares you do not receive is refunded without interest, within the period the prospectus sets out.',
  },
  {
    question: 'Who do I contact?',
    answer: `For questions about an application or its result, contact the issuing house, ${ISSUING_HOUSE}. For questions about Bestari Food Berhad, contact our Investor Relations team.`,
  },
]
