// Pure calculation helpers for the Financial & Percentage Calculator tool.
// All functions take/return plain numbers; the caller (UI layer) is
// responsible for parsing/validating user input before calling these.

export interface PercentageOfResult {
  result: number;
}
export function percentOf(value: number, percent: number): PercentageOfResult {
  return { result: (value * percent) / 100 };
}

export interface PercentageChangeResult {
  newValue: number;
  changeAmount: number;
}
export function increaseByPercent(value: number, percent: number): PercentageChangeResult {
  const changeAmount = (value * percent) / 100;
  return { newValue: value + changeAmount, changeAmount };
}
export function decreaseByPercent(value: number, percent: number): PercentageChangeResult {
  const changeAmount = (value * percent) / 100;
  return { newValue: value - changeAmount, changeAmount };
}

export interface PercentDifferenceResult {
  difference: number;
  percentChange: number | null; // null when valueA is 0 (undefined percent change)
}
export function percentDifference(valueA: number, valueB: number): PercentDifferenceResult {
  const difference = valueB - valueA;
  const percentChange = valueA !== 0 ? (difference / Math.abs(valueA)) * 100 : null;
  return { difference, percentChange };
}

export interface VatForwardResult {
  subtotal: number;
  taxAmount: number;
  total: number;
}
/** Given a tax-exclusive amount, compute the tax and the tax-inclusive total. */
export function vatForward(amount: number, taxPercent: number): VatForwardResult {
  const taxAmount = (amount * taxPercent) / 100;
  return { subtotal: amount, taxAmount, total: amount + taxAmount };
}

export interface VatReverseResult {
  subtotal: number;
  taxAmount: number;
  total: number;
}
/** Given a tax-inclusive total, back out the pre-tax amount and the tax portion. */
export function vatReverse(total: number, taxPercent: number): VatReverseResult {
  const subtotal = total / (1 + taxPercent / 100);
  const taxAmount = total - subtotal;
  return { subtotal, taxAmount, total };
}

export interface ProfitLossResult {
  amount: number; // positive => profit, negative => loss, 0 => break-even
  isProfit: boolean;
  isLoss: boolean;
  isBreakEven: boolean;
  marginPercent: number | null; // relative to selling price; null if selling price is 0
}
export function profitLoss(cost: number, selling: number): ProfitLossResult {
  const amount = selling - cost;
  const marginPercent = selling !== 0 ? (amount / selling) * 100 : null;
  return {
    amount,
    isProfit: amount > 0,
    isLoss: amount < 0,
    isBreakEven: amount === 0,
    marginPercent,
  };
}
