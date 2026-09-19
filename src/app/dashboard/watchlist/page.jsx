import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserWatchlist } from "@/lib/queries";
import { inr, timeAgo, readJsonArray } from "@/lib/utils";
import Image from "next/image";
import { Countdown } from "@/components/ui/Countdown";
import { Badge } from "@/components/ui/Badge";
import { WatchButton } from "@/components/WatchButton";
export const metadata = { title: "Watchlist" };
export default async function WatchlistPage() {
    const session = await getSession();
    if (!session)
        redirect("/login?next=/dashboard/watchlist");
    const watchlist = await getUserWatchlist(session.id);
    return (<div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-ink-900">Watchlist</h1>
        <p className="mt-0.5 text-sm text-ink-500">
          {watchlist.length} car{watchlist.length === 1 ? "" : "s"} you&apos;re following
        </p>
      </div>

      {watchlist.length === 0 ? (<div className="card px-6 py-16 text-center text-ink-500">
          <div className="text-4xl">💛</div>
          <p className="mt-3 font-medium text-ink-700">Nothing saved yet</p>
          <p className="mt-1 text-sm">
            Tap the heart on any listing to track it here.
          </p>
        </div>) : (<div className="grid gap-4 sm:grid-cols-2">
          {watchlist.map((w) => {
                const a = w.car.auctions[0];
                const img = (readJsonArray(w.car.images)[0]) ?? "/cars/cz-001.svg";
                return (<div key={w.carId} className="card flex gap-4 p-4">
                <Link href={`/cars/${w.car.slug}`} className="relative block h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                  <Image src={img} alt={w.car.title} fill sizes="144px" className="object-cover"/>
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/cars/${w.car.slug}`} className="line-clamp-1 font-bold text-ink-900 hover:text-brand-600">
                    {w.car.title}
                  </Link>
                  <div className="mt-0.5 text-xs text-ink-500">
                    {w.car.kmDriven.toLocaleString("en-IN")} km ·{" "}
                    {w.car.fuel.charAt(0) + w.car.fuel.slice(1).toLowerCase()}
                  </div>
                  {a ? (<div className="mt-2 flex items-center justify-between gap-2">
                      {a.status === "LIVE" ? (<>
                          <div className="tabular text-sm font-bold text-ink-900">
                            {inr(a.currentPrice)}
                          </div>
                          <Countdown endsAt={a.endsAt} size="sm" compact/>
                        </>) : a.status === "ENDED" ? (<Badge tone="neutral">Auction ended</Badge>) : (<Badge tone="accent">Scheduled</Badge>)}
                    </div>) : (<div className="mt-2 text-xs text-ink-400">No auction yet</div>)}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-ink-400">Added {timeAgo(w.createdAt)}</span>
                    <WatchButton carId={w.car.id} initialWatching showLabel={false}/>
                  </div>
                </div>
              </div>);
            })}
        </div>)}
    </div>);
}
