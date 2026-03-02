"use client";

import { useEffect } from "react";

import { cn } from "@/lib/cn";

type CatalogDetailsModalProps = {
  children: React.ReactNode;
  className?: string;
  closeLabel: string;
  onClose: () => void;
  open: boolean;
  title: string;
};

export function CatalogDetailsModal({
  children,
  className,
  closeLabel,
  onClose,
  open,
  title,
}: CatalogDetailsModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/80 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          "w-full max-w-2xl rounded-2xl border border-border-strong bg-surface-base p-6 shadow-panel sm:p-7",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <h3 className="font-display text-3xl leading-tight text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border-subtle px-3 py-2 text-xs font-semibold tracking-wide text-text-muted uppercase hover:text-text-primary"
          >
            {closeLabel}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
