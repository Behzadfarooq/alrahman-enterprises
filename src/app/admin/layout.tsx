import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Al Rahman Admin" },
  robots: { index: false, follow: false },
};

/** The login page renders standalone; the dashboard shell lives in (dash)/layout. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
