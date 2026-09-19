import { SellForm } from "@/components/SellForm";
export const metadata = { title: "Sell Your Car" };
export default function SellPage() {
    return (<div className="container-site py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-black tracking-tight text-ink-900">
            Sell your car at auction
          </h1>
          <p className="mt-3 text-lg text-ink-500">
            Free inspection, no listing fee, and a payout within a week of the
            hammer. Let the market decide what your car is worth.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Free inspection", "Our engineers inspect your car and give you a full condition report."],
            ["No listing fee", "Share none of your hammer price as listing cost — we earn only on sale."],
            ["Payout in 7 days", "Sell, sign, and get paid within a week of the auction ending."],
        ].map(([t, d]) => (<div key={t} className="card p-5 text-center">
              <div className="font-bold text-ink-900">{t}</div>
              <p className="mt-1.5 text-sm text-ink-500">{d}</p>
            </div>))}
        </div>

        <div className="card mt-8 p-6 sm:p-8">
          <SellForm />
        </div>
      </div>
    </div>);
}
