import React from 'react';
import VideoGallery from '../components/VideoGallery';
import { useInView } from '../hooks/useInView';
import { useMedia } from '../hooks/useConvex';

const HASHTAGS = [
  '#BiigggX', '#XMarksTheMoment', '#StreetDrop', '#UrbanCulture',
  '#NewDrop2026', '#TagTheWall', '#GraffitiLife', '#LimitedDrop',
  '#StreetWear', '#Biiggg', '#XFactor', '#SprayArt',
];

const SOCIAL_EMBEDS = [
  { platform: 'TikTok',    handle: '@biigggx', followers: '24.2K', color: '#00BFFF', posts: '98' },
  { platform: 'Instagram', handle: '@biiggg.x', followers: '18.7K', color: '#E53935',  posts: '142' },
  { platform: 'X',         handle: '@biigggx',  followers: '9.1K',  color: '#B0B0B0',  posts: '312' },
];

export default function Media() {
  const [headerRef, headerInView] = useInView(0.1);
  const [galleryRef, galleryInView] = useInView(0.05);
  const [hashtagRef, hashtagInView] = useInView(0.1);
  const [socialRef, socialInView] = useInView(0.1);

  // Live Convex data — undefined while loading
  const videos = useMedia();
  const videosLoading = videos === undefined;

  return (
    <div className="bg-midnight min-h-screen pt-20">
      {/* Header */}
      <section
        ref={headerRef}
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5"
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,191,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          className="absolute right-0 bottom-0 font-bebas text-[15rem] text-white/[0.02] leading-none pointer-events-none select-none"
          style={{ lineHeight: 0.9 }}
        >
          REEL
        </div>

        <div className="max-w-7xl mx-auto">
          <div
            style={{
              opacity: headerInView ? 1 : 0,
              transform: headerInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="tag-badge font-marker mb-6 inline-block">Media & Reels</span>
            <h1
              className="font-bebas leading-none mb-4"
              style={{ fontSize: 'clamp(3.5rem, 11vw, 9rem)' }}
            >
              THE{' '}
              <span
                className="text-neon"
                style={{ textShadow: '0 0 30px rgba(0,191,255,0.4)' }}
              >
                FEED
              </span>
            </h1>
            <p className="font-montserrat text-sm text-urban/50 max-w-xl leading-relaxed">
              Graffiti spray intros, electric pulse animations, merch drops, and behind-the-scenes moments. The X is always moving.
            </p>
          </div>
        </div>
      </section>

      {/* Social Stats */}
      <section ref={socialRef} className="py-12 px-4 sm:px-6 lg:px-8 bg-surface border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SOCIAL_EMBEDS.map((social, i) => (
              <div
                key={social.platform}
                className="group p-6 border border-white/5 hover:border-white/10 transition-all duration-300 cursor-pointer"
                style={{
                  background: '#0A0A0A',
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                  opacity: socialInView ? 1 : 0,
                  transform: socialInView ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.7s ease ${i * 120}ms`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = social.color + '40';
                  e.currentTarget.style.boxShadow = `0 0 20px ${social.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-bebas text-2xl tracking-wider"
                    style={{ color: social.color }}
                  >
                    {social.platform}
                  </span>
                  <span className="font-montserrat text-xs text-urban/40">{social.handle}</span>
                </div>
                <div className="flex gap-6">
                  <div>
                    <div className="font-bebas text-3xl text-white">{social.followers}</div>
                    <div className="font-montserrat text-[10px] text-urban/30 uppercase tracking-widest">Followers</div>
                  </div>
                  <div>
                    <div className="font-bebas text-3xl text-white">{social.posts}</div>
                    <div className="font-montserrat text-[10px] text-urban/30 uppercase tracking-widest">Posts</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <section ref={galleryRef} className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="mb-12"
            style={{
              opacity: galleryInView ? 1 : 0,
              transform: galleryInView ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease',
            }}
          >
            <h2 className="section-title">
              Video <span>Gallery</span>
            </h2>
            <p className="font-montserrat text-xs text-urban/40 uppercase tracking-widest mt-2">
              Spray it. Play it. Tag it.
            </p>
          </div>

          <div
            style={{
              opacity: galleryInView ? 1 : 0,
              transition: 'opacity 0.8s ease 0.3s',
            }}
          >
            <VideoGallery videos={videos} loading={videosLoading} />
          </div>
        </div>
      </section>

      {/* Hashtag Wall */}
      <section ref={hashtagRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-surface border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div
            className="text-center mb-12"
            style={{
              opacity: hashtagInView ? 1 : 0,
              transform: hashtagInView ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s ease',
            }}
          >
            <h2 className="section-title">The <span>Wall</span></h2>
            <p className="font-montserrat text-xs text-urban/40 uppercase tracking-widest mt-2">
              Tag it. Own it. Spread it.
            </p>
          </div>

          {/* Hashtag cloud */}
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {HASHTAGS.map((tag, i) => {
              const sizes = ['text-2xl', 'text-3xl', 'text-4xl', 'text-xl', 'text-5xl'];
              const colors = ['text-crimson', 'text-neon', 'text-urban/60'];
              const size = sizes[i % sizes.length];
              const color = colors[i % colors.length];
              const rotate = (Math.random() * 10 - 5).toFixed(1);

              return (
                <span
                  key={tag}
                  className={`font-marker ${size} ${color} cursor-pointer transition-all duration-300 hover:text-white hover:scale-110 select-none`}
                  style={{
                    display: 'inline-block',
                    transform: `rotate(${rotate}deg)`,
                    opacity: hashtagInView ? 1 : 0,
                    transition: `all 0.6s ease ${i * 80}ms`,
                    textShadow: color.includes('crimson') ? '0 0 20px rgba(229,57,53,0.3)' : color.includes('neon') ? '0 0 20px rgba(0,191,255,0.3)' : 'none',
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* UGC CTA */}
          <div
            className="text-center mt-16"
            style={{
              opacity: hashtagInView ? 1 : 0,
              transition: 'opacity 0.8s ease 0.8s',
            }}
          >
            <p className="font-montserrat text-sm text-urban/40 mb-4">
              Wearing Biiggg X? Tag your fits.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { name: 'TikTok', color: '#00BFFF' },
                { name: 'Instagram', color: '#E53935' },
                { name: 'X', color: '#B0B0B0' },
              ].map((s) => (
                <a
                  key={s.name}
                  href="#"
                  className="font-montserrat text-sm uppercase tracking-widest transition-all duration-200"
                  style={{ color: s.color, textShadow: `0 0 10px ${s.color}40` }}
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
