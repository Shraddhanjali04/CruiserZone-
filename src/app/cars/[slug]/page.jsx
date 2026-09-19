import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAuctionBySlug } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { readJsonArray, inr, formatDate } from "@/lib/utils";
import { BidPanel } from "@/components/BidPanel";
import { WatchButton } from "@/components/WatchButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CONDITION_CHECKPOINTS } from "@/lib/constants";
export const metadata = { title: "Car Details" };
export default async function CarPage({ params, }) {
    const { slug } = await params;
    const [car, session] = await Promise.all([
        getAuctionBySlug(slug),
        getSession(),
    ]);
    if (!car)
        notFound();
    const auction = car.auctions[0];
    const images = readJsonArray(car.images);
    const conditionKeys = readJsonArray(car.conditionKeys);
    const hasDeposit = !!session
        ? !!(await prisma.transaction.findFirst({
            where: { userId: session.id, type: "DEPOSIT", status: "SUCCESS" },
        }))
        : false;
    const watching = !!session
        ? await prisma.watchlist.findUnique({
            where: { userId_carId: { userId: session.id, carId: car.id } },
        })
        : null;
    const live = auction && auction.status === "LIVE";
    const topBid = auction?.bids[0] ?? null;
    const bidCount = auction
        ? await prisma.bid.count({ where: { auctionId: auction.id } })
        : 0;
    const specs = [
        ["Year", car.year],
        ["Kilometres driven", `${car.kmDriven.toLocaleString("en-IN")} km`],
        ["Fuel type", car.fuel.charAt(0) + car.fuel.slice(1).toLowerCase()],
        ["Transmission", car.transmission],
        ["Ownership", `${car.ownership === 1 ? "1st" : `${car.ownership}nd`} owner`],
        ["Colour", car.colour],
        ["Body type", car.bodyType],
        ["Seats", car.seats],
        ["Engine", car.engineCc ? `${car.engineCc} cc` : "—"],
        ["RTO / city", car.rto ? `${car.rto} · ${car.city}` : car.city ?? "—"],
        ["Registration", car.registrationNumber ?? "—"],
        ["Insurance valid till", formatDate(car.insuranceValidTill)],
        ["Last service", car.lastServiceKm ? `${car.lastServiceKm.toLocaleString("en-IN")} km` : "—"],
        ["VIN", car.vin ? `<span class="tabular">${car.vin}</span>` : "—"],
        ["Source", car.source === "CONSIGNED" ? "Consigned by owner" : "CruiserZone stock"],
    ];
    return (<div className="container-site py-8">
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-ink-400">
        <Link href="/" className="hover:text-ink-600">Home</Link>
        <span>/</span>
        <Link href="/listings" className="hover:text-ink-600">Auctions</Link>
        <span>/</span>
        <span className="text-ink-700">{car.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left column */}
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="relative aspect-[16/10] sm:aspect-[16/9]">
              <Image src={images[0] ?? "/cars/cz-001.svg"} alt={car.title} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover"/>
              <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                {car.certified && <Badge tone="dark">Certified</Badge>}
                {car.featured && <Badge tone="accent">Featured</Badge>}
                {live && (<Badge tone="danger">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"/>
                    LIVE
                  </Badge>)}
              </div>
              {car.inspectionScore > 0 && (<div className="absolute bottom-4 right-4 rounded-xl bg-ink-950/85 px-3.5 py-2 text-center text-white backdrop-blur">
                  <div className="text-xl font-black text-emerald-400">{car.inspectionScore}/100</div>
                  <div className="text-[11px] uppercase tracking-wide text-ink-300">Inspection score</div>
                </div>)}
            </div>
            {images.length > 1 && (<div className="grid grid-cols-4 gap-2 p-2">
                {images.map((img, i) => (<div key={i} className={`relative aspect-[16/10] overflow-hidden rounded-lg ${i === 0 ? "ring-2 ring-brand-500" : ""}`}>
                    <Image src={img} alt={`${car.title} ${i + 1}`} fill sizes="200px" className="object-cover"/>
                  </div>))}
              </div>)}
          </div>

          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">
                  {car.title}
                </h1>
                <p className="mt-1 text-ink-500">
                  {car.bodyType} · {car.city ?? "India"}
                  {car.source === "CONSIGNED" && (<span className="ml-2 text-ink-400">· Consigned</span>)}
                </p>
              </div>
              {session ? (<WatchButton carId={car.id} initialWatching={!!watching}/>) : (<Button href="/login" variant="outline" size="sm">
                  Sign in to watch
                </Button>)}
            </div>

            {car.description && (<p className="mt-5 leading-relaxed text-ink-600">{car.description}</p>)}

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {specs.map(([label, value]) => (<div key={label} className="border-b border-ink-100 pb-2.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    {label}
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-ink-800" dangerouslySetInnerHTML={typeof value === "string" && value.startsWith("<span")
                ? { __html: value }
                : undefined}>
                    {typeof value === "string" && value.startsWith("<span")
                ? undefined
                : value}
                  </div>
                </div>))}
            </div>
          </div>

          <div className="card p-6" id="bids">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">Bid history</h2>
              <span className="text-sm text-ink-400">{bidCount} bids placed</span>
            </div>
            {auction && bidCount > 0 ? (<div className="mt-4 space-y-1.5">
                {auction.bids.map((b) => (<div key={b.id} className="flex items-center justify-between rounded-lg bg-ink-50 px-3.5 py-2.5 text-sm">
                    <span className="flex items-center gap-2 font-medium text-ink-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500"/>
                      {b.user.name}
                      {b.user.id === session?.id && <Badge tone="success">You</Badge>}
                    </span>
                    <div className="flex items-center gap-4 tabular">
                      <span className="text-xs text-ink-400">
                        {b.createdAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="font-bold text-ink-900">{inr(b.amount)}</span>
                    </div>
                  </div>))}
              </div>) : (<p className="mt-3 text-sm text-ink-400">
                No bids yet. Start at the minimum bid to be first.
              </p>)}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink-900">220-point inspection report</h2>
            <p className="mt-1 text-sm text-ink-500">
              Inspected and re-verified by CruiserZone&apos;s certified engineers.
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {(conditionKeys.length ? conditionKeys : [...CONDITION_CHECKPOINTS]).map((c) => (<div key={c} className="flex items-start gap-2.5 rounded-lg bg-emerald-50/60 px-3.5 py-2.5 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-100">
                  <svg className="mt-0.5 shrink-0 text-emerald-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  {c}
                </div>))}
            </div>
          </div>
        </div>

        {/* Right column — bid panel */}
        <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          {auction ? (<BidPanel auctionId={auction.id} carSlug={car.slug} initial={{
                status: auction.status,
                currentPrice: auction.currentPrice,
                startBid: auction.startBid,
                increment: auction.increment,
                endsAt: auction.endsAt.toISOString(),
                reservePrice: auction.reservePrice,
                reserveMet: (topBid?.amount ?? 0) >= auction.reservePrice,
                bidCount,
                topBid: topBid
                    ? { amount: topBid.amount, bidder: topBid.user.name, bidderId: topBid.user.id }
                    : null,
            }} user={session ? { id: session.id } : null} hasDeposit={hasDeposit}/>) : (<div className="card p-6 text-center text-sm text-ink-500">
              This car isn&apos;t scheduled for auction yet.
            </div>)}

          <div className="card p-5 text-sm">
            <h3 className="font-bold text-ink-900">Buying made transparent</h3>
            <ul className="mt-3 space-y-2 text-ink-600">
              {[
            "Refundable ₹10,000 token unlocks bidding",
            "Reserve price stays hidden until met",
            "Final 60 seconds auto-extends by 2 minutes",
            "Highest genuine bid wins — no fees to the buyer",
            "Free RC transfer & paperwork on winning",
        ].map((t) => (<li key={t} className="flex items-start gap-2">
                  <svg className="mt-0.5 shrink-0 text-emerald-600" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  {t}
                </li>))}
            </ul>
          </div>
        </div>
      </div>
    </div>);
}
