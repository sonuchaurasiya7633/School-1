'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ShieldCheck, Key, Server, Check } from 'lucide-react';

export default function DocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data) => setSpec(data))
      .catch((err) => console.error(err));
  }, []);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  if (!spec) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading OpenAPI Documentation...</span>
        </div>
      </div>
    );
  }

  const paths = Object.entries(spec.paths || {});
  const tags = ['All', ...Array.from(new Set(paths.flatMap(([_, methods]: any) => Object.values(methods).flatMap((m: any) => m.tags || []))))];

  const filteredPaths = paths.filter(([_, methods]: any) => {
    if (activeTag === 'All') return true;
    return Object.values(methods).some((m: any) => m.tags?.includes(activeTag));
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h1 className="font-bold text-lg text-white">{spec.info.title}</h1>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded font-mono font-bold">
                v{spec.info.version}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{spec.info.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-slate-400">
            <Key className="w-3.5 h-3.5 text-emerald-400" /> Bearer JWT + Cookie
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-800">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTag === tag
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Endpoints List */}
        <div className="space-y-4">
          {filteredPaths.map(([pathName, methods]: any) => {
            return Object.entries(methods).map(([method, details]: any) => {
              const methodColor =
                method === 'get'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : method === 'post'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : method === 'put'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

              return (
                <div
                  key={`${pathName}-${method}`}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${methodColor}`}
                      >
                        {method}
                      </span>
                      <code className="text-sm font-mono text-white font-semibold">{pathName}</code>
                      <button
                        onClick={() => handleCopy(pathName)}
                        title="Copy endpoint"
                        className="text-slate-500 hover:text-slate-300 transition"
                      >
                        {copiedPath === pathName ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded">copy</span>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {details.tags?.map((t: string) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] rounded font-medium"
                        >
                          {t}
                        </span>
                      ))}
                      {details.security && (
                        <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <ShieldCheck className="w-3 h-3" /> Auth Required
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 font-medium">{details.summary}</p>
                  {details.description && (
                    <p className="text-xs text-slate-500 mt-1">{details.description}</p>
                  )}
                </div>
              );
            });
          })}
        </div>
      </main>
    </div>
  );
}
