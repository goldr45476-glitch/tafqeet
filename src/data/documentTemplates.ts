import { convertNumberToWords } from '../utils/numberToWordsEngine';

export type DocumentCategory =
  | 'paymentRequest'
  | 'salaryCertificate'
  | 'employmentCertificate'
  | 'leaveRequest'
  | 'expenseRequest'
  | 'officialNotice'
  | 'invoiceText'
  | 'meetingNotice';

export type FieldKey =
  | 'name'
  | 'company'
  | 'position'
  | 'amount'
  | 'currency'
  | 'date'
  | 'reason'
  | 'referenceNumber'
  | 'department'
  | 'recipient'
  | 'duration'
  | 'startDate'
  | 'endDate'
  | 'meetingDate'
  | 'meetingTime'
  | 'meetingLocation'
  | 'subject'
  | 'itemDescription'
  | 'notes';

export type FieldType = 'text' | 'date' | 'textarea' | 'currency-amount';

export interface FieldDef {
  key: FieldKey;
  type: FieldType;
  required: boolean;
}

export type FieldValues = Partial<Record<FieldKey, string>>;

export interface DocumentTemplateDef {
  id: DocumentCategory;
  fields: FieldDef[];
  generate: (values: FieldValues, lang: 'ar' | 'en') => string;
}

function v(values: FieldValues, key: FieldKey, fallback = ''): string {
  const val = values[key];
  return val && val.trim() !== '' ? val.trim() : fallback;
}

/** Renders "amount (amount in words) currency" using the Tafqeet engine when possible. */
function amountLine(values: FieldValues, lang: 'ar' | 'en'): string {
  const amount = v(values, 'amount');
  const currency = v(values, 'currency', 'IQD');
  if (!amount) return lang === 'ar' ? '—' : '—';

  const outcome = convertNumberToWords({ rawValue: amount, currencyCode: currency });
  const words = outcome.success ? (lang === 'ar' ? outcome.wordsAr : outcome.wordsEn) : '';
  return words ? `${amount} ${currency} (${words})` : `${amount} ${currency}`;
}

const DASH = '—';

export const DOCUMENT_TEMPLATES: DocumentTemplateDef[] = [
  {
    id: 'paymentRequest',
    fields: [
      { key: 'recipient', type: 'text', required: false },
      { key: 'name', type: 'text', required: true },
      { key: 'position', type: 'text', required: false },
      { key: 'amount', type: 'currency-amount', required: true },
      { key: 'reason', type: 'textarea', required: true },
      { key: 'referenceNumber', type: 'text', required: false },
      { key: 'date', type: 'date', required: true },
    ],
    generate: (values, lang) => {
      const name = v(values, 'name', DASH);
      const position = v(values, 'position');
      const recipient = v(values, 'recipient');
      const reason = v(values, 'reason', DASH);
      const ref = v(values, 'referenceNumber');
      const date = v(values, 'date', DASH);
      const amount = amountLine(values, lang);

      if (lang === 'ar') {
        return [
          recipient ? `إلى: ${recipient}` : null,
          'الموضوع: طلب صرف',
          ref ? `الرقم المرجعي: ${ref}` : null,
          '',
          'تحية طيبة وبعد،',
          '',
          `يرجى التكرم بالموافقة على صرف المبلغ التالي:`,
          `المبلغ: ${amount}`,
          `${position ? `المستفيد: ${name} — ${position}` : `المستفيد: ${name}`}`,
          `السبب: ${reason}`,
          '',
          `التاريخ: ${date}`,
          '',
          'ولكم جزيل الشكر والتقدير.',
        ]
          .filter((line) => line !== null)
          .join('\n');
      }

      return [
        recipient ? `To: ${recipient}` : null,
        'Subject: Payment Request',
        ref ? `Reference No.: ${ref}` : null,
        '',
        'Dear Sir/Madam,',
        '',
        'Kindly approve the disbursement of the following amount:',
        `Amount: ${amount}`,
        position ? `Beneficiary: ${name} — ${position}` : `Beneficiary: ${name}`,
        `Reason: ${reason}`,
        '',
        `Date: ${date}`,
        '',
        'Thank you for your kind consideration.',
      ]
        .filter((line) => line !== null)
        .join('\n');
    },
  },
  {
    id: 'salaryCertificate',
    fields: [
      { key: 'company', type: 'text', required: true },
      { key: 'name', type: 'text', required: true },
      { key: 'position', type: 'text', required: false },
      { key: 'amount', type: 'currency-amount', required: false },
      { key: 'referenceNumber', type: 'text', required: false },
      { key: 'date', type: 'date', required: true },
    ],
    generate: (values, lang) => {
      const company = v(values, 'company', DASH);
      const name = v(values, 'name', DASH);
      const position = v(values, 'position', DASH);
      const ref = v(values, 'referenceNumber');
      const date = v(values, 'date', DASH);
      const hasAmount = !!v(values, 'amount');
      const amount = amountLine(values, lang);

      if (lang === 'ar') {
        return [
          `${company}`,
          ref ? `الرقم المرجعي: ${ref}` : null,
          '',
          'تأييد راتب',
          '',
          `تشهد ${company} بأن السيد/ة: ${name}`,
          `يعمل/تعمل لدينا بوظيفة: ${position}`,
          hasAmount ? `وأن راتبه/راتبها الشهري هو: ${amount}` : null,
          '',
          'وقد أعطي له/لها هذا التأييد بناءً على طلبه/طلبها لتقديمه إلى الجهة التي يرغب.',
          '',
          `التاريخ: ${date}`,
          '',
          'التوقيع: ____________________',
        ]
          .filter((line) => line !== null)
          .join('\n');
      }

      return [
        `${company}`,
        ref ? `Reference No.: ${ref}` : null,
        '',
        'Salary Certificate',
        '',
        `This is to certify that Mr./Ms.: ${name}`,
        `is employed with us as: ${position}`,
        hasAmount ? `with a monthly salary of: ${amount}` : null,
        '',
        'This certificate is issued upon request for whatever purpose it may serve.',
        '',
        `Date: ${date}`,
        '',
        'Signature: ____________________',
      ]
        .filter((line) => line !== null)
        .join('\n');
    },
  },
  {
    id: 'employmentCertificate',
    fields: [
      { key: 'company', type: 'text', required: true },
      { key: 'name', type: 'text', required: true },
      { key: 'position', type: 'text', required: true },
      { key: 'startDate', type: 'date', required: false },
      { key: 'referenceNumber', type: 'text', required: false },
      { key: 'date', type: 'date', required: true },
    ],
    generate: (values, lang) => {
      const company = v(values, 'company', DASH);
      const name = v(values, 'name', DASH);
      const position = v(values, 'position', DASH);
      const startDate = v(values, 'startDate');
      const ref = v(values, 'referenceNumber');
      const date = v(values, 'date', DASH);

      if (lang === 'ar') {
        return [
          `${company}`,
          ref ? `الرقم المرجعي: ${ref}` : null,
          '',
          'تأييد عمل',
          '',
          `تشهد ${company} بأن السيد/ة: ${name}`,
          `يعمل/تعمل لدى الشركة بوظيفة: ${position}`,
          startDate ? `اعتبارًا من تاريخ: ${startDate}` : null,
          'وأنه/أنها لا يزال/تزال على رأس عمله/عملها حتى تاريخه.',
          '',
          'وقد أعطي له/لها هذا التأييد بناءً على طلبه/طلبها لتقديمه إلى الجهة التي يرغب.',
          '',
          `التاريخ: ${date}`,
          '',
          'التوقيع: ____________________',
        ]
          .filter((line) => line !== null)
          .join('\n');
      }

      return [
        `${company}`,
        ref ? `Reference No.: ${ref}` : null,
        '',
        'Employment Certificate',
        '',
        `This is to certify that Mr./Ms.: ${name}`,
        `is employed with the company as: ${position}`,
        startDate ? `since: ${startDate}` : null,
        'and remains an active employee as of the date of this letter.',
        '',
        'This certificate is issued upon request for whatever purpose it may serve.',
        '',
        `Date: ${date}`,
        '',
        'Signature: ____________________',
      ]
        .filter((line) => line !== null)
        .join('\n');
    },
  },
  {
    id: 'leaveRequest',
    fields: [
      { key: 'company', type: 'text', required: false },
      { key: 'department', type: 'text', required: false },
      { key: 'name', type: 'text', required: true },
      { key: 'position', type: 'text', required: false },
      { key: 'startDate', type: 'date', required: true },
      { key: 'endDate', type: 'date', required: true },
      { key: 'reason', type: 'textarea', required: false },
      { key: 'date', type: 'date', required: true },
    ],
    generate: (values, lang) => {
      const company = v(values, 'company');
      const department = v(values, 'department');
      const name = v(values, 'name', DASH);
      const position = v(values, 'position');
      const startDate = v(values, 'startDate', DASH);
      const endDate = v(values, 'endDate', DASH);
      const reason = v(values, 'reason');
      const date = v(values, 'date', DASH);

      if (lang === 'ar') {
        return [
          company ? `إلى: إدارة ${company}` : 'إلى: إدارة الموارد البشرية',
          department ? `القسم: ${department}` : null,
          'الموضوع: طلب إجازة',
          '',
          'تحية طيبة وبعد،',
          '',
          `${position ? `أنا الموظف/ة: ${name} — ${position}` : `أنا الموظف/ة: ${name}`}`,
          `أرجو الموافقة على منحي إجازة اعتبارًا من تاريخ ${startDate} ولغاية ${endDate}.`,
          reason ? `السبب: ${reason}` : null,
          '',
          `التاريخ: ${date}`,
          '',
          'ولكم جزيل الشكر والتقدير.',
          '',
          'التوقيع: ____________________',
        ]
          .filter((line) => line !== null)
          .join('\n');
      }

      return [
        company ? `To: ${company} Management` : 'To: Human Resources Department',
        department ? `Department: ${department}` : null,
        'Subject: Leave Request',
        '',
        'Dear Sir/Madam,',
        '',
        position ? `I, ${name} — ${position},` : `I, ${name},`,
        `kindly request approval for leave from ${startDate} to ${endDate}.`,
        reason ? `Reason: ${reason}` : null,
        '',
        `Date: ${date}`,
        '',
        'Thank you for your understanding.',
        '',
        'Signature: ____________________',
      ]
        .filter((line) => line !== null)
        .join('\n');
    },
  },
  {
    id: 'expenseRequest',
    fields: [
      { key: 'company', type: 'text', required: false },
      { key: 'name', type: 'text', required: true },
      { key: 'itemDescription', type: 'text', required: true },
      { key: 'amount', type: 'currency-amount', required: true },
      { key: 'reason', type: 'textarea', required: false },
      { key: 'referenceNumber', type: 'text', required: false },
      { key: 'date', type: 'date', required: true },
    ],
    generate: (values, lang) => {
      const company = v(values, 'company');
      const name = v(values, 'name', DASH);
      const item = v(values, 'itemDescription', DASH);
      const reason = v(values, 'reason');
      const ref = v(values, 'referenceNumber');
      const date = v(values, 'date', DASH);
      const amount = amountLine(values, lang);

      if (lang === 'ar') {
        return [
          company ? `الجهة: ${company}` : null,
          'الموضوع: طلب مصروف',
          ref ? `الرقم المرجعي: ${ref}` : null,
          '',
          'تحية طيبة وبعد،',
          '',
          `يرجى التكرم بالموافقة على صرف مبلغ المصروف التالي:`,
          `مقدم الطلب: ${name}`,
          `وصف المصروف: ${item}`,
          `المبلغ: ${amount}`,
          reason ? `ملاحظات: ${reason}` : null,
          '',
          `التاريخ: ${date}`,
          '',
          'ولكم جزيل الشكر والتقدير.',
        ]
          .filter((line) => line !== null)
          .join('\n');
      }

      return [
        company ? `Entity: ${company}` : null,
        'Subject: Expense Request',
        ref ? `Reference No.: ${ref}` : null,
        '',
        'Dear Sir/Madam,',
        '',
        'Kindly approve reimbursement for the following expense:',
        `Requested by: ${name}`,
        `Expense description: ${item}`,
        `Amount: ${amount}`,
        reason ? `Notes: ${reason}` : null,
        '',
        `Date: ${date}`,
        '',
        'Thank you for your kind consideration.',
      ]
        .filter((line) => line !== null)
        .join('\n');
    },
  },
  {
    id: 'officialNotice',
    fields: [
      { key: 'company', type: 'text', required: false },
      { key: 'recipient', type: 'text', required: false },
      { key: 'subject', type: 'text', required: true },
      { key: 'notes', type: 'textarea', required: true },
      { key: 'referenceNumber', type: 'text', required: false },
      { key: 'date', type: 'date', required: true },
    ],
    generate: (values, lang) => {
      const company = v(values, 'company');
      const recipient = v(values, 'recipient');
      const subject = v(values, 'subject', DASH);
      const notes = v(values, 'notes', DASH);
      const ref = v(values, 'referenceNumber');
      const date = v(values, 'date', DASH);

      if (lang === 'ar') {
        return [
          company ? `${company}` : null,
          recipient ? `إلى: ${recipient}` : null,
          `الموضوع: ${subject}`,
          ref ? `الرقم المرجعي: ${ref}` : null,
          '',
          'تحية طيبة وبعد،',
          '',
          notes,
          '',
          `التاريخ: ${date}`,
          '',
          'وتفضلوا بقبول فائق الاحترام والتقدير.',
        ]
          .filter((line) => line !== null)
          .join('\n');
      }

      return [
        company ? `${company}` : null,
        recipient ? `To: ${recipient}` : null,
        `Subject: ${subject}`,
        ref ? `Reference No.: ${ref}` : null,
        '',
        'Dear Sir/Madam,',
        '',
        notes,
        '',
        `Date: ${date}`,
        '',
        'Best regards.',
      ]
        .filter((line) => line !== null)
        .join('\n');
    },
  },
  {
    id: 'invoiceText',
    fields: [
      { key: 'company', type: 'text', required: false },
      { key: 'recipient', type: 'text', required: false },
      { key: 'itemDescription', type: 'text', required: true },
      { key: 'amount', type: 'currency-amount', required: true },
      { key: 'referenceNumber', type: 'text', required: false },
      { key: 'date', type: 'date', required: true },
    ],
    generate: (values, lang) => {
      const company = v(values, 'company');
      const recipient = v(values, 'recipient');
      const item = v(values, 'itemDescription', DASH);
      const ref = v(values, 'referenceNumber');
      const date = v(values, 'date', DASH);
      const amount = amountLine(values, lang);

      if (lang === 'ar') {
        return [
          company ? `${company}` : null,
          'نص فاتورة',
          ref ? `رقم الفاتورة: ${ref}` : null,
          `التاريخ: ${date}`,
          recipient ? `إلى: ${recipient}` : null,
          '',
          `وصف السلعة/الخدمة: ${item}`,
          `المبلغ الإجمالي: ${amount}`,
          '',
          'شكرًا لتعاملكم معنا.',
        ]
          .filter((line) => line !== null)
          .join('\n');
      }

      return [
        company ? `${company}` : null,
        'Invoice',
        ref ? `Invoice No.: ${ref}` : null,
        `Date: ${date}`,
        recipient ? `Bill To: ${recipient}` : null,
        '',
        `Item/Service description: ${item}`,
        `Total amount: ${amount}`,
        '',
        'Thank you for your business.',
      ]
        .filter((line) => line !== null)
        .join('\n');
    },
  },
  {
    id: 'meetingNotice',
    fields: [
      { key: 'company', type: 'text', required: false },
      { key: 'recipient', type: 'text', required: false },
      { key: 'subject', type: 'text', required: true },
      { key: 'meetingDate', type: 'date', required: true },
      { key: 'meetingTime', type: 'text', required: true },
      { key: 'meetingLocation', type: 'text', required: false },
      { key: 'notes', type: 'textarea', required: false },
      { key: 'date', type: 'date', required: true },
    ],
    generate: (values, lang) => {
      const company = v(values, 'company');
      const recipient = v(values, 'recipient');
      const subject = v(values, 'subject', DASH);
      const meetingDate = v(values, 'meetingDate', DASH);
      const meetingTime = v(values, 'meetingTime', DASH);
      const location = v(values, 'meetingLocation');
      const notes = v(values, 'notes');
      const date = v(values, 'date', DASH);

      if (lang === 'ar') {
        return [
          company ? `${company}` : null,
          recipient ? `إلى: ${recipient}` : null,
          'الموضوع: إشعار اجتماع',
          '',
          'تحية طيبة وبعد،',
          '',
          `تتم دعوتكم لحضور اجتماع بخصوص: ${subject}`,
          `التاريخ: ${meetingDate}`,
          `الوقت: ${meetingTime}`,
          location ? `المكان: ${location}` : null,
          notes ? `ملاحظات: ${notes}` : null,
          '',
          `تاريخ الإشعار: ${date}`,
          '',
          'يرجى الحضور في الموعد المحدد.',
        ]
          .filter((line) => line !== null)
          .join('\n');
      }

      return [
        company ? `${company}` : null,
        recipient ? `To: ${recipient}` : null,
        'Subject: Meeting Notice',
        '',
        'Dear Sir/Madam,',
        '',
        `You are kindly invited to a meeting regarding: ${subject}`,
        `Date: ${meetingDate}`,
        `Time: ${meetingTime}`,
        location ? `Location: ${location}` : null,
        notes ? `Notes: ${notes}` : null,
        '',
        `Notice date: ${date}`,
        '',
        'Your attendance is highly appreciated.',
      ]
        .filter((line) => line !== null)
        .join('\n');
    },
  },
];

export function getDocumentTemplate(id: DocumentCategory): DocumentTemplateDef {
  const found = DOCUMENT_TEMPLATES.find((tpl) => tpl.id === id);
  if (!found) throw new Error(`Unknown document template: ${id}`);
  return found;
}
