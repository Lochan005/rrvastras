import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="mt-4 text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="mt-8 inline-block">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
