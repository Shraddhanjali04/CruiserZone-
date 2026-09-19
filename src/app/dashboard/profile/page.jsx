import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { KycForm, PasswordForm } from "./forms";
import { formatDate } from "@/lib/utils";
export const metadata = { title: "Profile & KYC" };
export default async function ProfilePage() {
    const session = await getSession();
    if (!session)
        redirect("/login?next=/dashboard/profile");
    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user)
        redirect("/login");
    return (<div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-ink-900">Profile & KYC</h1>
        <p className="mt-0.5 text-sm text-ink-500">Manage your account details and identity verification.</p>
      </div>

      <div className="card p-6">
        <h2 className="font-bold text-ink-900">Account details</h2>
        <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <Info label="Name" value={user.name}/>
          <Info label="Email" value={user.email}/>
          <Info label="Mobile" value={user.phone}/>
          <Info label="City" value={user.city ?? "—"}/>
          <Info label="Member since" value={formatDate(user.createdAt)}/>
          <Info label="KYC status" value={user.kycStatus}/>
        </div>
      </div>

      <KycForm kycStatus={user.kycStatus} kycType={user.kycType} kycNumber={user.kycNumber} city={user.city}/>

      <PasswordForm />
    </div>);
}
function Info({ label, value }) {
    return (<div>
      <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</div>
      <div className="mt-0.5 font-semibold text-ink-800">{value}</div>
    </div>);
}
