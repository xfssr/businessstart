"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

import { Container } from "./Container";
import { WhatsAppLink } from "./WhatsAppLink";

type StickyWhatsAppBarProps = {
  label: string;
  message: string;
};

export function StickyWhatsAppBar({ label, message }: StickyWhatsAppBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 220);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface-overlay/95 py-3 backdrop-blur-sm transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <Container>
        <WhatsAppLink label={label} message={message} className="w-full" />
      </Container>
    </div>
  );
}
