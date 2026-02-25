export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
      Live
    </span>
  );
}
