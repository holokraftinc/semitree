import { STATUS_META, type RelationStatus } from "@/lib/industry/relationships";

/**
 * Small confidence pill for a relationship or data point. Makes the honesty
 * model visible: Verified / Reported / Researching / Unknown.
 */
export function StatusBadge({ status, className = "" }: { status: RelationStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      title={meta.description}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className} ${className}`}
    >
      {meta.label}
    </span>
  );
}
