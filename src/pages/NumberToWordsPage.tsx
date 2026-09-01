import React from 'react';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import NumberToWordsTool from '../components/tools/NumberToWordsTool';

export default function NumberToWordsPage() {
  const { t } = useLocale();

  return (
    <>
      <Seo title={t.numberToWords.title} description={t.numberToWords.subtitle} />
      <NumberToWordsTool />
    </>
  );
}
