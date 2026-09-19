"use client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input, Select, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
export function FilterSidebar({ makes, bodyTypes, fuels, transmissions, cities, active, activeCount, }) {
    const router = useRouter();
    function apply(patch) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries({ ...active, ...patch })) {
            if (v && k !== "sort")
                params.set(k, v);
        }
        if (active.sort)
            params.set("sort", active.sort);
        router.push(`/listings?${params.toString()}`);
    }
    function clear() {
        router.push("/listings");
    }
    const searchInput = (() => {
        if (typeof window === "undefined")
            return "";
        return active.q ?? "";
    })();
    return (<aside className="h-fit card p-5 lg:sticky lg:top-20">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-ink-900">Filters</h2>
        {activeCount > 0 && (<button onClick={clear} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Clear all
          </button>)}
      </div>

      <div className="mt-4 space-y-5">
        <div>
          <Label>Search</Label>
          <form onSubmit={(e) => {
            e.preventDefault();
            const q = new FormData(e.currentTarget).get("q");
            apply({ q });
        }}>
            <Input name="q" defaultValue={searchInput} placeholder="Creta, Swift, Fortuner…"/>
          </form>
        </div>

        <div>
          <Label>Budget (max current bid)</Label>
          <Select value={active.maxPrice ?? ""} onChange={(e) => apply({ maxPrice: e.target.value })}>
            <option value="">Any</option>
            <option value="500000">Up to ₹5,00,000</option>
            <option value="750000">Up to ₹7,50,000</option>
            <option value="1000000">Up to ₹10,00,000</option>
            <option value="1250000">Up to ₹12,50,000</option>
            <option value="1500000">Up to ₹15,00,000</option>
            <option value="2000000">Up to ₹20,00,000</option>
            <option value="3000000">Up to ₹30,00,000</option>
          </Select>
        </div>

        <div>
          <Label>Brand</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {makes.map((m) => (<FilterChip key={m} label={m.split(" ")[0]} selected={active.make === m} onClick={() => apply({ make: active.make === m ? "" : m })}/>))}
          </div>
        </div>

        <div>
          <Label>Body type</Label>
          <div className="flex flex-wrap gap-1.5">
            {bodyTypes.map((b) => (<FilterChip key={b} label={b === "MUV" ? "MUV / MPV" : b.charAt(0) + b.slice(1).toLowerCase()} selected={active.bodyType === b} onClick={() => apply({ bodyType: active.bodyType === b ? "" : b })}/>))}
          </div>
        </div>

        <div>
          <Label>Fuel</Label>
          <div className="flex flex-wrap gap-1.5">
            {fuels.map((f) => (<FilterChip key={f} label={f.charAt(0) + f.slice(1).toLowerCase()} selected={active.fuel === f} onClick={() => apply({ fuel: active.fuel === f ? "" : f })}/>))}
          </div>
        </div>

        <div>
          <Label>Transmission</Label>
          <div className="flex flex-wrap gap-1.5">
            {transmissions.map((t) => (<FilterChip key={t} label={t.charAt(0) + t.slice(1).toLowerCase()} selected={active.transmission === t} onClick={() => apply({ transmission: active.transmission === t ? "" : t })}/>))}
          </div>
        </div>

        <div>
          <Label>City</Label>
          <Select value={active.city ?? ""} onChange={(e) => apply({ city: e.target.value })}>
            <option value="">All cities</option>
            {cities.map((c) => (<option key={c} value={c}>
                {c}
              </option>))}
          </Select>
        </div>

        <Button type="button" onClick={clear} variant="outline" size="sm" className="w-full">
          Reset filters
        </Button>
      </div>
    </aside>);
}
function FilterChip({ label, selected, onClick, }) {
    return (<button type="button" onClick={onClick} className={cn("rounded-lg border px-2.5 py-1.5 text-xs font-medium transition", selected
            ? "border-brand-500 bg-brand-50 text-brand-700"
            : "border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50")}>
      {label}
    </button>);
}
