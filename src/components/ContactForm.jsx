"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label, Select } from "@/components/ui/Field";
export function ContactForm() {
    const [sent, setSent] = useState(false);
    if (sent) {
        return (<div className="card p-6 sm:p-8">
        <div className="py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-ink-900">Message sent</h2>
          <p className="mt-1 text-sm text-ink-500">
            Thanks for reaching out. We&apos;ll get back to you within one business day.
          </p>
          <Button variant="outline" size="sm" className="mt-6" onClick={() => setSent(false)}>
            Send another message
          </Button>
        </div>
      </div>);
    }
    return (<div className="card p-6 sm:p-8">
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="name">Your name</Label><Input id="name" name="name" required placeholder="Full name"/></div>
          <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required placeholder="you@example.com"/></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label htmlFor="phone">Mobile</Label><Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210"/></div>
          <div><Label htmlFor="topic">Topic</Label><Select id="topic" name="topic" defaultValue="Bidding help"><option>Bidding help</option><option>About a car</option><option>Selling my car</option><option>Payment / refund</option><option>Other</option></Select></div>
        </div>
        <div><Label htmlFor="message">Message</Label><Textarea id="message" name="message" required placeholder="How can we help?"/></div>
        <Button type="submit" size="lg" className="w-full sm:w-auto">Send message</Button>
      </form>
    </div>);
}
