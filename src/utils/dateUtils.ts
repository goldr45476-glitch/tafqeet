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

// ---------------------------------------------------------------------------
// Time-of-day math (hours / minutes / seconds, no calendar involved)
// ---------------------------------------------------------------------------

const SECONDS_PER_DAY = 24 * 60 * 60;

/** Maps Arabic-Indic and Persian digits to 0-9 so people can type in either. */
export function normalizeDigits(value: string): string {
  return value
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06f0-\u06f9]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

/**
 * Parses a typed time of day into seconds since midnight.
 * Accepts 24-hour ("14:30", "14:30:15", "8") and 12-hour with an AM/PM marker in
 * English or Arabic ("2:30 pm", "2:30 م", "9 ص"). Returns null when invalid.
 */
export function parseTimeInput(value: string): number | null {
  const cleaned = normalizeDigits(value).trim().toLowerCase().replace(/\s+/g, ' ');
  const match =
    /^(\d{1,2})(?:[:.](\d{1,2}))?(?:[:.](\d{1,2}))?\s*(a\.?m\.?|p\.?m\.?|ص|صباحا|صباحًا|م|مساء|مساءً|مساءا)?$/.exec(
      cleaned,
    );
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = match[2] === undefined ? 0 : Number(match[2]);
  const seconds = match[3] === undefined ? 0 : Number(match[3]);
  const marker = match[4];

  if (minutes > 59 || seconds > 59) return null;

  if (marker) {
    const isPm = marker.startsWith('p') || marker === 'م' || marker.startsWith('مساء');
    if (hours < 1 || hours > 12) return null;
    if (isPm) {
      if (hours !== 12) hours += 12;
    } else if (hours === 12) {
      hours = 0;
    }
  } else if (hours > 23) {
    return null;
  }

  return hours * 3600 + minutes * 60 + seconds;
}

export interface TimeDiff {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  /** Rounded to 2 decimal places. */
  totalMinutes: number;
  /** Rounded to 2 decimal places. */
  totalHours: number;
  /** True when the end time was treated as falling on the next day. */
  crossedMidnight: boolean;
  /** True when the two times were swapped because the end was earlier. */
  swapped: boolean;
}

/**
 * Elapsed time between two times of day. When the end is earlier than the start
 * it is either read as the next day (`overnight`, e.g. a 22:00 -> 06:00 shift is
 * 8 hours) or the two times are swapped, as the date calculator does.
 */
export function timeDiff(startSeconds: number, endSeconds: number, overnight = true): TimeDiff {
  let a = startSeconds;
  let b = endSeconds;
  let crossedMidnight = false;
  let swapped = false;

  if (b < a) {
    if (overnight) {
      b += SECONDS_PER_DAY;
      crossedMidnight = true;
    } else {
      [a, b] = [b, a];
      swapped = true;
    }
  }

  const total = b - a;
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    totalSeconds: total,
    totalMinutes: Math.round((total / 60) * 100) / 100,
    totalHours: Math.round((total / 3600) * 100) / 100,
    crossedMidnight,
    swapped,
  };
}
