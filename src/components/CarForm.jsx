"use client";
import { useActionState } from "react";
import { createCarWithAuction } from "@/lib/actions/admin";
import { Button } from "@/components/ui/Button";
import { Input, Select, Label } from "@/components/ui/Field";
import { MAKES, BODY_TYPE, FUEL, TRANSMISSION, CITIES } from "@/lib/constants";
export function CarForm() {
    const [state, action, pending] = useActionState(createCarWithAuction, {});
    return (<form action={action} className="space-y-6">
      {state.error && (<div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {state.error}
        </div>)}
      {state.ok && (<div className="rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
          Car created and auction is live. 🚗
        </div>)}

      <fieldset className="card p-5">
        <legend className="px-1 text-sm font-bold text-ink-900">
          Car details
        </legend>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Listing title *</Label>
            <Input id="title" name="title" required placeholder="2021 Hyundai Creta 1.5 SX IVT"/>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="make">Make *</Label>
              <Select id="make" name="make" required defaultValue="">
                <option value="" disabled>Select</option>
                {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
              </Select>
            </div>
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input id="model" name="model" required placeholder="Creta"/>
            </div>
            <div>
              <Label htmlFor="variant">Variant</Label>
              <Input id="variant" name="variant" placeholder="1.5 SX IVT"/>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><Label htmlFor="year">Year *</Label><Input id="year" name="year" type="number" required min="1990" max={new Date().getFullYear()}/></div>
            <div><Label htmlFor="kmDriven">Km driven *</Label><Input id="kmDriven" name="kmDriven" type="number" required min="0"/></div>
            <div><Label htmlFor="ownership">Ownership</Label><Input id="ownership" name="ownership" type="number" min="1" defaultValue="1"/></div>
            <div><Label htmlFor="colour">Colour</Label><Input id="colour" name="colour"/></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <Label htmlFor="fuel">Fuel</Label>
              <Select id="fuel" name="fuel" defaultValue="PETROL">
                {Object.values(FUEL).map((f) => <option key={f} value={f}>{f.charAt(0) + f.slice(1).toLowerCase()}</option>)}
              </Select>
            </div>
            <div>
              <Label htmlFor="transmission">Transmission</Label>
              <Select id="transmission" name="transmission" defaultValue="MANUAL">
                {Object.values(TRANSMISSION).map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
            <div>
              <Label htmlFor="bodyType">Body type</Label>
              <Select id="bodyType" name="bodyType" defaultValue="SUV">
                {Object.values(BODY_TYPE).map((b) => <option key={b} value={b}>{b.charAt(0) + b.slice(1).toLowerCase()}</option>)}
              </Select>
            </div>
            <div>
              <Label htmlFor="seats">Seats</Label>
              <Input id="seats" name="seats" type="number" min="2" max="9" defaultValue="5"/>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><Label htmlFor="rto">RTO</Label><Input id="rto" name="rto" placeholder="MH-01"/></div>
            <div>
              <Label htmlFor="city">City</Label>
              <Select id="city" name="city" defaultValue="">
                <option value="">—</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div><Label htmlFor="registrationNumber">Reg. number</Label><Input id="registrationNumber" name="registrationNumber"/></div>
            <div><Label htmlFor="vin">VIN</Label><Input id="vin" name="vin"/></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label htmlFor="engineCc">Engine (cc)</Label><Input id="engineCc" name="engineCc" type="number" min="0"/></div>
            <div><Label htmlFor="inspectionScore">Inspection score</Label><Input id="inspectionScore" name="inspectionScore" type="number" min="0" max="100" defaultValue="90"/></div>
          </div>
          <div>
            <Label htmlFor="image">Cover image URL</Label>
            <Input id="image" name="image" placeholder="/cars/cz-001.svg" defaultValue="/cars/cz-001.svg"/>
            <p className="mt-1 text-xs text-ink-400">
              Placeholder SVGs live in <code>/public/cars</code>. Swap with real
              car photos in production.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" name="certified" defaultChecked className="rounded border-ink-300 text-brand-500"/>
            Certified (220-pt inspection passed)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-700">
            <input type="checkbox" name="featured" className="rounded border-ink-300 text-brand-500"/>
            Featured on homepage
          </label>
        </div>
      </fieldset>

      <fieldset className="card p-5">
        <legend className="px-1 text-sm font-bold text-ink-900">Auction settings</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div><Label htmlFor="startBid">Starting bid (₹) *</Label><Input id="startBid" name="startBid" type="number" required min="1000" defaultValue="500000"/></div>
          <div><Label htmlFor="reservePrice">Reserve price (₹, hidden)</Label><Input id="reservePrice" name="reservePrice" type="number" min="0" defaultValue="600000"/></div>
          <div><Label htmlFor="increment">Increment (₹)</Label><Input id="increment" name="increment" type="number" min="1000" defaultValue="10000"/></div>
          <div><Label htmlFor="durationHours">Duration (hours)</Label><Input id="durationHours" name="durationHours" type="number" min="1" defaultValue="24"/></div>
        </div>
        <div className="mt-4">
          <Label htmlFor="startsAt">Starts at (blank = start now)</Label>
          <Input id="startsAt" name="startsAt" type="datetime-local"/>
        </div>
      </fieldset>

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Creating…" : "Create car & launch auction"}
      </Button>
    </form>);
}
