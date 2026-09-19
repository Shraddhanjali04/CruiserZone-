import Link from "next/link";
import Image from "next/image";
import { getAdminCars } from "@/lib/queries";
import { readJsonArray } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
export const metadata = { title: "Inventory" };
export default async function AdminCarsPage() {
    const cars = await getAdminCars();
    const tone = (s) => s === "LIVE" ? "success" : s === "SOLD" ? "accent" : s === "UNSOLD" ? "neutral" : "warning";
    return (<div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-ink-900">Inventory</h1>
          <p className="mt-0.5 text-sm text-ink-500">
            {cars.length} car{cars.length === 1 ? "" : "s"} in the system
          </p>
        </div>
        <Button href="/admin/cars/new">+ Add car</Button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3 font-semibold">Car</th>
                <th className="px-4 py-3 font-semibold">Year / Km</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Inspection</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {cars.map((c) => {
            const img = readJsonArray(c.images)[0] ?? "/cars/cz-001.svg";
            return (<tr key={c.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-ink-100">
                          <Image src={img} alt={c.title} fill sizes="64px" className="object-cover"/>
                        </div>
                        <div>
                          <Link href={`/admin/cars/${c.id}/edit`} className="font-semibold text-ink-900 hover:text-brand-600">
                            {c.title}
                          </Link>
                          <div className="text-xs text-ink-400">
                            {c.make} {c.model} · {c.transmission} · {c.city ?? "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-600">
                      {c.year} · {c.kmDriven.toLocaleString("en-IN")} km
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={tone(c.status)}>{c.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className={c.inspectionScore >= 80 ? "text-emerald-600" : "text-ink-500"}>
                        {c.inspectionScore || "—"}/100
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-600">
                      {c.source === "CONSIGNED" ? "Consigned" : "Stock"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/cars/${c.id}/edit`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                        Manage →
                      </Link>
                    </td>
                  </tr>);
        })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);
}
