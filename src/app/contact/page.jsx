import { ContactForm } from "@/components/ContactForm";
export const metadata = { title: "Contact" };
export default function ContactPage() {
    return (<div className="container-site py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-black tracking-tight text-ink-900">Contact us</h1>
        <p className="mt-3 text-ink-500">
          Questions about a car, a bid, or selling? Drop us a line — we reply
          within one business day.
        </p>

        <div className="mt-8">
          <ContactForm />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Email", "info@cruiserzone.in", "For general queries & bids"],
            ["Phone", "+91 98 0000 0000", "Mon–Sat, 10am–7pm"],
            ["Head office", "Mumbai, India", "By appointment"],
        ].map(([t, v, d]) => (<div key={t} className="card p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">{t}</div>
              <div className="mt-1.5 font-bold text-ink-900">{v}</div>
              <div className="mt-0.5 text-sm text-ink-500">{d}</div>
            </div>))}
        </div>
      </div>
    </div>);
}
