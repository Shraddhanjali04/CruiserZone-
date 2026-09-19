import { getBidders } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { approveKyc } from "@/lib/actions/admin";
export const metadata = { title: "Bidders & KYC" };
export default async function BiddersPage() {
    const users = await getBidders();
    const tone = (s) => s === "APPROVED" ? "success" : s === "REJECTED" ? "danger" : s === "SUBMITTED" ? "warning" : "neutral";
    return (<div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-ink-900">Bidders & KYC</h1>
        <p className="mt-0.5 text-sm text-ink-500">
          {users.length} registered user{users.length === 1 ? "" : "s"} — approve identity documents.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">KYC</th>
                <th className="px-4 py-3 font-semibold">Document</th>
                <th className="px-4 py-3 font-semibold">Bids</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {users.map((u) => (<tr key={u.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink-900">{u.name}</div>
                    <div className="text-xs text-ink-400">
                      {u.email} · <span className="tabular">{u.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={u.role === "ADMIN" ? "dark" : "neutral"}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(u.kycStatus)}>{u.kycStatus}</Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-600">
                    {u.kycType ? (<>
                        {u.kycType}
                        <div className="tabular text-xs text-ink-400">{u.kycNumber}</div>
                      </>) : ("—")}
                  </td>
                  <td className="px-4 py-3 text-ink-600">{u._count.bids}</td>
                  <td className="px-4 py-3 text-ink-600">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    {u.kycStatus === "SUBMITTED" ? (<div className="flex justify-end gap-1.5">
                        <form action={async () => {
                "use server";
                await approveKyc(u.id, true);
            }}>
                          <button className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100">
                            Approve
                          </button>
                        </form>
                        <form action={async () => {
                "use server";
                await approveKyc(u.id, false);
            }}>
                          <button className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-100">
                            Reject
                          </button>
                        </form>
                      </div>) : (<div className="text-right text-xs text-ink-400">—</div>)}
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
