"use client";
import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Field";
import { Logo } from "@/components/Navbar";
import { AuthShell } from "@/components/AuthShell";
export default function LoginPage() {
    const params = useSearchParams();
    const next = params.get("next");
    const [state, formAction, pending] = useActionState(loginAction, {});
    return (<AuthShell>
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <h1 className="text-center text-2xl font-black tracking-tight text-ink-900">
        Sign in to bid
      </h1>
      <p className="mt-1.5 text-center text-sm text-ink-500">
        Welcome back. Your live auctions are waiting.
      </p>

      {state.error && !state.fieldErrors && (<div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {state.error}
        </div>)}
      {next && (<div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
          Please sign in to place a bid.
        </div>)}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email"/>
          <FieldError>{state.fieldErrors?.email?.[0]}</FieldError>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password"/>
          <FieldError>{state.fieldErrors?.password?.[0]}</FieldError>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-sm text-ink-500">
        <span>Don&apos;t have an account?</span>
        <Link href="/register" className="font-semibold text-brand-600 hover:text-brand-700">
          Join free
        </Link>
      </div>
    </AuthShell>);
}
