"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { BoxIcon, GridIcon, LogoutIcon, MenuIcon, TagIcon, XIcon } from "@/components/icons";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Overview", icon: GridIcon },
  { href: "/admin/products", label: "Products", icon: BoxIcon },
  { href: "/admin/brands", label: "Brands", icon: TagIcon },
  { href: "/admin/categories", label: "Categories", icon: GridIcon },
];

export function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
              active ? "bg-brand-800 text-white" : "text-brand-700 hover:bg-brand-50",
            )}
          >
            <Icon width={18} height={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-brand-100 pt-4">
      <p className="truncate px-3.5 text-xs text-brand-500">Signed in as</p>
      <p className="truncate px-3.5 text-sm font-semibold text-brand-900">{email}</p>
      <div className="mt-3 flex flex-col gap-1">
        <Link
          href="/"
          target="_blank"
          className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"
        >
          View website ↗
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            <LogoutIcon width={18} height={18} /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-brand-100 bg-white px-4 lg:hidden">
        <Link href="/admin/dashboard"><Logo /></Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg p-2.5 text-brand-800 hover:bg-brand-50"
        >
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>
      {open && (
        <div className="border-b border-brand-100 bg-white p-4 lg:hidden">
          {items}
          <div className="mt-4">{footer}</div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-brand-100 bg-white p-4 lg:flex">
        <div>
          <Link href="/admin/dashboard" className="mb-6 block px-1"><Logo /></Link>
          {items}
        </div>
        {footer}
      </aside>
    </>
  );
}
