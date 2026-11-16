import { useState, type ReactElement } from 'react'
import { DIVIDEND_POLICY } from '../../content/sections'
import { DataTable, type Column } from '../../ui/DataTable'
import { FilterBar, SelectField, type Option } from '../../ui/Filters'
import { Notice, Panel } from '../../ui/PageParts'
import { ALL, entitlementYears, filterEntitlements, type EntitlementCriteria } from './calc'
import { ENTITLEMENT_TYPE_LABELS, ENTITLEMENTS, KEY_DATES, type Entitlement, type EntitlementType } from './content'
import { todayIso } from './dates'
import { formatIsoDate } from './format'

const ALL_CRITERIA: EntitlementCriteria = { year: ALL, type: ALL }

type TypeFilter = EntitlementCriteria['type']

const TYPE_OPTIONS: readonly Option<TypeFilter>[] = [
  { value: ALL, label: 'All types' },
  ...(Object.keys(ENTITLEMENT_TYPE_LABELS) as EntitlementType[]).map((type) => ({
    value: type,
    label: ENTITLEMENT_TYPE_LABELS[type],
  })),
]

const YEAR_OPTIONS: readonly Option[] = [
  { value: ALL, label: 'All years' },
  ...entitlementYears(ENTITLEMENTS, todayIso().slice(0, 4)).map((year) => ({ value: year, label: year })),
]

const ENTITLEMENT_COLUMNS: readonly Column<Entitlement>[] = [
  { key: 'announced', header: 'Announced', render: (row) => formatIsoDate(row.announced) },
  { key: 'exDate', header: 'Ex-date', render: (row) => formatIsoDate(row.exDate) },
  { key: 'entitlementDate', header: 'Entitlement date', render: (row) => formatIsoDate(row.entitlementDate) },
  { key: 'paymentDate', header: 'Payment date', render: (row) => formatIsoDate(row.paymentDate) },
  { key: 'type', header: 'Type', render: (row) => ENTITLEMENT_TYPE_LABELS[row.type] },
  { key: 'details', header: 'Details', render: (row) => row.details, isRowHeader: true },
  { key: 'rate', header: 'Rate', render: (row) => row.rate, align: 'right' },
]

/** Stock Info › Entitlements: the dividend policy and every declared entitlement with its key dates. */
export function Entitlements(): ReactElement {
  const [criteria, setCriteria] = useState<EntitlementCriteria>(ALL_CRITERIA)
  const rows = filterEntitlements(ENTITLEMENTS, criteria)

  return (
    <>
      <DividendPolicy />
      <Panel title="Declared entitlements" sub="Newest first">
        <FilterBar label="Filter entitlements" onReset={() => setCriteria(ALL_CRITERIA)}>
          <SelectField
            id="ent-year"
            label="Year"
            value={criteria.year}
            options={YEAR_OPTIONS}
            onChange={(year) => setCriteria({ ...criteria, year })}
          />
          <SelectField<TypeFilter>
            id="ent-type"
            label="Entitlement type"
            value={criteria.type}
            options={TYPE_OPTIONS}
            onChange={(type) => setCriteria({ ...criteria, type })}
          />
        </FilterBar>
        <DataTable
          caption="Dividends and other entitlements"
          columns={ENTITLEMENT_COLUMNS}
          rows={rows}
          rowKey={(row) => row.id}
          emptyMessage={ENTITLEMENTS.length === 0 ? 'No entitlements declared yet.' : 'No entitlements match these filters.'}
          minWidth={860}
        />
      </Panel>
      <Notice tone="pending">
        Bestari Food Berhad is not listed yet. Each dividend or other entitlement is added here when it is announced
        to Bursa Malaysia.
      </Notice>
      <KeyDates />
    </>
  )
}

function DividendPolicy(): ReactElement {
  return (
    <Panel title="Dividend policy" sub="As set out in the prospectus">
      <p className="policy-lede">{DIVIDEND_POLICY}</p>
      <p className="note">
        The full policy, including what the Board considers before recommending a dividend, is in the prospectus.
      </p>
    </Panel>
  )
}

function KeyDates(): ReactElement {
  return (
    <Panel title="Key dates explained">
      <dl className="key-dates">
        {KEY_DATES.map((entry) => (
          <div key={entry.term}>
            <dt>{entry.term}</dt>
            <dd>{entry.meaning}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}
