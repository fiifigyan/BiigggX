/**
 * Feature card with icon, title, and description
 */
export function FeatureBlock({ icon, title, desc, color, inView, delay }) {
  return (
    <div
      className="group relative p-6 border border-white/5 transition-all duration-500 hover:border-crimson/30"
      style={{
        background: '#0A0A0A',
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <div
        className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 inline-block"
        style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        role="img"
        aria-label={title}
      >
        {icon}
      </div>
      <h3 className="font-bebas text-xl text-white tracking-wider mb-2">{title}</h3>
      <p className="font-montserrat text-xs text-urban/50 leading-relaxed">{desc}</p>
      <div
        className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(135deg, transparent 50%, ${color}30 50%)` }}
      />
    </div>
  );
}
