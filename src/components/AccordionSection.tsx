import React from 'react';
import { ChevronDown } from 'lucide-react';

export const AccordionSection = ({ title, children, defaultOpen = false }: { title: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) => {
  return (
    <details className="group border border-slate-200 rounded-xl bg-white shadow-sm [&_summary::-webkit-details-marker]:hidden" open={defaultOpen}>
      <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 md:p-6 text-slate-900 font-bold text-lg md:text-xl leading-snug">
        {title}
        <ChevronDown className="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180" />
      </summary>
      <div className="p-4 pt-0 md:p-6 md:pt-0">
        {children}
      </div>
    </details>
  );
};
