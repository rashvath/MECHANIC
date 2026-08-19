import { MapPin, Navigation, Radar } from "lucide-react";
import { cn } from "@/lib/utils";

export function MapPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[radial-gradient(circle_at_top_left,_#eef4fa,_#f8fbff_48%,_#ffffff)] p-4",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,#d9e4ef_1px,transparent_1px),linear-gradient(to_bottom,#d9e4ef_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="relative h-72">
        <div className="absolute left-[20%] top-[22%] rounded-full bg-white p-2 shadow"><MapPin className="h-4 w-4 text-[var(--primary)]" /></div>
        <div className="absolute left-[64%] top-[40%] rounded-full bg-white p-2 shadow"><MapPin className="h-4 w-4 text-[var(--primary)]" /></div>
        <div className="absolute left-[48%] top-[58%] rounded-full bg-white p-2 shadow"><Navigation className="h-4 w-4 text-[var(--success)]" /></div>
        <div className="absolute left-[46%] top-[56%] h-16 w-16 rounded-full border-2 border-dashed border-[var(--primary)]/40" />
        <div className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs shadow"><Radar className="h-3 w-3" /> Service radius</div>
      </div>
    </div>
  );
}
