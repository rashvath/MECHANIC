import Link from "next/link";

const links = [
  ["Dashboard", "/admin"],
  ["Users", "/admin/users"],
  ["Mechanics", "/admin/mechanics"],
  ["Bookings", "/admin/bookings"],
  ["Services", "/admin/services"],
  ["Service Areas", "/admin/areas"],
  ["Reviews", "/admin/reviews"],
  ["Reports", "/admin/reports"],
] as const;

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-[var(--border)] bg-white p-4 lg:block">
      <p className="font-heading text-xl font-semibold">Royal mechanics Admin</p>
      <nav className="mt-5 space-y-1">
        {links.map(([label, href]) => (
          <Link key={label} href={href} className="block rounded-lg px-3 py-2 text-sm text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--foreground)]">
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
