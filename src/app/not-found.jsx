import { Button } from "@/components/ui/Button";
export default function NotFound() {
    return (<div className="container-site flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <div className="text-7xl font-black text-ink-200">404</div>
      <h1 className="mt-4 text-2xl font-black text-ink-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-ink-500">
        The page you&apos;re after doesn&apos;t exist, or that auction may have
        ended and been removed.
      </p>
      <div className="mt-6 flex gap-3">
        <Button href="/">Back home</Button>
        <Button href="/listings" variant="outline">
          Browse live auctions
        </Button>
      </div>
    </div>);
}
