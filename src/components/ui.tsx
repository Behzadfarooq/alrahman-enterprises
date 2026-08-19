import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]";

const variants = {
  primary: "bg-brand-800 text-white hover:bg-brand-700 shadow-card hover:shadow-lift",
  accent: "bg-accent-500 text-brand-950 hover:bg-accent-400 shadow-card hover:shadow-lift",
  outline: "border border-brand-200 bg-white text-brand-800 hover:border-brand-400 hover:bg-brand-50",
  ghost: "text-brand-700 hover:bg-brand-50",
  danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  whatsapp: "bg-[#1ebe5d] text-white hover:bg-[#19a851] shadow-card hover:shadow-lift",
} as const;

const sizes = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

type Style = { variant?: keyof typeof variants; size?: keyof typeof sizes };

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & Style) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & Style) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function AnchorButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"a"> & Style) {
  return <a className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "accent" | "danger";
  className?: string;
}) {
  const tones = {
    neutral: "bg-brand-50 text-brand-700 ring-brand-100",
    success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    warning: "bg-amber-50 text-amber-800 ring-amber-100",
    accent: "bg-accent-100 text-accent-700 ring-accent-200",
    danger: "bg-red-50 text-red-700 ring-red-100",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-500">{eyebrow}</p>
        )}
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-brand-950 sm:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-brand-700/80 sm:text-base">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 px-6 py-16 text-center">
      <p className="font-display text-lg font-bold text-brand-900">{title}</p>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-brand-700/80">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
