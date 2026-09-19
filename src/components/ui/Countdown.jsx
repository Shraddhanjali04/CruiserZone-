"use client";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
function diff(endsAt) {
    return Math.max(0, endsAt - Date.now());
}
function parse(ms) {
    const s = Math.floor(ms / 1000);
    return {
        d: Math.floor(s / 86400),
        h: Math.floor((s % 86400) / 3600),
        m: Math.floor((s % 3600) / 60),
        s: s % 60,
    };
}
function Unit({ value, label, size, }) {
    const boxes = size === "lg"
        ? "h-11 min-w-11 text-xl rounded-xl"
        : size === "sm"
            ? "h-7 min-w-7 text-xs rounded-md"
            : "h-9 min-w-9 text-sm rounded-lg";
    const labelCls = size === "sm" ? "text-[10px]" : "text-[11px]";
    return (<span className="flex flex-col items-center gap-0.5">
      <span className={cn("tabular flex items-center justify-center bg-ink-900 px-1.5 text-white", boxes)}>
        {String(value).padStart(2, "0")}
      </span>
      <span className={cn("uppercase tracking-wide text-ink-500", labelCls)}>
        {label}
      </span>
    </span>);
}
export function Countdown({ endsAt, onEnd, size = "md", compact = false, className, }) {
    const target = useMemo(() => new Date(typeof endsAt === "string" || typeof endsAt === "number"
        ? endsAt
        : endsAt.getTime()).getTime(), [endsAt]);
    const [remaining, setRemaining] = useState(() => diff(target));
    const done = remaining <= 0;
    useEffect(() => {
        const id = setInterval(() => {
            setRemaining(diff(target));
        }, 1000);
        return () => clearInterval(id);
    }, [target]);
    useEffect(() => {
        if (done && remaining <= 0)
            onEnd?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [done]);
    if (done) {
        return (<span className={cn("inline-flex items-center gap-1.5 font-semibold text-red-600", className)}>
        <span className="h-2 w-2 rounded-full bg-red-500"/>
        Ended
      </span>);
    }
    const { d, h, m, s } = parse(remaining);
    if (compact) {
        const includeDays = d > 0;
        return (<span className={cn("tabular inline-flex items-baseline gap-0.5 font-semibold text-ink-900", className)}>
        {includeDays && <span>{d}d </span>}
        {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}
        {!includeDays && <span>:{String(s).padStart(2, "0")}</span>}
      </span>);
    }
    return (<span className={cn("inline-flex items-center gap-1.5", className)}>
      {d > 0 && <Unit value={d} label="days" size={size}/>}
      <Unit value={h} label="hrs" size={size}/>
      <Unit value={m} label="min" size={size}/>
      <Unit value={s} label="sec" size={size}/>
    </span>);
}
