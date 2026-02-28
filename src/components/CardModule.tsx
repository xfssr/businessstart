import { cn } from "@/lib/cn";

type CardModuleProps = {
  children: React.ReactNode;
  className?: string;
};

export function CardModule({ children, className }: CardModuleProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border-subtle bg-surface-elevated/85 p-6 shadow-panel backdrop-blur-[1px] sm:p-7",
        className,
      )}
    >
      {children}
    </article>
  );
}
