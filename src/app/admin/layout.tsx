import { AdminRouteShell } from "@/components/layout/admin-route-shell";

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminRouteShell>{children}</AdminRouteShell>;
}
