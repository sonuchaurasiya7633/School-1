'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Layers,
  Link as LinkIcon,
  Globe,
  Award,
  Phone,
  Clock,
  MapPin,
  Mail,
  Shield,
  Check,
} from 'lucide-react';
import { IFooterSettings, IFooterLink, IFooterPortal, DEFAULT_FOOTER_SETTINGS } from '@/types/footer';
import { authFetch } from '@/lib/api';
import PublicFooter from '@/components/common/PublicFooter';

export default function FooterCMSManager() {
  const [activeSubTab, setActiveSubTab] = useState<
    'branding' | 'links' | 'portals' | 'admissions' | 'campus' | 'bottom' | 'preview'
  >('branding');

  const [footerState, setFooterState] = useState<IFooterSettings>(DEFAULT_FOOTER_SETTINGS);
  const [savedState, setSavedState] = useState<IFooterSettings>(DEFAULT_FOOTER_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Preview viewport width state
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Check for unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(footerState) !== JSON.stringify(savedState);
  }, [footerState, savedState]);

  // Fetch current footer data on mount
  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/footer');
      const data = await res.json();
      if (data.success && data.footer) {
        setFooterState(data.footer);
        setSavedState(data.footer);
      }
    } catch (err: any) {
      console.error('Failed to load footer settings:', err);
      setStatusMsg({ type: 'error', text: 'Failed to load footer settings from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterData();
  }, []);

  // Save changes to database
  const handleSave = async () => {
    try {
      setSaving(true);
      setStatusMsg(null);

      const res = await authFetch('/api/admin/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(footerState),
      });

      const data = await res.json();
      if (data.success) {
        setSavedState(data.footer || footerState);
        setFooterState(data.footer || footerState);
        setStatusMsg({ type: 'success', text: 'Footer updated and published live across the website!' });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to update footer.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Network error while saving.' });
    } finally {
      setSaving(false);
    }
  };

  // Reset to last saved
  const handleReset = () => {
    if (confirm('Are you sure you want to discard unsaved changes?')) {
      setFooterState(JSON.parse(JSON.stringify(savedState)));
      setStatusMsg({ type: 'success', text: 'Unsaved edits reverted to previous saved state.' });
    }
  };

  // Logo file upload handler
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      alert('Logo size must be less than 4MB.');
      return;
    }

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'footer_logos');

      const res = await authFetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.secure_url) {
        setFooterState((prev) => ({
          ...prev,
          logo: data.secure_url,
        }));
        setStatusMsg({ type: 'success', text: 'Footer logo uploaded successfully!' });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Failed to upload logo.' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Error uploading logo.' });
    } finally {
      setUploadingLogo(false);
    }
  };

  // ---------------- Navigation Links helpers ----------------
  const addExploreLink = () => {
    const newLink: IFooterLink = {
      id: `link-${Date.now()}`,
      label: 'New Link',
      url: '/',
      isExternal: false,
      enabled: true,
    };
    setFooterState((prev) => ({
      ...prev,
      exploreLinks: [...(prev.exploreLinks || []), newLink],
    }));
  };

  const updateExploreLink = (id: string, field: keyof IFooterLink, value: any) => {
    setFooterState((prev) => ({
      ...prev,
      exploreLinks: prev.exploreLinks.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    }));
  };

  const removeExploreLink = (id: string) => {
    setFooterState((prev) => ({
      ...prev,
      exploreLinks: prev.exploreLinks.filter((l) => l.id !== id),
    }));
  };

  const moveExploreLink = (index: number, direction: 'up' | 'down') => {
    const links = [...footerState.exploreLinks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;
    const temp = links[index];
    links[index] = links[targetIdx];
    links[targetIdx] = temp;
    setFooterState((prev) => ({ ...prev, exploreLinks: links }));
  };

  // ---------------- Digital Portals helpers ----------------
  const addPortal = () => {
    const newPortal: IFooterPortal = {
      id: `portal-${Date.now()}`,
      label: 'New Portal',
      url: '/login',
      target: '_self',
      enabled: true,
    };
    setFooterState((prev) => ({
      ...prev,
      portals: [...(prev.portals || []), newPortal],
    }));
  };

  const updatePortal = (id: string, field: keyof IFooterPortal, value: any) => {
    setFooterState((prev) => ({
      ...prev,
      portals: prev.portals.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    }));
  };

  const removePortal = (id: string) => {
    setFooterState((prev) => ({
      ...prev,
      portals: prev.portals.filter((p) => p.id !== id),
    }));
  };

  const movePortal = (index: number, direction: 'up' | 'down') => {
    const list = [...footerState.portals];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setFooterState((prev) => ({ ...prev, portals: list }));
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-bold text-sm">Loading Footer CMS configurations...</p>
      </div>
    );
  }

  const subTabs = [
    { id: 'branding', label: '1. School Branding', icon: Layers },
    { id: 'links', label: '2. Navigation Links', icon: LinkIcon },
    { id: 'portals', label: '3. Digital Portals', icon: Globe },
    { id: 'admissions', label: '4. Admissions Card', icon: Award },
    { id: 'campus', label: '5. Campus Information', icon: MapPin },
    { id: 'bottom', label: '6. Bottom Bar', icon: Clock },
    { id: 'preview', label: '7. Responsive Live Preview', icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Action Buttons & Unsaved Changes Alert */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 rounded-3xl border border-emerald-800/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CMS Engine
            </span>
            {isDirty ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                ● Unsaved Changes
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ✓ All Changes Published
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            Footer Management Module
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full dynamic control of school branding, navigation links, digital portals, admissions card, and contact info.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
          {isDirty && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing Live...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Publish Footer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 shadow-sm border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="font-semibold">{statusMsg.text}</span>
        </div>
      )}

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 no-scrollbar">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. BRANDING MANAGEMENT TAB                                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'branding' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-white">School Branding & Identity</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure footer logo, school name, tagline, description, and admission CTA button.
            </p>
          </div>

          {/* Logo Uploader / Replaced / Removed */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <label className="text-xs font-bold text-slate-300 block">Footer Logo</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white p-1.5 overflow-hidden shrink-0 shadow-inner border border-slate-700 flex items-center justify-center">
                <Image
                  src={footerState.logo || '/images/logo.jpeg'}
                  alt="Footer Logo"
                  width={64}
                  height={64}
                  className="object-contain w-full h-full"
                />
              </div>

              <div className="space-y-2 flex-1 w-full">
                <div className="flex flex-wrap gap-2">
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs">
                    {uploadingLogo ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingLogo ? 'Uploading...' : 'Upload New Logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setFooterState((p) => ({ ...p, logo: '/images/logo.jpeg' }))}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
                  >
                    Reset to Default Logo
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Recommended size: Square PNG or JPG with transparent background (at least 200×200px).
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">School Name</label>
              <input
                type="text"
                value={footerState.schoolName}
                onChange={(e) => setFooterState((p) => ({ ...p, schoolName: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-bold"
                placeholder="SUCCESS POINT SCHOOL"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">Tagline (Peach accent)</label>
              <input
                type="text"
                value={footerState.tagline}
                onChange={(e) => setFooterState((p) => ({ ...p, tagline: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-bold"
                placeholder="Best Education, Good Results."
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">Footer Description</label>
            <textarea
              rows={3}
              value={footerState.description}
              onChange={(e) => setFooterState((p) => ({ ...p, description: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-hidden focus:border-emerald-500 leading-relaxed"
              placeholder="Short institutional summary..."
            />
          </div>

          {/* Admission CTA Button Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-white">Call-To-Action (CTA) Button</h4>
                <p className="text-[11px] text-slate-400">Prominent admission action button in footer</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={footerState.ctaButton?.enabled}
                  onChange={(e) =>
                    setFooterState((p) => ({
                      ...p,
                      ctaButton: { ...p.ctaButton, enabled: e.target.checked },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {footerState.ctaButton?.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Button Text</label>
                  <input
                    type="text"
                    value={footerState.ctaButton.text}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        ctaButton: { ...p.ctaButton, text: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Destination URL</label>
                  <input
                    type="text"
                    value={footerState.ctaButton.url}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        ctaButton: { ...p.ctaButton, url: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NAVIGATION LINKS (EXPLORE INSTITUTION)                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'links' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white">Explore Institution Navigation Links</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage all institutional page links, reorder, toggle visibility, and support internal or external destinations.
              </p>
            </div>
            <button
              type="button"
              onClick={addExploreLink}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Link</span>
            </button>
          </div>

          <div className="space-y-3">
            {footerState.exploreLinks?.map((link, idx) => (
              <div
                key={link.id || idx}
                className={`p-3.5 rounded-2xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                  link.enabled
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/30 border-slate-900 opacity-60'
                }`}
              >
                {/* Drag / Reorder Controls */}
                <div className="flex items-center gap-1.5 self-center md:self-auto shrink-0">
                  <span className="text-[11px] font-bold text-slate-500 w-5 text-center">#{idx + 1}</span>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveExploreLink(idx, 'up')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 text-[10px]"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === footerState.exploreLinks.length - 1}
                      onClick={() => moveExploreLink(idx, 'down')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 text-[10px]"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2.5 flex-1 w-full">
                  <div className="md:col-span-6">
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Link Label</label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateExploreLink(link.id, 'label', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-semibold"
                    />
                  </div>

                  <div className="md:col-span-6">
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Destination URL</label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => updateExploreLink(link.id, 'url', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-300 focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Toggles & Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={link.isExternal}
                      onChange={(e) => updateExploreLink(link.id, 'isExternal', e.target.checked)}
                      className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                    />
                    <span>External</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => updateExploreLink(link.id, 'enabled', !link.enabled)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      link.enabled
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                    title={link.enabled ? 'Enabled' : 'Disabled'}
                  >
                    {link.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeExploreLink(link.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                    title="Delete Link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {footerState.exploreLinks?.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
                No links added yet. Click &quot;Add New Link&quot; above to add one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DIGITAL PORTALS                                                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'portals' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white">Digital Portals Management</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage Student, Teacher, and Super Admin portal login routes and link behaviors.
              </p>
            </div>
            <button
              type="button"
              onClick={addPortal}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Portal</span>
            </button>
          </div>

          <div className="space-y-3">
            {footerState.portals?.map((portal, idx) => (
              <div
                key={portal.id || idx}
                className={`p-3.5 rounded-2xl border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                  portal.enabled
                    ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/30 border-slate-900 opacity-60'
                }`}
              >
                {/* Reorder Buttons */}
                <div className="flex items-center gap-1.5 self-center md:self-auto shrink-0">
                  <span className="text-[11px] font-bold text-slate-500 w-5 text-center">#{idx + 1}</span>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => movePortal(idx, 'up')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 text-[10px]"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === footerState.portals.length - 1}
                      onClick={() => movePortal(idx, 'down')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 text-[10px]"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 flex-1 w-full">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Portal Name</label>
                    <input
                      type="text"
                      value={portal.label}
                      onChange={(e) => updatePortal(portal.id, 'label', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Destination URL</label>
                    <input
                      type="text"
                      value={portal.url}
                      onChange={(e) => updatePortal(portal.id, 'url', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-300"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Link Target</label>
                    <select
                      value={portal.target || '_self'}
                      onChange={(e) => updatePortal(portal.id, 'target', e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                    >
                      <option value="_self">Same Tab (_self)</option>
                      <option value="_blank">New Tab (_blank)</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => updatePortal(portal.id, 'enabled', !portal.enabled)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      portal.enabled
                        ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {portal.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => removePortal(portal.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ADMISSIONS CARD MANAGEMENT                                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'admissions' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white">Admissions Callout Card</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage the highlighted admissions badge card displayed below Digital Portals.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={footerState.admissionsCard?.enabled}
                onChange={(e) =>
                  setFooterState((p) => ({
                    ...p,
                    admissionsCard: { ...p.admissionsCard, enabled: e.target.checked },
                  }))
                }
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {footerState.admissionsCard?.enabled && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Card Heading</label>
                <input
                  type="text"
                  value={footerState.admissionsCard.title}
                  onChange={(e) =>
                    setFooterState((p) => ({
                      ...p,
                      admissionsCard: { ...p.admissionsCard, title: e.target.value },
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold"
                  placeholder="Admissions Session 2026-27"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Description Text</label>
                <textarea
                  rows={3}
                  value={footerState.admissionsCard.description}
                  onChange={(e) =>
                    setFooterState((p) => ({
                      ...p,
                      admissionsCard: { ...p.admissionsCard, description: e.target.value },
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed"
                  placeholder="Admissions open for Nursery through Class 11th..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Action Link Text</label>
                  <input
                    type="text"
                    value={footerState.admissionsCard.ctaText}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        admissionsCard: { ...p.admissionsCard, ctaText: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-semibold"
                    placeholder="Apply Online"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">Action Link URL</label>
                  <input
                    type="text"
                    value={footerState.admissionsCard.ctaUrl}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        admissionsCard: { ...p.admissionsCard, ctaUrl: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    placeholder="/admissions"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CAMPUS INFORMATION MANAGEMENT                                          */}
      {/* ========================================================================= */}
      {activeSubTab === 'campus' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-white">Campus Information & Contact Details</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit address, phone numbers, email, hours, and Google Maps URL with field-level visibility controls.
            </p>
          </div>

          <div className="space-y-4">
            {/* Address */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E8B4A8]" />
                  <span>Campus Address</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerState.campusInfo?.showAddress}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        campusInfo: { ...p.campusInfo, showAddress: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <span>Show in Footer</span>
                </label>
              </div>
              <input
                type="text"
                value={footerState.campusInfo?.address}
                onChange={(e) =>
                  setFooterState((p) => ({
                    ...p,
                    campusInfo: { ...p.campusInfo, address: e.target.value },
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Phone Numbers */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#E8B4A8]" />
                  <span>Official Contact Numbers (Auto-generates tel: links)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerState.campusInfo?.showPhone}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        campusInfo: { ...p.campusInfo, showPhone: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <span>Show in Footer</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Primary Phone</label>
                  <input
                    type="text"
                    value={footerState.campusInfo?.phonePrimary}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        campusInfo: { ...p.campusInfo, phonePrimary: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    placeholder="+91 8051217686"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Secondary Phone</label>
                  <input
                    type="text"
                    value={footerState.campusInfo?.phoneSecondary}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        campusInfo: { ...p.campusInfo, phoneSecondary: e.target.value },
                      }))
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Email Address */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#E8B4A8]" />
                  <span>Official Email Address (Auto-generates mailto: link)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerState.campusInfo?.showEmail}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        campusInfo: { ...p.campusInfo, showEmail: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <span>Show in Footer</span>
                </label>
              </div>
              <input
                type="email"
                value={footerState.campusInfo?.email}
                onChange={(e) =>
                  setFooterState((p) => ({
                    ...p,
                    campusInfo: { ...p.campusInfo, email: e.target.value },
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="info@successpointschool.edu"
              />
            </div>

            {/* Office Hours */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#E8B4A8]" />
                  <span>Office / Administration Hours</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerState.campusInfo?.showOfficeHours}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        campusInfo: { ...p.campusInfo, showOfficeHours: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <span>Show in Footer</span>
                </label>
              </div>
              <input
                type="text"
                value={footerState.campusInfo?.officeHours}
                onChange={(e) =>
                  setFooterState((p) => ({
                    ...p,
                    campusInfo: { ...p.campusInfo, officeHours: e.target.value },
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                placeholder="Office Hours: 08:00 AM - 02:30 PM (Mon-Sat)"
              />
            </div>

            {/* Maps URL */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-[#E8B4A8]" />
                  <span>Google Maps URL</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerState.campusInfo?.showMaps}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        campusInfo: { ...p.campusInfo, showMaps: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <span>Show in Footer</span>
                </label>
              </div>
              <input
                type="text"
                value={footerState.campusInfo?.mapsUrl}
                onChange={(e) =>
                  setFooterState((p) => ({
                    ...p,
                    campusInfo: { ...p.campusInfo, mapsUrl: e.target.value },
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. BOTTOM BAR MANAGEMENT                                                  */}
      {/* ========================================================================= */}
      {activeSubTab === 'bottom' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-extrabold text-white">Footer Bottom Bar</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit copyright notice template, bottom-right tagline, and toggle visibility.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 block">Copyright Notice</label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerState.bottomBar?.showCopyright}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        bottomBar: { ...p.bottomBar, showCopyright: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <span>Show Copyright</span>
                </label>
              </div>
              <input
                type="text"
                value={footerState.bottomBar?.copyrightText}
                onChange={(e) =>
                  setFooterState((p) => ({
                    ...p,
                    bottomBar: { ...p.bottomBar, copyrightText: e.target.value },
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-medium"
                placeholder="© {year} Success Point School (S.P.S.). All Rights Reserved."
              />
              <p className="text-[11px] text-emerald-400/80">
                💡 Tip: Use <code className="bg-slate-800 px-1 py-0.5 rounded text-white">{'{year}'}</code> to automatically insert the current year ({new Date().getFullYear()}).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 block">Bottom Right School Tagline</label>
                <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerState.bottomBar?.showTagline}
                    onChange={(e) =>
                      setFooterState((p) => ({
                        ...p,
                        bottomBar: { ...p.bottomBar, showTagline: e.target.checked },
                      }))
                    }
                    className="rounded border-slate-700 text-emerald-600 focus:ring-0"
                  />
                  <span>Show Tagline</span>
                </label>
              </div>
              <input
                type="text"
                value={footerState.bottomBar?.tagline}
                onChange={(e) =>
                  setFooterState((p) => ({
                    ...p,
                    bottomBar: { ...p.bottomBar, tagline: e.target.value },
                  }))
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-medium"
                placeholder="Best Education, Good Results."
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. RESPONSIVE LIVE PREVIEW                                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'preview' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-white">Interactive Responsive Footer Preview</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulate how your live footer looks across Desktop, Tablet, and Mobile devices in real time.
              </p>
            </div>

            {/* Viewport switch buttons */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  previewViewport === 'desktop'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (100%)</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewViewport('tablet')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  previewViewport === 'tablet'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>Tablet (768px)</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  previewViewport === 'mobile'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile (375px)</span>
              </button>
            </div>
          </div>

          {/* Device Frame */}
          <div className="w-full flex justify-center py-4 bg-slate-950/80 rounded-3xl border border-slate-800/80 overflow-x-auto">
            <div
              className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-700/60 ${
                previewViewport === 'desktop'
                  ? 'w-full max-w-full'
                  : previewViewport === 'tablet'
                  ? 'w-[768px] max-w-full'
                  : 'w-[375px] max-w-full'
              }`}
            >
              {/* Mini Device Header Bar */}
              <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 font-sans font-bold text-white text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Preview Mode ({previewViewport.toUpperCase()})
                </span>
                <span>
                  {previewViewport === 'desktop'
                    ? '100% Full Width'
                    : previewViewport === 'tablet'
                    ? '768 × 1024'
                    : '375 × 812'}
                </span>
              </div>

              {/* Rendered Live Component */}
              <PublicFooter initialData={footerState} previewMode={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
