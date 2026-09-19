import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserTransactions, getDepositBalance } from "@/lib/queries";
import { inr, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { payDepositDemo, requestRefund } from "@/lib/actions/payments";
import { DEPOSIT_AMOUNT } from "@/lib/constants";
export const metadata = { title: "Wallet & Refunds" };
export default async function WalletPage() {
    const session = await getSession();
    if (!session)
        redirect("/login?next=/dashboard/wallet");
    const [txns, balance] = await Promise.all([
        getUserTransactions(session.id),
        getDepositBalance(session.id),
    ]);
    const tone = (s) => s === "SUCCESS" ? "success" : s === "REFUNDED" ? "neutral" : "warning";
    return (<div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Refundable token balance
          </div>
          <div className="tabular mt-2 text-3xl font-black text-ink-900">
            {inr(balance)}
          </div>
          <p className="mt-1 text-sm text-ink-500">
            Paid once as ₹{DEPOSIT_AMOUNT.toLocaleString("en-IN")}. Refunded when
            you have no active bids.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {balance === 0 && (<form action={async () => {
                "use server";
                await payDepositDemo();
            }}>
                <Button size="sm">Pay ₹{DEPOSIT_AMOUNT.toLocaleString("en-IN")} token</Button>
              </form>)}
            {balance > 0 && (<form action={async () => {
                "use server";
                await requestRefund();
            }}>
                <Button variant="outline" size="sm">
                  Request full refund
                </Button>
              </form>)}
          </div>
        </div>

        <div className="card p-6">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Refund policy
          </div>
          <ul className="mt-3 space-y-2 text-sm text-ink-600">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"/>
              Token refunds once all your auctions have ended.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"/>
              Refund to the original payment method within 3–5 working days.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"/>
              If you win and don&apos;t pay, the token is forfeited.
            </li>
          </ul>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-ink-100 px-6 py-4">
          <h2 className="font-bold text-ink-900">Transaction history</h2>
        </div>
        {txns.length === 0 ? (<div className="px-6 py-12 text-center text-sm text-ink-400">
            No transactions yet.
          </div>) : (<div className="divide-y divide-ink-100">
            {txns.map((t) => (<div key={t.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                    {t.type === "DEPOSIT" && "Bidding token"}
                    {t.type === "REFUND" && "Token refund"}
                    {t.type === "WINNING_PAYMENT" && "Winning payment"}
                    {t.note && <span className="max-w-52 truncate font-normal text-ink-400">· {t.note}</span>}
                  </div>
                  <div className="mt-0.5 text-xs text-ink-400">
                    {formatDateTime(t.createdAt)} · {t.gateway ?? "Gateway"} ·{" "}
                    <span className="tabular">{t.gatewayRef ?? t.id.slice(-6)}</span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Badge tone={tone(t.status)}>
                    {t.status.charAt(0) + t.status.slice(1).toLowerCase()}
                  </Badge>
                  <span className={`tabular w-28 text-right font-bold ${t.type === "REFUND" ? "text-emerald-600" : "text-ink-900"}`}>
                    {inr(t.amount)}
                  </span>
                </div>
              </div>))}
          </div>)}
      </div>
    </div>);
}
