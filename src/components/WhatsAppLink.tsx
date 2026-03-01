"use client";

import { WHATSAPP_PHONE } from "@/lib/constants";

import { Button } from "./Button";
import { useLocale } from "./LocaleProvider";

type WhatsAppLinkProps = {
  className?: string;
  label: string;
  message: string;
  phone?: string;
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
  phone,
  variant = "primary",
}: WhatsAppLinkProps) {
  const { get } = useLocale();
  const configuredPhone = get<string>("global.whatsappNumber");
  const targetPhone = phone || configuredPhone || WHATSAPP_PHONE;

  return (
    <Button
      href={buildWhatsAppHref(targetPhone, message)}
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
