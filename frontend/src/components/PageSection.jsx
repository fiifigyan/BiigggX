import React from 'react';

/**
 * Reusable page section wrapper with optional decorative elements
 */
function SectionDecoration({ gradient = 'crimson' }) {
  const color = gradient === 'crimson' ? '#E53935' : '#00BFFF';
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[1px]"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
    />
  );
}

export const PageSection = React.forwardRef(({
  children,
  className = '',
  withDecoration = false,
  decorationGradient = 'crimson',
  bgClass = '',
  borderTop = false,
  ...props
}, ref) => {
  return (
    <section
      ref={ref}
      className={`relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden ${bgClass} ${borderTop ? 'border-t border-white/5' : ''} ${className}`}
      {...props}
    >
      {withDecoration && <SectionDecoration gradient={decorationGradient} />}
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
});
