import React, { useMemo, useState } from 'react';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import BackgroundDecor from '../components/BackgroundDecor';
import PageHeader from '../components/PageHeader';
import CopyButton from '../components/CopyButton';
import {
  DOCUMENT_TEMPLATES,
  getDocumentTemplate,
  type DocumentCategory,
  type FieldValues,
} from '../data/documentTemplates';
import { CURRENCIES, DEFAULT_CURRENCY_CODE } from '../utils/numberToWordsEngine';
import { todayISO } from '../utils/dateUtils';
import { IconDocument, IconInfo, IconPrinter } from '../components/icons';

export default function DocumentHelperPage() {
  const { t, locale } = useLocale();

  const [category, setCategory] = useState<DocumentCategory>('paymentRequest');
  const [values, setValues] = useState<FieldValues>({ date: todayISO(), currency: DEFAULT_CURRENCY_CODE });
  const [generated, setGenerated] = useState('');
  const [error, setError] = useState<string | null>(null);

  const template = useMemo(() => getDocumentTemplate(category), [category]);

  function handleCategoryChange(next: DocumentCategory) {
    setCategory(next);
    setGenerated('');
    setError(null);
    setValues({ date: todayISO(), currency: DEFAULT_CURRENCY_CODE });
  }

  function handleFieldChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    const missing = template.fields.filter((f) => f.required && !(values[f.key] ?? '').trim());
    if (missing.length > 0) {
      setError(t.documentHelper.requiredFieldsError);
      setGenerated('');
      return;
    }
    setError(null);
    setGenerated(template.generate(values, locale));
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="relative overflow-hidden py-14 sm:py-20">
      <BackgroundDecor variant="compact" />
      <Seo title={t.documentHelper.title} description={t.documentHelper.subtitle} />

      <div className="section-container">
        <PageHeader
          eyebrow={t.nav.tools}
          title={t.documentHelper.title}
          subtitle={t.documentHelper.subtitle}
          icon={<IconDocument className="h-7 w-7" />}
        />

        <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-500/10 dark:text-amber-300">
          <IconInfo className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{t.documentHelper.disclaimer}</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-5">
          <form onSubmit={handleGenerate} className="glass-card p-6 sm:p-8 lg:col-span-2">
            <label className="field-label" htmlFor="doc-category">
              {t.documentHelper.categoryLabel}
            </label>
            <select
              id="doc-category"
              className="field-select"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as DocumentCategory)}
            >
              {DOCUMENT_TEMPLATES.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {t.documentHelper.categories[tpl.id]}
                </option>
              ))}
            </select>

            <div className="mt-5 space-y-4">
              {template.fields.map((field) => {
                const label = t.documentHelper.fields[field.key];
                const fieldId = `doc-field-${field.key}`;

                if (field.type === 'currency-amount') {
                  return (
                    <div key={field.key} className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="field-label" htmlFor={fieldId}>
                          {label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          id={fieldId}
                          type="text"
                          inputMode="decimal"
                          dir="ltr"
                          className="field-input"
                          value={values[field.key] ?? ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor="doc-field-currency">
                          {t.documentHelper.fields.currency}
                        </label>
                        <select
                          id="doc-field-currency"
                          className="field-select"
                          value={values.currency ?? DEFAULT_CURRENCY_CODE}
                          onChange={(e) => handleFieldChange('currency', e.target.value)}
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                }

                if (field.type === 'textarea') {
                  return (
                    <div key={field.key}>
                      <label className="field-label" htmlFor={fieldId}>
                        {label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                        id={fieldId}
                        className="field-input min-h-[90px] resize-y"
                        value={values[field.key] ?? ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      />
                    </div>
                  );
                }

                return (
                  <div key={field.key}>
                    <label className="field-label" htmlFor={fieldId}>
                      {label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      id={fieldId}
                      type={field.type === 'date' ? 'date' : 'text'}
                      className="field-input"
                      value={values[field.key] ?? ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary mt-6 w-full">
              {t.documentHelper.generateButton}
            </button>
          </form>

          <div className="lg:col-span-3">
            <div className="result-box min-h-[320px]" id="print-area">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                {t.documentHelper.resultTitle}
              </h2>

              {generated ? (
                <pre
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  className="mt-4 whitespace-pre-wrap font-sans text-[15px] leading-8 text-slate-800 dark:text-slate-100"
                >
                  {generated}
                </pre>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-400 dark:text-slate-500">
                  {t.documentHelper.resultPlaceholder}
                </p>
              )}

              <div className="no-print mt-6 flex flex-wrap gap-2.5">
                <CopyButton text={generated} label={t.documentHelper.copyText} disabled={!generated} />
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={!generated}
                  className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <IconPrinter className="h-4 w-4" />
                  {t.documentHelper.printButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
