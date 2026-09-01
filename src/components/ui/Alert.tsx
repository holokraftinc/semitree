import { cn } from "@/lib/utils/cn";

type AlertVariant = "info" | "success" | "warning" | "danger" | "neutral";

const variants: Record<AlertVariant, { box: string; icon: string; path: string }> =
  {
    info: {
      box: "border-info/30 bg-info/5 text-foreground",
      icon: "text-info",
      path: "M10 9v4m0 3h.01M10 3a7 7 0 100 14 7 7 0 000-14z",
    },
    success: {
      box: "border-success/30 bg-success/5 text-foreground",
      icon: "text-success",
      path: "M7 10.5l2 2 4-4.5M10 3a7 7 0 100 14 7 7 0 000-14z",
    },
    warning: {
      box: "border-warning/30 bg-warning/5 text-foreground",
      icon: "text-warning",
      path: "M10 7v4m0 3h.01M8.6 3.3L2.3 14a1.6 1.6 0 001.4 2.4h12.6a1.6 1.6 0 001.4-2.4L11.4 3.3a1.6 1.6 0 00-2.8 0z",
    },
    danger: {
      box: "border-danger/30 bg-danger/5 text-foreground",
      icon: "text-danger",
      path: "M10 7v4m0 3h.01M10 3a7 7 0 100 14 7 7 0 000-14z",
    },
    neutral: {
      box: "border-border bg-muted/40 text-foreground",
      icon: "text-muted-foreground",
      path: "M10 9v4m0 3h.01M10 3a7 7 0 100 14 7 7 0 000-14z",
    },
  };

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: string;
};

export function Alert({
  className,
  variant = "info",
  title,
  children,
  ...props
}: AlertProps) {
  const v = variants[variant];
  return (
    <div
      role={variant === "danger" || variant === "warning" ? "alert" : "note"}
      className={cn("flex gap-3 rounded-lg border p-4 text-sm", v.box, className)}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className={cn("mt-0.5 h-5 w-5 shrink-0", v.icon)}
      >
        <path d={v.path} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
