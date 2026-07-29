/**
 * Reusable section heading with highlight and subtitle
 */
export function SectionTitle({ title, highlight, subtitle, inView, delay = 0 }) {
  return (
    <div
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <h2 className="section-title">
        {title} {highlight && <span className="text-crimson">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className="font-montserrat text-sm text-urban/60 mt-2 uppercase tracking-widest">{subtitle}</p>
      )}
    </div>
  );
}
