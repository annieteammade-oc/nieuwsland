export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
      Breaking
    </span>
  );
}

