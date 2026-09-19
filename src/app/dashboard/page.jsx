import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getActiveBids, getDepositBalance, getUserWatchlist, getUserBids, } from "@/lib/queries";
import { settleEndedAuctions } from "@/lib/bidEngine";
import { inr, timeAgo } from "@/lib/utils";
import { Countdown } from "@/components/ui/Countdown";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
export const metadata = { title: "Dashboard" };
export default async function DashboardOverview() {
    const session = await getSession();
    if (!session)
        redirect("/login?next=/dashboard");
    await settleEndedAuctions();
    const [activeBids, watchlist, wallet, allBids] = await Promise.all([
        getActiveBids(session.id),
        getUserWatchlist(session.id),
        getDepositBalance(session.id),
        getUserBids(session.id),
    ]);
    const won = allBids.filter((b) => b.auction.status === "ENDED" && b.auction.winnerId === session.id).length;
    const liveCount = allBids.filter((b) => b.auction.status === "LIVE").length;
    const leading = activeBids.filter((b) => b.auction.bids[0]?.userId === session.id).length;
    return (<div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active bids" value={String(liveCount)} sub={`${leading} you're leading`}/>
        <Stat label="Auctions won" value={String(won)} sub={won > 0 ? "Congratulations 🎉" : "Keep bidding"}/>
        <Stat label="Watching" value={String(watchlist.length)} sub="cars on your radar"/>
        <Stat label="Token balance" value={inr(wallet)} sub="refundable"/>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink-900">Your live bids</h2>
            <Link href="/dashboard/bids" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          {activeBids.length === 0 ? (<div className="mt-4 rounded-lg border border-dashed border-ink-200 px-4 py-8 text-center text-sm text-ink-400">
              <p>No active bids right now.</p>
              <Button href="/listings" variant="outline" size="sm" className="mt-3">
                Browse live auctions
              </Button>
            </div>) : (<ul className="mt-4 space-y-3">
              {activeBids.slice(0, 4).map((b) => {
                const auct = b.auction;
                const top = auct.bids[0];
                const leading = top?.userId === session.id;
                return (<li key={b.id}>
                    <Link href={`/cars/${auct.car.slug}`} className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 p-3 transition hover:border-brand-300">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-ink-900">
                          {auct.car.title}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-500">
                          <span className="tabular">Your bid: {inr(b.amount)}</span>
                          <Badge tone={leading ? "success" : "danger"}>
                            {leading ? "Leading" : "Outbid"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Countdown endsAt={auct.endsAt} size="sm" compact/>
                      </div>
                    </Link>
                  </li>);
            })}
            </ul>)}
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink-900">Watchlist</h2>
            <Link href="/dashboard/watchlist" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>
          {watchlist.length === 0 ? (<div className="mt-4 rounded-lg border border-dashed border-ink-200 px-4 py-8 text-center text-sm text-ink-400">
              Watch cars to get updates before the clock closes.
              <div className="mt-3">
                <Button href="/listings" variant="outline" size="sm">
                  Explore now
                </Button>
              </div>
            </div>) : (<ul className="mt-4 space-y-3">
              {watchlist.slice(0, 4).map((w) => {
                const auct = w.car.auctions[0];
                return (<li key={w.carId}>
                    <Link href={`/cars/${w.car.slug}`} className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 p-3 transition hover:border-brand-300">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-ink-900">
                          {w.car.title}
                        </div>
                        <div className="mt-0.5 text-xs text-ink-500">
                          {auct?.status === "LIVE" ? (<span className="text-emerald-600">Live now</span>) : auct?.status === "ENDED" ? ("Auction ended") : ("Scheduled")}{" "}
                          · added {timeAgo(w.createdAt)}
                        </div>
                      </div>
                      {auct && auct.status === "LIVE" && (<Countdown endsAt={auct.endsAt} size="sm" compact/>)}
                    </Link>
                  </li>);
            })}
            </ul>)}
        </section>
      </div>
    </div>);
}
function Stat({ label, value, sub }) {
    return (<div className="card p-5">
      <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
        {label}
      </div>
      <div className="tabular mt-1.5 text-2xl font-black text-ink-900">{value}</div>
      <div className="mt-0.5 text-xs text-ink-500">{sub}</div>
    </div>);
}
