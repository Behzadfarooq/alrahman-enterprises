"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "../actions";
import { Field, FormMessage, Input, SubmitButton } from "@/components/admin/fields";

const initial: ActionState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {next && <input type="hidden" name="next" value={next} />}

      {state.message && <FormMessage>{state.message}</FormMessage>}

      <Field label="Email address" error={state.errors?.email} required>
        <Input
          name="email"
          type="email"
          autoComplete="username"
          placeholder="owner@alrahmanenterprises.com"
          error={Boolean(state.errors?.email)}
          required
        />
      </Field>

      <Field label="Password" error={state.errors?.password} required>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={Boolean(state.errors?.password)}
          required
        />
      </Field>

      <SubmitButton pendingLabel="Signing in…" className="w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}
