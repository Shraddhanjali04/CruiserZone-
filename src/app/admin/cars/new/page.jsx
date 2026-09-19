import { CarForm } from "@/components/CarForm";
export const metadata = { title: "Add Car" };
export default function NewCarPage() {
    return (<div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-ink-900">Add a car & launch auction</h1>
        <p className="mt-0.5 text-sm text-ink-500">
          Creating this record immediately opens a live auction.
        </p>
      </div>
      <CarForm />
    </div>);
}
