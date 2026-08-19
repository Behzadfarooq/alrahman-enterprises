"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

function Inner({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors disabled:opacity-50",
        on
          ? "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100"
          : "bg-brand-50 text-brand-600 ring-brand-200 hover:bg-brand-100",
      )}
    >
      {pending ? "…" : on ? onLabel : offLabel}
    </button>
  );
}

/** One-click toggle (stock / featured) posted straight to a server action. */
export function QuickToggle({
  action,
  id,
  on,
  onLabel,
  offLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  on: boolean;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <Inner on={on} onLabel={onLabel} offLabel={offLabel} />
    </form>
  );
}
