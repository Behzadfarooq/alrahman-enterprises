"use client";

import { useActionState, useState } from "react";
import { Field, FormMessage, Input, SubmitButton, Textarea } from "./fields";
import { ConfirmDelete } from "./ConfirmDelete";
import { EditIcon, PlusIcon } from "@/components/icons";
import type { ActionState } from "@/app/admin/actions";

export type TaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  text: string | null;
  sortOrder: number;
  productCount: number;
};

const initialState: ActionState = {};

/**
 * Shared add/edit/delete UI for brands and categories — both have the same shape,
 * so the owner sees exactly one pattern to learn.
 */
export function TaxonomyManager({
  kind,
  items,
  saveAction,
  deleteAction,
  textLabel,
  textHint,
  addHint,
}: {
  kind: "brand" | "category";
  items: TaxonomyItem[];
  saveAction: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction: (formData: FormData) => Promise<void>;
  textLabel: string;
  textHint: string;
  addHint: string;
}) {
  const [state, formAction] = useActionState(saveAction, initialState);
  const [editing, setEditing] = useState<TaxonomyItem | null>(null);
  const textField = kind === "brand" ? "about" : "description";
  const noun = kind === "brand" ? "brand" : "category";

  // `key` resets the uncontrolled inputs whenever the edit target changes.
  const formKey = editing?.id ?? "new";

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
      <section className="rounded-2xl border border-brand-100 bg-white p-5">
        <h2 className="font-display text-base font-bold text-brand-950">
          {editing ? `Edit ${noun}` : `Add a ${noun}`}
        </h2>
        <p className="mt-1 text-sm text-brand-600">{editing ? `Update "${editing.name}".` : addHint}</p>

        <form key={formKey} action={formAction} className="mt-5 space-y-4">
          {editing && <input type="hidden" name="id" value={editing.id} />}

          {state.message && <FormMessage ok={state.ok}>{state.message}</FormMessage>}

          <Field label="Name" error={state.errors?.name} required>
            <Input
              name="name"
              defaultValue={editing?.name ?? ""}
              error={Boolean(state.errors?.name)}
              required
              maxLength={60}
              placeholder={kind === "brand" ? "e.g. Samsung" : "e.g. Water Purifiers"}
            />
          </Field>

          <Field label={textLabel} hint={textHint}>
            <Textarea name={textField} defaultValue={editing?.text ?? ""} rows={4} maxLength={500} />
          </Field>

          <Field label="Display order" hint="Lower numbers appear first. Leave at 0 if unsure.">
            <Input name="sortOrder" type="number" min={0} max={999} defaultValue={editing?.sortOrder ?? 0} />
          </Field>

          <div className="flex gap-3">
            <SubmitButton>{editing ? "Save changes" : `Add ${noun}`}</SubmitButton>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="inline-flex h-11 items-center rounded-xl border border-brand-200 px-5 text-sm font-semibold text-brand-800 hover:bg-brand-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-brand-100 bg-white">
        <div className="border-b border-brand-100 px-5 py-4">
          <h2 className="font-display text-base font-bold text-brand-950">
            {items.length} {items.length === 1 ? noun : `${noun}s`}
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <PlusIcon />
            </span>
            <p className="mt-3 font-display text-sm font-bold text-brand-900">No {noun}s yet</p>
            <p className="mt-1 text-sm text-brand-600">Use the form to add your first one.</p>
          </div>
        ) : (
          <ul className="divide-y divide-brand-100">
            {items.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold text-brand-950">{item.name}</p>
                  <p className="mt-0.5 text-xs text-brand-500">
                    {item.productCount} {item.productCount === 1 ? "product" : "products"} · /{item.slug}
                  </p>
                  {item.text && <p className="mt-1.5 line-clamp-2 text-xs text-brand-600">{item.text}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(item);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 bg-white px-3 py-2 text-xs font-semibold text-brand-800 hover:bg-brand-50"
                  >
                    <EditIcon width={14} height={14} /> Edit
                  </button>
                  <ConfirmDelete action={deleteAction} id={item.id} name={item.name} what={noun} />
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="border-t border-brand-100 px-5 py-3.5 text-xs text-brand-500">
          Deleting a {noun} does not delete its products — they simply stop showing that {noun}.
        </p>
      </section>
    </div>
  );
}
