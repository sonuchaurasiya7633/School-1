'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AvatarUploaderProps {
  currentAvatar?: string;
  name: string;
  targetUserId?: string; // Optional: If Super Admin is updating another user
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onSuccess?: (newAvatarUrl: string) => void;
  className?: string;
}

export function AvatarUploader({
  currentAvatar,
  name,
  targetUserId,
  size = 'lg',
  onSuccess,
  className = '',
}: AvatarUploaderProps) {
  const { refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(currentAvatar || '');
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (currentAvatar !== undefined) {
      setAvatar(currentAvatar || '');
    }
  }, [currentAvatar]);

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-28 h-28 text-3xl',
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setStatusMsg({ type: 'error', text: 'Image size should be less than 5MB.' });
      return;
    }

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setStatusMsg({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, WebP).' });
      return;
    }

    setUploading(true);
    setStatusMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (targetUserId) {
        formData.append('targetUserId', targetUserId);
      }

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const rawText = await res.text();
      let data: any = {};
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error(rawText || `Server returned error (${res.status})`);
      }

      if (res.ok && data.success && data.avatar) {
        setAvatar(data.avatar);
        setStatusMsg({ type: 'success', text: data.message || 'Profile picture updated!' });
        if (onSuccess) onSuccess(data.avatar);
        await refreshUser();
      } else {
        setStatusMsg({ type: 'error', text: data.message || `Failed to upload photo (${res.status})` });
      }
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setStatusMsg({ type: 'error', text: err.message || 'Upload error occurred.' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const initial = name ? name.trim().charAt(0).toUpperCase() : 'U';

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        aria-label="Upload profile image"
      />

      {/* Avatar Container */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`group relative ${sizeClasses[size]} rounded-2xl overflow-hidden shadow-md border-2 border-white ring-2 ring-slate-200/80 cursor-pointer transition-all hover:ring-emerald-500 hover:shadow-lg flex items-center justify-center bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-black`}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name || 'User Avatar'}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <span>{initial}</span>
        )}

        {/* Hover / Loading Overlay */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center transition-opacity ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <>
              <Camera className="w-5 h-5 text-white drop-shadow-sm" />
              <span className="text-[9px] font-bold text-white mt-1 uppercase tracking-wider">Change</span>
            </>
          )}
        </div>
      </div>

      {/* Camera Badge Button (Visible always on bottom right) */}
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-white border border-slate-200 shadow-md text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition active:scale-95 disabled:opacity-50"
        title="Upload new profile picture"
        aria-label="Upload photo"
      >
        {uploading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
        ) : (
          <Camera className="w-3.5 h-3.5 text-emerald-700" />
        )}
      </button>

      {/* Temporary Toast Status */}
      {statusMsg && (
        <div
          className={`absolute top-full left-0 mt-2 z-50 whitespace-nowrap px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-lg flex items-center gap-1.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border border-emerald-700'
              : 'bg-rose-900 text-rose-100 border border-rose-700'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-rose-300" />
          )}
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="ml-1 opacity-70 hover:opacity-100">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AvatarUploader;
