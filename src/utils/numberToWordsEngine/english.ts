// English number-to-words core. Simpler grammar than Arabic: no gender, only
// a singular/plural distinction driven by a plain count === 1 check.

const ONES = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

export const SCALE_WORDS_EN = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion'];

function twoDigitWord(n: number): string {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones > 0 ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens];
}

function threeDigitWord(n: number): string {
  if (n === 0) return '';
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (hundreds > 0) parts.push(`${ONES[hundreds]} Hundred`);
  if (rest > 0) parts.push(twoDigitWord(rest));
  return parts.join(' ');
}

export function integerToEnglishWords(value: bigint): string {
  if (value < 0n) throw new Error('integerToEnglishWords expects a non-negative value');
  if (value === 0n) return 'Zero';

  const groups: number[] = [];
  let remaining = value;
  while (remaining > 0n) {
    groups.push(Number(remaining % 1000n));
    remaining /= 1000n;
  }

  if (groups.length - 1 >= SCALE_WORDS_EN.length) {
    throw new Error('Number is too large to be converted (exceeds supported scale words).');
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    const groupValue = groups[i];
    if (groupValue === 0) continue;
    const words = threeDigitWord(groupValue);
    parts.push(i > 0 ? `${words} ${SCALE_WORDS_EN[i]}` : words);
  }

  return parts.join(' ');
}

export function pluralizeEnglish(count: bigint | number, singular: string, plural: string): string {
  const isOne = typeof count === 'bigint' ? count === 1n : count === 1;
  return isOne ? singular : plural;
}

export const ENGLISH_ONLY_SUFFIX = 'Only';
export const ENGLISH_DECIMAL_SEPARATOR_WORD = 'Point';
export const ENGLISH_ZERO_WORD = 'Zero';
export const ENGLISH_NEGATIVE_PREFIX = 'Negative';
export const ENGLISH_AND = 'and';
