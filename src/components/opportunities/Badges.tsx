import {
  PROBLEM_STATUS_META,
  EVIDENCE_META,
  type ProblemStatus,
  type EvidenceLevel,
} from "@/lib/opportunities/opportunities";

export function StatusPill({ status }: { status: ProblemStatus }) {
  const meta = PROBLEM_STATUS_META[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
}

export function EvidencePill({ level }: { level: EvidenceLevel }) {
  const meta = EVIDENCE_META[level];
  return (
    <span
      title={meta.description}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}
