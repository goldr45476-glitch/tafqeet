import { calendarDiff, parseDateInputToUTC, isValidDateString } from '../src/utils/dateUtils';

function show(label: string, a: string, b: string) {
  const dA = parseDateInputToUTC(a)!;
  const dB = parseDateInputToUTC(b)!;
  const diff = calendarDiff(dA, dB);
  console.log(`${label}: ${a} -> ${b} :: ${diff.years}y ${diff.months}m ${diff.days}d | totalDays=${diff.totalDays} totalWeeks=${diff.totalWeeks} totalMonths=${diff.totalMonths} totalHours=${diff.totalHours}`);
}

show('leap-birth', '2000-02-29', '2024-02-29'); // exact 24 years
show('leap-birth-nonleap-target', '2000-02-29', '2023-03-01'); // should be 23y 0m 1d (borrow logic)
show('simple', '1998-05-15', '2026-08-29');
show('same-day', '2020-01-01', '2020-01-01');
show('end-of-month', '2024-01-31', '2024-03-01');
show('future', '2026-08-29', '2030-01-01');

console.log('\nvalidity checks:');
console.log('2023-02-31 valid?', isValidDateString('2023-02-31')); // false
console.log('2024-02-29 valid?', isValidDateString('2024-02-29')); // true (leap)
console.log('2023-02-29 valid?', isValidDateString('2023-02-29')); // false (not leap)
console.log('2026-08-29 valid?', isValidDateString('2026-08-29')); // true
