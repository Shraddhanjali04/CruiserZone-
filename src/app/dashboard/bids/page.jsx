import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserBids } from "@/lib/queries";
import { inr, formatDateTime } from "@/lib/utils";
import { Countdown } from "@/components/ui/Countdown";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { completeWinningPayment } from "@/lib/actions/payments";
import { settleEndedAuctions } from "@/lib/bidEngine";
export const metadata = { title: "My Bids" };
export default async function BidsPage({ searchParams, }) {
    const session = await getSession();
    if (!session)
        redirect("/login?next=/dashboard/bids");
    const { paid } = await searchParams;
    await settleEndedAuctions();
    const bids = await getUserBids(session.id);
    // Group by auction, keep highest bid
    const byAuction = new Map();
    for (const b of bids) {
        const ex = byAuction.get(b.auctionId);
        if (!ex)
            byAuction.set(b.auctionId, { auction: b.auction, highestBid: b.amount, count: 1 });
        else {
            ex.highestBid = Math.max(ex.highestBid, b.amount);
            ex.count += 1;
        }
    }
    const rows = [...byAuction.values()];
    return (<div className="space-y-5">
      {paid && (<div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
          Payment recorded. Our team will contact you for delivery & RC transfer. 🎉
        </div>)}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-ink-900">My bids</h1>
          <p className="mt-0.5 text-sm text-ink-500">
            {bids.length} total bid{bids.length === 1 ? "" : "s"} across {rows.length} auction{rows.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (<div className="card px-6 py-16 text-center text-ink-500">
          <div className="text-4xl">🔨</div>
          <p className="mt-3 font-medium text-ink-700">You haven&apos;t placed any bids yet</p>
          <Button href="/listings" className="mt-4">
            Find your car
          </Button>
        </div>) : (<div className="space-y-4">
          {rows.map((r) => {
                const a = r.auction;
                const top = a.bids[0];
                const winning = a.status === "ENDED" && a.winnerId === session.id;
                const leading = a.status === "LIVE" && top?.userId === session.id;
                const paidFor = !!a.winnerId && a.winnerId === session.id;
                return (<div key={a.id} className="card p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/cars/${a.car.slug}`} className="truncate font-bold text-ink-900 hover:text-brand-600">
                        {a.car.title}
                      </Link>
                      {winning && <Badge tone="success">Won 🎉</Badge>}
                      {a.status === "LIVE" && (<Badge tone="danger">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"/>
                          LIVE
                        </Badge>)}
                      {a.status === "ENDED" && !winning && <Badge tone="neutral">Ended</Badge>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-500">
                      <span>
                        Your highest bid:{" "}
                        <span className="font-semibold text-ink-800 tabular">{inr(r.highestBid)}</span>
                      </span>
                      <span>
                        Current:{" "}
                        <span className="font-semibold text-ink-800 tabular">
                          {inr(a.currentPrice)}
                        </span>
                      </span>
                      <span>{r.count} bid{r.count > 1 ? "s" : ""} placed</span>
                    </div>
                    <div className="mt-1 text-xs text-ink-400">
                      {a.startsAt && formatDateTime(a.startsAt)} → {a.endsAt && formatDateTime(a.endsAt)}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {a.status === "LIVE" && (<div className="text-right">
                        <div className="text-xs text-ink-400">Ends in</div>
                        <Countdown endsAt={a.endsAt} compact className="text-base"/>
                      </div>)}
                    {a.status === "LIVE" && (<Button href={`/cars/${a.car.slug}`} variant="outline" size="sm">
                        {leading ? "Leading" : "Bid again"}
                      </Button>)}
                    {winning && (<form action={async () => {
                            "use server";
                            await completeWinningPayment(a.id);
                        }}>
                        <Button type="submit" size="sm" disabled={paidFor}>
                          {paidFor ? "Pay" : "Pay final amount"} · {inr(a.soldPrice ?? a.currentPrice)}
                        </Button>
                      </form>)}
                  </div>
                </div>
              </div>);
            })}
        </div>)}
    </div>);
}
