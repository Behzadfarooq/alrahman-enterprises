import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Link href="/"><Logo /></Link>
      <p className="mt-10 font-display text-6xl font-extrabold text-brand-200">404</p>
      <h1 className="mt-3 font-display text-2xl font-extrabold text-brand-950">We could not find that page</h1>
      <p className="mt-3 max-w-md text-sm text-brand-700/80">
        The product or page you are looking for may have been removed. Browse the full catalogue instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/products">Browse products</ButtonLink>
        <ButtonLink href="/" variant="outline">Back to home</ButtonLink>
      </div>
    </div>
  );
}
