import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload, FileText, Download, Eye, Trash2, Plus, Search,
  Filter, Calendar, X, Image, File, Share2, Lock, Unlock,
  AlertCircle, CheckCircle, ChevronDown, Building2, RefreshCw,
  ShieldCheck, Clock, FilePlus, FolderOpen, FileImage, Pill,
  Stethoscope, BookOpen, Globe, Tag, MoreVertical, ExternalLink,
} from 'lucide-react';
import { documentsAPI, hospitalsAPI } from '../../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface MedDoc {
  id: number;
  title: string;
  category: string;
  original_name: string;
  mimetype: string;
  file_size: number;
  description?: string;
  document_date?: string;
  privacy_status: 'private' | 'shared';
  uploaded_at: string;
}
interface ShareRecord {
  id: number;
  hospital_id: number;
  access_status: 'active' | 'revoked';
  shared_at: string;
  hospitals: { id: number; name: string; city: string };
}
interface Hospital { id: number; name: string; city: string }

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: 'medical_reports',         label: 'Medical Reports',           icon: FileText,     color: 'bg-red-50 text-red-600 border-red-100' },
  { value: 'imaging_scans',           label: 'Imaging & Scans',           icon: FileImage,    color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { value: 'prescriptions',           label: 'Prescriptions',             icon: Pill,         color: 'bg-green-50 text-green-600 border-green-100' },
  { value: 'hospitalization_surgery', label: 'Hospitalization & Surgery', icon: Stethoscope,  color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { value: 'medical_history',         label: 'Medical History',           icon: BookOpen,     color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { value: 'identity_travel',         label: 'Identity & Travel',         icon: Globe,        color: 'bg-teal-50 text-teal-600 border-teal-100' },
  { value: 'other',                   label: 'Other',                     icon: Tag,          color: 'bg-gray-50 text-gray-600 border-gray-200' },
] as const;

const MAX_MB = parseInt((import.meta as any).env?.VITE_MAX_FILE_MB ?? '20');
const ALLOWED_EXTS = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx';
const ALLOWED_MIMES = new Set([
  'application/pdf','image/jpeg','image/jpg','image/png','image/webp',
  'application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtSize = (b: number) => {
  if (!b) return '—';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};
const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const catMeta = (val: string) =>
  CATEGORIES.find(c => c.value === val) ?? CATEGORIES[CATEGORIES.length - 1];

const fileIcon = (mime: string) => {
  if (mime?.startsWith('image/')) return <FileImage className="w-5 h-5" />;
  if (mime === 'application/pdf') return <FileText className="w-5 h-5" />;
  return <File className="w-5 h-5" />;
};

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast: React.FC<{ msg: string; type: 'ok' | 'err'; onClose: () => void }> = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium
      ${type === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
      {type === 'ok' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
};

// ─── Upload Modal ─────────────────────────────────────────────────────────────
interface UploadModalProps {
  onClose: () => void;
  onUploaded: () => void;
  hospitals: Hospital[];
}
const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploaded, hospitals }) => {
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({
    title: '', category: 'other', description: '',
    document_date: '', associated_hospital_id: '',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (f: File) => {
    if (!ALLOWED_MIMES.has(f.type)) return `File type not allowed: ${f.type}`;
    if (f.size > MAX_MB * 1024 * 1024) return `File too large (max ${MAX_MB} MB)`;
    return '';
  };

  const pick = (f: File) => {
    const e = validate(f);
    if (e) { setErr(e); return; }
    setErr('');
    setFile(f);
    if (!form.title) setForm(p => ({ ...p, title: f.name.replace(/\.[^.]+$/, '') }));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) pick(f);
  };

  const submit = async () => {
    if (!file) return setErr('Please select a file');
    if (!form.title.trim()) return setErr('Document title is required');
    setErr(''); setUploading(true);
    // Fake progress ticks
    const iv = setInterval(() => setProgress(p => Math.min(p + 12, 88)), 200);
    try {
      await documentsAPI.uploadDocument(file, {
        title: form.title.trim(),
        category: form.category,
        description: form.description || undefined,
        document_date: form.document_date || undefined,
        associated_hospital_id: form.associated_hospital_id ? parseInt(form.associated_hospital_id) : undefined,
      });
      clearInterval(iv); setProgress(100);
      setTimeout(() => { onUploaded(); onClose(); }, 400);
    } catch (e: any) {
      clearInterval(iv); setProgress(0);
      setErr(e.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <FilePlus className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Upload Document</h3>
              <p className="text-xs text-gray-400">Supports PDF, JPG, PNG, WEBP, DOC, DOCX · Max {MAX_MB} MB</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
              ${drag ? 'border-emerald-400 bg-emerald-50' : file ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200 hover:border-emerald-300'}`}
            onDragEnter={e => { e.preventDefault(); setDrag(true); }}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" className="hidden" accept={ALLOWED_EXTS}
              onChange={e => { const f = e.target.files?.[0]; if (f) pick(f); }} />
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <div className="text-emerald-600">{fileIcon(file.type)}</div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500">{fmtSize(file.size)}</p>
                </div>
                <button className="ml-2 p-1 hover:bg-gray-200 rounded" onClick={e => { e.stopPropagation(); setFile(null); setProgress(0); }}>
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Drag & drop or <span className="text-emerald-600">browse</span></p>
              </>
            )}
          </div>

          {/* Progress */}
          {uploading && (
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}

          {/* Form fields */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Document Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g. CBC Blood Test Results"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category *</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Document Date</label>
              <input type="date" value={form.document_date} onChange={e => setForm(p => ({ ...p, document_date: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Hospital / Doctor</label>
              <select value={form.associated_hospital_id} onChange={e => setForm(p => ({ ...p, associated_hospital_id: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">None</option>
                {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description (optional)</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={2} placeholder="Brief notes about this document"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>

          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
            <Lock className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">This document will be <strong>private</strong> by default. You can share it with hospitals at any time.</p>
          </div>

          {err && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{err}
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
          <button onClick={submit} disabled={uploading || !file}
            className="flex-1 px-4 py-2.5 text-sm bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2">
            {uploading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Upload</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Share Modal ──────────────────────────────────────────────────────────────
interface ShareModalProps {
  doc: MedDoc;
  hospitals: Hospital[];
  onClose: () => void;
  onChanged: () => void;
}
const ShareModal: React.FC<ShareModalProps> = ({ doc, hospitals, onClose, onChanged }) => {
  const [shares, setShares] = useState<ShareRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      const r = await documentsAPI.getShares(doc.id);
      setShares(r.data.shares ?? []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [doc.id]);

  useEffect(() => { load(); }, [load]);

  const activeShares = shares.filter(s => s.access_status === 'active');
  const sharedHospIds = new Set(activeShares.map(s => s.hospital_id));
  const available = hospitals.filter(h => !sharedHospIds.has(h.id));

  const share = async () => {
    if (!selectedHospital) return;
    setBusy(true); setErr('');
    try {
      await documentsAPI.shareDocument(doc.id, parseInt(selectedHospital));
      setSelectedHospital('');
      await load();
      onChanged();
    } catch (e: any) { setErr(e.message || 'Failed to share'); }
    finally { setBusy(false); }
  };

  const revoke = async (hospitalId: number) => {
    setBusy(true);
    try {
      await documentsAPI.revokeShare(doc.id, hospitalId);
      await load();
      onChanged();
    } catch { /* ignore */ }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Share Document</h3>
            <p className="text-xs text-gray-400 truncate max-w-xs">{doc.title}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Share with hospital */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600">Share with a hospital</label>
            <div className="flex gap-2">
              <select value={selectedHospital} onChange={e => setSelectedHospital(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Select hospital…</option>
                {available.map(h => <option key={h.id} value={h.id}>{h.name} — {h.city}</option>)}
              </select>
              <button onClick={share} disabled={!selectedHospital || busy}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
            {available.length === 0 && (
              <p className="text-xs text-gray-400">Document is shared with all hospitals.</p>
            )}
            {err && <p className="text-xs text-red-600">{err}</p>}
          </div>

          {/* Active shares */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Currently shared with</p>
            {loading ? (
              <div className="flex justify-center py-4"><RefreshCw className="w-5 h-5 animate-spin text-gray-300" /></div>
            ) : activeShares.length === 0 ? (
              <div className="text-center py-5 text-gray-400 text-xs">
                <Lock className="w-6 h-6 mx-auto mb-1.5 text-gray-200" />
                Not shared with any hospital yet
              </div>
            ) : (
              <div className="space-y-2">
                {activeShares.map(s => (
                  <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{s.hospitals.name}</p>
                        <p className="text-xs text-gray-400">{s.hospitals.city} · Shared {fmtDate(s.shared_at)}</p>
                      </div>
                    </div>
                    <button onClick={() => revoke(s.hospital_id)} disabled={busy}
                      className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors font-medium disabled:opacity-50">
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Revoked list (collapsed) */}
          {shares.filter(s => s.access_status === 'revoked').length > 0 && (
            <details className="text-xs text-gray-400">
              <summary className="cursor-pointer select-none">Show revoked access history</summary>
              <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-gray-100">
                {shares.filter(s => s.access_status === 'revoked').map(s => (
                  <p key={s.id} className="text-gray-400">
                    {s.hospitals.name} — revoked
                  </p>
                ))}
              </div>
            </details>
          )}
        </div>

        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">Done</button>
        </div>
      </div>
    </div>
  );
};

// ─── Document Card ────────────────────────────────────────────────────────────
interface DocCardProps {
  doc: MedDoc;
  onDelete: (doc: MedDoc) => void;
  onShare: (doc: MedDoc) => void;
  onView: (doc: MedDoc) => void;
  onDownload: (doc: MedDoc) => void;
}
const DocCard: React.FC<DocCardProps> = ({ doc, onDelete, onShare, onView, onDownload }) => {
  const cat = catMeta(doc.category);
  const CatIcon = cat.icon;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className={`flex items-center gap-2.5 min-w-0`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${cat.color}`}>
            <CatIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate leading-tight">{doc.title}</p>
            <p className="text-xs text-gray-400 truncate">{doc.original_name}</p>
          </div>
        </div>

        {/* Privacy badge + menu */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border
            ${doc.privacy_status === 'shared'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            {doc.privacy_status === 'shared' ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
            {doc.privacy_status === 'shared' ? 'Shared' : 'Private'}
          </span>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(o => !o)} className="p-1 hover:bg-gray-100 rounded-lg">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20">
                <button onClick={() => { onView(doc); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button onClick={() => { onDownload(doc); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button onClick={() => { onShare(doc); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                  <Share2 className="w-3.5 h-3.5" /> Share / Revoke
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button onClick={() => { onDelete(doc); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {cat.label}
        </span>
        {doc.document_date && (
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{fmtDate(doc.document_date)}</span>
        )}
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Uploaded {fmtDate(doc.uploaded_at)}</span>
        <span>{fmtSize(doc.file_size ?? 0)}</span>
      </div>

      {doc.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{doc.description}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1 border-t border-gray-50">
        <button onClick={() => onView(doc)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        <button onClick={() => onDownload(doc)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
          <Download className="w-3.5 h-3.5" /> Download
        </button>
        <button onClick={() => onShare(doc)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
          <Share2 className="w-3.5 h-3.5" /> Share
        </button>
      </div>
    </div>
  );
};

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
const DeleteConfirm: React.FC<{ doc: MedDoc; onCancel: () => void; onConfirm: () => Promise<void> }> = ({ doc, onCancel, onConfirm }) => {
  const [busy, setBusy] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]" onClick={onCancel}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete Document?</h3>
        <p className="text-sm text-gray-500 text-center mb-5">
          "<span className="font-medium text-gray-700">{doc.title}</span>" will be permanently deleted and all shares revoked.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
          <button onClick={async () => { setBusy(true); await onConfirm(); }}
            disabled={busy}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
            {busy ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── View Modal ───────────────────────────────────────────────────────────────
const ViewModal: React.FC<{ doc: MedDoc; onClose: () => void }> = ({ doc, onClose }) => {
  const src = documentsAPI.getFileUrl(doc.id, true);
  const isImg = doc.mimetype?.startsWith('image/');
  const isPdf = doc.mimetype === 'application/pdf';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100]" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-sm truncate">{doc.title}</p>
            <p className="text-xs text-gray-400 truncate">{doc.original_name} · {fmtSize(doc.file_size ?? 0)}</p>
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <a href={documentsAPI.getFileUrl(doc.id)} download={doc.original_name}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-100 font-medium">
              <Download className="w-3.5 h-3.5" /> Download
            </a>
            <a href={src} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 hover:bg-gray-100 font-medium">
              <ExternalLink className="w-3.5 h-3.5" /> Open
            </a>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden bg-gray-50 min-h-0">
          {isPdf ? (
            <iframe src={src} className="w-full h-full" title={doc.title} />
          ) : isImg ? (
            <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
              <img src={src} alt={doc.title} className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <FileText className="w-16 h-16 text-gray-300" />
              <p className="text-gray-500 text-sm">Preview not available for this file type.</p>
              <a href={documentsAPI.getFileUrl(doc.id)} download={doc.original_name}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700">
                <Download className="w-4 h-4" /> Download to view
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const PatientDocuments: React.FC = () => {
  const [docs, setDocs] = useState<MedDoc[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // Filters
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [privFilter, setPrivFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const LIMIT = 12;

  // Modals
  const [showUpload, setShowUpload] = useState(false);
  const [shareDoc, setShareDoc] = useState<MedDoc | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<MedDoc | null>(null);
  const [viewDoc, setViewDoc] = useState<MedDoc | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const notify = (msg: string, type: 'ok' | 'err' = 'ok') => setToast({ msg, type });

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const r = await documentsAPI.getDocuments({
        category: catFilter || undefined,
        search: search || undefined,
        sort,
        page,
        limit: LIMIT,
      });
      // client-side privacy filter (backend returns all patient docs)
      let list: MedDoc[] = r.data.documents ?? [];
      if (privFilter) list = list.filter((d: MedDoc) => d.privacy_status === privFilter);
      setDocs(list);
      setTotal(privFilter ? list.length : (r.data.total ?? list.length));
    } catch (e: any) {
      notify(e.message || 'Failed to load documents', 'err');
    } finally { setLoading(false); }
  }, [catFilter, search, sort, page, privFilter]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);
  useEffect(() => {
    hospitalsAPI.getHospitals({ limit: 200 })
      .then(r => setHospitals(r.data?.hospitals ?? []))
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    if (!deleteDoc) return;
    try {
      await documentsAPI.deleteDocument(deleteDoc.id);
      notify('Document deleted');
      setDeleteDoc(null);
      fetchDocs();
    } catch (e: any) {
      notify(e.message || 'Delete failed', 'err');
      setDeleteDoc(null);
    }
  };

  const handleDownload = async (doc: MedDoc) => {
    try {
      await documentsAPI.downloadDocument(doc.id, doc.original_name);
    } catch (e: any) {
      notify(e.message || 'Download failed', 'err');
    }
  };

  // Stats for sidebar
  const catCounts = CATEGORIES.map(c => ({
    ...c,
    count: docs.filter(d => d.category === c.value).length,
  }));
  const totalShared = docs.filter(d => d.privacy_status === 'shared').length;
  const totalPrivate = docs.filter(d => d.privacy_status === 'private').length;

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-600" /> My Medical Documents
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Securely store and share your health records</p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex-shrink-0">
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: total, color: 'text-gray-800', bg: 'bg-gray-50', border: 'border-gray-100' },
          { label: 'Private', value: totalPrivate, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Shared', value: totalShared, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Categories', value: catCounts.filter(c => c.count > 0).length, color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-100' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 text-center`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => { setCatFilter(''); setPage(1); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
            ${!catFilter ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
          All
        </button>
        {CATEGORIES.map(c => {
          const Icon = c.icon;
          return (
            <button key={c.value} onClick={() => { setCatFilter(c.value); setPage(1); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors
                ${catFilter === c.value ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'}`}>
              <Icon className="w-3 h-3" />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Search + Filters bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={privFilter} onChange={e => { setPrivFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
            <option value="">All Visibility</option>
            <option value="private">Private</option>
            <option value="shared">Shared</option>
          </select>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Document grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-sm text-gray-400">Loading documents…</p>
        </div>
      ) : docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-2xl border border-dashed border-gray-200">
          <FolderOpen className="w-14 h-14 text-gray-200" />
          <div className="text-center">
            <p className="font-semibold text-gray-600">No documents found</p>
            <p className="text-sm text-gray-400 mt-1">
              {search || catFilter ? 'Try adjusting your filters' : 'Upload your first medical document'}
            </p>
          </div>
          {!search && !catFilter && (
            <button onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700">
              <Plus className="w-4 h-4" /> Upload Document
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map(doc => (
            <DocCard key={doc.id} doc={doc}
              onDelete={setDeleteDoc}
              onShare={setShareDoc}
              onView={setViewDoc}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
        </div>
      )}

      {/* Privacy notice */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
        <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          All documents are <strong>private by default</strong>. Documents are only accessible to hospitals you explicitly share them with.
          You can revoke access at any time.
        </p>
      </div>

      {/* Modals */}
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploaded={() => { fetchDocs(); notify('Document uploaded successfully'); }} hospitals={hospitals} />}
      {shareDoc && <ShareModal doc={shareDoc} hospitals={hospitals} onClose={() => setShareDoc(null)} onChanged={() => { fetchDocs(); notify('Sharing updated'); }} />}
      {deleteDoc && <DeleteConfirm doc={deleteDoc} onCancel={() => setDeleteDoc(null)} onConfirm={handleDelete} />}
      {viewDoc && <ViewModal doc={viewDoc} onClose={() => setViewDoc(null)} />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default PatientDocuments;
