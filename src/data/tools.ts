import type { ComponentType } from 'react';
import { IconDateDiff, IconDocument, IconFinancial, IconTafqeet, type IconProps } from '../components/icons';

export type ToolId = 'numberToWords' | 'dateDifference' | 'financialCalculator' | 'documentHelper';

export interface ToolMeta {
  id: ToolId;
  path: string;
  icon: ComponentType<IconProps>;
  gradient: string;
}

export const TOOLS: ToolMeta[] = [
  {
    id: 'numberToWords',
    path: '/tools/number-to-words',
    icon: IconTafqeet,
    gradient: 'from-brand-500 to-brand-700',
  },
  {
    id: 'dateDifference',
    path: '/tools/date-difference',
    icon: IconDateDiff,
    gradient: 'from-violet-500 to-violet-700',
  },
  {
    id: 'financialCalculator',
    path: '/tools/financial-calculator',
    icon: IconFinancial,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'documentHelper',
    path: '/tools/document-helper',
    icon: IconDocument,
    gradient: 'from-rose-500 to-rose-700',
  },
];

export function getToolByPath(path: string): ToolMeta | undefined {
  return TOOLS.find((tool) => tool.path === path);
}
