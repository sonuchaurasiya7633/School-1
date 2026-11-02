'use client';

import React from 'react';
import { LucideIcon, Search, AlertCircle, RefreshCw, FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'empty' | 'no-results' | 'error';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = FolderSearch,
  actionLabel,
  onAction,
  variant = 'empty',
}) => {
  const iconColor =
    variant === 'error'
      ? 'text-rose-500 bg-rose-50 border-rose-200'
      : variant === 'no-results'
      ? 'text-amber-500 bg-amber-50 border-amber-200'
      : 'text-emerald-600 bg-emerald-50 border-emerald-200';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center shadow-xs my-4">
      <div
        className={`w-16 h-16 rounded-3xl border ${iconColor} flex items-center justify-center mx-auto mb-4 shadow-xs`}
      >
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
