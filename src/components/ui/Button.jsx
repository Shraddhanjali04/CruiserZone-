import Link from "next/link";
import { cn } from "@/lib/utils";
const base = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:pointer-events-none disabled:opacity-50";
const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700",
    dark: "bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-950",
    outline: "border border-ink-300 bg-white text-ink-800 hover:border-ink-400 hover:bg-ink-50",
    ghost: "text-ink-700 hover:bg-ink-100",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
};
const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
};
export function buttonStyles({ variant = "primary", size = "md", className, } = {}) {
    return cn(base, variants[variant], sizes[size], className);
}
export function Button({ variant = "primary", size = "md", href, className, children, ...rest }) {
    const cls = buttonStyles({ variant, size, className });
    if (href) {
        return (<Link href={href} className={cls}>
        {children}
      </Link>);
    }
    return (<button className={cls} {...rest}>
      {children}
    </button>);
}
