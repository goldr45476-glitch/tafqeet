import type { ArabicNounForms, Gender } from './types';

// ---------------------------------------------------------------------------
// Word banks
// ---------------------------------------------------------------------------

// 1 and 2: the number word AGREES with the counted noun's gender.
const ONE_WORD: Record<Gender, string> = { masculine: 'واحد', feminine: 'إحدى' };
const TWO_WORD: Record<Gender, string> = { masculine: 'اثنان', feminine: 'اثنتان' };

// 3-9 standalone (and as the "ones" part of 13-19, 23-29, ... 93-99):
// classical Arabic polarity rule — a MASCULINE noun takes the FEMININE-marked
// (taa-marbuta) number word, and a FEMININE noun takes the bare (masculine-looking) word.
const FEMININE_MARKED_ONES = ['', '', '', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const MASCULINE_MARKED_ONES = ['', '', '', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثمان', 'تسع'];

const TENS_WORDS = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];

const HUNDREDS_WORDS = [
  '',
  'مائة',
  'مائتان',
  'ثلاثمائة',
  'أربعمائة',
  'خمسمائة',
  'ستمائة',
  'سبعمائة',
  'ثمانمائة',
  'تسعمائة',
];

export interface ScaleForms {
  singular: string;
  dual: string;
  plural: string;
  accusative: string;
  construct: string;
}

// Scale words (ألف / مليون / مليار / تريليون / كوادريليون ...) are always
// masculine nouns, so the numbers that count them internally always use the
// masculine-noun agreement rules regardless of the currency's own gender.
export const SCALE_FORMS: (ScaleForms | null)[] = [
  null,
  { singular: 'ألف', dual: 'ألفان', plural: 'آلاف', accusative: 'ألفًا', construct: 'ألفَ' },
  { singular: 'مليون', dual: 'مليونان', plural: 'ملايين', accusative: 'مليونًا', construct: 'مليونَ' },
  { singular: 'مليار', dual: 'ملياران', plural: 'مليارات', accusative: 'مليارًا', construct: 'مليارَ' },
  { singular: 'تريليون', dual: 'تريليونان', plural: 'تريليونات', accusative: 'تريليونًا', construct: 'تريليونَ' },
  { singular: 'كوادريليون', dual: 'كوادريليونان', plural: 'كوادريليونات', accusative: 'كوادريليونًا', construct: 'كوادريليونَ' },
  { singular: 'كوينتليون', dual: 'كوينتليونان', plural: 'كوينتليونات', accusative: 'كوينتليونًا', construct: 'كوينتليونَ' },
];

// ---------------------------------------------------------------------------
// Grammatical helpers
// ---------------------------------------------------------------------------

/** Bucket used to pick the correct grammatical form based on "the last two digits". */
export type CountBucket = 'zero' | 'one' | 'two' | 'few' | 'many';

export function bucketOf(n: number): CountBucket {
  const r = ((n % 100) + 100) % 100;
  if (r === 0) return 'zero';
  if (r === 1) return 'one';
  if (r === 2) return 'two';
  if (r >= 3 && r <= 10) return 'few';
  return 'many';
}

export function pluralForm(n: number, forms: ScaleForms | ArabicNounForms): string {
  switch (bucketOf(n)) {
    case 'zero':
    case 'one':
      return forms.singular;
    case 'two':
      return forms.dual;
    case 'few':
      return forms.plural;
    case 'many':
    default:
      return forms.accusative;
  }
}

/**
 * When the count is exactly "...02" (bucket "two"), the dual form of the
 * counted noun (e.g. "ألفان" / "ديناران") already conveys "two" by itself —
 * so the standalone word "اثنان"/"اثنتان" that `threeDigitWord` produced for
 * that trailing digit must be dropped, not placed in front of the dual noun
 * (otherwise the result reads as the redundant "two two-thousand").
 * Any hundreds prefix that came before it (e.g. "مائة" in "102") is kept and
 * re-joined to the dual noun with "و", matching how every other component
 * of the number is joined.
 */
export function attachDualReplacingTwo(numberWords: string, dualForm: string): string {
  const tokens = numberWords.split(' و');
  const last = tokens[tokens.length - 1];
  if (last === 'اثنان' || last === 'اثنتان') {
    tokens.pop();
    const prefix = tokens.join(' و');
    return prefix ? `${prefix} و${dualForm}` : dualForm;
  }
  return `${numberWords} ${dualForm}`;
}

function onesWord(digit: number, gender: Gender): string {
  if (digit === 0) return '';
  if (digit === 1) return ONE_WORD[gender];
  if (digit === 2) return TWO_WORD[gender];
  return gender === 'masculine' ? FEMININE_MARKED_ONES[digit] : MASCULINE_MARKED_ONES[digit];
}

/** Converts a 0-99 value into Arabic words, honoring the counted noun's gender. */
function twoDigitWord(n: number, gender: Gender): string {
  if (n === 0) return '';
  if (n < 10) return onesWord(n, gender);
  if (n === 10) return gender === 'masculine' ? 'عشرة' : 'عشر';
  if (n === 11) return gender === 'masculine' ? 'أحد عشر' : 'إحدى عشرة';
  if (n === 12) return gender === 'masculine' ? 'اثنا عشر' : 'اثنتا عشرة';
  if (n < 20) {
    const ones = digit3to9Teen(n - 10, gender);
    const suffix = gender === 'masculine' ? 'عشر' : 'عشرة';
    return `${ones} ${suffix}`;
  }
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (ones === 0) return TENS_WORDS[tens];
  return `${onesWord(ones, gender)} و${TENS_WORDS[tens]}`;
}

// The "ones" part of 13-19 follows the same polarity rule as standalone 3-9.
function digit3to9Teen(digit: number, gender: Gender): string {
  return gender === 'masculine' ? FEMININE_MARKED_ONES[digit] : MASCULINE_MARKED_ONES[digit];
}

/** Converts a 0-999 value into Arabic words, honoring the counted noun's gender. */
export function threeDigitWord(n: number, gender: Gender): string {
  if (n === 0) return '';
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds > 0) parts.push(HUNDREDS_WORDS[hundreds]);
  if (rest > 0) parts.push(twoDigitWord(rest, gender));
  return parts.join(' و');
}

/**
 * Converts a non-negative BigInt into full Arabic words, grouping by
 * thousands/millions/billions/... The `gender` only affects the final
 * (rightmost, un-scaled) group — the group that is directly adjacent to
 * whatever noun ultimately follows (e.g. a currency name).
 */
export function integerToArabicWords(value: bigint, gender: Gender, directNoun: boolean = false): string {
  if (value < 0n) throw new Error('integerToArabicWords expects a non-negative value');
  if (value === 0n) return 'صفر';

  const groups: number[] = [];
  let remaining = value;
  while (remaining > 0n) {
    groups.push(Number(remaining % 1000n));
    remaining /= 1000n;
  }

  if (groups.length - 1 >= SCALE_FORMS.length) {
    throw new Error('Number is too large to be converted (exceeds supported scale words).');
  }

  // The scale word (ألف/مليون/...) closest to whatever noun follows the whole
  // number (e.g. a currency name) is the group with the smallest index that
  // still has a non-zero value — nothing else stands between it and that
  // noun. That group is grammatically "mudaf" to the noun, so its "many"
  // (11-99) accusative form must drop the tanween: "ألفَ" not "ألفًا".
  const nearestNonZeroIndex = groups.findIndex((g) => g !== 0);

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const groupValue = groups[i];
    if (groupValue === 0) continue;

    if (i === 0) {
      parts.push(threeDigitWord(groupValue, gender));
      continue;
    }

    const scale = SCALE_FORMS[i]!;
    const bucket = bucketOf(groupValue);
    let scaleWord = pluralForm(groupValue, scale);
    if (bucket === 'many' && directNoun && i === nearestNonZeroIndex) {
      scaleWord = scale.construct;
    }

    if (bucket === 'one' && groupValue === 1) {
      // "ألف" not "واحد ألف"
      parts.push(scaleWord);
    } else if (bucket === 'two') {
      // "ألفان" / "مائة وألفان", never "اثنان ألف" or "مائة واثنان ألفان"
      const groupWords = threeDigitWord(groupValue, 'masculine');
      parts.push(attachDualReplacingTwo(groupWords, scaleWord));
    } else {
      const groupWords = threeDigitWord(groupValue, 'masculine');
      parts.push(`${groupWords} ${scaleWord}`);
    }
  }

  return parts.join(' و');
}

export function arabicNegativePrefix(): string {
  return 'سالب';
}

export const ARABIC_ONLY_SUFFIX = 'فقط لا غير';
export const ARABIC_DECIMAL_SEPARATOR_WORD = 'فاصلة';
export const ARABIC_ZERO_WORD = 'صفر';
