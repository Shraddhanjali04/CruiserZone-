import Link from "next/link";
import { Logo } from "@/components/Navbar";
export function Footer() {
    return (<footer className="mt-16 bg-ink-950 text-ink-300">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="[&_*]:text-white">
            <Logo />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-400">
            CruiserZone Pvt Ltd — India&apos;s trusted certified pre-owned car
            auction platform. Every car inspected, history-verified, and backed
            by a refundable bidding token.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Auctions
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-white" href="/listings">Live auctions</Link></li>
            <li><Link className="hover:text-white" href="/results">Recent results</Link></li>
            <li><Link className="hover:text-white" href="/how-it-works">How bidding works</Link></li>
            <li><Link className="hover:text-white" href="/sell">Sell your car</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Company
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link className="hover:text-white" href="/about">About us</Link></li>
            <li><Link className="hover:text-white" href="/faq">FAQs</Link></li>
            <li><Link className="hover:text-white" href="/contact">Contact</Link></li>
            <li><Link className="hover:text-white" href="/terms">Terms &amp; refund policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-400">
            <li>cruiserzone@gmail.com</li>
            <li>+91 99928 89394</li>
            <li>Mon–Sat, 10am–7pm IST</li>
            <li className="pt-2">House No. 1066, Sector 14, Sonipat, Haryana, 131001, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} CruiserZone Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/>
            All auctions live in real time
          </p>
        </div>
      </div>
    </footer>);
}
