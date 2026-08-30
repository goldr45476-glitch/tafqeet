// Calendar-accurate date math utilities, built on UTC-anchored Date objects so
// that day/month/year arithmetic is never perturbed by daylight-saving shifts.
// Inputs are plain "YYYY-MM-DD" strings, as produced by <input type="date">.

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function parseDateInputToUTC(value: string): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const date = new Date(Date.UTC(year, month - 1, day));
  // Reject "overflowed" dates like 2023-02-31, which JS Date would silently
  // roll forward into March.
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }
  return date;
}

export function isValidDateString(value: string): boolean {
  return parseDateInputToUTC(value) !== null;
}

export function todayISO(): string {
  const now = new Date();
  return toISODate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

export function toISODate(date: Date): string {
  const y = date.getUTCFullYear().toString().padStart(4, '0');
  const m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const d = date.getUTCDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function daysInMonth(year: number, monthIndex0: number): number {
  return new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export interface CalendarDiff {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
}

/** Adds `n` months to `date`, clamping the day-of-month to the target month's length
 * (e.g. Jan 31 + 1 month -> Feb 28/29, never an invalid "Feb 31"). */
function addMonthsClamped(date: Date, n: number): Date {
  const totalMonthIndex = date.getUTCMonth() + n;
  const targetYear = date.getUTCFullYear() + Math.floor(totalMonthIndex / 12);
  const targetMonth = ((totalMonthIndex % 12) + 12) % 12;
  const maxDay = daysInMonth(targetYear, targetMonth);
  const day = Math.min(date.getUTCDate(), maxDay);
  return new Date(Date.UTC(targetYear, targetMonth, day));
}

/**
 * Calendar-correct difference between two dates (order-independent — the
 * earlier date is always treated as the start). Finds the largest whole
 * number of months that can be added to `start` without passing `end`
 * (clamping short months the way humans expect, e.g. Jan 31 -> Feb 28), then
 * counts the remaining whole days. This guarantees a non-negative day count
 * in every case, including end-of-month edge cases that a naive
 * borrow-from-the-previous-month subtraction can get wrong.
 */
export function calendarDiff(dateA: Date, dateB: Date): CalendarDiff {
  const start = dateA.getTime() <= dateB.getTime() ? dateA : dateB;
  const end = dateA.getTime() <= dateB.getTime() ? dateB : dateA;

  let totalMonths =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth());
  if (totalMonths > 0 && addMonthsClamped(start, totalMonths).getTime() > end.getTime()) {
    totalMonths -= 1;
  }
  // (totalMonths can never need increasing: the raw month-index difference is
  // already the maximum possible whole-month count.)

  const monthAnchor = addMonthsClamped(start, totalMonths);
  const days = Math.round((end.getTime() - monthAnchor.getTime()) / MS_PER_DAY);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const totalDays = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalMonths,
    totalHours: totalDays * 24,
  };
}

