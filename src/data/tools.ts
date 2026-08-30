import type { ComponentType } from 'react';
import { IconDocument, IconFinancial, IconTafqeet, type IconProps } from '../components/icons';

export type ToolId = 'numberToWords' | 'financialCalculator' | 'documentHelper';

export interface ToolMeta {
  id: ToolId;
  number: string;
  path: string;
  icon: ComponentType<IconProps>;
  gradient: string;
}

/**
 * The site's three focused tools, in display order. Kept as a single
 * registry so Navbar, Footer, Home and the Tools dashboard all stay in sync —
 * add a fourth tool here (plus its route, icon, and i18n strings) and it
 * appears everywhere automatically.
 */
export const TOOLS: ToolMeta[] = [
  {
    id: 'numberToWords',
    number: '01',
    path: '/tools/number-to-words',
    icon: IconTafqeet,
    gradient: 'from-brand-500 to-brand-700',
  },
  {
    id: 'financialCalculator',
    number: '02',
    path: '/tools/financial-calculator',
    icon: IconFinancial,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'documentHelper',
    number: '03',
    path: '/tools/document-helper',
    icon: IconDocument,
    gradient: 'from-rose-500 to-rose-700',
  },
];

export function getToolByPath(path: string): ToolMeta | undefined {
  return TOOLS.find((tool) => tool.path === path);
}
