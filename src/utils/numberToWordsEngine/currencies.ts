import type { CurrencyDefinition } from './types';

/**
 * Currency registry for the Tafqeet / Number-to-Words engine.
 *
 * Adding a new currency is a single new entry in this array — nothing else in
 * the engine needs to change. `decimalPlaces` follows each currency's real-world
 * minor-unit precision (e.g. 3 for Iraqi/Kuwaiti/Jordanian dinars, 2 for most others).
 *
 * Arabic noun forms are pre-computed per currency (singular / dual / plural /
 * accusative) rather than derived at runtime, so every currency's grammar can be
 * reviewed and corrected independently — Arabic plurals are often irregular
 * ("broken plurals") and cannot be derived from the singular by a fixed rule.
 */
export const CURRENCIES: CurrencyDefinition[] = [
  {
    code: 'IQD',
    nameAr: 'دينار عراقي',
    nameEn: 'Iraqi Dinar',
    symbol: 'د.ع',
    decimalPlaces: 3,
    major: {
      gender: 'masculine',
      ar: { singular: 'دينار عراقي', dual: 'ديناران عراقيان', plural: 'دنانير عراقية', accusative: 'دينارًا عراقيًا' },
      enSingular: 'Iraqi Dinar',
      enPlural: 'Iraqi Dinars',
    },
    minor: {
      gender: 'masculine',
      ar: { singular: 'فلس', dual: 'فلسان', plural: 'فلوس', accusative: 'فلسًا' },
      enSingular: 'Fils',
      enPlural: 'Fils',
    },
  },
  {
    code: 'USD',
    nameAr: 'دولار أمريكي',
    nameEn: 'US Dollar',
    symbol: '$',
    decimalPlaces: 2,
    major: {
      gender: 'masculine',
      ar: { singular: 'دولار أمريكي', dual: 'دولاران أمريكيان', plural: 'دولارات أمريكية', accusative: 'دولارًا أمريكيًا' },
      enSingular: 'US Dollar',
      enPlural: 'US Dollars',
    },
    minor: {
      gender: 'masculine',
      ar: { singular: 'سنت', dual: 'سنتان', plural: 'سنتات', accusative: 'سنتًا' },
      enSingular: 'Cent',
      enPlural: 'Cents',
    },
  },
  {
    code: 'EUR',
    nameAr: 'يورو',
    nameEn: 'Euro',
    symbol: '€',
    decimalPlaces: 2,
    major: {
      gender: 'masculine',
      ar: { singular: 'يورو', dual: 'يورو', plural: 'يوروهات', accusative: 'يورو' },
      enSingular: 'Euro',
      enPlural: 'Euros',
    },
    minor: {
      gender: 'masculine',
      ar: { singular: 'سنت', dual: 'سنتان', plural: 'سنتات', accusative: 'سنتًا' },
      enSingular: 'Cent',
      enPlural: 'Cents',
    },
  },
  {
    code: 'GBP',
    nameAr: 'جنيه إسترليني',
    nameEn: 'British Pound',
    symbol: '£',
    decimalPlaces: 2,
    major: {
      gender: 'masculine',
      ar: {
        singular: 'جنيه إسترليني',
        dual: 'جنيهان إسترلينيان',
        plural: 'جنيهات إسترلينية',
        accusative: 'جنيهًا إسترلينيًا',
      },
      enSingular: 'British Pound',
      enPlural: 'British Pounds',
    },
    minor: {
      gender: 'masculine',
      ar: { singular: 'بنس', dual: 'بنسان', plural: 'بنسات', accusative: 'بنسًا' },
      enSingular: 'Penny',
      enPlural: 'Pence',
    },
  },
  {
    code: 'SAR',
    nameAr: 'ريال سعودي',
    nameEn: 'Saudi Riyal',
    symbol: 'ر.س',
    decimalPlaces: 2,
    major: {
      gender: 'masculine',
      ar: { singular: 'ريال سعودي', dual: 'ريالان سعوديان', plural: 'ريالات سعودية', accusative: 'ريالًا سعوديًا' },
      enSingular: 'Saudi Riyal',
      enPlural: 'Saudi Riyals',
    },
    minor: {
      gender: 'feminine',
      ar: { singular: 'هللة', dual: 'هللتان', plural: 'هللات', accusative: 'هللةً' },
      enSingular: 'Halala',
      enPlural: 'Halalas',
    },
  },
  {
    code: 'AED',
    nameAr: 'درهم إماراتي',
    nameEn: 'UAE Dirham',
    symbol: 'د.إ',
    decimalPlaces: 2,
    major: {
      gender: 'masculine',
      ar: {
        singular: 'درهم إماراتي',
        dual: 'درهمان إماراتيان',
        plural: 'دراهم إماراتية',
        accusative: 'درهمًا إماراتيًا',
      },
      enSingular: 'UAE Dirham',
      enPlural: 'UAE Dirhams',
    },
    minor: {
      gender: 'masculine',
      ar: { singular: 'فلس', dual: 'فلسان', plural: 'فلوس', accusative: 'فلسًا' },
      enSingular: 'Fils',
      enPlural: 'Fils',
    },
  },
  {
    code: 'KWD',
    nameAr: 'دينار كويتي',
    nameEn: 'Kuwaiti Dinar',
    symbol: 'د.ك',
    decimalPlaces: 3,
    major: {
      gender: 'masculine',
      ar: { singular: 'دينار كويتي', dual: 'ديناران كويتيان', plural: 'دنانير كويتية', accusative: 'دينارًا كويتيًا' },
      enSingular: 'Kuwaiti Dinar',
      enPlural: 'Kuwaiti Dinars',
    },
    minor: {
      gender: 'masculine',
      ar: { singular: 'فلس', dual: 'فلسان', plural: 'فلوس', accusative: 'فلسًا' },
      enSingular: 'Fils',
      enPlural: 'Fils',
    },
  },
  {
    code: 'JOD',
    nameAr: 'دينار أردني',
    nameEn: 'Jordanian Dinar',
    symbol: 'د.أ',
    decimalPlaces: 3,
    major: {
      gender: 'masculine',
      ar: { singular: 'دينار أردني', dual: 'ديناران أردنيان', plural: 'دنانير أردنية', accusative: 'دينارًا أردنيًا' },
      enSingular: 'Jordanian Dinar',
      enPlural: 'Jordanian Dinars',
    },
    minor: {
      gender: 'masculine',
      ar: { singular: 'فلس', dual: 'فلسان', plural: 'فلوس', accusative: 'فلسًا' },
      enSingular: 'Fils',
      enPlural: 'Fils',
    },
  },
  {
    code: 'TRY',
    nameAr: 'ليرة تركية',
    nameEn: 'Turkish Lira',
    symbol: '₺',
    decimalPlaces: 2,
    major: {
      gender: 'feminine',
      ar: { singular: 'ليرة تركية', dual: 'ليرتان تركيتان', plural: 'ليرات تركية', accusative: 'ليرةً تركيةً' },
      enSingular: 'Turkish Lira',
      enPlural: 'Turkish Liras',
    },
    minor: {
      gender: 'masculine',
      ar: { singular: 'قرش', dual: 'قرشان', plural: 'قروش', accusative: 'قرشًا' },
      enSingular: 'Kurus',
      enPlural: 'Kurus',
    },
  },
  {
    code: 'IDR',
    nameAr: 'روبية إندونيسية',
    nameEn: 'Indonesian Rupiah',
    symbol: 'Rp',
    decimalPlaces: 2,
    major: {
      gender: 'feminine',
      ar: {
        singular: 'روبية إندونيسية',
        dual: 'روبيتان إندونيسيتان',
        plural: 'روبيات إندونيسية',
        accusative: 'روبيةً إندونيسيةً',
      },
      enSingular: 'Indonesian Rupiah',
      enPlural: 'Indonesian Rupiah',
    },
    minor: {
      gender: 'masculine',
      ar: { singular: 'سنت', dual: 'سنتان', plural: 'سنتات', accusative: 'سنتًا' },
      enSingular: 'Sen',
      enPlural: 'Sen',
    },
  },
  {
    code: 'MYR',
    nameAr: 'رينغيت ماليزي',
    nameEn: 'Malaysian Ringgit',
    symbol: 'RM',
    decimalPlaces: 2,
    major: {
      gender: 'masculine',
      ar: {
        singular: 'رينغيت ماليزي',
        dual: 'رينغيتان ماليزيان',
        plural: 'رينغيتات ماليزية',
        accusative: 'رينغيتًا ماليزيًا',
      },
      enSingular: 'Malaysian Ringgit',
      enPlural: 'Malaysian Ringgit',
    },
    minor: {
      gender: 'masculine',
      ar: { singular: 'سنت', dual: 'سنتان', plural: 'سنتات', accusative: 'سنتًا' },
      enSingular: 'Sen',
      enPlural: 'Sen',
    },
  },
];

export function getCurrency(code: string | null | undefined): CurrencyDefinition | null {
  if (!code) return null;
  return CURRENCIES.find((c) => c.code === code) ?? null;
}

export const DEFAULT_CURRENCY_CODE = 'IQD';
