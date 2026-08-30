import { composeDocument, emptyDocumentValues } from '../src/utils/documentComposer';

const labels = {
  referenceNumber: 'العدد',
  date: 'التاريخ',
  subject: 'الموضوع',
  amountBlockLabel: 'المبلغ',
  tafqeetBlockLabel: 'التفقيط',
};

const values = emptyDocumentValues({
  referenceNumber: '123',
  date: '2026-08-29',
  recipient: 'السيد المدير العام المحترم',
  subject: 'طلب صرف تكاليف صيانة',
  explanation: 'نفيدكم بأنه يُطلب صرف مبلغ [AMOUNT] وذلك من أجل صيانة الأجهزة.',
  reason: 'وذلك بغرض استمرارية العمل.',
  closingPhrase: 'يرجى التكرم بالاطلاع والموافقة على صرف المبلغ أعلاه.',
  amount: '1250.750',
  currencyCode: 'IQD',
  position: 'محاسب',
  employeeName: 'محمد أحمد',
});

console.log('--- FULL ---');
console.log(composeDocument(values, 'ar', labels));
console.log('\n--- BODY ONLY ---');
console.log(composeDocument(values, 'ar', labels, { bodyOnly: true }));

console.log('\n--- No amount, no reason (optional fields empty) ---');
const values2 = emptyDocumentValues({ subject: 'إشعار عام', explanation: 'نص الإشعار هنا.' });
console.log(composeDocument(values2, 'ar', labels));
