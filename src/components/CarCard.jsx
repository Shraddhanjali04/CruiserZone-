import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Countdown } from "@/components/ui/Countdown";
import { inr, readJsonArray } from "@/lib/utils";
function Spec({ label, value, }) {
    return (<div className="rounded-lg bg-ink-50 px-2.5 py-2 text-center">
      <div className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
        {label}
      </div>
      <div className="text-sm font-semibold text-ink-800">{value}</div>
    </div>);
}
export function CarCard({ auction, countdown = true, }) {
    const car = auction.car;
    const images = readJsonArray(car.images);
    const cover = images[0] ?? "/cars/cz-001.svg";
    const live = auction.status === "LIVE";
    return (<Link href={`/cars/${car.slug}`} className="card card-hover group flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        <Image src={cover} alt={car.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-300 group-hover:scale-[1.03]"/>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {car.certified && <Badge tone="dark">Certified</Badge>}
          {car.featured && <Badge tone="accent">Featured</Badge>}
        </div>
        {live && countdown && (<div className="absolute right-3 top-3">
            <Badge tone="danger">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"/>
              LIVE
            </Badge>
          </div>)}
        {!live && (<div className="absolute right-3 top-3">
            <Badge tone="neutral">Ended</Badge>
          </div>)}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-bold text-ink-900 transition group-hover:text-brand-600">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-ink-500">
            {car.bodyType} · {car.city ?? "—"}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          <Spec label="Km" value={car.kmDriven.toLocaleString("en-IN")}/>
          <Spec label="Fuel" value={car.fuel.charAt(0) + car.fuel.slice(1).toLowerCase()}/>
          <Spec label="Gear" value={car.transmission === "MANUAL" ? "M/T" : "A/T"}/>
          <Spec label="Owner" value={car.ownership === 1 ? "1st" : `${car.ownership}nd`}/>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-ink-100 pt-3">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
              Current bid
            </div>
            <div className="tabular text-lg font-black text-ink-900">
              {inr(auction.currentPrice || auction.startBid)}
            </div>
          </div>
          {live && countdown ? (<Countdown endsAt={auction.endsAt} compact className="text-sm"/>) : (<span className="text-sm font-medium text-ink-400">Closed</span>)}
        </div>
      </div>
    </Link>);
}
