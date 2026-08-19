import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Owner Login",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getSession()) redirect("/admin/dashboard");
  const { next } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-50/60 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>
        <div className="mt-8 rounded-2xl border border-brand-100 bg-white p-7 shadow-card">
          <h1 className="font-display text-xl font-extrabold text-brand-950">Owner login</h1>
          <p className="mt-1.5 text-sm text-brand-600">
            Sign in to manage products, brands and stock.
          </p>
          <LoginForm next={next} />
        </div>
        <p className="mt-6 text-center text-xs text-brand-500">
          This area is for the store owner only.
        </p>
      </div>
    </div>
  );
}
