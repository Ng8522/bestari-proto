import { Ph } from '../../components/text'
import { BOARD_LEAD, BOARD_MEMBERS, BOARD_NOTE, type BoardMember } from './data'
import { IrSection, SectionHead } from './Section'

/** Leadership grid: the Managing Director's card spans two columns, then senior management and placeholders. */
export function Board() {
  return (
    <IrSection id="board" className="sec--tinted">
      <SectionHead sectionId="board" eyebrow="Leadership" title="Board & key senior management." />
      <ul className="people">
        <li className="pp pp--lead reveal">
          <Portrait />
          <div className="pp-body">
            <p className="eyebrow pp-role">{BOARD_LEAD.title}</p>
            <h3 className="pp-name">{BOARD_LEAD.name}</h3>
            <p className="pp-role">{BOARD_LEAD.summary}</p>
          </div>
        </li>
        {BOARD_MEMBERS.map((member, index) => (
          <PersonCard key={`${member.name}-${index}`} member={member} />
        ))}
      </ul>
      <p className="note">{BOARD_NOTE}</p>
    </IrSection>
  )
}

/** Striped portrait placeholder until photography is supplied. */
function Portrait() {
  return (
    <div className="pp-img" aria-hidden="true">
      [ portrait ]
    </div>
  )
}

interface PersonCardProps {
  member: BoardMember
}

function PersonCard({ member }: PersonCardProps) {
  return (
    <li className="pp reveal">
      <Portrait />
      <div className="pp-body">
        <h3 className="pp-name">{member.placeholder === 'name' ? <Ph>{member.name}</Ph> : member.name}</h3>
        <p className="pp-role">{member.placeholder === 'role' ? <Ph>{member.role}</Ph> : member.role}</p>
      </div>
    </li>
  )
}
