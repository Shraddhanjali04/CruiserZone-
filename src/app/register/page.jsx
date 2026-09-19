"use client";
import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Field";
import { Logo } from "@/components/Navbar";
import { AuthShell } from "@/components/AuthShell";
import { CITIES } from "@/lib/constants";
export default function RegisterPage() {
    const [state, formAction, pending] = useActionState(registerAction, {});
    return (<AuthShell>
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <h1 className="text-center text-2xl font-black tracking-tight text-ink-900">
        Create your account
      </h1>
      <p className="mt-1.5 text-center text-sm text-ink-500">
        Free to join. Complete your KYC to unlock bidding.
      </p>

      {state.error && !state.fieldErrors && (<div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {state.error}
        </div>)}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" placeholder="Aryan Mehta" autoComplete="name"/>
          <FieldError>{state.fieldErrors?.name?.[0]}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email"/>
          <FieldError>{state.fieldErrors?.email?.[0]}</FieldError>
        </div>
        <div>
          <Label htmlFor="phone">Mobile number</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel"/>
          <FieldError>{state.fieldErrors?.phone?.[0]}</FieldError>
        </div>
        <div>
          <Label htmlFor="city">City (optional)</Label>
          <Input id="city" name="city" list="cities" placeholder="Mumbai"/>
          <datalist id="cities">
            {CITIES.map((c) => (<option key={c} value={c}/>))}
          </datalist>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="Minimum 8 characters" autoComplete="new-password"/>
          <FieldError>{state.fieldErrors?.password?.[0]}</FieldError>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs leading-relaxed text-ink-400">
        By joining you agree to the CruiserZone{" "}
        <span className="underline">Terms of bidding</span> and{" "}
        <span className="underline">Refund policy</span>.
      </p>
    </AuthShell>);
}
