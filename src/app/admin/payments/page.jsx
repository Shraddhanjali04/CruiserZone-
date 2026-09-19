import { getAdminTransactions } from "@/lib/queries";
import { inr, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { markRefunded } from "@/lib/actions/admin";
export const metadata = { title: "Payments" };
export default async function PaymentsPage() {
    const txns = await getAdminTransactions();
    const tone = (s) => s === "SUCCESS" ? "success" : s === "FAILED" ? "danger" : s === "REFUNDED" ? "neutral" : "warning";
    return (<div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-ink-900">Payments</h1>
        <p className="mt-0.5 text-sm text-ink-500">
          Deposits, refunds and winning payments from the payment gateway.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Gateway ref</th>
                <th className="px-4 py-3 font-semibold">Paid at</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {txns.map((t) => (<tr key={t.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink-900">{t.user.name}</div>
                    <div className="text-xs text-ink-400">{t.user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{t.type.replace("_", " ")}</td>
                  <td className="tabular px-4 py-3 font-bold text-ink-900">
                    {t.type === "REFUND" ? "+" : ""}{inr(t.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={tone(t.status)}>{t.status}</Badge>
                  </td>
                  <td className="tabular px-4 py-3 text-xs text-ink-500">{t.gatewayRef ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-600">{formatDateTime(t.paidAt)}</td>
                  <td className="px-4 py-3 text-right">
                    {t.status === "SUCCESS" && t.type === "REFUND" && (<form action={async () => {
                "use server";
                await markRefunded(t.id);
            }}>
                        <button className="rounded-lg bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600 hover:bg-ink-200">
                          Mark refunded
                        </button>
                      </form>)}
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
