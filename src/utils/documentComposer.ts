import { convertNumberToWords } from './numberToWordsEngine';

/**
 * The full set of editable fields on the administrative letter editor. Every
 * field applies to every document type — the type only changes the label
 * set shown and the suggested default closing phrase (see documentTypes.ts).
 */
export interface DocumentFieldValues {
  referenceNumber: string;
  date: string;
  recipient: string;
  subject: string;
  explanation: string;
  reason: string;
  closingPhrase: string;
  amount: string;
  currencyCode: string;
  position: string;
  employeeName: string;
}

export function emptyDocumentValues(defaults: Partial<DocumentFieldValues> = {}): DocumentFieldValues {
  return {
    referenceNumber: '',
    date: '',
    recipient: '',
    subject: '',
    explanation: '',
    reason: '',
    closingPhrase: '',
    amount: '',
    currencyCode: '',
    position: '',
    employeeName: '',
    ...defaults,
  };
}

/** The placeholder a user can type anywhere in free text to inject the amount + its Tafqeet. */
export const AMOUNT_TOKEN = '[AMOUNT]';

export interface AmountInfo {
  hasAmount: boolean;
  /** e.g. "1,250.750 IQD" */
  numberText: string;
  /** The Tafqeet (written-out) form in the requested language, empty if invalid/absent. */
  tafqeetText: string;
}

/** Resolves the Amount field + currency into display text and its Tafqeet, once, so every
 * consumer (the [AMOUNT] substitution, the dedicated amount block, the copy buttons) agrees. */
export function computeAmountInfo(amount: string, currencyCode: string, lang: 'ar' | 'en'): AmountInfo {
  const trimmed = amount.trim();
  if (!trimmed || !currencyCode) return { hasAmount: false, numberText: '', tafqeetText: '' };

  const outcome = convertNumberToWords({
    rawValue: trimmed,
    currencyCode,
    includeSubunit: true,
    addOnly: false,
  });
  if (!outcome.success) return { hasAmount: false, numberText: '', tafqeetText: '' };

  const words = lang === 'ar' ? outcome.wordsAr : outcome.wordsEn;
  return { hasAmount: true, numberText: `${trimmed} ${currencyCode}`, tafqeetText: words };
}

/** Replaces every occurrence of the [AMOUNT] token in free text with the resolved amount + Tafqeet. */
export function substituteAmountToken(text: string, info: AmountInfo): string {
  if (!text || !text.includes(AMOUNT_TOKEN)) return text;
  const replacement = info.hasAmount ? `${info.numberText} (${info.tafqeetText})` : '';
  return text.split(AMOUNT_TOKEN).join(replacement);
}

/** Labels needed to compose the plain-text version of the document (used for the two copy modes). */
export interface ComposerLabels {
  referenceNumber: string;
  date: string;
  subject: string;
  amountBlockLabel: string;
  tafqeetBlockLabel: string;
}

interface ComposeOptions {
  /** When true, starts from the Subject line — excludes reference no., date, and recipient. */
  bodyOnly?: boolean;
}

/**
 * Assembles the final plain-text document, in order, for the two clipboard
 * modes ("copy full document" vs "copy text only"). The live A4 preview is
 * rendered separately as styled JSX (a plain-text join can't represent the
 * top-left reference block or the bottom-left signature block), but both
 * draw on the same field values and the same [AMOUNT] substitution so they
 * always agree on content.
 */
export function composeDocument(
  values: DocumentFieldValues,
  lang: 'ar' | 'en',
  labels: ComposerLabels,
  opts: ComposeOptions = {},
): string {
  const amountInfo = computeAmountInfo(values.amount, values.currencyCode, lang);
  const explanation = substituteAmountToken(values.explanation.trim(), amountInfo);
  const reason = substituteAmountToken(values.reason.trim(), amountInfo);
  const closing = substituteAmountToken(values.closingPhrase.trim(), amountInfo);

  const lines: string[] = [];
  const pushBlank = () => {
    if (lines.length > 0 && lines[lines.length - 1] !== '') lines.push('');
  };

  if (!opts.bodyOnly) {
    const ref = values.referenceNumber.trim();
    const date = values.date.trim();
    if (ref) lines.push(`${labels.referenceNumber}: ${ref}`);
    if (date) lines.push(`${labels.date}: ${date}`);
    pushBlank();

    if (values.recipient.trim()) {
      lines.push(values.recipient.trim());
      pushBlank();
    }
  }

  if (values.subject.trim()) {
    lines.push(`${labels.subject}: ${values.subject.trim()}`);
    pushBlank();
  }

  if (explanation) {
    lines.push(explanation);
    pushBlank();
  }
  if (reason) {
    lines.push(reason);
    pushBlank();
  }
  if (closing) {
    lines.push(closing);
    pushBlank();
  }

  if (amountInfo.hasAmount) {
    lines.push(`${labels.amountBlockLabel}: ${amountInfo.numberText}`);
    lines.push(`${labels.tafqeetBlockLabel}: ${amountInfo.tafqeetText}`);
    pushBlank();
  }

  const position = values.position.trim();
  const employeeName = values.employeeName.trim();
  if (position) lines.push(position);
  if (employeeName) lines.push(employeeName);

  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();

  return lines.join('\n');
}
