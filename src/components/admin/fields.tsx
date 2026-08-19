"use client";

import { useFormStatus } from "react-dom";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AlertIcon, CheckIcon } from "@/components/icons";

const control =
  "w-full rounded-xl border bg-white px-3.5 text-sm text-brand-950 outline-none transition-colors placeholder:text-brand-400 focus:border-brand-500 disabled:bg-brand-50";

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-1 text-sm font-semibold text-brand-900">
        {label}
        {required && <span className="text-red-500">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-brand-500">{hint}</span>}
      {error && (
        <span className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
          <AlertIcon width={13} height={13} /> {error}
        </span>
      )}
    </label>
  );
}

export function Input({ className, error, ...props }: ComponentProps<"input"> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(control, "h-11", error ? "border-red-300" : "border-brand-200", className)}
    />
  );
}

export function Textarea({
  className,
  error,
  ...props
}: ComponentProps<"textarea"> & { error?: boolean }) {
  return (
    <textarea
      {...props}
      className={cn(control, "py-3 leading-relaxed", error ? "border-red-300" : "border-brand-200", className)}
    />
  );
}

export function Select({ className, error, ...props }: ComponentProps<"select"> & { error?: boolean }) {
  return (
    <select
      {...props}
      className={cn(control, "h-11", error ? "border-red-300" : "border-brand-200", className)}
    />
  );
}

export function Toggle({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-200 bg-white p-3.5 transition-colors hover:border-brand-300">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4.5 w-4.5 rounded border-brand-300 accent-brand-700"
      />
      <span>
        <span className="block text-sm font-semibold text-brand-900">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-brand-600">{description}</span>}
      </span>
    </label>
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  className,
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 text-sm font-semibold text-white transition-all hover:bg-brand-700 disabled:opacity-60",
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({ ok, children }: { ok?: boolean; children: ReactNode }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-xl px-3.5 py-3 text-sm font-medium",
        ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700",
      )}
    >
      {ok ? <CheckIcon width={16} height={16} className="mt-0.5 shrink-0" /> : <AlertIcon width={16} height={16} className="mt-0.5 shrink-0" />}
      {children}
    </p>
  );
}
