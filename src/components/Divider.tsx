import { cn } from "@/lib/cn";

type DividerProps = {
  className?: string;
};

export function Divider({ className }: DividerProps) {
  return (
    <div
      className={cn(
        "mx-auto h-px w-full max-w-[1160px] bg-gradient-to-r from-transparent via-border-subtle to-transparent",
        className,
      )}
      aria-hidden
    />
  );
}
