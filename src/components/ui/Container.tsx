import { cn } from "@/lib/utils/cn";

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Narrower measure for reading-heavy pages (lessons, articles). */
  size?: "default" | "prose";
};

/** Centered, padded page container with a consistent max width. */
export function Container({
  className,
  size = "default",
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        size === "prose" ? "max-w-3xl" : "max-w-content",
        className,
      )}
      {...props}
    />
  );
}
