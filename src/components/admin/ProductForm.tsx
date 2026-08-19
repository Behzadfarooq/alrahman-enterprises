"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { saveProductAction, type ActionState } from "@/app/admin/actions";
import { ImageUploader, type UploadedImage } from "./ImageUploader";
import { Field, FormMessage, Input, Select, SubmitButton, Textarea, Toggle } from "./fields";
import { PlusIcon, TrashIcon } from "@/components/icons";

type Option = { id: string; name: string };
type Spec = { label: string; value: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  brandId: string;
  categoryId: string;
  modelNumber: string;
  description: string;
  promoText: string;
  priceInr: string;
  mrpInr: string;
  inStock: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  specs: Spec[];
  images: UploadedImage[];
};

const initialState: ActionState = {};

const NEW = "__new__";

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-brand-100 bg-white p-5 sm:p-6">
      <h2 className="font-display text-base font-bold text-brand-950">{title}</h2>
      {hint && <p className="mt-1 text-sm text-brand-600">{hint}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function ProductForm({
  brands,
  categories,
  values,
}: {
  brands: Option[];
  categories: Option[];
  values: ProductFormValues;
}) {
  const [state, formAction] = useActionState(saveProductAction, initialState);
  const [specs, setSpecs] = useState<Spec[]>(
    values.specs.length ? values.specs : [{ label: "", value: "" }],
  );
  const [brandId, setBrandId] = useState(values.brandId);
  const [categoryId, setCategoryId] = useState(values.categoryId);

  const setSpec = (index: number, patch: Partial<Spec>) =>
    setSpecs((current) => current.map((s, i) => (i === index ? { ...s, ...patch } : s)));

  return (
    <form action={formAction} className="space-y-5 pb-2">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      {state.message && <FormMessage ok={state.ok}>{state.message}</FormMessage>}

      <Card title="Product details" hint="The name is what customers see first — keep it clear and specific.">
        <Field label="Product name" error={state.errors?.name} required
          hint="For example: Voltas 1.5 Ton 3 Star Inverter Split AC">
          <Input name="name" defaultValue={values.name} error={Boolean(state.errors?.name)} required maxLength={140} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Brand" error={state.errors?.brandId}>
            <Select name="brandId" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
              <option value="">— No brand —</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
              <option value={NEW}>＋ Add a new brand…</option>
            </Select>
          </Field>

          <Field label="Category" error={state.errors?.categoryId}>
            <Select name="categoryId" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">— No category —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
              <option value={NEW}>＋ Add a new category…</option>
            </Select>
          </Field>

          {brandId === NEW && (
            <Field label="New brand name" error={state.errors?.newBrandName} required>
              <Input name="newBrandName" placeholder="e.g. Samsung" autoFocus maxLength={60} />
            </Field>
          )}
          {categoryId === NEW && (
            <Field label="New category name" error={state.errors?.newCategoryName} required>
              <Input name="newCategoryName" placeholder="e.g. Water Purifiers" maxLength={60} />
            </Field>
          )}

          <Field label="Model number" hint="Optional, but helps customers match the exact model.">
            <Input name="modelNumber" defaultValue={values.modelNumber} maxLength={80} />
          </Field>
        </div>

        <Field label="Description" hint="A short paragraph about what makes this product a good choice.">
          <Textarea name="description" defaultValue={values.description} rows={5} maxLength={4000} />
        </Field>
      </Card>

      <Card title="Photos" hint="Add clear photos on a plain background. The first photo is shown in listings.">
        <ImageUploader initial={values.images} />
      </Card>

      <Card title="Price & offers" hint="Leave the price empty to show “Price on enquiry” on the website.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Selling price (₹)" error={state.errors?.priceInr} hint="Whole rupees only, e.g. 24990">
            <Input name="priceInr" defaultValue={values.priceInr} inputMode="numeric" error={Boolean(state.errors?.priceInr)} />
          </Field>
          <Field label="MRP / crossed-out price (₹)" error={state.errors?.mrpInr} hint="Optional. Shows the customer how much they save.">
            <Input name="mrpInr" defaultValue={values.mrpInr} inputMode="numeric" error={Boolean(state.errors?.mrpInr)} />
          </Field>
        </div>
        <Field label="Offer text" hint="Optional, e.g. “Free installation this month”">
          <Input name="promoText" defaultValue={values.promoText} maxLength={120} />
        </Field>
      </Card>

      <Card title="Specifications" hint="Add the details customers ask about — capacity, star rating, warranty.">
        <div className="space-y-2.5">
          {specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input
                name="specLabel"
                value={spec.label}
                onChange={(e) => setSpec(i, { label: e.target.value })}
                placeholder="Capacity"
                maxLength={60}
                className="h-11 w-2/5 rounded-xl border border-brand-200 bg-white px-3.5 text-sm outline-none focus:border-brand-500"
              />
              <input
                name="specValue"
                value={spec.value}
                onChange={(e) => setSpec(i, { value: e.target.value })}
                placeholder="1.5 Ton"
                maxLength={200}
                className="h-11 flex-1 rounded-xl border border-brand-200 bg-white px-3.5 text-sm outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => setSpecs((c) => (c.length === 1 ? [{ label: "", value: "" }] : c.filter((_, idx) => idx !== i)))}
                aria-label="Remove this specification"
                className="shrink-0 rounded-xl border border-brand-200 px-3 text-brand-500 hover:bg-red-50 hover:text-red-600"
              >
                <TrashIcon width={16} height={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSpecs((c) => [...c, { label: "", value: "" }])}
          disabled={specs.length >= 30}
          className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 px-3.5 py-2 text-sm font-semibold text-brand-800 hover:bg-brand-50 disabled:opacity-50"
        >
          <PlusIcon width={15} height={15} /> Add another specification
        </button>
      </Card>

      <Card title="Availability">
        <div className="grid gap-3 sm:grid-cols-3">
          <Toggle name="inStock" label="In stock" description="Uncheck when the product is sold out." defaultChecked={values.inStock} />
          <Toggle name="isFeatured" label="Feature on homepage" description="Shows in the featured row." defaultChecked={values.isFeatured} />
          <Toggle name="isPublished" label="Show on website" description="Uncheck to hide it from customers." defaultChecked={values.isPublished} />
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-4 flex items-center gap-3 border-t border-brand-100 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <SubmitButton>{values.id ? "Save changes" : "Add product"}</SubmitButton>
        <Link
          href="/admin/products"
          className="inline-flex h-11 items-center rounded-xl border border-brand-200 px-5 text-sm font-semibold text-brand-800 hover:bg-brand-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
