import React from 'react';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import FinancialCalculatorTool from '../components/tools/FinancialCalculatorTool';

export default function FinancialCalculatorPage() {
  const { t } = useLocale();

  return (
    <>
      <Seo title={t.financial.title} description={t.financial.subtitle} />
      <FinancialCalculatorTool />
    </>
  );
}
