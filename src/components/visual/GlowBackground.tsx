import { cn } from "@/lib/cn";

import { GradientOrb } from "@/components/visual/GradientOrb";

type GlowBackgroundProps = {
  className?: string;
  dense?: boolean;
};

export function GlowBackground({ className, dense = false }: GlowBackgroundProps) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <GradientOrb
        className={dense ? "-start-20 top-24" : "-start-28 top-16"}
        color="blue"
        size={dense ? 260 : 330}
        opacity={dense ? 0.75 : 0.65}
      />
      <GradientOrb
        className={dense ? "end-0 top-10" : "end-8 top-14"}
        color="cyan"
        size={dense ? 220 : 300}
        opacity={dense ? 0.62 : 0.55}
      />
      <GradientOrb
        className="end-[24%] bottom-[-140px]"
        color="duo"
        size={dense ? 260 : 380}
        opacity={dense ? 0.42 : 0.34}
      />
    </div>
  );
}
