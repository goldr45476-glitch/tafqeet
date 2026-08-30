/**
 * The administrative document types the letter editor supports. Kept as a
 * small, flat registry (rather than one hand-built template per type, as
 * the old `documentTemplates.ts` did) so the *fields* stay identical and
 * reusable across every type — only the label and the default closing
 * phrase vary. Adding a 7th document type later is a one-entry addition
 * here, nothing else has to change.
 *
 * The "default closing phrase" is only a starting suggestion used to
 * pre-fill the (fully editable) closing-phrase field when the user picks a
 * document type — never rendered as fixed/read-only text. The user can
 * rewrite it freely, and it stays exactly as they left it even if they
 * later change other fields.
 */
export type DocumentTypeId =
  | 'paymentRequest'
  | 'receiptRequest'
  | 'approvalRequest'
  | 'actionRequest'
  | 'notice'
  | 'officialLetter';

export interface DocumentTypeDef {
  id: DocumentTypeId;
  defaultClosingPhrase: { ar: string; en: string };
}

export const DOCUMENT_TYPES: DocumentTypeDef[] = [
  {
    id: 'paymentRequest',
    defaultClosingPhrase: {
      ar: 'يرجى التكرم بالاطلاع والموافقة على صرف المبلغ أعلاه.',
      en: 'Kindly review and approve disbursement of the above amount.',
    },
  },
  {
    id: 'receiptRequest',
    defaultClosingPhrase: {
      ar: 'يرجى التكرم بالاطلاع والموافقة على قبض المبلغ أعلاه.',
      en: 'Kindly review and approve receipt of the above amount.',
    },
  },
  {
    id: 'approvalRequest',
    defaultClosingPhrase: {
      ar: 'يرجى التكرم بالاطلاع والموافقة على ما ورد أعلاه.',
      en: 'Kindly review and approve the above.',
    },
  },
  {
    id: 'actionRequest',
    defaultClosingPhrase: {
      ar: 'يرجى التكرم باتخاذ الإجراء اللازم بخصوص ما ورد أعلاه.',
      en: 'Kindly take the necessary action regarding the above.',
    },
  },
  {
    id: 'notice',
    defaultClosingPhrase: {
      ar: 'تم إرسال هذا الإشعار للعلم واتخاذ ما يلزم.',
      en: 'This notice is sent for your information and necessary action.',
    },
  },
  {
    id: 'officialLetter',
    defaultClosingPhrase: {
      ar: 'وتفضلوا بقبول فائق الاحترام والتقدير.',
      en: 'Please accept our highest respect and appreciation.',
    },
  },
];

export function getDocumentType(id: DocumentTypeId): DocumentTypeDef {
  const found = DOCUMENT_TYPES.find((dt) => dt.id === id);
  if (!found) throw new Error(`Unknown document type: ${id}`);
  return found;
}
