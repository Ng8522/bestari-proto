import { Ph } from '../../../../components/text'
import { COMPANY } from '../../../../content/site'
import { CORPORATE_DIRECTORY } from '../../content/prospectus'
import { IR_EMAIL_PLACEHOLDER } from '../../data'
import { PAGE_TITLE_ID, PageHeader, Panel } from '../../ui/PageParts'
import { SectionTabs, type SectionTab } from '../../ui/SectionTabs'
import { EnquiryForm } from './EnquiryForm'
import './contact.css'

function directoryLines(label: string): readonly string[] {
  return CORPORATE_DIRECTORY.find((entry) => entry.label === label)?.lines ?? []
}

interface ContactCard {
  title: string
  role: string
  lines: readonly string[]
}

const OTHER_CONTACTS: readonly ContactCard[] = [
  {
    title: 'Share registrar',
    role: 'Shareholding records, change of address and dividend payments, after listing.',
    lines: directoryLines('Share registrar'),
  },
  {
    title: 'Issuing house',
    role: 'IPO share applications and balloting.',
    lines: directoryLines('Issuing house'),
  },
  {
    title: 'Principal adviser',
    role: 'Principal adviser, sole underwriter and sole placement agent for the IPO.',
    lines: directoryLines('Principal adviser, sole underwriter & sole placement agent'),
  },
  {
    title: 'Registered office',
    role: 'Statutory notices and company secretarial matters.',
    lines: [...directoryLines('Registered office'), ...directoryLines('Company secretaries')],
  },
]

/** /investor-relations/contact: the IR team, the enquiry form, and who else to contact for what. */
export function IrContactPage() {
  return (
    <article className="wrap wrap--wide ir-page" aria-labelledby={PAGE_TITLE_ID}>
      <PageHeader title="Talk to our IR team" intro="Contact us for any matter relating to investor relations." />
      <SectionTabs tabs={CONTACT_TABS} />
    </article>
  )
}

function IrTeam() {
  return (
    <div className="contact reveal">
      <div>
        <p className="eyebrow">Investor relations</p>
        <h3 className="contact-title">{COMPANY.name}</h3>
        <dl className="contact-details">
          <div>
            <dt>Contact person</dt>
            <dd>
              <Ph>Name per company</Ph>
            </dd>
          </div>
          <div>
            <dt>Telephone</dt>
            <dd>
              <a href={COMPANY.phone.href}>{COMPANY.phone.label}</a>
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <Ph>{IR_EMAIL_PLACEHOLDER}</Ph>
            </dd>
          </div>
          <div>
            <dt>Head office</dt>
            <dd>{COMPANY.addressLines.join(' ')}</dd>
          </div>
        </dl>
      </div>
      <EnquiryForm />
    </div>
  )
}

function OtherContacts() {
  return (
    <div className="grid-2">
      {OTHER_CONTACTS.map((card) => (
        <Panel key={card.title} title={card.title} sub={card.role}>
          <address className="contact-address">
            {card.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </Panel>
      ))}
    </div>
  )
}

type ContactTab = 'ir-team' | 'others'

const CONTACT_TABS: readonly SectionTab<ContactTab>[] = [
  { id: 'ir-team', label: 'IR team', content: <IrTeam /> },
  { id: 'others', label: 'Registrar & advisers', content: <OtherContacts /> },
]
