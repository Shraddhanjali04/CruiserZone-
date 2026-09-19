export const metadata = { title: "Terms & Refund Policy" };
export default function TermsPage() {
    const blocks = [
        ["1. Acceptance", "By accessing CruiserZone's auction platform you agree to these Terms of Bidding. If you place a bid, you accept that the bid is a binding offer to purchase at the hammer price."],
        ["2. Eligibility", "You must be 18 or older and legally able to enter contracts in India. Each bidder must complete registration and (for winning) KYC verification."],
        ["3. The bidding token", "A refundable token of ₹10,000 (inclusive of GST) is required before bidding. It is a security to keep bidding genuine and is refunded in full when you have no active bids. Crypto/Fiat gateway charges, if any, are borne by CruiserZone."],
        ["4. Bids are binding", "Every bid placed is a legally binding offer. You may not retract a bid. You agree to complete purchase at the hammer price if you are the winning bidder and the reserve price is met."],
        ["5. Winning & payment", "The winning bidder must pay the full hammer price within 48 hours of the auction ending. Payment methods include UPI, credit/debit cards and netbanking via our partner gateway."],
        ["6. Reserve price", "Each lot carries a hidden minimum (reserve). If the highest bid is below reserve, the lot is not sold and no buyer pays any amount beyond their token."],
        ["7. Anti-sniping", "Bids placed within 60 seconds of the scheduled end extend the auction by 2 minutes. The extension repeats until 60 seconds pass without a bid."],
        ["8. Non-payment", "If a winning bidder fails to pay within 48 hours, the token is forfeited as liquidated damages, the bidder may be suspended, and the lot may be offered to the next-highest bidder."],
        ["9. Refund of token", "Refunds are processed within 3–5 working days to the original payment source. Purchase-price refunds beyond these terms are governed by our inspection warranty letter delivered with the vehicle."],
        ["10. Car condition", "Cars are sold 'as inspected'. Our 220-point inspection report is provided before bidding. Test drives and physical inspections can be arranged before an auction ends."],
        ["11. Delivery & RC", "CruiserZone coordinates delivery and handles RC transfer paperwork. Transfer timeline is typically 10–15 business days, subject to RTO processing."],
        ["12. Disputes", "Disputes are resolved by CruiserZone's internal review within 7 business days. Jurisdiction: courts of Mumbai, India."],
    ];
    return (<div className="container-site py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-black tracking-tight text-ink-900">
          Terms of bidding & refund policy
        </h1>
        <p className="mt-2 text-sm text-ink-400">Last updated: 1 September 2026</p>
        <div className="mt-8 space-y-6">
          {blocks.map(([t, d]) => (<div key={t}>
              <h2 className="font-bold text-ink-900">{t}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{d}</p>
            </div>))}
        </div>
      </div>
    </div>);
}
