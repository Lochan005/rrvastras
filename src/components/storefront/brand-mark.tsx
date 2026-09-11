import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandMark({
  compact = false,
}: {
  compact?: boolean;
  inverted?: boolean;
}) {
  return (
    <Link href="/" aria-label="RR Vastras home" className="flex items-center">
      <Image
        src="/logo.png"
        alt="RR Vastras"
        width={512}
        height={512}
        className={cn(
          "rounded-sm object-cover",
          compact ? "h-20 w-20" : "h-11 w-11 lg:h-14 lg:w-14"
        )}
        priority
      />
    </Link>
  );
}
