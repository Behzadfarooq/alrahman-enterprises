"use client";

import { useFormStatus } from "react-dom";
import { TrashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

function Inner({ label, className }: { label: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60",
        className,
      )}
    >
      <TrashIcon width={14} height={14} />
      {pending ? "Deleting…" : label}
    </button>
  );
}

/**
 * Delete button that asks for confirmation before the server action runs.
 * Wraps a form so it still works with progressive enhancement.
 */
export function ConfirmDelete({
  action,
  id,
  name,
  label = "Delete",
  what = "item",
  className,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  name: string;
  label?: string;
  what?: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const message = `Delete the ${what} "${name}"?\n\nThis cannot be undone.`;
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Inner label={label} className={className} />
    </form>
  );
}
