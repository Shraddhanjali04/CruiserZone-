"use client";
import { useState, useTransition } from "react";
import { toggleWatchlist } from "@/lib/actions/bids";
import { cn } from "@/lib/utils";
export function WatchButton({ carId, initialWatching, showLabel = true, }) {
    const [watching, setWatching] = useState(initialWatching);
    const [pending, startTransition] = useTransition();
    function toggle() {
        startTransition(async () => {
            const res = await toggleWatchlist(carId);
            if (res.ok)
                setWatching(res.watching);
        });
    }
    return (<button onClick={toggle} disabled={pending} className={cn("inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition disabled:opacity-60", watching
            ? "border-brand-300 bg-brand-50 text-brand-700"
            : "border-ink-300 bg-white text-ink-700 hover:border-ink-400 hover:bg-ink-50")}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill={watching ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
      {showLabel && (watching ? "Watching" : "Watch")}
    </button>);
}
