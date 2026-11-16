/** The Group’s business activities (company overview). Revenue by segment is in prospectus.ts. */
export interface Segment {
  name: string
  description: string
}

export const SEGMENTS: readonly Segment[] = [
  { name: 'Food premixes', description: 'Bestari-brand retail and commercial packs' },
  { name: 'Food ingredients', description: 'Supply of food ingredients' },
  { name: 'Food processing & production equipment', description: 'Equipment for food manufacturers' },
  { name: 'Spare parts & maintenance services', description: 'After-sales support for equipment' },
]
