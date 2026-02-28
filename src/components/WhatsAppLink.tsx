import { WHATSAPP_PHONE } from "@/lib/constants";

import { Button } from "./Button";

type WhatsAppLinkProps = {
  className?: string;
  label: string;
  message: string;
  variant?: "primary" | "secondary";
};

function buildWhatsAppHref(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppLink({
  className,
  label,
  message,
  variant = "primary",
}: WhatsAppLinkProps) {
  return (
    <Button
      href={buildWhatsAppHref(WHATSAPP_PHONE, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      variant={variant}
    >
      {label}
    </Button>
  );
}

export { buildWhatsAppHref };
