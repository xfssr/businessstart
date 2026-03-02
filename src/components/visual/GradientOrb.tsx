import { cn } from "@/lib/cn";

type GradientOrbProps = {
  className?: string;
  color?: "blue" | "cyan" | "duo";
  opacity?: number;
  size?: number;
};

function orbGradient(color: GradientOrbProps["color"]) {
  if (color === "cyan") {
    return "radial-gradient(circle, rgb(79 226 255 / 0.52) 0%, transparent 70%)";
  }
  if (color === "duo") {
    return "radial-gradient(circle, rgb(98 171 255 / 0.48) 0%, rgb(79 226 255 / 0.2) 48%, transparent 76%)";
  }
  return "radial-gradient(circle, rgb(98 171 255 / 0.56) 0%, transparent 70%)";
}

export function GradientOrb({
  className,
  color = "blue",
  opacity = 1,
  size = 300,
}: GradientOrbProps) {
  return (
    <span
      className={cn("pointer-events-none absolute rounded-full blur-[42px]", className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        background: orbGradient(color),
      }}
      aria-hidden
    />
  );
}
