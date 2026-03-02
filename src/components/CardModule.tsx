import { GlassCard } from "@/components/ui/GlassCard";

type CardModuleProps = {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  strong?: boolean;
};

export function CardModule({ children, className, interactive = true, strong = false }: CardModuleProps) {
  return (
    <GlassCard className={className} interactive={interactive} strong={strong}>
      {children}
    </GlassCard>
  );
}
