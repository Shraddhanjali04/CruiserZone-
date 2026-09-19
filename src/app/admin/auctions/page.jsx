import Link from "next/link";
import { getAdminAuctions } from "@/lib/queries";
import { inr, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { updateAuctionControl } from "@/lib/actions/admin";
export const metadata = { title: "Auctions" };
export default async function AdminAuctionsPage() {
    const auctions = await getAdminAuctions();
    const tone = (s) => s === "LIVE" ? "success" : s === "ENDED" ? "accent" : s === "CANCELLED" ? "danger" : "warning";
    return (<div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-ink-900">Auctions</h1>
        <p className="mt-0.5 text-sm text-ink-500">
          {auctions.length} auction{auctions.length === 1 ? "" : "s"} — start,
          end or cancel from here.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3 font-semibold">Car</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Current</th>
                <th className="px-4 py-3 font-semibold">Bids</th>
                <th className="px-4 py-3 font-semibold">Ends</th>
                <th className="px-4 py-3 font-semibold">Winner</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {auctions.map((a) => (<tr key={a.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <Link href={`/cars/${a.car.slug}`} className="font-semibold text-ink-900 hover:text-brand-600">
                      {a.car.title}
                    </Link>
                    <div className="text-xs text-ink-400">
                      Start {inr(a.startBid)} · Reserve {a.reservePrice > 0 ? inr(a.reservePrice) : "none"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(a.status)}>{a.status}</Badge>
                  </td>
                  <td className="tabular px-4 py-3 font-bold text-ink-900">{inr(a.currentPrice || a.startBid)}</td>
                  <td className="px-4 py-3 text-ink-600">{a._count.bids}</td>
                  <td className="px-4 py-3 text-ink-600">{formatDateTime(a.endsAt)}</td>
                  <td className="px-4 py-3 text-ink-600">{a.winner?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1.5">
                      {a.status === "LIVE" && (<form action={async () => {
                "use server";
                await updateAuctionControl(a.id, "END");
            }}>
                          <button className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100">
                            End
                          </button>
                        </form>)}
                      {a.status === "SCHEDULED" && (<form action={async () => {
                "use server";
                await updateAuctionControl(a.id, "START");
            }}>
                          <button className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                            Start
                          </button>
                        </form>)}
                      {(a.status === "LIVE" || a.status === "SCHEDULED") && (<form action={async () => {
                "use server";
                await updateAuctionControl(a.id, "CANCEL");
            }}>
                          <button className="rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600 hover:bg-ink-200">
                            Cancel
                          </button>
                        </form>)}
                      <Link href={`/admin/cars/${a.carId}/edit`} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-brand-600 hover:bg-brand-50">
                        Manage
                      </Link>
                    </div>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
