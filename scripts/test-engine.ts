/**
 * Standalone manual test runner for the Number-to-Words engine.
 * Runs with `tsx scripts/test-engine.ts` — no build step / npm install required,
 * since it only imports plain TypeScript modules with zero external dependencies.
 */
import { convertNumberToWords } from '../src/utils/numberToWordsEngine/index';

let passCount = 0;
let failCount = 0;

function show(label: string, rawValue: string, currencyCode: string | null, opts: Record<string, unknown> = {}) {
  const result = convertNumberToWords({ rawValue, currencyCode, ...opts } as any);
  if (!result.success) {
    console.log(`❌ [${label}] "${rawValue}" -> ERROR: ${result.errorKey}`);
    failCount++;
    return;
  }
  console.log(`✅ [${label}] "${rawValue}"${currencyCode ? ' ' + currencyCode : ''}`);
  console.log(`    AR: ${result.wordsAr}`);
  console.log(`    EN: ${result.wordsEn}`);
  passCount++;
}

console.log('\n================ PLAIN NUMBERS (no currency) ================\n');
const plainCases = [
  '0', '1', '10', '11', '21', '100', '101', '110', '125', '1000', '1001', '1010', '1100',
  '1250', '10000', '100000', '1000000', '1000000000', '999999999.99', '1000.01', '1000.05',
  '1000.50', '1000.75', '0.01', '0.50', '-100', '-100.50', '2', '3', '12', '13', '15', '20',
  '99', '200', '300', '900', '999', '2000', '3000', '11000', '20000', '50000', '150000',
  '2000000', '3000000', '25000000', '1000000000000', '123456789012',
];
for (const c of plainCases) show('plain', c, null);

console.log('\n================ IQD (3 decimals) ================\n');
const iqdCases = ['1250.750', '1', '2', '3', '10', '11', '100', '0', '0.750', '0.001', '1000.005', '999999999.99'];
for (const c of iqdCases) show('IQD', c, 'IQD');

console.log('\n================ USD (2 decimals) ================\n');
for (const c of ['1', '2', '3', '10', '11', '21', '100', '1000.50', '1000.05', '0.01', '0.99', '0']) {
  show('USD', c, 'USD');
}

console.log('\n================ SAR (feminine minor unit: halala) ================\n');
for (const c of ['1', '2', '3', '10', '25.50']) show('SAR', c, 'SAR');

console.log('\n================ TRY (feminine major unit: lira) ================\n');
for (const c of ['1', '2', '3', '10', '11', '100', '25.75']) show('TRY', c, 'TRY');

console.log('\n================ All currencies smoke test ================\n');
for (const code of ['IQD', 'USD', 'EUR', 'GBP', 'SAR', 'AED', 'KWD', 'JOD', 'TRY', 'IDR', 'MYR']) {
  show(code, '1234567.89', code);
}

console.log('\n================ Negative & edge cases ================\n');
for (const c of ['-1250.750']) show('IQD-neg', c, 'IQD');
show('invalid', 'abc', 'IQD');
show('empty', '', 'IQD');
show('invalid2', '12.34.56', null);

console.log(`\n\nSummary: ${passCount} produced output, ${failCount} errored.\n`);
