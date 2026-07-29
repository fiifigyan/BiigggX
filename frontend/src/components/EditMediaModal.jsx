import React, { useState } from 'react';
import Modal from './Modal';

const MEDIA_TYPES = ['reel', 'showcase', 'merch', 'campaign', 'reveal', 'behind-the-scenes'];
const PLATFORMS = ['tiktok', 'instagram', 'youtube', 'twitter', 'internal'];

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

function AdminInput({ label, value, onChange, type = 'text', placeholder, autoFocus }) {
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
        autoFocus={autoFocus}
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

export default function EditMediaModal({ item, onClose, onSave, saving = false }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    type: item?.type || 'reel',
    platform: item?.platform || 'instagram',
    description: item?.description || '',
    embedId: item?.embedId || '',
    duration: item?.duration || '',
    tags: (item?.tags || []).join(', '),
    isPublished: item?.isPublished ?? true,
  });

  function setF(k, v) {
    setForm(f => ({ ...f, [k]: v }));
  }

  const handleSave = () => {
    onSave({
      title: form.title,
      type: form.type,
      platform: form.platform,
      description: form.description || undefined,
      embedId: form.embedId || undefined,
      duration: form.duration || undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      isPublished: form.isPublished,
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      onConfirm={handleSave}
      title={`Edit: ${item?.title}`}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminInput
            label="Title *"
            value={form.title}
            onChange={e => setF('title', e.target.value)}
            placeholder="Video title"
            autoFocus
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

        <div>
          <AdminInput
            label="Description"
            value={form.description}
            onChange={e => setF('description', e.target.value)}
            placeholder="Optional caption or description"
          />
        </div>

        <div>
          <AdminCheckbox
            checked={form.isPublished}
            onChange={e => setF('isPublished', e.target.checked)}
            label="Published"
          />
        </div>

        {item?.url && (
          <div>
            <div className="font-montserrat text-[10px] uppercase tracking-widest text-urban/30 mb-2">
              Current Video URL
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="font-montserrat text-xs text-neon/60 hover:text-neon transition-colors break-all"
            >
              {item.url}
            </a>
          </div>
        )}

        {item?.thumbnailURL && (
          <div>
            <div className="font-montserrat text-[10px] uppercase tracking-widest text-urban/30 mb-2">
              Current Thumbnail URL
            </div>
            <a
              href={item.thumbnailURL}
              target="_blank"
              rel="noreferrer"
              className="font-montserrat text-xs text-neon/60 hover:text-neon transition-colors break-all"
            >
              {item.thumbnailURL}
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
}
