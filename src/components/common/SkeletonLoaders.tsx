'use client';

import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className="w-full animate-pulse p-4 space-y-4">
      {/* Header bar */}
      <div className="h-9 bg-slate-100 rounded-xl w-full" />
      {/* Rows */}
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 py-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-full bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded w-1/3" />
            <div className="h-3 bg-slate-100/70 rounded w-1/4" />
          </div>
          <div className="h-4 bg-slate-100 rounded w-24 hidden sm:block" />
          <div className="h-6 bg-slate-100 rounded-full w-16" />
          <div className="h-8 bg-slate-100 rounded-lg w-20" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/80 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-slate-100 rounded w-20" />
              <div className="h-7 bg-slate-200 rounded w-28" />
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-32 pt-2" />
        </div>
      ))}
    </div>
  );
};
