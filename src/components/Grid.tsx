import { cn } from "@/lib/cn";

type GridProps = {
  children: React.ReactNode;
  className?: string;
  cols?: 2 | 3 | 4;
};

export function Grid({ children, className, cols = 3 }: GridProps) {
  const columnClass =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 4
        ? "md:grid-cols-2 xl:grid-cols-4"
        : "md:grid-cols-3";

  return <div className={cn("grid gap-5", columnClass, className)}>{children}</div>;
}
