import { cn } from "@/lib/utils";
export function Label({ children, className, htmlFor, }) {
    return (<label htmlFor={htmlFor} className={cn("mb-1.5 block text-sm font-medium text-ink-700", className)}>
      {children}
    </label>);
}
const fieldCls = "block w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-ink-100";
export function Input({ className, ...rest }) {
    return <input className={cn(fieldCls, className)} {...rest}/>;
}
export function Select({ className, children, ...rest }) {
    return (<select className={cn(fieldCls, "pr-8", className)} {...rest}>
      {children}
    </select>);
}
export function Textarea({ className, ...rest }) {
    return <textarea className={cn(fieldCls, "min-h-24", className)} {...rest}/>;
}
export function FieldError({ children }) {
    if (!children)
        return null;
    return <p className="mt-1.5 text-xs font-medium text-red-600">{children}</p>;
}
