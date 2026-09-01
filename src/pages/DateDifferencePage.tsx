import React from 'react';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import DateDifferenceTool from '../components/tools/DateDifferenceTool';

export default function DateDifferencePage() {
  const { t } = useLocale();

  return (
    <>
      <Seo title={t.dateDifference.title} description={t.dateDifference.subtitle} />
      <DateDifferenceTool />
    </>
  );
}
