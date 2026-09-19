import { cn } from "@/lib/utils";
const tones = {
    neutral: "bg-ink-100 text-ink-700",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    accent: "bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-200",
    dark: "bg-ink-900 text-white",
};
export function Badge({ children, tone = "neutral", className, }) {
    return (<span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>);
}
