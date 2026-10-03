import type { ComponentType } from 'react';
import { IconDateDiff, IconDocument, IconFinancial, IconTafqeet, type IconProps } from '../components/icons';

export type ToolId = 'numberToWords' | 'dateDifference' | 'financialCalculator' | 'documentHelper';

export interface ToolMeta {
  id: ToolId;
  path: string;
  icon: ComponentType<IconProps>;
  /** Solid fill for the tool's icon tile / accents. */
  solid: string;
  /** Page-section tint (see BackgroundDecor). */
  tone: 'brand' | 'sapphire' | 'accent' | 'ruby';
  /** Text colour used for the star medallion fill in the page header. */
  medallion: string;
}

export const TOOLS: ToolMeta[] = [
  {
    id: 'numberToWords',
    path: '/tools/number-to-words',
    icon: IconTafqeet,
    solid: 'bg-brand-700',
    tone: 'brand',
    medallion: 'text-brand-700',
  },
  {
    id: 'dateDifference',
    path: '/tools/date-difference',
    icon: IconDateDiff,
    solid: 'bg-sapphire-700',
    tone: 'sapphire',
    medallion: 'text-sapphire-700',
  },
  {
    id: 'financialCalculator',
    path: '/tools/financial-calculator',
    icon: IconFinancial,
    solid: 'bg-accent-700',
    tone: 'accent',
    medallion: 'text-accent-700',
  },
  {
    id: 'documentHelper',
    path: '/tools/document-helper',
    icon: IconDocument,
    solid: 'bg-ruby-700',
    tone: 'ruby',
    medallion: 'text-ruby-700',
  },
];

export function getToolByPath(path: string): ToolMeta | undefined {
  return TOOLS.find((tool) => tool.path === path);
}
