import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  subtitle,
  className,
  children,
}: {
  id?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-12 sm:py-16", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {title ? (
          <div className="mb-7 sm:mb-10">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
            {subtitle ? <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)] sm:text-base">{subtitle}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
