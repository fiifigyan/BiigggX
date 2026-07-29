/**
 * Loading skeleton for product cards
 * Used in Home and Shop pages
 */
export default function SkeletonCard() {
  return (
    <div
      className="bg-surface-2 animate-pulse"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
      }}
    >
      <div className="aspect-square bg-surface-3" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-surface-3 rounded w-3/4" />
        <div className="h-2 bg-surface-3 rounded w-1/2" />
        <div className="h-8 bg-surface-3 rounded mt-4" />
      </div>
    </div>
  );
}
