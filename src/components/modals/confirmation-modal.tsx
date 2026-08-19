"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({ open, title, description, onConfirm, onCancel }: ConfirmationModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
      <Card className="w-full max-w-md p-5">
        <h3 className="font-heading text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{description}</p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </Card>
    </div>
  );
}
