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

// ---- time-of-day difference ----
import { parseTimeInput, timeDiff } from '../src/utils/dateUtils';

function showTime(label: string, a: string, b: string, overnight = true) {
  const sa = parseTimeInput(a);
  const sb = parseTimeInput(b);
  if (sa === null || sb === null) {
    console.log(`${label}: ${a} -> ${b} :: INVALID (${sa}, ${sb})`);
    return;
  }
  const d = timeDiff(sa, sb, overnight);
  console.log(
    `${label}: ${a} -> ${b} :: ${d.hours}h ${d.minutes}m ${d.seconds}s | totalMin=${d.totalMinutes} totalH=${d.totalHours} totalSec=${d.totalSeconds}${d.crossedMidnight ? ' [next day]' : ''}${d.swapped ? ' [swapped]' : ''}`,
  );
}

console.log('\ntime checks:');
showTime('work day', '08:30', '17:45');
showTime('overnight shift', '22:00', '06:00');
showTime('swap instead', '22:00', '06:00', false);
showTime('12-hour pm', '9:15 am', '5:45 pm');
showTime('arabic marker', '9 ص', '5:30 م');
showTime('arabic digits', '٠٩:٣٠', '١٧:٤٥');
showTime('with seconds', '10:00:15', '10:01:00');
showTime('noon/midnight', '12:00 am', '12:00 pm');
showTime('same time', '14:00', '14:00');
showTime('bad minutes', '10:75', '11:00');
showTime('bad hour', '25:00', '11:00');
showTime('bad 12h hour', '13:00 pm', '11:00');
