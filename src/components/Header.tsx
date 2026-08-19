"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { AnchorButton } from "./ui";
import { MenuIcon, PhoneIcon, SearchIcon, XIcon } from "./icons";
import { site, telLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/brands", label: "Brands" },
  { href: "/categories", label: "Categories" },
  { href: "/contact", label: "Visit Us" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="bg-brand-900 text-brand-100">
        <div className="container-page flex h-9 items-center justify-between text-[11px] font-medium sm:text-xs">
          <p className="truncate">{site.address.full}</p>
          <a href={telLink()} className="hidden shrink-0 items-center gap-1.5 hover:text-white sm:flex">
            <PhoneIcon width={13} height={13} /> {site.phoneDisplay}
          </a>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/90 backdrop-blur transition-shadow",
          scrolled ? "border-brand-100 shadow-card" : "border-transparent",
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-[70px]">
          <Link href="/" aria-label={`${site.name} home`}>
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                  isActive(l.href) ? "bg-brand-50 text-brand-800" : "text-brand-700/80 hover:bg-brand-50 hover:text-brand-800",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/products"
              aria-label="Search products"
              className="rounded-lg p-2.5 text-brand-700 hover:bg-brand-50 lg:hidden"
            >
              <SearchIcon />
            </Link>
            <AnchorButton href={telLink()} size="sm" className="hidden sm:inline-flex">
              <PhoneIcon width={16} height={16} /> Call now
            </AnchorButton>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="rounded-lg p-2.5 text-brand-800 hover:bg-brand-50 lg:hidden"
            >
              {open ? <MenuIcon className="hidden" /> : null}
              {open ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-brand-100 bg-white lg:hidden">
            <nav className="container-page flex flex-col py-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-lg px-3 py-3 text-base font-semibold",
                    isActive(l.href) ? "bg-brand-50 text-brand-800" : "text-brand-800",
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <AnchorButton href={telLink()} className="mt-3" size="lg">
                <PhoneIcon /> Call {site.phoneDisplay}
              </AnchorButton>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
