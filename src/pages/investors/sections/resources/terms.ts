/**
 * IR website terms of use: a DRAFT for legal review, not in force. General wording for a Malaysian listed
 * company's IR site; company facts (name, registration number) come from content/prospectus.ts.
 */
import { CORPORATE_DIRECTORY } from '../../content/prospectus'
import { COMPANY } from '../../../../content/site'

export interface TermsSection {
  /** Anchor id, e.g. "terms-privacy". */
  id: string
  title: string
  paragraphs: readonly string[]
}

const REGISTRATION = CORPORATE_DIRECTORY.find((entry) => entry.label === 'Registration no.')?.lines[0]
const COMPANY_LINE = REGISTRATION ? `${COMPANY.name} (Registration No. ${REGISTRATION})` : COMPANY.name

/** Anchor of the privacy section, linked from the news alerts form. */
export const PRIVACY_SECTION_ID = 'terms-privacy'

export const TERMS_SECTIONS: readonly TermsSection[] = [
  {
    id: 'terms-information',
    title: 'Information only',
    paragraphs: [
      `This Investor Relations website is published by ${COMPANY_LINE} (“we”, “us”) to give general information about us and our subsidiaries (the “Group”) to shareholders, investors and the public. By using it, you agree to these terms.`,
      'Nothing on this website is investment, financial, legal or tax advice. It does not take into account your objectives, financial situation or needs. Please consult your own licensed adviser before making any investment decision.',
    ],
  },
  {
    id: 'terms-not-an-offer',
    title: 'Not an offer',
    paragraphs: [
      'Nothing on this website is an offer for subscription or purchase of, or an invitation to subscribe for or purchase, any securities of ours, in Malaysia or anywhere else. It is not directed at anyone in a jurisdiction where publishing or using it would be unlawful.',
      'Applications for shares in our initial public offering may be made only on the basis of the prospectus registered with the Securities Commission Malaysia (SC), in the manner it sets out. The draft prospectus on the SC’s prospectus exposure page is unregistered, incomplete and may change.',
      'The SC’s approval of our listing, and its registration of our prospectus, do not mean that the SC recommends the offering or takes responsibility for the merits of our shares.',
    ],
  },
  {
    id: 'terms-forward-looking',
    title: 'Forward-looking statements',
    paragraphs: [
      'Some content describes our plans, expectations and intentions, such as how we intend to use the proceeds of our IPO. These forward-looking statements are based on our current views and assumptions, and involve risks and uncertainties that could make actual results differ materially.',
      'Do not place undue reliance on them. We are not obliged to update them, except where the law or the Bursa Malaysia Main Market Listing Requirements require it.',
    ],
  },
  {
    id: 'terms-accuracy',
    title: 'Accuracy and third-party data',
    paragraphs: [
      `We take reasonable care to keep this website accurate and up to date, but we do not warrant that it is complete, accurate or current. Financial figures are taken from the draft prospectus and press reports, and may be revised in the registered prospectus.`,
      'Share price, trading and market data, when shown, come from third-party providers. They may be delayed and are for reference only; we are not responsible for them.',
      'Our announcements to Bursa Malaysia are the official version of our disclosures. Where this website differs from an announcement, the announcement prevails.',
    ],
  },
  {
    id: 'terms-links',
    title: 'Links to other websites',
    paragraphs: [
      'This website links to websites run by others, such as the SC, Bursa Malaysia and news publishers. Those links open in a new tab and are for your convenience only. We do not control those websites and are not responsible for their content, and a link is not an endorsement.',
    ],
  },
  {
    id: 'terms-ip',
    title: 'Intellectual property',
    paragraphs: [
      'The content of this website, including its text, graphics, logos, images and design, belongs to us or to our licensors.',
      'You may view, download and print it for your own personal, non-commercial use, provided you keep any copyright and other notices. Any other use, including copying, changing or republishing it, needs our prior written permission.',
    ],
  },
  {
    id: 'terms-liability',
    title: 'Limitation of liability',
    paragraphs: [
      'To the fullest extent permitted by law, neither we nor our directors, officers, employees or advisers are liable for any loss or damage, direct or indirect, arising from your use of, or reliance on, this website or any website linked to it.',
      'This includes loss caused by errors or omissions in the content, by delays or interruptions in access, or by viruses or other harmful code.',
    ],
  },
  {
    id: PRIVACY_SECTION_ID,
    title: 'Privacy and personal data',
    paragraphs: [
      'When you sign up for news alerts or send us an enquiry, we collect the personal data you give us, such as your name, email address and message. We use it only to send you the alerts you chose and to reply to you, and we process it in line with the Personal Data Protection Act 2010.',
      'We may use service providers, such as an email delivery service, to process it on our behalf. You may ask to access or correct your personal data, or withdraw your consent, by contacting our IR team. Our full IR privacy notice will be published with these terms.',
    ],
  },
  {
    id: 'terms-changes',
    title: 'Changes to these terms',
    paragraphs: [
      'We may change these terms at any time by posting a new version on this page, with the date it was last updated. If you keep using the website after a change, you accept the new terms.',
    ],
  },
  {
    id: 'terms-law',
    title: 'Governing law',
    paragraphs: [
      'These terms are governed by the laws of Malaysia. You agree to submit to the jurisdiction of the courts of Malaysia for any dispute arising from them or from your use of this website.',
    ],
  },
]
