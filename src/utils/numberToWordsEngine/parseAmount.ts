import type { ParsedAmount, ScaledAmount } from './types';

/**
 * Parses a raw numeric string typed by the user into a sign + arbitrary-precision
 * integer part + raw fraction digits. Deliberately avoids the `number` type for the
 * integer part so we never lose precision on very large values (billions, trillions...).
 *
 * Accepts: optional leading "-", digits, optional thousands separators (",", " "),
 * optional single "." followed by digits.
 */
export function parseAmountString(input: string): ParsedAmount | null {
  if (input == null) return null;
  const trimmed = input.trim();
  if (trimmed === '') return null;

  const cleaned = trimmed.replace(/[,\s]/g, '');
  const match = /^(-)?(\d+)(?:\.(\d+))?$/.exec(cleaned);
  if (!match) return null;

  const [, neg, intPart, fracPart] = match;

  return {
    negative: Boolean(neg) && !/^0+$/.test(intPart + (fracPart ?? '')),
    integerPart: BigInt(intPart),
    fractionRaw: fracPart ?? '',
  };
}

/**
 * Combines the parsed amount with a target decimal-place precision, producing a
 * whole-unit BigInt and a minor-unit integer, applying standard half-up rounding
 * (with carry into the integer part when the minor units overflow), all using
 * integer arithmetic only.
 */
export function scaleToUnits(parsed: ParsedAmount, decimalPlaces: number): ScaledAmount {
  const keep = Math.max(0, decimalPlaces);
  const frac = parsed.fractionRaw;

  let fracKept = frac.slice(0, keep);
  if (fracKept.length < keep) fracKept = fracKept.padEnd(keep, '0');

  let roundUp = false;
  if (frac.length > keep) {
    const nextDigit = frac.charAt(keep);
    roundUp = nextDigit >= '5';
  }

  let integerUnits = parsed.integerPart;
  let minorUnits = keep > 0 ? (fracKept.length ? parseInt(fracKept, 10) : 0) : 0;

  if (roundUp) {
    if (keep > 0) {
      minorUnits += 1;
      const maxMinor = 10 ** keep;
      if (minorUnits >= maxMinor) {
        minorUnits -= maxMinor;
        integerUnits += 1n;
      }
    } else {
      integerUnits += 1n;
    }
  }

  return { integerUnits, minorUnits };
}
