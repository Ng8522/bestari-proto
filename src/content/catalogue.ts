/**
 * Distributor records migrated from https://www.bestarifood.com/distributors/ (November 2026),
 * used by the Onsite Outlets page (linked from the footer's Shop column).
 */
import type { LinkItem } from './site'

export interface Distributor {
  region: string
  name: string
  address: string
  phones: LinkItem[]
}

export interface DistributorGroup {
  id: 'retail' | 'food-service' | 'international'
  title: string
  description: string
  distributors: Distributor[]
  note?: string
}

/** Malaysian numbers as written on the old site, turned into tappable tel: links. */
function tel(label: string, number: string = label): LinkItem {
  const digits = number.replace(/[^\d+]/g, '')
  return { label, href: `tel:${digits.startsWith('+') ? digits : `+6${digits}`}` }
}

const KEE_HUA: Distributor = {
  region: 'Sarawak',
  name: 'Kee Hua Food Sdn Bhd',
  address: 'Sublot 28, Batu 9, Jalan Penrissen, 93250 Kuching, Sarawak',
  phones: [tel('082-614 473')],
}

export const DISTRIBUTOR_GROUPS: DistributorGroup[] = [
  {
    id: 'retail',
    title: 'Shops & retail',
    description: 'These distributors supply Bestari to grocers, minimarts and supermarkets in each state.',
    distributors: [
      {
        region: 'Kedah',
        name: 'Aintai Jitra Sdn Bhd',
        address: 'No. 13, Kawasan Perindustrian, Bandar Darul Aman, 06000 Jitra, Kedah',
        phones: [tel('04-917 2714')],
      },
      {
        region: 'Penang',
        name: 'Aintai Corporation Sdn Bhd',
        address: '1101, Jalan Makmur 6/7, Taman Industri Makmur, 09600 Lunas, Kedah',
        phones: [tel('04-484 2340')],
      },
      {
        region: 'Perak',
        name: 'Lein Hing Enterprise (Perak) Sdn Bhd',
        address: 'No. 17, Persiaran Kilang Jelapang, Industrial Estate, 30100 Ipoh, Perak',
        phones: [tel('05-526 2216')],
      },
      {
        region: 'Selangor & Kuala Lumpur',
        name: 'Kapaly Distributor (M) Sdn Bhd',
        address: 'Lot 9157, Jalan Besar, Telok Gong, 42000 Port Klang, Selangor',
        phones: [tel('03-3134 1361'), tel('03-3134 3527')],
      },
      {
        region: 'Negeri Sembilan',
        name: 'YFM Distributors Sdn Bhd',
        address: 'Lot 3983, Warehouse 2, Jalan Haruan 1, Oakland Industrial Park, 70300 Seremban, Negeri Sembilan',
        phones: [tel('06-761 3360')],
      },
      {
        region: 'Melaka',
        name: 'Hublong Oil and Food Sdn Bhd',
        address: 'Plot 2-42 & 2-43, Jalan TTC 10, Kawasan Perindustrian Cheng, 75250 Melaka',
        phones: [tel('06-335 1968'), tel('06-337 2023')],
      },
      {
        region: 'Yong Peng, Johor',
        name: 'Koh Soon Huat (Yong Peng) Sdn Bhd',
        address: 'Lot 246–247, Batu 1¼, Jalan Air Hitam, 83700 Yong Peng, Johor',
        phones: [tel('07-467 2381')],
      },
      {
        region: 'Johor Bahru',
        name: 'Massive Distribution Sdn Bhd',
        address: 'PTD 149229, Jalan Berjaya 8, Taman Perindustrian Berjaya, Kempas Lama, 81200 Johor Bahru, Johor',
        phones: [tel('07-559 9753 / 754 / 755', '07-559 9753')],
      },
      {
        region: 'Temerloh, Pahang',
        name: 'Yong Soon Marketing Sdn Bhd (Temerloh)',
        address: 'No. 81, Kawasan Perindustrian Songsang, 28000 Temerloh, Pahang',
        phones: [tel('09-278 1306')],
      },
      {
        region: 'Kuantan, Pahang',
        name: 'Yong Soon Marketing Sdn Bhd (Kuantan)',
        address: 'No. 7, Jalan IM 3/1, Kawasan Perindustrian Indera Mahkota 3, 25200 Kuantan, Pahang',
        phones: [tel('09-573 8750 / 51', '09-573 8750')],
      },
      {
        region: 'Kelantan & Terengganu',
        name: 'Golden CKS Marketing Sdn Bhd',
        address: 'Lot 3357 & 3358, Kawasan Perindustrian Pengkalan Chepa 2, 16100 Kota Bharu, Kelantan',
        phones: [tel('09-771 8896'), tel('09-771 8898')],
      },
      {
        region: 'Sabah & Labuan',
        name: 'Syarikat Lui Kim Chock Sdn Bhd',
        address: 'Lot 17-18, Taman Victory, Mile 4½, Jalan Penampang, 88300 Kota Kinabalu, Sabah',
        phones: [tel('088-727 921'), tel('088-727 981')],
      },
      KEE_HUA,
    ],
  },
  {
    id: 'food-service',
    title: 'Food service',
    description: 'For restaurants, caterers, hawkers and cafés buying in bulk.',
    distributors: [
      {
        region: 'Puchong, Selangor',
        name: 'Best Marketing & Distribution Sdn Bhd',
        address: '9, Jalan Rajawali 1A, Bandar Puchong Jaya, 47170 Puchong, Selangor',
        phones: [tel('+60 3 2386 6085 / 86', '+60 3 2386 6085')],
      },
      {
        region: 'Kuala Lumpur',
        name: 'Q’Zine Gallery Sdn Bhd',
        address: '37, Jalan Perdana 6/8, Pandan Perdana, 55300 Kuala Lumpur',
        phones: [tel('+60 3 9285 0818')],
      },
      {
        region: 'Seri Kembangan, Selangor',
        name: 'Pemborong Barang Runcit Soon Sheng',
        address: '120, Jalan Taming 6, Taman Taming Jaya, 43300 Seri Kembangan, Selangor',
        phones: [tel('011-2805 9484')],
      },
      {
        region: 'Sabah',
        name: 'Woo Joo Food Sdn Bhd',
        address: 'Lot 5, Jalan Buah Duku 1, Kolombong Industrial, Inanam, 88769 Kota Kinabalu, Sabah',
        phones: [tel('+60 88 435 511')],
      },
      KEE_HUA,
    ],
    note: 'Food service sales for West Malaysia: +60 12-969 0780 (Jia Maine).',
  },
  {
    id: 'international',
    title: 'Outside Malaysia',
    description: 'Bestari is exported through partners abroad.',
    distributors: [
      {
        region: 'Saudi Arabia',
        name: 'Khairat Alastoura Trading Company',
        address: 'King Faisal Road, Al-Mahjar District, Modern Warehouses, 22511 Jeddah, Saudi Arabia',
        phones: [],
      },
    ],
    note: 'Brunei, Australia, Cambodia, Sri Lanka and other markets: contact our export team at gabriel (at) synerchem.com.my.',
  },
]
