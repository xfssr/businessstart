import { SectionShell } from "@/components/ui/SectionShell";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  size?: "default" | "large";
  tone?: "default" | "muted";
  withGlowAccent?: boolean;
};

export function Section({
  children,
  className,
  description,
  eyebrow,
  id,
  size,
  tone,
  title,
  withGlowAccent,
}: SectionProps) {
  return (
    <SectionShell
      id={id}
      className={className}
      eyebrow={eyebrow}
      title={title}
      description={description}
      size={size}
      tone={tone}
      withGlowAccent={withGlowAccent}
    >
      {children}
    </SectionShell>
  );
}
