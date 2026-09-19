import { getLiveAuctions } from "@/lib/queries";
import { CarCard } from "@/components/CarCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FilterSidebar } from "@/components/FilterSidebar";
import { SortControl } from "@/components/SortControl";
import { MAKES, BODY_TYPE, FUEL, TRANSMISSION, CITIES } from "@/lib/constants";
export const metadata = { title: "Live Auctions" };
export default async function ListingsPage({ searchParams, }) {
    const sp = await searchParams;
    const filters = {
        make: sp.make,
        fuel: sp.fuel,
        bodyType: sp.bodyType,
        transmission: sp.transmission,
        city: sp.city,
        maxPrice: sp.maxPrice,
        q: sp.q,
        sort: sp.sort,
    };
    const auctions = await getLiveAuctions(filters);
    const activeCount = Object.entries(filters).filter(([k, v]) => v && k !== "sort").length;
    return (<div className="container-site py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">
          Live auctions
        </h1>
        <p className="mt-1 text-ink-500">
          {auctions.length} car{auctions.length === 1 ? "" : "s"} with an open
          bid right now.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <FilterSidebar makes={[...MAKES]} bodyTypes={Object.values(BODY_TYPE)} fuels={Object.values(FUEL)} transmissions={Object.values(TRANSMISSION)} cities={[...CITIES]} active={filters} activeCount={activeCount}/>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-ink-500">
              Sorting:{" "}
              <span className="font-semibold text-ink-800">
                {filters.sort === "price_asc" && "Price — low to high"}
                {filters.sort === "price_desc" && "Price — high to low"}
                {filters.sort === "newest" && "Newest first"}
                {!filters.sort && "Ending soonest"}
              </span>
            </div>
            <SortControl current={filters.sort ?? "ends_soon"} hidden={{
            make: filters.make,
            fuel: filters.fuel,
            bodyType: filters.bodyType,
            maxPrice: filters.maxPrice,
            city: filters.city,
            transmission: filters.transmission,
            q: filters.q,
        }}/>
          </div>

          {auctions.length === 0 ? (<div className="card flex flex-col items-center px-6 py-16 text-center">
              <div className="text-4xl">🚗</div>
              <h3 className="mt-3 font-bold text-ink-900">No cars match your filters</h3>
              <p className="mt-1 max-w-sm text-sm text-ink-500">
                Try widening your budget or clearing a filter. New cars go live
                every week.
              </p>
              <Button href="/listings" variant="outline" size="sm" className="mt-5">
                Clear all filters
              </Button>
            </div>) : (<>
              {activeCount > 0 && (<div className="mb-4 flex items-center gap-2">
                  <Badge tone="accent">{activeCount} filter{activeCount > 1 ? "s" : ""} active</Badge>
                  <Button href="/listings" variant="ghost" size="sm">
                    Clear
                  </Button>
                </div>)}
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {auctions.map((a) => (<CarCard key={a.id} auction={a}/>))}
              </div>
            </>)}
        </div>
      </div>
    </div>);
}
