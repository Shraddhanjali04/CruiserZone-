"use client";
import { useActionState } from "react";
import { updateKycAction, changePasswordAction } from "@/lib/actions/profile";
import { Button } from "@/components/ui/Button";
import { Input, Select, Label, FieldError } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
const KYC_TONE = {
    PENDING: "warning",
    SUBMITTED: "success",
    APPROVED: "success",
    REJECTED: "danger",
};
export function KycForm({ kycStatus, kycType, kycNumber, city, }) {
    const [state, action, pending] = useActionState(updateKycAction, {});
    const submitted = kycStatus === "APPROVED" || kycStatus === "SUBMITTED";
    return (<div className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-ink-900">KYC verification</h2>
        <Badge tone={KYC_TONE[kycStatus] ?? "neutral"}>
          {kycStatus.charAt(0) + kycStatus.slice(1).toLowerCase()}
        </Badge>
      </div>
      <p className="mt-1 text-sm text-ink-500">
        Verified bidders get priority support and faster checkout when they win.
      </p>

      {submitted ? (<div className="mt-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
          {kycStatus === "APPROVED"
                ? "Your identity is verified. You're all set to bid and check out quickly."
                : "Your KYC is under review. Our team usually completes verification within 24 hours."}
        </div>) : (<form action={action} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="kycType">Document type</Label>
              <Select id="kycType" name="kycType" defaultValue={kycType ?? "AADHAAR"}>
                <option value="AADHAAR">Aadhaar</option>
                <option value="PAN">PAN card</option>
                <option value="PASSPORT">Passport</option>
                <option value="DRIVING_LICENSE">Driving licence</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="kycNumber">Document number</Label>
              <Input id="kycNumber" name="kycNumber" defaultValue={kycNumber ?? ""} placeholder="Enter document number"/>
            </div>
          </div>
          <div className="sm:w-1/2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" defaultValue={city ?? ""} placeholder="Mumbai"/>
          </div>
          {state.error && (<div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
              {state.error}
            </div>)}
          {state.ok && (<div className="rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
              KYC submitted for review.
            </div>)}
          <Button type="submit" disabled={pending}>
            {pending ? "Submitting…" : "Submit for verification"}
          </Button>
        </form>)}
    </div>);
}
export function PasswordForm() {
    const [state, action, pending] = useActionState(changePasswordAction, {});
    return (<div className="card p-6">
      <h2 className="font-bold text-ink-900">Change password</h2>
      <form action={action} className="mt-5 space-y-4">
        <div>
          <Label htmlFor="current">Current password</Label>
          <Input id="current" name="current" type="password" autoComplete="current-password"/>
        </div>
        <div>
          <Label htmlFor="next">New password</Label>
          <Input id="next" name="next" type="password" autoComplete="new-password"/>
          <FieldError>{state.error?.includes("at least") ? state.error : undefined}</FieldError>
        </div>
        {state.error && !state.error.includes("at least") && (<div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
            {state.error}
          </div>)}
        {state.ok && (<div className="rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
            Password updated.
          </div>)}
        <Button type="submit" variant="outline" disabled={pending}>
          {pending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>);
}
