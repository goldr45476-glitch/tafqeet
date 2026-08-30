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
      className="group animate-fadeInUp glass-card flex flex-col p-6 hover:-translate-y-1.5 hover:shadow-glow focus-visible:-translate-y-1.5 focus-visible:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 sm:p-7"
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-white shadow-soft transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">{info.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{info.short}</p>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400">
        {t.common.openTool}
        <IconArrowEnd
          className={
            dir === 'rtl'
              ? 'h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1'
              : 'h-4 w-4 transition-transform duration-300 group-hover:translate-x-1'
          }
        />
      </span>

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r ${tool.gradient} transition-transform duration-300 group-hover:scale-x-100`}
      />
    </Link>
  );
}
