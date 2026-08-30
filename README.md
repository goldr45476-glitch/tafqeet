# تفقيط — TAFQEET

**التفقيط والأدوات الإدارية / TAFQEET & Administrative Tools**

A focused, fully bilingual (Arabic/English, RTL/LTR) toolkit built around one
core need — accurate Tafqeet (number-to-words) — extended with a financial
calculator and a professional administrative letter editor:

1. **Tafqeet (Number to Words)** — grammar-aware Arabic + English number/currency-to-words engine, 11 currencies, decimals, subunits, negatives, huge numbers. The site's flagship tool.
2. **Financial & Percentage Calculator** — percentages, VAT/tax (forward & reverse), profit/loss — every monetary result also shows its Tafqeet.
3. **Administrative Documents** — a structured letter editor (not a simple form): document type, reference/date, recipient, subject, explanation with an `[AMOUNT]` placeholder, a free-editable reason, an editable closing phrase, an amount block with automatic Tafqeet, a signature block, a text-formatting toolbar, and a live A4 preview that prints cleanly.

Built with **React + TypeScript + Vite + Tailwind CSS**. 100% client-side — no backend, no API keys, no accounts, no tracking. Recent Tafqeet conversions, saved document explanations, the current document draft, and your theme/background preferences are kept only in the browser's `localStorage`.

---

## Getting started

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
npm run build     # type-check (tsc -b) + production build into dist/
npm run preview   # preview the production build locally
```

### Regression tests (no build step required)

The Tafqeet engine, date utilities, and the document composer are plain
TypeScript with zero React dependency, so they can be exercised directly with
`tsx`:

```bash
npm run test:engine    # runs scripts/test-engine.ts — Tafqeet across currencies & edge cases
npm run test:dates     # runs scripts/test-dates.ts — calendar/date-math edge cases
npx tsx scripts/test-composer.ts   # document composer: full vs. body-only, [AMOUNT] substitution
```

These scripts print every input/output pair so the output can be reviewed by
eye; they are not pass/fail assertions, but every case in this project's spec
(0, 1, 2, 10, 11, 12, 20, 21, 100, 101, 102, 110, 111, 125, 1000 …
999999999.99, negative numbers, all 11 currencies) is included.

---

## Project structure

```
src/
  components/     Reusable UI: Navbar, Footer, ToolCard, CopyButton, icons,
                  BackgroundDecor + BackgroundSwitcher (5 CSS-only styles)...
  pages/          One file per route (Home, Tools, the 3 tools, static pages)
  utils/
    numberToWordsEngine/   The Tafqeet engine — framework-agnostic, unit-testable
      types.ts             Shared types (Gender, CurrencyDefinition, ...)
      arabic.ts            Arabic grammar core (gender, polarity, dual, plurals, scale words)
      english.ts           English number-to-words core
      currencies.ts        Currency registry (11 currencies; add more by appending one entry)
      parseAmount.ts        String -> {integer, fraction} parsing with BigInt precision + rounding
      index.ts              Public API: convertNumberToWords()
    documentComposer.ts  Assembles the letter's plain text (full / body-only) +
                          the [AMOUNT] placeholder substitution — shared by the
                          copy buttons; the on-screen A4 preview is separate JSX
                          so it can render the top-left/bottom-left blocks.
    dateUtils.ts       Calendar-accurate date math
    financialUtils.ts  Percentage / VAT / profit-loss pure functions
    clipboard.ts       Clipboard helper with legacy fallback
  data/
    tools.ts          Tool registry (icons, routes, gradients) shared by Home/Tools/Nav/Footer
    documentTypes.ts  The 6 document types + their default (fully editable) closing phrase
  i18n/          en.ts / ar.ts dictionaries (typed so both stay structurally in
                 sync — ar.ts's strings differ, but a missing/renamed key is a
                 compile error) + LocaleProvider (RTL/LTR, localStorage)
  hooks/         useTheme, useBackground, useLocalStorage, useToast
scripts/
  test-engine.ts     Manual regression runner for the Tafqeet engine
  test-dates.ts      Manual regression runner for date utilities
  test-composer.ts   Manual regression runner for the document composer
```

The Tafqeet engine (`src/utils/numberToWordsEngine/`) has **no React or DOM
dependency** — it's pure TypeScript, so it can be reused in a CLI, a backend,
or a different frontend without modification. The document composer follows
the same pattern.

---

## Adding a new currency

Open `src/utils/numberToWordsEngine/currencies.ts` and append one object to the
`CURRENCIES` array with the major/minor unit names in both languages (singular,
dual, plural, and accusative Arabic forms), gender, and `decimalPlaces`. Nothing
else in the engine needs to change — the currency immediately appears in every
currency `<select>` in the UI (Tafqeet, Financial Calculator, Document Helper).

## Adding a new document type

Open `src/data/documentTypes.ts` and append one entry to `DOCUMENT_TYPES` with
an `id` and a default (still fully user-editable) closing phrase in both
languages, then add the matching label under `documentHelper.documentTypes` in
both `src/i18n/en.ts` and `src/i18n/ar.ts`. The editor's fields, the A4
preview, and both copy modes work for every type automatically — nothing else
needs to change.

---

## Deployment

### GitHub

```bash
git init
git add .
git commit -m "Initial commit — TAFQEET"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Railway

Railway auto-detects Node projects via Nixpacks. Recommended settings:

- **Build command:** `npm run build`
- **Start command:** `npm run start` (serves the `dist/` build via `vite preview`, bound to Railway's `$PORT`)

No environment variables are required — the app has no backend and no API keys.

### Any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3, etc.)

This is a static single-page app:

1. `npm run build`
2. Deploy the contents of `dist/`
3. Configure a SPA fallback so unknown paths serve `index.html` (needed for React Router's client-side routes — e.g. Netlify's `_redirects` with `/* /index.html 200`, or Vercel's default SPA handling).

---

## Notes on the development environment

This project was built and reviewed in a sandboxed environment without access
to the npm registry, so `npm install` could not be executed here. To compensate:

- The **Tafqeet engine**, **date utilities**, and **document composer** — the
  algorithmically sensitive parts of the app — were type-checked directly with
  the TypeScript compiler and exhaustively exercised at runtime with `tsx`
  against the full set of test cases from the specification, including every
  worked example the spec calls out by name (1250.750 IQD →
  "ألف ومائتان وخمسون دينارًا عراقيًا وسبعمائة وخمسون فلسًا فقط لا غير",
  999999999.99, negative numbers, 0/1/2/dual/plural/accusative boundaries,
  and all 11 currencies), plus the `en.ts`/`ar.ts` i18n dictionaries were
  type-checked against each other so a missing or mis-shaped key in either
  file is a compile error, not a silent runtime gap.
- Every `import`/`export` across all source files was cross-checked
  programmatically (both named and default exports) to catch missing files or
  typo'd symbol names.
- The full app was **not** run through `vite build` or a browser in this
  environment, since that requires installing `react-router-dom`, Tailwind,
  and Vite from the npm registry. Please run `npm install && npm run build`
  (or `npm run dev`) after downloading the project to do a final visual pass —
  everything is expected to work, but a live browser check is the last mile
  this sandbox could not complete.

---

## License

Provided as-is for the requesting user's own project. No warranty implied —
see the in-app Terms page for the Document Helper's template disclaimer.
