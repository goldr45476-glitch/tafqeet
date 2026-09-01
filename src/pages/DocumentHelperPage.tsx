import React from 'react';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import DocumentHelperTool from '../components/tools/DocumentHelperTool';

export default function DocumentHelperPage() {
  const { t } = useLocale();

  return (
    <>
      <Seo title={t.documentHelper.title} description={t.documentHelper.subtitle} />
      <DocumentHelperTool />
    </>
  );
}
