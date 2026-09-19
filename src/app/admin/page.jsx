import Link from "next/link";
import { getAdminStats } from "@/lib/queries";
import { settleEndedAuctions } from "@/lib/bidEngine";
import { prisma } from "@/lib/db";
import { inr, formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
export const metadata = { title: "Admin Overview" };
export default async function AdminPage() {
    await settleEndedAuctions();
    const stats = await getAdminStats();
    const endingSoon = await prisma.auction.findMany({
        where: { status: "LIVE" },
        orderBy: { endsAt: "asc" },
        take: 5,
        include: { car: true, _count: { select: { bids: true } } },
    });
    return (<div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Total revenue" value={inr(stats.revenue)} sub="from sold auctions" highlight/>
        <Stat label="Live auctions" value={String(stats.live)} sub="cars on the block now"/>
        <Stat label="Inventory" value={String(stats.cars)} sub="cars in the system"/>
        <Stat label="Auctions ended" value={String(stats.ended)} sub="published to results"/>
        <Stat label="Total bids" value={String(stats.bids)} sub="across all auctions"/>
        <Stat label="Registered users" value={String(stats.users)} sub="buyers & sellers"/>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="font-bold text-ink-900">Ending soonest</h2>
          <Button href="/admin/auctions" variant="outline" size="sm">
            Manage all auctions
          </Button>
        </div>
        {endingSoon.length === 0 ? (<div className="px-6 py-10 text-center text-sm text-ink-400">
            No live auctions right now. Create one from the inventory.
          </div>) : (<div className="divide-y divide-ink-100">
            {endingSoon.map((a) => (<div key={a.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <Link href={`/cars/${a.car.slug}`} className="min-w-0 truncate font-semibold text-ink-900 hover:text-brand-600">
                  {a.car.title}
                </Link>
                <span className="shrink-0 text-sm text-ink-400">
                  Ends {formatDateTime(a.endsAt)}
                </span>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone="accent">{a._count.bids} bids</Badge>
                  <span className="tabular w-28 text-right font-bold text-ink-900">
                    {inr(a.currentPrice || a.startBid)}
                  </span>
                </div>
              </div>))}
          </div>)}
      </div>
    </div>);
}
function Stat({ label, value, sub, highlight }) {
    return (<div className={`card p-5 ${highlight ? "border-brand-200 bg-brand-50/50" : ""}`}>
      <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</div>
      <div className="tabular mt-1.5 text-2xl font-black text-ink-900">{value}</div>
      <div className="mt-0.5 text-xs text-ink-500">{sub}</div>
    </div>);
}
