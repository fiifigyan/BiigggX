import React, { useState } from 'react';

export default function ContactForm({ onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', message: '', type: 'collab' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    if (form.message.trim().length < 10) e.message = 'Message too short (min 10 chars)';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setStatus('sending');
    try {
      if (onSubmit) {
        await onSubmit(form);
      } else {
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1500));
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '', type: 'collab' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-6">
        {/* Success X mark */}
        <div className="relative">
          <div
            className="font-bebas text-8xl text-crimson animate-spray-in"
            style={{ textShadow: '0 0 20px #E53935, 0 0 60px rgba(229,57,53,0.3)' }}
          >
            X
          </div>
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(229,57,53,0.2) 0%, transparent 70%)',
              animation: 'neonPulse 2s ease-in-out infinite',
            }}
          />
        </div>
        <div>
          <h3 className="font-bebas text-3xl text-white tracking-wider mb-2">Wall Tagged!</h3>
          <p className="font-montserrat text-sm text-urban/60">
            Message received. We'll hit you back soon.
          </p>
        </div>
        <button
          onClick={() => setStatus('idle')}
          className="btn-neon text-xs"
        >
          Send Another
        </button>
      </div>
    );
  }

  const COLLAB_TYPES = [
    { value: 'collab', label: 'Collaboration' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'media', label: 'Media / Press' },
    { value: 'stockist', label: 'Stockist / Retail' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Type selector */}
      <div>
        <label className="font-montserrat text-xs text-urban/60 uppercase tracking-widest block mb-2">
          What's the move?
        </label>
        <div className="flex flex-wrap gap-2">
          {COLLAB_TYPES.map((ct) => (
            <button
              key={ct.value}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, type: ct.value }))}
              className={`font-montserrat text-xs px-3 py-1.5 border transition-all duration-200 ${
                form.type === ct.value
                  ? 'bg-crimson border-crimson text-white'
                  : 'border-white/15 text-urban/60 hover:border-white/30 hover:text-white'
              }`}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))',
              }}
            >
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-montserrat text-xs text-urban/60 uppercase tracking-widest block mb-1.5">
            Name <span className="text-crimson">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className={`input-field ${errors.name ? 'border-crimson/60' : ''}`}
          />
          {errors.name && (
            <p className="font-montserrat text-xs text-crimson mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="font-montserrat text-xs text-urban/60 uppercase tracking-widest block mb-1.5">
            Email <span className="text-crimson">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`input-field ${errors.email ? 'border-crimson/60' : ''}`}
          />
          {errors.email && (
            <p className="font-montserrat text-xs text-crimson mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Social handle (optional) */}
      <div>
        <label className="font-montserrat text-xs text-urban/60 uppercase tracking-widest block mb-1.5">
          Social Handle <span className="text-urban/30 text-[10px] ml-1">(optional)</span>
        </label>
        <input
          type="text"
          name="socialHandle"
          value={form.socialHandle || ''}
          onChange={handleChange}
          placeholder="@yoursocial"
          className="input-field"
        />
      </div>

      {/* Message */}
      <div>
        <label className="font-montserrat text-xs text-urban/60 uppercase tracking-widest block mb-1.5">
          Message <span className="text-crimson">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Tell us about your idea, brand, or collab vision..."
          className={`input-field resize-none ${errors.message ? 'border-crimson/60' : ''}`}
        />
        <div className="flex justify-between mt-1">
          {errors.message ? (
            <p className="font-montserrat text-xs text-crimson">{errors.message}</p>
          ) : (
            <span />
          )}
          <span className={`font-montserrat text-xs ${form.message.length > 400 ? 'text-crimson' : 'text-urban/30'}`}>
            {form.message.length}/500
          </span>
        </div>
      </div>

      {/* Error state */}
      {status === 'error' && (
        <div className="p-4 border border-crimson/40 bg-crimson/10">
          <p className="font-montserrat text-sm text-crimson">
            Something went wrong. Please try again or email us directly.
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-crimson w-full justify-center group/submit"
      >
        {status === 'sending' ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Tag the Wall. Let's Build.
            <svg className="w-4 h-4 group-hover/submit:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        )}
      </button>
    </form>
  );
}
