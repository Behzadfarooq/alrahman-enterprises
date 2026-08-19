"use client";

import { Button, ButtonLink } from "@/components/ui";
import { AlertIcon } from "@/components/icons";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertIcon width={26} height={26} />
      </span>
      <h1 className="mt-6 font-display text-2xl font-extrabold text-brand-950">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-brand-700/80">
        We could not load this page. Please try again, or call the showroom on 7006509625.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="outline">Back to home</ButtonLink>
      </div>
    </div>
  );
}
