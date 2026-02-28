import { cn } from "@/lib/cn";

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[1160px] px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}
