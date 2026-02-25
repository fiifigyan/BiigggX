import React, { useState, useRef } from 'react';

const PLATFORM_ICONS = {
  tiktok: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.77a8.18 8.18 0 004.78 1.52V6.82a4.85 4.85 0 01-1.01-.13z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  youtube: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  twitter: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 5.252zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
};

const TYPE_COLORS = {
  reel: '#E53935',
  showcase: '#00BFFF',
  merch: '#B0B0B0',
  campaign: '#E53935',
  reveal: '#00BFFF',
  'behind-the-scenes': '#B0B0B0',
};

function SkeletonVideoCard() {
  return (
    <div
      className="bg-surface-2 animate-pulse"
      style={{ clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))' }}
    >
      <div className="aspect-video bg-surface-3" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-surface-3 rounded w-3/4" />
        <div className="h-2 bg-surface-3 rounded w-1/2" />
      </div>
    </div>
  );
}

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const color = TYPE_COLORS[video.type] || '#E53935';

  return (
    <div className="video-card group cursor-pointer" onClick={() => setPlaying(!playing)}>
      {/* Thumbnail / Video player */}
      <div className="relative aspect-video overflow-hidden bg-surface-3">
        {video.url && playing ? (
          <video
            ref={videoRef}
            src={video.url}
            autoPlay
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center relative"
            style={{ background: `linear-gradient(135deg, #0A0A0A, #111111, ${color}10)` }}
          >
            {/* Decorative scan lines */}
            {Array(5).fill(null).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-[1px] opacity-5"
                style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, top: `${20 * (i + 1)}%` }}
              />
            ))}

            {/* Play button + title */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110"
                style={{ borderColor: color, background: `${color}20`, boxShadow: `0 0 20px ${color}40` }}
              >
                <svg className="w-6 h-6 ml-1" fill={color} viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="font-marker text-base text-center px-4" style={{ color }}>
                {video.title}
              </span>
            </div>

            {/* Duration badge */}
            {video.duration && (
              <span className="absolute bottom-3 right-3 font-montserrat text-xs text-urban/60 bg-black/60 px-2 py-0.5">
                {video.duration}
              </span>
            )}
          </div>
        )}

        {/* Platform badge */}
        {video.platform && PLATFORM_ICONS[video.platform] && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 text-white opacity-80"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <span className={
              video.platform === 'tiktok' ? 'text-white' :
              video.platform === 'instagram' ? 'text-pink-400' :
              'text-red-400'
            }>
              {PLATFORM_ICONS[video.platform]}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3">
        <h4 className="font-montserrat font-semibold text-sm text-white group-hover:text-crimson transition-colors duration-200 mb-2">
          {video.title}
        </h4>
        <div className="flex flex-wrap gap-1">
          {(video.tags ?? []).map((tag) => (
            <span key={tag} className="font-marker text-xs" style={{ color: `${color}80` }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const FILTER_TYPES = [
  { id: 'all',      label: 'All' },
  { id: 'reel',     label: 'Reels' },
  { id: 'showcase', label: 'Showcases' },
  { id: 'merch',    label: 'Merch' },
  { id: 'campaign', label: 'Campaign' },
];

/**
 * @param {{ videos: object[]|undefined, loading: boolean }} props
 * `videos` — array from Convex `useMedia()`. Pass `undefined` or omit while loading.
 * `loading` — show skeleton grid.
 */
export default function VideoGallery({ videos, loading = false }) {
  const [filter, setFilter] = useState('all');

  const list = videos ?? [];
  const filtered = filter === 'all' ? list : list.filter((v) => v.type === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTER_TYPES.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`font-montserrat text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-200 ${
              filter === f.id
                ? 'bg-crimson border-crimson text-white'
                : 'border-white/15 text-urban/60 hover:border-white/30 hover:text-white'
            }`}
            style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6).fill(null).map((_, i) => <SkeletonVideoCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 gap-3">
            <div className="font-bebas text-5xl text-white/10">NO REELS</div>
            <p className="font-montserrat text-xs text-urban/30">Nothing in this category yet. Check back soon.</p>
          </div>
        ) : (
          filtered.map((video) => (
            // Convex returns _id; fall back to title as key for safety
            <VideoCard key={video._id ?? video.title} video={video} />
          ))
        )}
      </div>
    </div>
  );
}
