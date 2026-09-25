import { Button } from "@/components/ui/Button";
export const metadata = { title: "How it Works" };
const STEPS = [
    {
        n: "01",
        title: "Create a free account",
        desc: "Register with your name, email and mobile number. Two minutes, no spam.",
        extra: [
            "Verify your mobile number with an OTP",
            "Optionally complete KYC (PAN/Aadhaar) for faster checkout",
        ],
    },
    {
        n: "02",
        title: "Pay the refundable bidding token",
        desc: "Place a ₹10,000 refundable token to unlock bidding. It is returned in full if you don't win, or adjusted against the winning price.",
        extra: ["UPI, cards, netbanking supported", "Instant refund to source within 3–5 working days"],
    },
    {
        n: "03",
        title: "Explore certified cars",
        desc: "Browse live auctions and filter by brand, budget, fuel, body type or city. Every car carries a 220-point inspection report and verified ownership history.",
        extra: ["Watch any car to get updates", "Spotless history with no accidents, floods or odometer tampering"],
    },
    {
        n: "04",
        title: "Bid in real time",
        desc: "Each auction has a hidden reserve and a clear minimum increment. Place a manual bid or use quick-bid buttons. Every new bid extends the clock if it lands inside the final 60 seconds",
        extra: [
            "Minimum bid = current highest bid + one increment",
            "Bids are binding once placed",
            "You'll be notified the moment you're outbid",
        ],
        note: "⚠ Anti-sniping: a bid in the last 60 seconds adds 2 extra minutes.",
    },
    {
        n: "05",
        title: "Win and take delivery",
        desc: "When the clock hits zero, the highest bid that met the reserve wins. Pay online, sign the handover, and complete the RC transfer with our paperwork team.",
        extra: [
            "Free RC transfer assistance",
            "Full vehicle delivery or pickup from your city",
            "3-day money-back inspection option on delivery",
        ],
    },
];
const RULES = [
    ["Hidden reserve", "Every car has a reserve set by CruiserZone. A bid only wins if reserve is met."],
    ["Bid increments", "New bids must be at least ₹10,000–₹20,000 above the current highest bid (shown on each listing)."],
    ["Anti-sniping", "Bids placed in the final 60 seconds extend the auction by 2 minutes to keep it fair."],
    ["Binding bids", "Placing a bid is a legally binding commitment to buy if you win."],
    ["Buyer fees", "Zero fees for buyers. The hammer price is the full price."],
    ["Refunds", "The bidding token is fully refundable once you have no active bids."],
];
export default function HowItWorksPage() {
    return (<div className="container-site py-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-black tracking-tight text-ink-900">
          How CruiserZone bidding works
        </h1>
        <p className="mt-3 text-lg text-ink-500">
          A fair, transparent way to buy a certified pre-owned car, with clear rules
          everyone can see.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-3xl space-y-8">
        {STEPS.map((s) => (<div key={s.n} className="card relative p-6 sm:p-8">
            <div className="text-4xl font-black text-brand-100">{s.n}</div>
            <h2 className="-mt-3 text-xl font-bold text-ink-900">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-ink-600">{s.desc}</p>
            {s.note && (<p className="mt-3 rounded-lg bg-amber-50 px-3.5 py-2.5 text-sm font-medium text-amber-800 ring-1 ring-amber-200">
                {s.note}
              </p>)}
            {s.extra && s.extra.length > 0 && (<ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {s.extra.map((e) => (<li key={e} className="flex items-start gap-2 text-sm text-ink-600">
                    <svg className="mt-0.5 shrink-0 text-emerald-600" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    {e}
                  </li>))}
              </ul>)}
          </div>))}
      </div>

      <div className="mx-auto mt-14 max-w-4xl">
        <h2 className="text-center text-2xl font-black tracking-tight text-ink-900">
          Auction rules
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RULES.map(([t, d]) => (<div key={t} className="card p-5">
              <h3 className="font-bold text-ink-900">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{d}</p>
            </div>))}
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-3xl rounded-2xl bg-ink-950 p-8 text-center text-white">
        <h2 className="text-2xl font-black">Ready to place your first bid?</h2>
        <p className="mt-2 text-ink-300">Join free and start watching live auctions.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href="/register" size="lg">Create account</Button>
          <Button href="/listings" size="lg" variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10">
            Browse auctions
          </Button>
        </div>
      </div>
    </div>);
}
