import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
const NAV = [
    { href: "/admin", label: "Overview", icon: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" },
    { href: "/admin/cars", label: "Inventory", icon: "M11 17h2m-2-4h2M9 9a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm12 0h.01M21 12a5 5 0 0 1-10 0 5 5 0 0 1 10 0Z" },
    { href: "/admin/auctions", label: "Auctions", icon: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
    { href: "/admin/bidders", label: "Bidders & KYC", icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z" },
    { href: "/admin/payments", label: "Payments", icon: "M2 7h20M2 17h20M6 7v10M18 7v10M2 5h20v14H2z" },
];
export default async function AdminLayout({ children, }) {
    const session = await getSession();
    if (!session)
        redirect("/login");
    if (session.role !== "ADMIN")
        redirect("/dashboard");
    return (<div className="container-site py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-ink-900">
          Admin console
        </h1>
        <p className="mt-0.5 text-sm text-ink-500">
          CruiserZone operations — {session.name}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit lg:sticky lg:top-20">
          <nav className="card flex flex-row gap-1 overflow-x-auto p-2 lg:flex-col">
            {NAV.map((item) => (<AdminLink key={item.href} href={item.href} label={item.label} iconPath={item.icon}/>))}
            <div className="mt-0 border-t border-ink-100 pt-2 lg:mt-2">
              <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-100">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
                Back to site
              </Link>
            </div>
          </nav>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>);
}
function AdminLink({ href, label, iconPath }) {
    return (<Link href={href} prefetch={false} className={cn("flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition", "text-ink-600 hover:bg-ink-100 hover:text-ink-900")}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={iconPath}/>
      </svg>
      {label}
    </Link>);
}
