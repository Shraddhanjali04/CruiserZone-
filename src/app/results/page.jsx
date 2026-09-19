import Image from "next/image";
import Link from "next/link";
import { getEndedAuctions } from "@/lib/queries";
import { readJsonArray, inr, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
export const metadata = { title: "Recent Results" };
export default async function ResultsPage() {
    const results = await getEndedAuctions();
    return (<div className="container-site py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">
          Recent results
        </h1>
        <p className="mt-1 text-ink-500">
          Transparent final prices from closed CruiserZone auctions.
        </p>
      </div>

      {results.length === 0 ? (<div className="card px-6 py-16 text-center text-ink-500">
          No results published yet. Check back after the first auction ends.
        </div>) : (<div className="card divide-y divide-ink-100">
          {results.map((a) => {
                const images = readJsonArray(a.car.images);
                const won = !!a.soldPrice;
                return (<div key={a.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Link href={`/cars/${a.car.slug}`} className="relative block h-24 w-full shrink-0 overflow-hidden rounded-lg bg-ink-100 sm:w-40">
                  <Image src={images[0] ?? "/cars/cz-001.svg"} alt={a.car.title} fill sizes="160px" className="object-cover"/>
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/cars/${a.car.slug}`} className="font-bold text-ink-900 hover:text-brand-600">
                    {a.car.title}
                  </Link>
                  <div className="mt-0.5 text-sm text-ink-500">
                    {a.car.year} · {a.car.kmDriven.toLocaleString("en-IN")} km ·{" "}
                    {a.car.fuel.charAt(0) + a.car.fuel.slice(1).toLowerCase()}
                  </div>
                  <div className="mt-1 text-xs text-ink-400">
                    Ended {formatDate(a.endedAt)}
                  </div>
                </div>
                <div className="sm:w-56 sm:text-right">
                  {won ? (<>
                      <div className="tabular text-xl font-black text-ink-900">
                        {inr(a.soldPrice)}
                      </div>
                      <Badge tone="success" className="mt-1">
                        Sold to {a.winner?.name ?? "winner"}
                      </Badge>
                    </>) : (<>
                      <Badge tone="neutral">Reserve not met</Badge>
                    </>)}
                </div>
              </div>);
            })}
        </div>)}
    </div>);
}
