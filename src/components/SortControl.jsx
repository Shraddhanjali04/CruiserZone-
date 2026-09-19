"use client";
import { useRouter } from "next/navigation";
export function SortControl({ current, hidden, }) {
    const router = useRouter();
    function change(value) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(hidden)) {
            if (v)
                params.set(k, v);
        }
        if (value && value !== "ends_soon")
            params.set("sort", value);
        router.push(`/listings?${params.toString()}`);
    }
    return (<select name="sort" value={current} onChange={(e) => change(e.target.value)} className="h-9 rounded-lg border border-ink-300 bg-white px-3 text-sm font-medium text-ink-700 focus:border-brand-500 focus:outline-none">
      <option value="ends_soon">Ending soonest</option>
      <option value="price_asc">Price: low to high</option>
      <option value="price_desc">Price: high to low</option>
      <option value="newest">Newest first</option>
    </select>);
}
