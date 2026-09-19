export const metadata = { title: "FAQs" };
const FAQS = [
    ["Is CruiserZone a dealer?", "No. CruiserZone is a technology platform that runs certified pre-owned car auctions. We don't set prices — the highest genuine bidder wins."],
    ["Who inspects the cars?", "CruiserZone's own certified engineers conduct a 220-point physical inspection and document check. You'll see the full report and score on every listing."],
    ["What is the bidding token?", "A refundable ₹10,000 token you pay once to unlock bidding. If you don't win any auction, you can request a full refund to your source."],
    ["What happens if I win?", "Pay the hammer price online (UPI/cards/netbanking), sign the digital handover, and CruiserZone handles RC transfer and delivery/pickup in your city."],
    ["Can I back out after winning?", "No. Every bid is a legally binding commitment. If you don't complete payment within 48 hours, your token is forfeited and you may be banned from the platform."],
    ["Do I pay buyer fees?", "No. The hammer price is the full price you pay. Sellers cover all CruiserZone fees."],
    ["What is the anti-sniping rule?", "If a bid is placed in the final 60 seconds, the auction clock extends by 2 minutes. This keeps the ending fair and avoids last-second sniping."],
    ["What does 'reserve not met' mean?", "Every car has a minimum hidden price the seller has accepted. If the highest bid doesn't reach it, the car is not sold in that auction."],
    ["How do I sell my car on CruiserZone?", "Submit the form on our Sell page. Our team will inspect your car, set a starting bid, and schedule your auction within 7 days."],
    ["How long does RC transfer take?", "Typically 10–15 business days from the date of sale. CruiserZone manages the process end-to-end for you."],
];
export default function FAQPage() {
    return (<div className="container-site py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black tracking-tight text-ink-900">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-lg text-ink-500">
          Everything buyers, sellers and bidders ask before joining CruiserZone.
        </p>

        <div className="mt-8 space-y-4">
          {FAQS.map(([q, a]) => (<details key={q} className="group card overflow-hidden p-0">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-sm font-semibold text-ink-900 transition hover:bg-ink-50">
                {q}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-ink-400 transition group-open:rotate-180">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </summary>
              <div className="border-t border-ink-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-ink-600">
                {a}
              </div>
            </details>))}
        </div>
      </div>
    </div>);
}
