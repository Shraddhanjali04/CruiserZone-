"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
const LINKS = [
    { href: "/listings", label: "Live Auctions" },
    { href: "/results", label: "Results" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/sell", label: "Sell your car" },
    { href: "/about", label: "About us" },
];
export function Logo() {
    return (<Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 font-black text-white">
        CZ
      </span>
      <span className="text-lg font-bold tracking-tight text-ink-900">
        CruiserZone
        <span className="text-brand-500">.</span>
      </span>
    </Link>);
}
export function Navbar({ session }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const dark = pathname === "/";
    return (<header className={cn("sticky top-0 z-50 border-b backdrop-blur", dark
            ? "border-white/10 bg-ink-950/80 text-white"
            : "border-ink-200 bg-white/90")}>
      <div className="container-site flex h-16 items-center justify-between gap-4">
        <div className={cn(dark && "[&_*]:text-white")}>
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (<Link key={l.href} href={l.href} className={cn("rounded-lg px-3 py-2 text-sm font-medium transition", dark
                ? "text-ink-300 hover:bg-white/10 hover:text-white"
                : "text-ink-600 hover:bg-ink-100 hover:text-ink-900")}>
              {l.label}
            </Link>))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {session ? (<>
              <Button href="/dashboard" variant={dark ? "outline" : "outline"} size="sm">
                Dashboard
              </Button>
              {session.role === "ADMIN" && (<Button href="/admin" variant="dark" size="sm">
                  Admin
                </Button>)}
            </>) : (<>
              <Button href="/login" variant="ghost" size="sm" className={dark ? "text-white hover:bg-white/10" : ""}>
                Sign in
              </Button>
              <Button href="/register" size="sm">
                Join free
              </Button>
            </>)}
        </div>

        <button className={cn("flex h-10 w-10 items-center justify-center rounded-lg lg:hidden", dark ? "text-white hover:bg-white/10" : "text-ink-900 hover:bg-ink-100")} onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (<>
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </>) : (<>
                <path d="M4 7h16"/>
                <path d="M4 12h16"/>
                <path d="M4 17h16"/>
              </>)}
          </svg>
        </button>
      </div>

      {open && (<div className="border-t border-ink-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (<Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-100">
                {l.label}
              </Link>))}
            <div className="mt-3 flex flex-col gap-2 border-t border-ink-100 pt-3">
              {session ? (<>
                  <Button href="/dashboard" size="sm">
                    Dashboard
                  </Button>
                  {session.role === "ADMIN" && (<Button href="/admin" variant="dark" size="sm">
                      Admin
                    </Button>)}
                </>) : (<>
                  <Button href="/login" variant="outline" size="sm">
                    Sign in
                  </Button>
                  <Button href="/register" size="sm">
                    Join free
                  </Button>
                </>)}
            </div>
          </nav>
        </div>)}
    </header>);
}
