import Link from "next/link";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--muted)]/40">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-heading font-semibold">Royal mechanics</Link>
          <Link href="/booking" className="text-sm text-[var(--muted-foreground)]">Book Service</Link>
        </div>
      </header>
      {children}
      <MobileBottomNav role="user" />
    </div>
  );
}
