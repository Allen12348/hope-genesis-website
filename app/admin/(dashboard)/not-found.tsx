import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardNotFound() {
  return (
    <div className="rounded-2xl border border-border bg-card p-10 text-center text-foreground shadow-card-hge">
      <h1 className="font-display text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">This admin route does not exist.</p>
      <Button asChild variant="default" className="mt-6 rounded-xl">
        <Link href="/admin">Back to dashboard</Link>
      </Button>
    </div>
  );
}
