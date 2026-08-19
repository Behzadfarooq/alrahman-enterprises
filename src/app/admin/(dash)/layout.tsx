import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Middleware already gates this, but re-check so the session is never assumed.
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-brand-50/40 lg:flex">
      <AdminNav email={session.email} />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}
