import { cn } from "@/lib/utils/cn";

type BadgeVariant =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-brand/10 text-brand",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

/** Small status/label pill. Also used for release tiers (MVP / v1 / v2). */
export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

/** Maps a calculator tier to a badge. */
export function TierBadge({ tier }: { tier: "mvp" | "v1" | "v2" }) {
  const label = tier === "mvp" ? "MVP" : tier.toUpperCase();
  const variant: BadgeVariant = tier === "mvp" ? "brand" : "neutral";
  return <Badge variant={variant}>{label}</Badge>;
}
