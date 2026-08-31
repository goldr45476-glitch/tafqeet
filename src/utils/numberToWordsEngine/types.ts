// Core types for the Number-to-Words / Currency Tafqeet engine.
// This module is intentionally framework-agnostic (no React) so it can be
// unit-tested in isolation and reused anywhere.

export type Gender = 'masculine' | 'feminine';

/**
 * The four grammatical forms an Arabic counted noun can take depending on
 * the number that governs it:
 *  - singular:   used when the count is 0 or 1, or a round multiple of 100/1000... (بدل مجرور)
 *  - dual:       used when the count is exactly 2 (مثنى)
 *  - plural:     used when the count is 3-10 (جمع مجرور)
 *  - accusative: used when the count is 11-99 (تمييز مفرد منصوب بتنوين)
 */
export interface ArabicNounForms {
  singular: string;
  dual: string;
  plural: string;
  accusative: string;
}

export interface CurrencyUnitDefinition {
  gender: Gender;
  ar: ArabicNounForms;
  enSingular: string;
  enPlural: string;
}

export interface CurrencyDefinition {
  code: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  /** Number of decimal digits the minor unit represents (e.g. 2 for cents, 3 for fils). */
  decimalPlaces: number;
  major: CurrencyUnitDefinition;
  /** Some currencies have no meaningful minor unit; pass null in that case. */
  minor: CurrencyUnitDefinition | null;
}

export type SupportedLanguage = 'ar' | 'en';

export interface ParsedAmount {
  negative: boolean;
  integerPart: bigint;
  /** Raw fraction digits exactly as typed, e.g. "5" for "1000.5". */
  fractionRaw: string;
}

export interface ScaledAmount {
  /** Integer whole-unit part after rounding, as BigInt to support arbitrarily large numbers. */
  integerUnits: bigint;
  /** Minor-unit integer value (e.g. 75 for .75 with 2 decimal places), always a safe JS number. */
  minorUnits: number;
}

export interface ConvertNumberOptions {
  /** Raw user input, as typed (supports arbitrary length integers). */
  rawValue: string;
  /** Currency code from the currency registry, or null for a plain number. */
  currencyCode: string | null;
  /** How many decimal places to honor; defaults to the currency's natural precision, or 2 for plain numbers. */
  decimalPlaces?: number;
  /** Whether to read out the subunit (fils/cents/...) clause. */
  includeSubunit?: boolean;
  /** Whether to append the "only, no more" idiom. */
  addOnly?: boolean;
  /** Where to place the "only, no more" idiom relative to the amount (Arabic only). Defaults to 'start'. */
  onlyPosition?: 'start' | 'end';
}

export interface ConvertNumberResult {
  success: true;
  negative: boolean;
  integerUnits: bigint;
  minorUnits: number;
  decimalPlaces: number;
  wordsAr: string;
  wordsEn: string;
}

export interface ConvertNumberError {
  success: false;
  errorKey: 'empty' | 'invalid' | 'too_large';
}

export type ConvertNumberOutcome = ConvertNumberResult | ConvertNumberError;
