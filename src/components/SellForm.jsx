"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, Select } from "@/components/ui/Field";
import { MAKES } from "@/lib/constants";
export function SellForm() {
    const [sent, setSent] = useState(false);
    if (sent) {
        return (<div className="py-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <h2 className="mt-4 text-xl font-bold text-ink-900">Request received</h2>
        <p className="mt-1 text-sm text-ink-500">
          Our team will call you within 24 hours to schedule your free inspection.
        </p>
        <Button variant="outline" size="sm" className="mt-6" onClick={() => setSent(false)}>
          Submit another car
        </Button>
      </div>);
    }
    return (<form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="name">Your name</Label><Input id="name" required placeholder="Full name"/></div>
        <div><Label htmlFor="phone">Mobile number</Label><Input id="phone" type="tel" required placeholder="+91 98765 43210"/></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="make">Car brand</Label><Select id="make" defaultValue=""><option value="" disabled>Select brand</option>{MAKES.map((m) => <option key={m} value={m}>{m}</option>)}</Select></div>
        <div><Label htmlFor="model">Model & variant</Label><Input id="model" required placeholder="e.g. Creta 1.5 SX"/></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><Label htmlFor="year">Year</Label><Input id="year" type="number" min="1990" max={new Date().getFullYear()} required placeholder="2019"/></div>
        <div><Label htmlFor="km">Kilometres driven</Label><Input id="km" type="number" min="0" required placeholder="45000"/></div>
        <div><Label htmlFor="city">City</Label><Input id="city" required placeholder="Mumbai"/></div>
      </div>
      <div><Label htmlFor="notes">Anything the inspection team should know? (optional)</Label><Textarea id="notes" placeholder="Service history, known condition issues, accessories, etc."/></div>
      <Button type="submit" size="lg" className="w-full sm:w-auto">Request free inspection</Button>
    </form>);
}
