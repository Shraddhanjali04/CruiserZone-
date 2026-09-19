import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { readJsonArray, inr, formatDateTime, formatDate } from "@/lib/utils";
import { updateAuctionControl, toggleFeatured } from "@/lib/actions/admin";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
export const metadata = { title: "Manage Car" };
export default async function EditCarPage({ params, }) {
    const { id } = await params;
    const car = await prisma.car.findUnique({
        where: { id },
        include: {
            auctions: {
                orderBy: { createdAt: "desc" },
                take: 1,
                include: { _count: { select: { bids: true } }, winner: { select: { name: true } } },
            },
        },
    });
    if (!car)
        notFound();
    const auction = car.auctions[0];
    const images = readJsonArray(car.images);
    const tone = (s) => s === "LIVE" ? "success" : s === "SOLD" ? "accent" : s === "ENDED" ? "neutral" : "warning";
    return (<div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-sm text-ink-400">
        <Link href="/admin/cars" className="hover:text-ink-600">Inventory</Link>
        <span>/</span>
        <span className="text-ink-700">{car.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black text-ink-900">{car.title}</h1>
              <Badge tone={tone(car.status)}>{car.status}</Badge>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 mt-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink-100">
                <Image src={images[0] ?? "/cars/cz-001.svg"} alt={car.title} fill sizes="600px" className="object-cover"/>
              </div>
              <div className="space-y-2">
                <DetailRow label="Year" value={String(car.year)}/>
                <DetailRow label="Make / Model" value={`${car.make} ${car.model}`}/>
                <DetailRow label="Variant" value={car.variant ?? "—"}/>
                <DetailRow label="Km driven" value={`${car.kmDriven.toLocaleString("en-IN")} km`}/>
                <DetailRow label="Fuel" value={car.fuel}/>
                <DetailRow label="Transmission" value={car.transmission}/>
                <DetailRow label="Body type" value={car.bodyType}/>
                <DetailRow label="Colour" value={car.colour}/>
                <DetailRow label="RTO" value={`${car.rto ?? "—"} ${car.city ? `· ${car.city}` : ""}`}/>
                <DetailRow label="Reg. number" value={car.registrationNumber ?? "—"}/>
                <DetailRow label="VIN" value={<span className="tabular">{car.vin ?? "—"}</span>}/>
                <DetailRow label="Source" value={car.source === "CONSIGNED" ? "Consigned" : "CruiserZone stock"}/>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-ink-900">Image management</h2>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.map((img, i) => (<div key={i} className="relative aspect-[16/10] overflow-hidden rounded-lg bg-ink-100">
                  <Image src={img} alt={`${i + 1}`} fill sizes="120px" className="object-cover"/>
                  <span className="absolute bottom-1 right-1 rounded bg-ink-900/70 px-1.5 py-0.5 text-[10px] text-white">
                    {i + 1}
                  </span>
                </div>))}
            </div>
            <p className="mt-3 text-xs text-ink-400">
              Images are stored as a JSON array. Swap placeholders with real
              photos from your inventory drive.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {auction && (<div className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-ink-900">Auction controls</h2>
                <Badge tone={tone(auction.status)}>{auction.status}</Badge>
              </div>
              <div className="mt-4 space-y-2.5 text-sm">
                <DetailRow label="Starting bid" value={inr(auction.startBid)}/>
                <DetailRow label="Reserve price" value={inr(auction.reservePrice)}/>
                <DetailRow label="Current highest" value={inr(auction.currentPrice)}/>
                <DetailRow label="Increment" value={inr(auction.increment)}/>
                <DetailRow label="Bids placed" value={String(auction._count.bids)}/>
                <DetailRow label="Starts" value={formatDateTime(auction.startsAt)}/>
                <DetailRow label="Ends" value={formatDateTime(auction.endsAt)}/>
                {auction.soldPrice && <DetailRow label="Sold for" value={inr(auction.soldPrice)}/>}
                {auction.winner && <DetailRow label="Winner" value={auction.winner.name}/>}
                <DetailRow label="Published" value={auction.published ? "Yes" : "No"}/>
              </div>
              <div className="mt-5 space-y-2">
                {auction.status === "SCHEDULED" && (<form action={async () => {
                "use server";
                await updateAuctionControl(auction.id, "START");
            }}>
                    <Button type="submit" className="w-full">Start now</Button>
                  </form>)}
                {auction.status === "LIVE" && (<form action={async () => {
                "use server";
                await updateAuctionControl(auction.id, "END");
            }}>
                    <Button type="submit" variant="danger" className="w-full">End early</Button>
                  </form>)}
                {(auction.status === "SCHEDULED" || auction.status === "LIVE") && (<form action={async () => {
                "use server";
                await updateAuctionControl(auction.id, "CANCEL");
            }}>
                    <Button type="submit" variant="outline" className="w-full">Cancel auction</Button>
                  </form>)}
              </div>
            </div>)}

          <div className="card p-6">
            <h2 className="font-bold text-ink-900">Visibility</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600">Featured on homepage</span>
                <form action={async () => {
        "use server";
        await toggleFeatured(car.id, !car.featured);
    }}>
                  <button type="submit" className={`rounded-full px-3 py-1 text-xs font-semibold transition ${car.featured
            ? "bg-brand-500 text-white"
            : "bg-ink-100 text-ink-600 hover:bg-ink-200"}`}>
                    {car.featured ? "Yes" : "No"}
                  </button>
                </form>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600">Certified (220-pt)</span>
                <span className="text-xs font-bold text-emerald-600">
                  {car.certified ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-600">Inspection score</span>
                <span className="tabular text-sm font-bold text-ink-900">
                  {car.inspectionScore}/100
                </span>
              </div>
            </div>
          </div>

          <div className="card p-5 text-xs text-ink-400">
            <p>Car ID: <span className="tabular">{car.id}</span></p>
            <p className="mt-0.5">Added: {formatDate(car.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>);
}
function DetailRow({ label, value, }) {
    return (<div className="flex items-center justify-between border-b border-ink-100 py-1.5">
      <span className="text-xs text-ink-400">{label}</span>
      <span className="text-sm font-semibold text-ink-800">{value}</span>
    </div>);
}
