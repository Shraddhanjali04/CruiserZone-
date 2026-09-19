"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { placeBid } from "@/lib/actions/bids";
import { payDepositDemo } from "@/lib/actions/payments";
import { Countdown } from "@/components/ui/Countdown";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { inr } from "@/lib/utils";
export function BidPanel({ auctionId, carSlug, initial, user, hasDeposit }) {
    const router = useRouter();
    const [state, setState] = useState({
        id: auctionId,
        status: initial.status,
        currentPrice: initial.currentPrice,
        bidCount: initial.bidCount,
        endsAt: initial.endsAt,
        reserveMet: initial.reserveMet,
        topBid: initial.topBid ? { ...initial.topBid, at: "" } : null,
        winner: null,
        soldPrice: null,
        bids: [],
        carSlug,
    });
    const [amount, setAmount] = useState("");
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState(null);
    const [paying, setPaying] = useState(false);
    const pollTimer = useRef(null);
    const live = state.status === "LIVE";
    const minBid = useMemo(() => {
        const current = state.topBid?.amount ?? state.currentPrice ?? initial.startBid;
        const base = current + initial.increment;
        return Math.ceil(base / initial.increment) * initial.increment;
    }, [state.topBid, state.currentPrice, initial.startBid, initial.increment]);
    const refresh = useCallback(async () => {
        try {
            const res = await fetch(`/api/auctions/${auctionId}/live`, { cache: "no-store" });
            if (res.ok) {
                const data = (await res.json());
                setState((prev) => ({ ...prev, ...data }));
            }
        }
        catch {
            /* ignore transient polling errors */
        }
    }, [auctionId]);
    useEffect(() => {
        pollTimer.current = setInterval(refresh, 4000);
        return () => {
            if (pollTimer.current)
                clearInterval(pollTimer.current);
        };
    }, [refresh]);
    const endBusy = () => {
        setBusy(false);
    };
    async function submit(proposed) {
        const value = proposed ?? Number(amount);
        if (!Number.isFinite(value) || value <= 0) {
            setNotice({ kind: "error", text: "Enter a valid bid amount." });
            return;
        }
        setBusy(true);
        setNotice(null);
        const result = await placeBid(auctionId, value);
        if (result.error) {
            setNotice({ kind: "error", text: result.error });
            endBusy();
            return;
        }
        setNotice({
            kind: "success",
            text: result.extended
                ? `Bid placed! The clock extended by 2 minutes.`
                : `Bid of ${inr(value)} placed. You're the highest bidder.`,
        });
        setAmount("");
        await refresh();
        endBusy();
        router.refresh();
    }
    async function deposit() {
        setPaying(true);
        const result = await payDepositDemo();
        if (result.error)
            setNotice({ kind: "error", text: result.error });
        setPaying(false);
        router.refresh();
    }
    const isMyBid = state.topBid && state.topBid.bidderId === user?.id ? true : false;
    if (!live) {
        const won = !!state.winner;
        const reserveMet = state.reserveMet;
        return (<div className="card p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Auction result
              </div>
              <div className="mt-1 text-3xl font-black tabular text-ink-900">
                {state.soldPrice ? inr(state.soldPrice) : inr(state.currentPrice || initial.currentPrice)}
              </div>
            </div>
            <Badge tone={won ? "success" : "neutral"}>
              {won ? "Hammered — SOLD" : reserveMet ? "Reserve met" : "Reserve not met"}
            </Badge>
          </div>
          {won ? (<div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
              <span className="font-semibold">{state.winner}</span> won this
              auction
              {isMyBid && (<span className="font-semibold"> — that&apos;s you. 🎉</span>)}
            </div>) : (<div className="rounded-lg bg-ink-50 px-4 py-3 text-sm text-ink-600">
              The reserve was not met, so the car was not sold in this auction.
            </div>)}
          <div className="space-y-2">
            {state.bids.slice(0, 5).map((b, i) => (<BidRow key={i} amount={b.amount} bidder={b.bidder} isMine={user?.id === b.bidderId}/>))}
            {state.bids.length === 0 && (<p className="text-sm text-ink-400">No bids were placed.</p>)}
          </div>
        </div>
      </div>);
    }
    return (<div className="card overflow-hidden">
      <div className="border-b border-ink-100 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">
            Bidding closes in
          </div>
          <Badge tone="danger">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"/>
            LIVE
          </Badge>
        </div>
        <div className="mt-3">
          <Countdown endsAt={state.endsAt} size="lg"/>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Current highest bid
            </div>
            <div className="tabular mt-1 text-4xl font-black text-ink-900">
              {inr(state.topBid?.amount ?? state.currentPrice ?? initial.startBid)}
            </div>
            <div className="mt-1 text-sm text-ink-500">
              {state.bidCount} bid{state.bidCount === 1 ? "" : "s"} ·{" "}
              {isMyBid ? (<span className="font-semibold text-emerald-600">you&apos;re winning</span>) : state.topBid ? (<>highest: {state.topBid.bidder}</>) : ("no bids yet")}
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="text-ink-400">Increment</div>
            <div className="tabular font-bold text-ink-800">{inr(initial.increment)}</div>
          </div>
        </div>

        {initial.reservePrice > 0 && (<div className="flex items-center gap-2 rounded-lg bg-ink-50 px-3 py-2.5 text-sm">
            <span className={`h-2 w-2 rounded-full ${state.reserveMet ? "bg-emerald-500" : "bg-amber-400"}`}/>
            <span className="font-medium text-ink-700">
              {state.reserveMet ? "Reserve price met — sale confirmed once it ends." : "Reserve price not yet met."}
            </span>
          </div>)}

        {notice && (<div className={`rounded-lg px-3.5 py-2.5 text-sm font-medium ${notice.kind === "error"
                ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                : notice.kind === "success"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-ink-50 text-ink-700"}`}>
            {notice.text}
          </div>)}

        {!user && (<div className="rounded-lg border border-dashed border-ink-300 px-4 py-5 text-center">
            <p className="text-sm font-medium text-ink-700">
              Sign in to place your bid.
            </p>
            <div className="mt-3 flex justify-center gap-2">
              <Button href={`/login?next=/cars/${carSlug}`} size="sm">
                Sign in
              </Button>
              <Button href="/register" variant="outline" size="sm">
                Create account
              </Button>
            </div>
          </div>)}

        {user && !hasDeposit && (<div className="rounded-lg border border-dashed border-ink-300 px-4 py-4">
            <p className="text-sm font-medium text-ink-700">
              Pay the refundable bidding token to keep bidding.
            </p>
            <p className="mt-0.5 text-xs text-ink-500">
              ₹10,000 · returned in full if you don&apos;t win.
            </p>
            <Button size="sm" className="mt-3" onClick={deposit} disabled={paying}>
              {paying ? "Processing…" : "Pay ₹10,000 token"}
            </Button>
          </div>)}

        {user && hasDeposit && (<form onSubmit={(e) => {
                e.preventDefault();
                submit();
            }} className="space-y-3">
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="md" className="flex-1" onClick={() => submit(minBid)} disabled={busy}>
                {inr(minBid)}
              </Button>
              <Button type="button" variant="outline" size="md" className="flex-1" onClick={() => submit(minBid + initial.increment)} disabled={busy}>
                {inr(minBid + initial.increment)}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-ink-500">OR</span>
              <input type="number" inputMode="numeric" step={initial.increment} min={minBid} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Custom (min ${inr(minBid)})`} className="flex-1 rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm tabular text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"/>
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? "Placing bid…" : "Place bid"}
            </Button>
            <p className="text-center text-xs text-ink-400">
              Bids are binding. By bidding, you agree to our Terms of bidding &
              refund policy.
            </p>
          </form>)}

        <div className="border-t border-ink-100 pt-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-400">
            <span>Recent bids</span>
            <Link href={`/cars/${carSlug}#bids`} className="normal-case text-brand-600 hover:text-brand-700">
              Full history
            </Link>
          </div>
          <div className="space-y-1.5">
            {state.bids.slice(0, 5).map((b, i) => (<BidRow key={i} amount={b.amount} bidder={b.bidder} isMine={user?.id === b.bidderId}/>))}
            {state.bids.length === 0 && (<p className="text-sm text-ink-400">No bids yet. Bid {inr(minBid)} to open.</p>)}
          </div>
        </div>
      </div>
    </div>);
}
function BidRow({ amount, bidder, isMine }) {
    return (<div className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2 text-sm">
      <span className="flex items-center gap-2 font-medium text-ink-700">
        <span className="h-1.5 w-1.5 rounded-full bg-brand-500"/>
        {bidder}
        {isMine && <Badge tone="success">You</Badge>}
      </span>
      <span className="tabular font-bold text-ink-900">{inr(amount)}</span>
    </div>);
}
