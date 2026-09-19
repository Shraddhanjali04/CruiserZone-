import { Button } from "@/components/ui/Button";
export const metadata = { title: "About Us" };
const VALUES = [
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>),
        title: "Trust over talk",
        desc: "Every car is physically inspected and its history verified before it earns a certified badge.",
    },
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>),
        title: "Radical transparency",
        desc: "Reserve prices, bid history and final hammer prices are all public. No hidden games.",
    },
    {
        icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
        title: "People first",
        desc: "Honest cars for real families. Our engineers, not marketers, sign off on every sale.",
    },
];
export default function AboutPage() {
    return (<div>
      <section className="bg-ink-950 text-white">
        <div className="container-site grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-brand-400">
              CruiserZone Pvt Ltd
            </div>
            <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              India&apos;s most transparent marketplace for certified pre-owned cars
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-300">
              CruiserZone was built because buying a used car in India shouldn&apos;t
              be a battle of trust. We inspect every car, verify every history,
              and let the market — not a salesperson — decide the price.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
            ["2019", "Founded in Mumbai"],
            ["4,000+", "Cars auctioned"],
            ["9", "Cities served"],
            ["₹4 Cr+", "Sold to date"],
        ].map(([n, l]) => (<div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <div className="text-3xl font-black text-brand-400">{n}</div>
                <div className="mt-1 text-sm text-ink-400">{l}</div>
              </div>))}
          </div>
        </div>
      </section>

      <section className="container-site py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-black tracking-tight text-ink-900">
            Why we use auctions
          </h2>
          <p className="mt-4 leading-relaxed text-ink-600">
            A used car is worth exactly what someone is willing to pay for it on
            a given day. Fixed prices are guesswork dressed up as authority.
            Live auctions surface a car&apos;s true market value in real time —
            while the countdown guarantees every listing sells in days, not
            months. Sellers get speed and a fair price. Buyers get certainty and
            zero haggling.
          </p>
          <p className="mt-4 leading-relaxed text-ink-600">
            The bidding token keeps participation serious, the anti-sniping rule
            keeps the end fair, and the public results page keeps every sale
            accountable.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (<div key={v.title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                {v.icon}
              </div>
              <h3 className="mt-4 font-bold text-ink-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{v.desc}</p>
            </div>))}
        </div>
      </section>

      <section className="container-site pb-16">
        <div className="card flex flex-col items-start gap-6 bg-gradient-to-br from-ink-900 to-ink-950 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Want to sell with CruiserZone?</h2>
            <p className="mt-2 max-w-xl text-ink-300">
              List your car for auction and let the market decide. Free
              inspection, no listing fee, payout within a week of the hammer.
            </p>
          </div>
          <Button href="/sell" size="lg" className="bg-white text-ink-900 hover:bg-ink-100">
            Sell your car
          </Button>
        </div>
      </section>
    </div>);
}
