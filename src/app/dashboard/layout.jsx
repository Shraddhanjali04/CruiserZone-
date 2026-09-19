import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
const NAV = [
    { href: "/dashboard", label: "Overview", icon: "M3 12 12 3l9 9M5 10v10h5v-6h4v6h5V10" },
    { href: "/dashboard/bids", label: "My bids", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
    { href: "/dashboard/watchlist", label: "Watchlist", icon: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" },
    { href: "/dashboard/wallet", label: "Wallet & refunds", icon: "M2 7h20M2 17h20M6 7v10M18 7v10M2 5h20v14H2z" },
    { href: "/dashboard/profile", label: "Profile & KYC", icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" },
];
export default async function DashboardLayout({ children, }) {
    const session = await getSession();
    if (!session)
        redirect("/login?next=/dashboard");
    return (<div className="container-site py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-ink-900">
            Hello, {session.name.split(" ")[0]}
          </h1>
          <p className="mt-0.5 text-sm text-ink-500">
            {session.email} ·{" "}
            {session.role === "ADMIN" ? "Administrator" : "Bidder"}
          </p>
        </div>
        <NavUser name={session.name} role={session.role}/>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit lg:sticky lg:top-20">
          <nav className="card flex flex-row gap-1 overflow-x-auto p-2 lg:flex-col">
            {NAV.map((item) => (<NavLink key={item.href} href={item.href} label={item.label} iconPath={item.icon}/>))}
            <form action={logoutAction} className="mt-0 lg:mt-2 lg:border-t lg:border-ink-100 lg:pt-2">
              <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
                Sign out
              </button>
            </form>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>);
}
function NavLink({ href, label, iconPath }) {
    return (<Link href={href} prefetch={false} className={cn("flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition", "text-ink-600 hover:bg-ink-100 hover:text-ink-900", "relative")}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={iconPath}/>
      </svg>
      {label}
    </Link>);
}
async function NavUser({ name, role }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return (<div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white">
        {initials}
      </div>
      <div className="hidden sm:block">
        <div className="text-sm font-semibold text-ink-900">{name}</div>
        <div className="text-xs text-ink-400">{role === "ADMIN" ? "Admin" : "Bidder"}</div>
      </div>
    </div>);
}
