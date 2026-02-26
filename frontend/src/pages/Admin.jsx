import React, { useState, useRef } from 'react';
import { useMutation, useQuery, useAction } from 'convex/react';
// eslint-disable-next-line import/no-unresolved
import { api } from '@convex/api';
import { useStorageUpload } from '../hooks/useAdminStorage';

const CATEGORIES = ['hoodie', 'cap', 'sticker', 'limited'];
const MEDIA_TYPES = ['reel', 'showcase', 'merch', 'campaign', 'reveal', 'behind-the-scenes'];
const PLATFORMS = ['tiktok', 'instagram', 'youtube', 'twitter', 'internal'];

const CAT_COLOR = { hoodie: '#E53935', cap: '#00BFFF', sticker: '#B0B0B0', limited: '#E53935' };
const TYPE_COLOR = {
  reel: '#E53935', showcase: '#00BFFF', merch: '#E53935',
  campaign: '#00BFFF', reveal: '#E53935', 'behind-the-scenes': '#B0B0B0',
};

// ─── Shared style helpers ───────────────────────────────────────────────────────

const baseInput = {
  background: '#1A1A1A',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: '12px',
  outline: 'none',
  padding: '8px 12px',
  width: '100%',
};

const CARD = {
  background: '#0D0D0D',
  border: '1px solid rgba(255,255,255,0.05)',
  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
};

const FORM_CARD = {
  background: '#0D0D0D',
  border: '1px solid rgba(229,57,53,0.2)',
  clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
};

function AdminInput({ label, value, onChange, type = 'text', placeholder, onKeyDown, autoFocus, min, step }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <div className="font-montserrat text-[10px] uppercase tracking-widest text-urban/40 mb-1.5">
          {label}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        min={min}
        step={step}
        style={{ ...baseInput, borderColor: focused ? 'rgba(229,57,53,0.5)' : 'rgba(255,255,255,0.08)' }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function AdminSelect({ label, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <div className="font-montserrat text-[10px] uppercase tracking-widest text-urban/40 mb-1.5">
          {label}
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        style={{ ...baseInput, cursor: 'pointer', borderColor: focused ? 'rgba(229,57,53,0.5)' : 'rgba(255,255,255,0.08)' }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {options.map(opt => (
          <option key={opt} value={opt} style={{ background: '#1A1A1A' }}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function AdminCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={onChange} className="w-3 h-3 cursor-pointer accent-crimson" />
      <span className="font-montserrat text-xs text-urban/60">{label}</span>
    </label>
  );
}

function Chip({ label, color }) {
  return (
    <span
      className="font-montserrat text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 inline-block"
      style={{
        color,
        background: color + '18',
        border: `1px solid ${color}35`,
        clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))',
      }}
    >
      {label}
    </span>
  );
}

function GhostBtn({ onClick, label, color = '#B0B0B0', disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-montserrat text-[10px] uppercase tracking-widest px-3 py-1.5 transition-all duration-200"
      style={{
        color,
        border: `1px solid ${color}35`,
        background: 'transparent',
        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.background = color + '12')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {label}
    </button>
  );
}

function FilePickerBtn({ label, accept, onChange, uploading, color = '#00BFFF' }) {
  return (
    <label
      className="font-montserrat text-[10px] uppercase tracking-widest px-3 py-1.5 cursor-pointer transition-all duration-200 inline-block"
      style={{
        color,
        border: `1px solid ${color}35`,
        background: 'transparent',
        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
        opacity: uploading ? 0.5 : 1,
        cursor: uploading ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={e => !uploading && (e.currentTarget.style.background = color + '12')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {uploading ? 'Uploading…' : label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={uploading}
        onChange={onChange}
        onClick={e => (e.target.value = '')}
      />
    </label>
  );
}

function ModeToggle({ value, onChange, options }) {
  return (
    <div className="flex gap-1 mb-2">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="font-montserrat text-[10px] uppercase tracking-widest px-3 py-1 transition-all duration-150"
          style={{
            background: value === opt.value ? 'rgba(229,57,53,0.12)' : 'transparent',
            border: `1px solid ${value === opt.value ? 'rgba(229,57,53,0.45)' : 'rgba(255,255,255,0.07)'}`,
            color: value === opt.value ? '#E53935' : '#B0B0B0',
            clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Password Gate ──────────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState('');
  const [wrong, setWrong] = useState(false);
  const [loading, setLoading] = useState(false);
  const verifyAdminPassword = useAction(api.functions.admin.verifyAdminPassword);

  async function attempt() {
    if (!input || loading) return;
    setLoading(true);
    try {
      await verifyAdminPassword({ password: input });
      sessionStorage.setItem('bx_admin', '1');
      onUnlock();
    } catch {
      setWrong(true);
      setInput('');
      setTimeout(() => setWrong(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
      <div
        className="w-full max-w-xs p-8"
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.06)',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}
      >
        <h1 className="font-bebas text-5xl text-white mb-1">
          ADMIN <span className="text-crimson">ACCESS</span>
        </h1>
        <p className="font-montserrat text-[10px] text-urban/30 uppercase tracking-widest mb-8">
          BiigggX Control Panel
        </p>
        <div className="space-y-3">
          <AdminInput
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="Password"
            autoFocus
          />
          {wrong && (
            <p className="font-montserrat text-xs text-crimson">Incorrect password.</p>
          )}
          <button
            onClick={attempt}
            disabled={loading}
            className={`btn-crimson w-full justify-center text-sm ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Verifying…' : 'Unlock'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Merch Tab ──────────────────────────────────────────────────────────────────

const EMPTY_ADD_MERCH = {
  name: '', category: 'hoodie', price: '', inventory: '',
  description: '', isFeatured: false, isExclusive: false,
};

function MerchTab() {
  const allMerch = useQuery(api.functions.merch.getAllMerch, {});
  const createMerch = useMutation(api.functions.merch.createMerch);
  const updateMerch = useMutation(api.functions.merch.updateMerch);
  const deleteMerch = useMutation(api.functions.merch.deleteMerch);
  const saveMerchImage = useMutation(api.functions.merch.saveMerchImage);
  const { uploadFile, uploading: globalUploading } = useStorageUpload(api.functions.merch.generateUploadUrl);

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_ADD_MERCH);
  const [addFile, setAddFile] = useState(null);
  const [addPreview, setAddPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [tabError, setTabError] = useState('');

  function setAdd(k, v) { setAddForm(f => ({ ...f, [k]: v })); }
  function setEdit(k, v) { setEditForm(f => ({ ...f, [k]: v })); }

  function pickAdd(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddFile(file);
    setAddPreview(URL.createObjectURL(file));
  }

  function pickEdit(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditFile(file);
    setEditPreview(URL.createObjectURL(file));
  }

  async function handleCreate() {
    if (!addForm.name || !addForm.price || !addForm.inventory) return;
    setSaving(true);
    setTabError('');
    try {
      const id = await createMerch({
        name: addForm.name,
        category: addForm.category,
        price: parseFloat(addForm.price),
        inventory: parseInt(addForm.inventory),
        description: addForm.description || undefined,
        isFeatured: addForm.isFeatured || undefined,
        isExclusive: addForm.isExclusive || undefined,
      });
      if (addFile) {
        const storageId = await uploadFile(addFile);
        await saveMerchImage({ id, storageId });
      }
      setAddForm(EMPTY_ADD_MERCH);
      setAddFile(null);
      setAddPreview(null);
      setShowAdd(false);
    } catch (err) {
      console.error('Create merch error:', err);
      setTabError(err instanceof Error ? err.message : 'Failed to create drop. Try again.');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setEditFile(null);
    setEditPreview(null);
    setEditForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      inventory: String(item.inventory),
      description: item.description || '',
      isActive: item.isActive,
      isFeatured: item.isFeatured || false,
      isExclusive: item.isExclusive || false,
    });
  }

  async function handleSave(id) {
    setSaving(true);
    setTabError('');
    try {
      await updateMerch({
        id,
        name: editForm.name,
        category: editForm.category,
        price: parseFloat(editForm.price),
        inventory: parseInt(editForm.inventory),
        description: editForm.description || undefined,
        isActive: editForm.isActive,
        isFeatured: editForm.isFeatured,
        isExclusive: editForm.isExclusive,
      });
      if (editFile) {
        setUploadingId(id);
        const storageId = await uploadFile(editFile);
        await saveMerchImage({ id, storageId });
        setUploadingId(null);
      }
      setEditingId(null);
      setEditFile(null);
      setEditPreview(null);
    } catch (err) {
      console.error('Save merch error:', err);
      setTabError(err instanceof Error ? err.message : 'Failed to save changes. Try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleQuickImageUpload(id, file) {
    setUploadingId(id);
    setTabError('');
    try {
      const storageId = await uploadFile(file);
      await saveMerchImage({ id, storageId });
    } catch (err) {
      console.error('Image upload error:', err);
      setTabError(err instanceof Error ? err.message : 'Image upload failed. Try again.');
    } finally {
      setUploadingId(null);
    }
  }

  if (allMerch === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-montserrat text-xs text-urban/30 uppercase tracking-widest animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Error banner */}
      {tabError && (
        <div
          className="flex items-start gap-2 px-4 py-3 mb-4"
          style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.25)' }}
        >
          <svg className="w-4 h-4 flex-shrink-0 text-crimson mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="font-montserrat text-xs text-crimson flex-1">{tabError}</p>
          <button onClick={() => setTabError('')} className="text-crimson/50 hover:text-crimson">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-montserrat text-xs text-urban/30 uppercase tracking-widest">
          {allMerch.length} items total
        </p>
        <button
          onClick={() => { setShowAdd(!showAdd); setEditingId(null); }}
          className={showAdd ? 'btn-neon text-sm' : 'btn-crimson text-sm'}
        >
          {showAdd ? '✕ Cancel' : '+ New Drop'}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-6 p-6" style={FORM_CARD}>
          <h3 className="font-bebas text-2xl text-white mb-5">
            NEW <span className="text-crimson">DROP</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <AdminInput
              label="Name *"
              value={addForm.name}
              onChange={e => setAdd('name', e.target.value)}
              placeholder="Drop name"
            />
            <AdminSelect
              label="Category"
              value={addForm.category}
              onChange={e => setAdd('category', e.target.value)}
              options={CATEGORIES}
            />
            <AdminInput
              label="Price ($) *"
              type="number"
              value={addForm.price}
              onChange={e => setAdd('price', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <AdminInput
              label="Inventory *"
              type="number"
              value={addForm.inventory}
              onChange={e => setAdd('inventory', e.target.value)}
              placeholder="0"
              min="0"
            />
            <AdminInput
              label="Description"
              value={addForm.description}
              onChange={e => setAdd('description', e.target.value)}
              placeholder="Optional"
            />
            <div>
              <div className="font-montserrat text-[10px] uppercase tracking-widest text-urban/40 mb-1.5">
                Image
              </div>
              <div className="flex items-center gap-3">
                {addPreview && (
                  <img
                    src={addPreview}
                    alt="preview"
                    className="w-10 h-10 object-cover flex-shrink-0"
                    style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                  />
                )}
                <FilePickerBtn
                  label={addFile ? addFile.name.slice(0, 16) + '…' : 'Choose Image'}
                  accept="image/*"
                  onChange={pickAdd}
                  uploading={false}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mb-5">
            <AdminCheckbox
              checked={addForm.isFeatured}
              onChange={e => setAdd('isFeatured', e.target.checked)}
              label="Featured (shows on homepage)"
            />
            <AdminCheckbox
              checked={addForm.isExclusive}
              onChange={e => setAdd('isExclusive', e.target.checked)}
              label="Exclusive (Pass holders only)"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={saving || globalUploading || !addForm.name || !addForm.price || !addForm.inventory}
            className={`btn-crimson text-sm ${(saving || globalUploading) ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {saving || globalUploading ? 'Creating…' : 'Create Drop'}
          </button>
        </div>
      )}

      {/* Items */}
      <div className="space-y-2">
        {allMerch.map(item => (
          <MerchRow
            key={item._id}
            item={item}
            isEditing={editingId === item._id}
            editForm={editForm}
            editPreview={editPreview}
            setEdit={setEdit}
            onStartEdit={() => { startEdit(item); setShowAdd(false); }}
            onCancelEdit={() => { setEditingId(null); setEditFile(null); setEditPreview(null); }}
            onSave={() => handleSave(item._id)}
            onDelete={() => { if (window.confirm(`Delete "${item.name}"?`)) deleteMerch({ id: item._id }); }}
            onPickEditImage={pickEdit}
            onQuickUpload={(file) => handleQuickImageUpload(item._id, file)}
            saving={saving && editingId === item._id}
            uploading={uploadingId === item._id || (globalUploading && editingId === item._id)}
          />
        ))}
      </div>
    </div>
  );
}

function MerchRow({
  item, isEditing, editForm, editPreview, setEdit,
  onStartEdit, onCancelEdit, onSave, onDelete,
  onPickEditImage, onQuickUpload, saving, uploading,
}) {
  return (
    <div style={{ ...CARD, borderColor: isEditing ? 'rgba(229,57,53,0.25)' : 'rgba(255,255,255,0.05)' }}>
      {isEditing ? (
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <AdminInput
              label="Name"
              value={editForm.name}
              onChange={e => setEdit('name', e.target.value)}
            />
            <AdminSelect
              label="Category"
              value={editForm.category}
              onChange={e => setEdit('category', e.target.value)}
              options={CATEGORIES}
            />
            <AdminInput
              label="Price ($)"
              type="number"
              value={editForm.price}
              onChange={e => setEdit('price', e.target.value)}
              min="0"
              step="0.01"
            />
            <AdminInput
              label="Inventory"
              type="number"
              value={editForm.inventory}
              onChange={e => setEdit('inventory', e.target.value)}
              min="0"
            />
          </div>

          <div className="mb-4">
            <AdminInput
              label="Description"
              value={editForm.description}
              onChange={e => setEdit('description', e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 mb-4">
            <AdminCheckbox
              checked={editForm.isActive}
              onChange={e => setEdit('isActive', e.target.checked)}
              label="Active (visible in store)"
            />
            <AdminCheckbox
              checked={editForm.isFeatured}
              onChange={e => setEdit('isFeatured', e.target.checked)}
              label="Featured"
            />
            <AdminCheckbox
              checked={editForm.isExclusive}
              onChange={e => setEdit('isExclusive', e.target.checked)}
              label="Exclusive"
            />
          </div>

          <div className="mb-5">
            <div className="font-montserrat text-[10px] uppercase tracking-widest text-urban/40 mb-2">
              Replace Image
            </div>
            <div className="flex items-center gap-3">
              {editPreview && (
                <img
                  src={editPreview}
                  alt="preview"
                  className="w-10 h-10 object-cover flex-shrink-0"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}
                />
              )}
              <FilePickerBtn
                label="Choose Image"
                accept="image/*"
                onChange={onPickEditImage}
                uploading={false}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <GhostBtn
              onClick={onSave}
              label={saving || uploading ? 'Saving…' : 'Save Changes'}
              color="#E53935"
              disabled={saving || uploading}
            />
            <GhostBtn onClick={onCancelEdit} label="Cancel" color="#B0B0B0" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4">
          {/* Thumbnail */}
          <div
            className="flex-shrink-0 w-14 h-14 overflow-hidden"
            style={{
              background: '#1A1A1A',
              clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
            }}
          >
            {item.imageURL ? (
              <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-bebas text-xl" style={{ color: (CAT_COLOR[item.category] || '#E53935') + '35' }}>
                  X
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-montserrat font-bold text-sm text-white truncate">{item.name}</span>
              <Chip label={item.category} color={CAT_COLOR[item.category] || '#B0B0B0'} />
              {item.isExclusive && <Chip label="Exclusive" color="#00BFFF" />}
              {item.isFeatured && <Chip label="Featured" color="#E53935" />}
              {!item.isActive && <Chip label="Hidden" color="#555" />}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bebas text-lg text-white">${item.price}</span>
              <span className="font-montserrat text-[10px] text-urban/35">{item.inventory} in stock</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-2 flex-wrap justify-end">
            <FilePickerBtn
              label={uploading ? 'Uploading…' : '↑ Image'}
              accept="image/*"
              onChange={e => e.target.files?.[0] && onQuickUpload(e.target.files[0])}
              uploading={uploading}
              color="#00BFFF"
            />
            <GhostBtn onClick={onStartEdit} label="Edit" color="#B0B0B0" />
            <GhostBtn onClick={onDelete} label="Delete" color="#E53935" />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Media Tab ──────────────────────────────────────────────────────────────────

const EMPTY_ADD_MEDIA = {
  title: '', type: 'reel', platform: 'instagram',
  description: '', embedId: '', duration: '', tags: '',
  isPublished: true,
};

function MediaTab() {
  const allMedia = useQuery(api.functions.media.getAllMedia, {});
  const addMedia = useMutation(api.functions.media.addMedia);
  const updateMedia = useMutation(api.functions.media.updateMedia);
  const deleteMedia = useMutation(api.functions.media.deleteMedia);
  const resolveStorageUrl = useMutation(api.functions.media.resolveStorageUrl);

  const { uploadFile: uploadVid, uploading: vidUploading } =
    useStorageUpload(api.functions.media.generateMediaUploadUrl);
  const { uploadFile: uploadThumb, uploading: thumbUploading } =
    useStorageUpload(api.functions.media.generateMediaUploadUrl);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_ADD_MEDIA);
  const [urlMode, setUrlMode] = useState('paste');
  const [thumbMode, setThumbMode] = useState('paste');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbUrl, setThumbUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [tabError, setTabError] = useState('');

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleAdd() {
    if (!form.title) return;
    setSaving(true);
    setTabError('');
    try {
      let finalVideo = urlMode === 'paste' ? (videoUrl || undefined) : undefined;
      let finalThumb = thumbMode === 'paste' ? (thumbUrl || undefined) : undefined;

      if (urlMode === 'upload' && videoFile) {
        const storageId = await uploadVid(videoFile);
        finalVideo = (await resolveStorageUrl({ storageId })) || undefined;
      }
      if (thumbMode === 'upload' && thumbFile) {
        const storageId = await uploadThumb(thumbFile);
        finalThumb = (await resolveStorageUrl({ storageId })) || undefined;
      }

      await addMedia({
        title: form.title,
        type: form.type,
        platform: form.platform,
        description: form.description || undefined,
        embedId: form.embedId || undefined,
        duration: form.duration || undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        url: finalVideo,
        thumbnailURL: finalThumb,
        isPublished: form.isPublished,
      });

      setForm(EMPTY_ADD_MEDIA);
      setVideoUrl('');
      setThumbUrl('');
      setVideoFile(null);
      setThumbFile(null);
      setUrlMode('paste');
      setThumbMode('paste');
      setShowAdd(false);
    } catch (err) {
      console.error('Add media error:', err);
      setTabError(err instanceof Error ? err.message : 'Failed to add media. Try again.');
    } finally {
      setSaving(false);
    }
  }

  const isUploading = saving || vidUploading || thumbUploading;

  if (allMedia === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="font-montserrat text-xs text-urban/30 uppercase tracking-widest animate-pulse">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Error banner */}
      {tabError && (
        <div
          className="flex items-start gap-2 px-4 py-3 mb-4"
          style={{ background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.25)' }}
        >
          <svg className="w-4 h-4 flex-shrink-0 text-crimson mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="font-montserrat text-xs text-crimson flex-1">{tabError}</p>
          <button onClick={() => setTabError('')} className="text-crimson/50 hover:text-crimson">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-montserrat text-xs text-urban/30 uppercase tracking-widest">
          {allMedia.length} items total
        </p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={showAdd ? 'btn-neon text-sm' : 'btn-crimson text-sm'}
        >
          {showAdd ? '✕ Cancel' : '+ Add Media'}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="mb-6 p-6" style={FORM_CARD}>
          <h3 className="font-bebas text-2xl text-white mb-5">
            ADD <span className="text-crimson">MEDIA</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <AdminInput
              label="Title *"
              value={form.title}
              onChange={e => setF('title', e.target.value)}
              placeholder="Video title"
            />
            <AdminSelect
              label="Type"
              value={form.type}
              onChange={e => setF('type', e.target.value)}
              options={MEDIA_TYPES}
            />
            <AdminSelect
              label="Platform"
              value={form.platform}
              onChange={e => setF('platform', e.target.value)}
              options={PLATFORMS}
            />
            <AdminInput
              label="Embed ID (YouTube, TikTok…)"
              value={form.embedId}
              onChange={e => setF('embedId', e.target.value)}
              placeholder="e.g. dQw4w9WgXcQ"
            />
            <AdminInput
              label="Duration"
              value={form.duration}
              onChange={e => setF('duration', e.target.value)}
              placeholder="e.g. 1:23"
            />
            <AdminInput
              label="Tags (comma-separated)"
              value={form.tags}
              onChange={e => setF('tags', e.target.value)}
              placeholder="#BiigggX, #Drop"
            />
          </div>

          <div className="mb-4">
            <AdminInput
              label="Description"
              value={form.description}
              onChange={e => setF('description', e.target.value)}
              placeholder="Optional caption or description"
            />
          </div>

          {/* Video source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <div className="font-montserrat text-[10px] uppercase tracking-widest text-urban/40 mb-2">
                Video Source
              </div>
              <ModeToggle
                value={urlMode}
                onChange={setUrlMode}
                options={[{ value: 'paste', label: 'Paste URL' }, { value: 'upload', label: 'Upload File' }]}
              />
              {urlMode === 'paste' ? (
                <AdminInput
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  placeholder="https://…"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <FilePickerBtn
                    label={videoFile ? videoFile.name.slice(0, 20) + '…' : 'Choose Video'}
                    accept="video/*"
                    onChange={e => setVideoFile(e.target.files?.[0] || null)}
                    uploading={vidUploading}
                  />
                  {videoFile && (
                    <span className="font-montserrat text-[10px] text-urban/40 truncate max-w-[120px]">
                      {videoFile.name}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div>
              <div className="font-montserrat text-[10px] uppercase tracking-widest text-urban/40 mb-2">
                Thumbnail Image
              </div>
              <ModeToggle
                value={thumbMode}
                onChange={setThumbMode}
                options={[{ value: 'paste', label: 'Paste URL' }, { value: 'upload', label: 'Upload Image' }]}
              />
              {thumbMode === 'paste' ? (
                <AdminInput
                  value={thumbUrl}
                  onChange={e => setThumbUrl(e.target.value)}
                  placeholder="https://…"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <FilePickerBtn
                    label={thumbFile ? thumbFile.name.slice(0, 20) + '…' : 'Choose Image'}
                    accept="image/*"
                    onChange={e => setThumbFile(e.target.files?.[0] || null)}
                    uploading={thumbUploading}
                  />
                  {thumbFile && (
                    <span className="font-montserrat text-[10px] text-urban/40 truncate max-w-[120px]">
                      {thumbFile.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 mb-5">
            <AdminCheckbox
              checked={form.isPublished}
              onChange={e => setF('isPublished', e.target.checked)}
              label="Publish immediately"
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={isUploading || !form.title}
            className={`btn-crimson text-sm ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Uploading…' : 'Add Media'}
          </button>
        </div>
      )}

      {/* Media list */}
      <div className="space-y-2">
        {allMedia.map(item => (
          <MediaRow
            key={item._id}
            item={item}
            onTogglePublish={() => updateMedia({ id: item._id, isPublished: !item.isPublished })}
            onDelete={() => {
              if (window.confirm(`Delete "${item.title}"?`)) deleteMedia({ id: item._id });
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MediaRow({ item, onTogglePublish, onDelete }) {
  return (
    <div className="flex items-center gap-4 p-4" style={CARD}>
      {/* Thumbnail */}
      <div
        className="flex-shrink-0 w-14 h-14 overflow-hidden"
        style={{
          background: '#1A1A1A',
          clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
        }}
      >
        {item.thumbnailURL ? (
          <img src={item.thumbnailURL} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ color: (TYPE_COLOR[item.type] || '#B0B0B0') + '40' }}>
              <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-montserrat font-bold text-sm text-white truncate">{item.title}</span>
          <Chip label={item.type} color={TYPE_COLOR[item.type] || '#B0B0B0'} />
          <Chip label={item.platform} color="#6B7280" />
          {!item.isPublished && <Chip label="Draft" color="#555" />}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {item.duration && <span className="font-montserrat text-[10px] text-urban/35">{item.duration}</span>}
          {item.embedId && <span className="font-montserrat text-[10px] text-urban/25">embed: {item.embedId}</span>}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="font-montserrat text-[10px] text-neon/50 hover:text-neon transition-colors"
            >
              view file ↗
            </a>
          )}
          {item.tags?.length > 0 && (
            <span className="font-montserrat text-[10px] text-urban/25">{item.tags.join(' ')}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-2">
        <GhostBtn
          onClick={onTogglePublish}
          label={item.isPublished ? 'Unpublish' : 'Publish'}
          color={item.isPublished ? '#B0B0B0' : '#00BFFF'}
        />
        <GhostBtn onClick={onDelete} label="Delete" color="#E53935" />
      </div>
    </div>
  );
}

// ─── Main Admin Page ────────────────────────────────────────────────────────────

export default function Admin() {
  const [unlocked, setUnlocked] = useState(
    sessionStorage.getItem('bx_admin') === '1'
  );
  const [tab, setTab] = useState('merch');

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className="bg-midnight min-h-screen pt-20">
      {/* Subtle grid bg */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(229,57,53,1) 1px, transparent 1px), linear-gradient(90deg, rgba(229,57,53,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 pb-6 border-b border-white/5">
          <div>
            <h1 className="font-bebas text-5xl sm:text-6xl text-white leading-none">
              ADMIN <span className="text-crimson" style={{ textShadow: '0 0 20px rgba(229,57,53,0.4)' }}>PANEL</span>
            </h1>
            <p className="font-montserrat text-[10px] text-urban/30 uppercase tracking-[0.25em] mt-1">
              BiigggX Content Management
            </p>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem('bx_admin'); setUnlocked(false); }}
            className="font-montserrat text-[10px] uppercase tracking-widest text-urban/30 hover:text-crimson transition-colors"
          >
            Lock ↩
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-8">
          {['Merch', 'Media'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t.toLowerCase())}
              className={`font-montserrat text-xs uppercase tracking-widest px-6 py-2.5 border transition-all duration-200 ${
                tab === t.toLowerCase()
                  ? 'bg-crimson border-crimson text-white'
                  : 'border-white/10 text-urban/40 hover:border-white/20 hover:text-white'
              }`}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'merch' ? <MerchTab /> : <MediaTab />}
      </div>
    </div>
  );
}
