import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../i18n';
import type { ToolMeta } from '../data/tools';
import { IconArrowEnd } from './icons';

export default function ToolCard({ tool, index = 0 }: { tool: ToolMeta; index?: number }) {
  const { t, dir } = useLocale();
  const Icon = tool.icon;
  const info = t.tools[tool.id];

  return (
    <Link
      to={tool.path}
      style={{ animationDelay: `${index * 80}ms` }}
      className="group animate-fadeInUp glass-card flex flex-col p-6 hover:-translate-y-1 hover:border-accent-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-500 sm:p-7"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-md border border-accent-400 ${tool.solid} text-accent-50 shadow-soft`}
      >
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-2xl font-bold text-brand-900 dark:text-accent-100">{info.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">{info.short}</p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 dark:text-accent-300">
        {t.common.openTool}
        <IconArrowEnd
          className={
            dir === 'rtl'
              ? 'h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1'
              : 'h-4 w-4 transition-transform duration-300 group-hover:translate-x-1'
          }
        />
      </span>
    </Link>
  );
}
