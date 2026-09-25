import Link from "next/link";
import { getFeaturedAuctions, getLiveAuctions } from "@/lib/queries";
import { CarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
const TRUST = [
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>),
        title: "220-point inspection",
        desc: "Every car is physically checked and re-verified before it goes live.",
    },
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>),
        title: "History verified",
        desc: "RC, insurance and ownership history checked against records.",
    },
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>),
        title: "Refundable token",
        desc: "Pay a small deposit to bid. Fully refundable if you don't win.",
    },
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/></svg>),
        title: "No renegotiation",
        desc: "The highest genuine bid wins. Transparent, zero haggling.",
    },
];
export default async function HomePage() {
    const [featured, live] = await Promise.all([
        getFeaturedAuctions(4),
        getLiveAuctions({ take: 4 }),
    ]);
    const heroCars = featured.length >= 4 ? featured : live.slice(0, 4);
    return (<div>
      {/* Hero */}
      <section className="bg-ink-950 text-white">
        <div className="container-site grid gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <Badge tone="accent" className="[&>span]:bg-transparent">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500"/>
                {live.length} cars live right now
              </Badge>
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Bid on certified pre-owned cars.{" "}
              <span className="text-brand-400">No haggling.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-300">
              CruiserZone runs live timed auctions on inspected, verified used
              cars across India. Watch the countdown, place your bid, and drive
              away at the price you set. Never a rupee more.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/listings" size="lg">
                Browse live auctions
              </Button>
              <Button href="/how-it-works" variant="outline" size="lg" className="border-white/25 bg-transparent text-white hover:bg-white/10 hover:border-white/40">
                See how it works
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-400">
              <div>
                <span className="text-2xl font-black text-white">₹4 Cr+</span>
                <div className="mt-0.5">cars sold to date</div>
              </div>
              <div>
                <span className="text-2xl font-black text-white">9 cities</span>
                <div className="mt-0.5">across India</div>
              </div>
              <div>
                <span className="text-2xl font-black text-white">220-pt</span>
                <div className="mt-0.5">certification</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {heroCars.map((a, i) => (<Link key={a.id} href={`/cars/${a.car.slug}`} className={`group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10 ${i % 3 === 0 ? "row-span-2" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={JSON.parse(a.car.images)[0]} alt={a.car.title} className={`w-full object-cover ${i % 3 === 0 ? "h-44 sm:h-full" : "h-28 sm:h-32"}`}/>
                <div className="p-3">
                  <div className="line-clamp-1 text-sm font-bold">{a.car.title}</div>
                  <div className="tabular mt-1 text-brand-400">
                    ₹{(a.currentPrice || a.startBid).toLocaleString("en-IN")}
                  </div>
                </div>
              </Link>))}
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="border-b border-ink-200 bg-white">
        <div className="container-site grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (<div key={t.title} className="flex gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                {t.icon}
              </div>
              <div>
                <div className="font-semibold text-ink-900">{t.title}</div>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{t.desc}</p>
              </div>
            </div>))}
        </div>
      </section>

      {/* Live auctions */}
      <section className="container-site py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">
              Live auctions
            </h2>
            <p className="mt-1 text-ink-500">
              Timed auctions ending soon. Bid before the clock runs out.
            </p>
          </div>
          <Button href="/listings" variant="outline" size="sm">
            View all
          </Button>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {live.map((a) => (<CarCard key={a.id} auction={a}/>))}
        </div>
      </section>

      {/* How it works preview */}
      <section className="bg-ink-950 text-white">
        <div className="container-site py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                How bidding works
              </h2>
              <p className="mt-1 text-ink-400">
                From inspection to the winning gavel in four steps.
              </p>
            </div>
            <Button href="/how-it-works" variant="outline" size="sm" className="border-white/25 bg-transparent text-white hover:bg-white/10">
              Full guide
            </Button>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
            ["01", "Find your car", "Filter live auctions by budget, brand, fuel and city. Every listing carries its full 220-point inspection report and ownership history."],
            ["02", "Pay the token", "Place a small, refundable deposit to unlock bidding. It's returned in full if you don't win."],
            ["03", "Bid in real time", "Place manual or auto bids with a hidden max. Watch the countdown and stay ahead until the final seconds."],
            ["04", "Win & drive away", "Highest bid wins when the clock hits zero. Pay, collect your RC, and drive home your certified car."],
        ].map(([n, t, d]) => (<div key={n} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-3xl font-black text-brand-400">{n}</div>
                <h3 className="mt-4 font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{d}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-site py-16">
        <div className="card flex flex-col items-start gap-6 bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Buying a car shouldn&apos;t be a negotiation.
            </h2>
            <p className="mt-2 max-w-xl text-white/90">
              Create a free account, complete your KYC, and you&apos;re ready to bid
              on your next certified pre-owned car.
            </p>
          </div>
          <Button href="/register" size="lg" className="bg-white text-brand-600 hover:bg-ink-50">
            Join free and start bidding
          </Button>
        </div>
      </section>
    </div>);
}
