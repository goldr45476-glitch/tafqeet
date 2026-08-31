import { parseAmountString, scaleToUnits } from './parseAmount';
import {
  ARABIC_DECIMAL_SEPARATOR_WORD,
  ARABIC_ONLY_SUFFIX,
  ARABIC_ZERO_WORD,
  arabicNegativePrefix,
  attachDualReplacingTwo,
  bucketOf,
  integerToArabicWords,
  pluralForm,
} from './arabic';
import {
  ENGLISH_AND,
  ENGLISH_DECIMAL_SEPARATOR_WORD,
  ENGLISH_NEGATIVE_PREFIX,
  ENGLISH_ONLY_SUFFIX,
  integerToEnglishWords,
  pluralizeEnglish,
} from './english';
import { getCurrency } from './currencies';
import type { ConvertNumberOptions, ConvertNumberOutcome } from './types';

const MAX_SUPPORTED_DIGITS = 21; // supports well beyond quadrillions

export function convertNumberToWords(options: ConvertNumberOptions): ConvertNumberOutcome {
  const { rawValue, currencyCode } = options;

  const parsed = parseAmountString(rawValue);
  if (!parsed) {
    return { success: false, errorKey: rawValue?.trim() === '' ? 'empty' : 'invalid' };
  }

  if (parsed.integerPart.toString().length > MAX_SUPPORTED_DIGITS) {
    return { success: false, errorKey: 'too_large' };
  }

  const currency = getCurrency(currencyCode);
  const decimalPlaces = options.decimalPlaces ?? currency?.decimalPlaces ?? 2;
  const includeSubunit = options.includeSubunit ?? true;
  const addOnly = options.addOnly ?? true;
  const onlyPosition = options.onlyPosition ?? 'start';

  const { integerUnits, minorUnits } = scaleToUnits(parsed, decimalPlaces);

  const wordsAr = currency
    ? buildCurrencyArabic(integerUnits, minorUnits, parsed.negative, currency, includeSubunit, addOnly, onlyPosition)
    : buildPlainArabic(integerUnits, minorUnits, decimalPlaces, parsed.negative, addOnly, onlyPosition);

  const wordsEn = currency
    ? buildCurrencyEnglish(integerUnits, minorUnits, parsed.negative, currency, includeSubunit, addOnly)
    : buildPlainEnglish(integerUnits, minorUnits, decimalPlaces, parsed.negative, addOnly);

  return {
    success: true,
    negative: parsed.negative,
    integerUnits,
    minorUnits,
    decimalPlaces,
    wordsAr,
    wordsEn,
  };
}

// ---------------------------------------------------------------------------
// Arabic composition
// ---------------------------------------------------------------------------

function buildCurrencyArabic(
  units: bigint,
  minorUnits: number,
  negative: boolean,
  currency: NonNullable<ReturnType<typeof getCurrency>>,
  includeSubunit: boolean,
  addOnly: boolean,
  onlyPosition: 'start' | 'end',
): string {
  const showMinor = includeSubunit && currency.minor !== null && minorUnits > 0;
  const showMajor = !(units === 0n && showMinor);

  const parts: string[] = [];

  if (showMajor) {
    const majorWords = integerToArabicWords(units, currency.major.gender, true);
    const majorMod100 = Number(units % 100n);
    const majorNoun = pluralForm(majorMod100, currency.major.ar);
    parts.push(
      bucketOf(majorMod100) === 'two' ? attachDualReplacingTwo(majorWords, majorNoun) : `${majorWords} ${majorNoun}`,
    );
  }

  if (showMinor && currency.minor) {
    const minorWords = integerToArabicWords(BigInt(minorUnits), currency.minor.gender, true);
    const minorNoun = pluralForm(minorUnits % 100, currency.minor.ar);
    parts.push(
      bucketOf(minorUnits) === 'two' ? attachDualReplacingTwo(minorWords, minorNoun) : `${minorWords} ${minorNoun}`,
    );
  }

  let result = parts.join(' و');
  if (negative) result = `${arabicNegativePrefix()} ${result}`;
  if (addOnly) {
    result = onlyPosition === 'start' ? `${ARABIC_ONLY_SUFFIX} ${result}` : `${result} ${ARABIC_ONLY_SUFFIX}`;
  }
  return result;
}

function buildPlainArabic(
  units: bigint,
  minorUnits: number,
  decimalPlaces: number,
  negative: boolean,
  addOnly: boolean,
  onlyPosition: 'start' | 'end',
): string {
  let result = integerToArabicWords(units, 'masculine');
  if (decimalPlaces > 0 && minorUnits > 0) {
    result += ` ${ARABIC_DECIMAL_SEPARATOR_WORD} ${integerToArabicWords(BigInt(minorUnits), 'masculine')}`;
  } else if (units === 0n && minorUnits === 0) {
    result = ARABIC_ZERO_WORD;
  }
  if (negative) result = `${arabicNegativePrefix()} ${result}`;
  if (addOnly) {
    result = onlyPosition === 'start' ? `${ARABIC_ONLY_SUFFIX} ${result}` : `${result} ${ARABIC_ONLY_SUFFIX}`;
  }
  return result;
}

// ---------------------------------------------------------------------------
// English composition
// ---------------------------------------------------------------------------

function buildCurrencyEnglish(
  units: bigint,
  minorUnits: number,
  negative: boolean,
  currency: NonNullable<ReturnType<typeof getCurrency>>,
  includeSubunit: boolean,
  addOnly: boolean,
): string {
  const showMinor = includeSubunit && currency.minor !== null && minorUnits > 0;
  const showMajor = !(units === 0n && showMinor);

  const parts: string[] = [];

  if (showMajor) {
    const majorWords = integerToEnglishWords(units);
    const majorNoun = pluralizeEnglish(units, currency.major.enSingular, currency.major.enPlural);
    parts.push(`${majorWords} ${majorNoun}`);
  }

  if (showMinor && currency.minor) {
    const minorWords = integerToEnglishWords(BigInt(minorUnits));
    const minorNoun = pluralizeEnglish(minorUnits, currency.minor.enSingular, currency.minor.enPlural);
    parts.push(`${minorWords} ${minorNoun}`);
  }

  let result = parts.join(` ${ENGLISH_AND} `);
  if (negative) result = `${ENGLISH_NEGATIVE_PREFIX} ${result}`;
  if (addOnly) result = `${result} ${ENGLISH_ONLY_SUFFIX}`;
  return result;
}

function buildPlainEnglish(
  units: bigint,
  minorUnits: number,
  decimalPlaces: number,
  negative: boolean,
  addOnly: boolean,
): string {
  let result = integerToEnglishWords(units);
  if (decimalPlaces > 0 && minorUnits > 0) {
    result += ` ${ENGLISH_DECIMAL_SEPARATOR_WORD} ${integerToEnglishWords(BigInt(minorUnits))}`;
  } else if (units === 0n && minorUnits === 0) {
    result = 'Zero';
  }
  if (negative) result = `${ENGLISH_NEGATIVE_PREFIX} ${result}`;
  if (addOnly) result = `${result} ${ENGLISH_ONLY_SUFFIX}`;
  return result;
}

export { CURRENCIES, getCurrency, DEFAULT_CURRENCY_CODE } from './currencies';
export type {
  ConvertNumberOptions,
  ConvertNumberOutcome,
  ConvertNumberResult,
  ConvertNumberError,
  CurrencyDefinition,
  SupportedLanguage,
} from './types';
